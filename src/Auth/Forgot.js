import React, { useState, useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import ThemeContext from "../Context/ThemeContext";

import { GradBtn, FloatingInput } from "../../components";
import LogoView from "../../components/LogoView";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AntDesign from "react-native-vector-icons/AntDesign";
import colors from "../../constant/colors";
import MindAxios from "../../api/MindAxios";
import Env from "../../api/Env";
import Helper from "../Helper";
// import { light as theme } from "../../constant/colorsConfig";
import { useDispatch } from "react-redux";
import allActions from "../../redux/actions";
import AuthContext from "../Context/AuthContext";

const Forgot = ({ navigation }) => {
  const { theme, mode } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [errMsgs, setErrMsgs] = useState({});
  const {
    myState: { language },
  } = useContext(AuthContext);

  const handleError = (error, input) => {
    setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
  };
  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const checkValidations = () => {
    let isValid = true;
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      handleError(language?.email_is_missing, "emailErrMessage");
      isValid = false;
    } else if (reg.test(email.trim()) == false) {
      handleError(language?.please_enter_valid_email, "emailErrMessage");
      isValid = false;
    }

    if (isValid) {
      // console.log("Valid Email");
      sendEmailForgot();
    }
  };
  const sendEmailForgot = async () => {
    dispatch(allActions.DataAction.ActivityModal(true));
    let verifybody = {
      email: email,
      type: "ResetPassword",
    };
    // console.log(verifybody);

    const res = await MindAxios.post(
      Env.createUrl("emails/authentication"),
      verifybody
    );
    dispatch(allActions.DataAction.ActivityModal(false));
    // console.log("verify response-->", res);
    if (res?.status == 200) {
      // console.log("success");
      Helper.showToastMessage(
        "ResetPassword email sent successfully",
        theme.success
      );
      await timeout(1000);
      navigation.goBack();
    } else {
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
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={22} />
      </TouchableOpacity>
      <LogoView label={language?.forgotPassword} />
      <FloatingInput
        label={language?.email}
        value={email}
        width={wp(90)}
        marginTop={hp(10)}
        autoCapitalize={"none"}
        onChangeText={(text) => {
          handleError(null, "emailErrMessage");
          setEmail(text);
        }}
        error={errMsgs.emailErrMessage ? errMsgs.emailErrMessage : false}
      />
      <GradBtn label="Confirm" height={50} onPress={checkValidations} />
    </View>
  );
};

export default Forgot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: hp(20),
    paddingHorizontal: wp(5),
  },
  backIcon: {
    width: 35,
    height: 35,
    backgroundColor: colors.white,
    padding: wp(1),
    borderRadius: hp(5),
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: hp(2),
    left: hp(1),
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
  },
});
