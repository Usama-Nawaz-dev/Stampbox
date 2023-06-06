import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Modal,
} from "react-native";
import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import Image from "react-native-fast-image";
import colors from "../../constant/colors";
import Icon from "react-native-vector-icons/Ionicons";
import Btn from "../../components/Btn";
import Helper from "../Helper";
import auth from "@react-native-firebase/auth";
import allActions from "../../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import MindAxios from "../../api/MindAxios";
import Env from "../../api/Env";
import { GradBtn } from "../../components/GradBtn";
import { useFocusEffect } from "@react-navigation/native";
import CountDown from "react-native-countdown-component";
import AppText from "../../components/AppText";
import ThemeContext from "../Context/ThemeContext";

const Confirm = ({ route, navigation }) => {
  const { email, id, firstName } = route.params.values;
  // const email = "jarit62282@deitada.com";
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(true);
  const [check, setCheck] = useState(false);
  const [timerCount, setTimer] = useState(60);
  const verified = useSelector((state) => state.DataReducer.email_verified);
  const modalVisible = useSelector((state) => state.DataReducer.modal_visible);
  const dispatch = useDispatch();
  const countDownElement = useRef();
  const { theme }= useContext(ThemeContext);
  let firstRender = true;
  // console.log('params', email)
  // let interval;
  useEffect(() => {
    // setLoading(false);

    let interval1 = setInterval(() => {
      const user = auth().currentUser;
      user
        ?.reload()
        .then(async () => {
          let emailVerified = user?.emailVerified;
          // console.log("emailVerified->", emailVerified);
          if (verified == false && emailVerified == true) {
            dispatch(allActions.DataAction.CheckEmail(true));
            dispatch(allActions.DataAction.VerifyModal(true));
            // handleClick(0)
            clearInterval(interval1);
          }
        })
        .catch((e) => console.log(e));
    }, 1000);
    return () => clearInterval(interval1);
  }, []);

  const handleClick = (val) => {
    countDownElement.current.restart(val);
  };

  const goto = async () => {
    setLoading(true);
    let { headers } = await MindAxios.formdataConfig();
    let fd = new FormData();
    let user = {
      first_name: firstName,
      is_email_verified: "1",
    };

    fd.append("user_id", JSON.stringify(id));
    fd.append("user", JSON.stringify(user));
    fetch(Env.createUrl("users/update"), {
      method: "POST",
      headers: headers,
      body: fd,
    })
      .then((response) => response.json())
      .then((res) => {
        setLoading(false);
        console.log("res", res);
        let { success, message } = res;
        if (success) {
          // console.log('here');
          let {
            result: { user: getuser },
          } = res;
          // console.log(getuser);
          // dispatch(allActions.DataAction.User(getuser));
          dispatch(allActions.ApiAction.getUserApi(getuser));
          dispatch(allActions.DataAction.VerifyModal(false));
          dispatch(allActions.DataAction.CheckEmail(false));
          navigation.navigate("category");
        } else {
          alert(message);
        }
      })
      .catch((error) => {
        setLoading(false);
        alert(error);
      });
  };

  const sendEmailVerify = async () => {
    // setTimeout(async() => {

    // }, 10000);
    let verifybody = {
      email: email,
      type: "EmailVerification",
    };

    const res = await MindAxios.post(
      Env.createUrl("emails/authentication"),
      verifybody
    );
    // console.log("verify response-->", res);
    if (res?.status == 200) {
      // console.log("firstRender-->", firstRender);
      setSent(true);
      handleClick(60);
    } else {
      // dispatch(allActions.DataAction.ActivityModal(false));
      const {
        e: {
          response: {
            data: { message },
          },
        },
      } = res;
      alert(message);
    }
  };
  return (
    <View
      style={{ flex: 1, alignItems: "center", backgroundColor: theme?.white }}
    >
      <View
        style={{
          flex: 0.2,
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: "red",
          width: "90%",
        }}
      >
        <Text style={[styles.heading, { color: theme?.darkGrey}]}>Activate Your Account</Text>
        <Text style={[styles.subHeading, { color: theme?.lightText}]}>
          Get your free StampBox account now
        </Text>
      </View>

      <View
        style={{
          flex: 0.55,
          width: "90%",
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: "lightgrey",
        }}
      >
        <Image
          resizeMode="contain"
          source={require("../../assets/images/letter.png")}
          style={{ width: 121, height: 121, marginBottom: 20 }}
        />
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Roboto-Regular",
            textAlign: "center",
            letterSpacing: 0.2,
            lineHeight: 25,
            marginBottom: 40,
            color: theme?.lightText,
          }}
        >
          Thanks for creating your Next door account.{"\n"}
          To continue, please verify Your email address{"\n"}
          by verifying the link sent at your mail.
        </Text>
        <GradBtn
          width={"100%"}
          borderRadius={7}
          height={50}
          label={"Please Verify Your Email Address"}
          fontSize={16}
          bold={true}
          onPress={() => {
            // console.log(check);
            Helper.showToastMessage("Not Verified");
          }}
        />
      </View>
      <View
        style={{
          flex: 0.25,
          // backgroundColor: "orange",
          width: "90%",
        }}
      >
        <TouchableOpacity
          disabled={sent}
          style={{ flexDirection: "row", alignSelf: "center" }}
          onPress={() => {
            // console.log("sending..");
            if (!verified) {
              sendEmailVerify();
            }
          }}
        >
          <Text style={[styles.resend, { opacity: sent ? 0.3 : 1, color: theme?.black }]}>
            Didn't Receive Email?
          </Text>
          <Text
            style={[
              styles.resend,
              {
                left: 5,
                color: colors.theme,
                opacity: sent ? 0.5 : 1,
                textDecorationLine: "underline",
              },
            ]}
          >
            Resend
          </Text>
        </TouchableOpacity>
        {sent ? (
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <AppText
              style={[styles.descriptionText, { fontSize: 14, left: 5, color: theme?.lightText }]}
            >
              in
            </AppText>
            <CountDown
              ref={countDownElement}
              until={60}
              onFinish={() => {
                // console.log("on finish");
                setSent(false);
              }}
              digitStyle={{
                color: "transparent",
              }}
              noUnit
              digitTxtStyle={{ color: theme?.black, fontWeight: "500" }}
              timeToShow={["S"]}
              timeLabels={{ s: null }}
            />
            <AppText
              style={[styles.descriptionText, { fontSize: 14, right: 18, color: theme?.lightText }]}
            >
              seconds
            </AppText>
          </View>
        ) : null}
      </View>

      <Modal
        animationType="fade"
        // animated={true}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          dispatch(allActions.DataAction.VerifyModal(false));
        }}
      >
        <View style={styles.container}>
          <View
            style={{
              height: 400,
              width: wp(85),
              backgroundColor: theme?.cardColor,
              borderRadius: hp(1),
              alignItems: "center",
              justifyContent: "space-evenly",
              //   marginBottom: 5
            }}
          >
            <Image
              resizeMode="contain"
              source={require("../../assets/images/success.png")}
              style={{ width: 121, height: 121, marginBottom: 20 }}
            />
            <View>
              <Text
                style={{
                  fontSize: 21,
                  fontWeight: "800",
                  fontFamily: "Roboto-Regular",
                  textAlign: "center",
                  letterSpacing: 1.5,
                  lineHeight: 35,
                  color: theme?.darkGrey,
                }}
              >
                VERIFIED
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  fontFamily: "Roboto-Regular",
                  textAlign: "center",
                  letterSpacing: 1.5,
                  lineHeight: 35,
                  marginBottom: 40,
                  color: theme?.darkGrey,
                }}
              >
                You have Successfully {"\n"}
                Verified the Account!
              </Text>
            </View>
            <GradBtn
              onPress={goto}
              loading={loading}
              label="Go To"
              width="50%"
              height={40}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Confirm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    // alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontFamily: "IBMPlexSans-Bold",
    color: colors.lightBlack,
  },
  subHeading: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    color: colors.btnText,
    letterSpacing: 0.5,
    marginTop: 5,
  },
  descriptionText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    marginLeft: wp(3),
    color: "grey",
  },
  resend: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    letterSpacing: 0.5,
    lineHeight: 23,
  },
});
