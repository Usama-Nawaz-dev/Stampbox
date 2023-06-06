import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import colors from "../../../../constant/colors";
import {
  BottomSheet,
  MainHeader,
  FloatingInput,
  GradBtn,
  Phone,
} from "../../../../components";
import AppText from "../../../../components/AppText";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Helper from "../../../Helper";
import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";
import { useDispatch } from "react-redux";
import allActions from "../../../../redux/actions";
import { useIsFocused } from "@react-navigation/native";
import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";

export const EmailAdresses = (props) => {
  const { item } = props.route.params;
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [phoneErr, setPhoneErr] = useState(false);

  const focused = useIsFocused();
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [userData, setUserData] = useState();

  const emailSheetRef = useRef();
  const phoneSheetRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    if (focused) {
      getData();
    }
  }, [focused]);

  const getData = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.createUrl("users/me"));
    dispatch(allActions.DataAction.AppLoader(false));
    // console.log("responsiveeeeeeeeee", response);
    if (response.status == 200) {
      let userData = response?.data?.user;
      setUserData(userData);
    } else {
      alert(language?.serverError);
    }
  };

  const addAnotherEmail = async () => {
    // console.log("email", email);
    let valid = true;
    let reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim().length == "") {
      setErrMsg("Please enter email.");
      valid = false;
      return;
    } else if (reg.test(email.trim()) === false) {
      setErrMsg("Please enter valid email.");
      valid = false;
    }
    if (valid) {
      let body = {
        email: email.trim(),
      };
      dispatch(allActions.DataAction.AppLoader(true));
      const response = await MindAxios.post(
        Env.createUrl("users/create-secondary-contact"),
        body
      );
      dispatch(allActions.DataAction.AppLoader(false));
      // console.log("Email adresses", response);
      if (response.status == 200) {
        emailSheetRef?.current?.close();
        await getData();
        Helper.showToastMessage("Email sucessfully added.", colors.green);
      } else {
        alert(language?.serverError);
      }
    }
  };

  const addAnotherPhone = async () => {
    // console.log("phone...", phone);
    let valid = true;
    if (phone.length == "") {
      setPhoneErr(true);
      valid = false;
      // return;
    } else if (phone.length < 7) {
      setPhoneErr(true);
      valid = false;
    }
    if (valid) {
      let body = {
        phone: phone,
      };
      dispatch(allActions.DataAction.AppLoader(true));
      const response = await MindAxios.post(
        Env.createUrl("users/create-secondary-contact"),
        body
      );
      dispatch(allActions.DataAction.AppLoader(false));
      // console.log("Email adresses", response);
      if (response.status == 200) {
        phoneSheetRef?.current?.close();
        await getData();
        Helper.showToastMessage("Phone no added sucessfully.", colors.green);
      } else {
        alert(language?.serverError);
      }
    }
  };
  const EmailCard = () => {
    return (
      <View>
        <AppText style={styles.titleText}>Email you've added</AppText>
        {/* Primary email view */}
        <View style={styles.primEmailView}>
          <View>
            <AppText
              style={[styles.titleText, { fontSize: 14, color: theme?.black }]}
            >
              Primary email
            </AppText>
            <AppText style={styles.emailText}>{userData?.email}</AppText>
          </View>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("ChangeEmail", { type: "email" })
            }
          >
            <AppText
              style={[
                styles.emailText,
                { marginTop: 0, color: colors.lightTheme },
              ]}
            >
              Change primary email
            </AppText>
          </TouchableOpacity>
        </View>
        {/* other email view */}
        <View style={styles.primEmailView}>
          <View>
            <AppText
              style={[styles.titleText, { fontSize: 14, color: theme?.black }]}
            >
              Other email(s)
            </AppText>
            {userData?.user_contacts?.map((item) => {
              if (item?.key == "email") {
                return <AppText style={styles.emailText}>{item.email}</AppText>;
              } else {
                return null;
              }
            })}
          </View>
          <TouchableOpacity
            onPress={() => {
              setErrMsg("");
              emailSheetRef?.current?.open();
            }}
          >
            <AppText
              style={[
                styles.emailText,
                { marginTop: 0, color: colors.lightTheme },
              ]}
            >
              Add another email
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const PhoneCard = () => {
    return (
      <View>
        <AppText style={styles.titleText}>Phone Numbers</AppText>
        {/* Primary email view */}
        <View style={styles.primEmailView}>
          <View>
            <AppText
              style={[styles.titleText, { fontSize: 14, color: theme?.black }]}
            >
              Primary phone numbers
            </AppText>
            <AppText style={styles.emailText}>{userData?.phone}</AppText>
          </View>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("ChangeEmail", { type: "phone" })
            }
          >
            <Text
              style={[
                styles.emailText,
                { marginTop: 0, color: colors.lightTheme },
              ]}
            >
              Change primary phone
            </Text>
          </TouchableOpacity>
        </View>
        {/* other email view */}
        <View style={styles.primEmailView}>
          <View>
            <AppText
              style={[styles.titleText, { fontSize: 14, color: theme?.black }]}
            >
              Other phone numbers
            </AppText>
            {userData?.user_contacts?.map((item) => {
              if (item?.key == "phone") {
                return (
                  <AppText style={styles.emailText}>{item?.phone}</AppText>
                );
              } else {
                return null;
              }
            })}
          </View>
          <TouchableOpacity
            onPress={() => {
              phoneSheetRef?.current?.open();
              setPhoneErr(false);
              setPhone("");
            }}
          >
            <AppText
              style={[
                styles.emailText,
                { marginTop: 0, color: colors.lightTheme },
              ]}
            >
              Add another phone
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title={item == "email" ? "Email" : "Phone"}
        onPressBack={() => props.navigation.goBack()}
      />
      <View style={styles.content}>
        {item === "email" ? <EmailCard /> : <PhoneCard />}
      </View>
      <BottomSheet
        ref={emailSheetRef}
        sheetHeight={hp(37)}
        ChildComponent={
          <View style={styles.bottomSteehView}>
            <AppText
              style={[styles.titleText, { fontWeight: "600", marginTop: 20 }]}
            >
              Enter Email Here
            </AppText>
            <FloatingInput
              label="Email Adress*"
              autoCapitalize={"none"}
              onChangeText={(text) => {
                // handleError(null, "errMsg");
                setEmail(text);
              }}
              error={errMsg ? errMsg : false}
            />
            <GradBtn
              label={"ADD"}
              height={hp(5)}
              onPress={() => {
                addAnotherEmail();
              }}
            />
          </View>
        }
      />
      <BottomSheet
        ref={phoneSheetRef}
        sheetHeight={hp(37)}
        ChildComponent={
          <View style={styles.bottomSteehView}>
            <AppText
              style={[styles.titleText, { fontWeight: "600", marginTop: 20 }]}
            >
              Enter Phone Here
            </AppText>

            <Phone
              phoneNumber={phone}
              setPhoneNumber={(number) => setPhone(number)}
              error={phoneErr}
              setError={setPhoneErr}
            />
            <GradBtn label={"ADD"} height={hp(5)} onPress={addAnotherPhone} />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: 14,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  primEmailView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  emailText: {
    marginTop: 10,
    fontSize: 15,
    // color: colors.cBlack,
  },
  bottomSteehView: {
    padding: 20,
  },
});
