import React, { useState, useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import { styles } from "./styles";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useDispatch } from "react-redux";
import auth from "@react-native-firebase/auth";
import AntDesign from "react-native-vector-icons/AntDesign";

import Helper from "../../Helper";
import colors from "../../../constant/colors";
import allActions from "../../../redux/actions";
import LogoView from "../../../components/LogoView";
import { FloatingInput, GradBtn } from "../../../components";

import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

export const ChangePassword = (props) => {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [errMsgs, setErrMsgs] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [cShowPass, setCShowPass] = useState(false);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme, mode } = useContext(ThemeContext);

  const handleError = (error, input) => {
    setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
  };

  const reauthenticate = (currentPassword) => {
    let user = auth().currentUser;
    console.log(user)
    let cred = auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  };

  const changePassword = (currentPassword, newPassword) => {
    dispatch(allActions.DataAction.AppLoader(true));
    reauthenticate(currentPassword)
      .then(() => {
        let user = auth().currentUser;
        user
          .updatePassword(newPassword)
          .then(() => {
            dispatch(allActions.DataAction.AppLoader(false));
            console.log("Password updated!");
            Helper.showToastMessage("Password updated successfully", "green");
            setTimeout(() => {
              props.navigation.goBack();
            }, 1000);
          })
          .catch((error) => {
            dispatch(allActions.DataAction.AppLoader(false));
            console.log("error1", error);
            Helper.showToastMessage("Couldn't update password!", "red");
          });
      })
      .catch((error) => {
        dispatch(allActions.DataAction.AppLoader(false));
        // console.log("error2", error);
        Helper.showToastMessage("Invalid old password!", "red");
      });
  };

  const passwordChecker = () => {
    const emptyReg = /^(?!.* )/;
    const lowerCase = /^(?=.*[a-z])/;
    const upperCase = /^(?=.*[A-Z])/;
    const oneDigit = /^(?=.*[0-9])/;
    const sChar = /^(?=.*[^A-Za-z0-9])/;

    if (!values?.password) {
      handleError(language?.password_is_missing, "passwordErrMessage");
      return false;
    } else if (emptyReg.test(values.password) == false) {
      handleError(
        language?.password_can_not_contain_white_spaces,
        "passwordErrMessage"
      );
      return false;
    } else if (values.password.length < 8) {
      handleError(
        "Password length can't be less then 8.",
        "passwordErrMessage"
      );
      Helper.showToastMessage(
        "The password must have minimum eight characters at least one uppercase letter, one lowercase letter, one number and one special character",
        colors.blueTheme
      );
      return false;
    } else if (
      lowerCase.test(values.password) === false ||
      upperCase.test(values.password) === false ||
      oneDigit.test(values.password) === false ||
      sChar.test(values.password) === false
    ) {
      handleError("Week password.", "passwordErrMessage");
      Helper.showToastMessage(
        "The password must have minimum eight characters at least one uppercase letter, one lowercase letter, one number and one special character",
        colors.blueTheme
      );
      return false;
    } else {
      return true;
    }
  };

  const checkValidations = async () => {
    let isValid = true;

    if (!values.oldPassword) {
      handleError("Old password is Missing.", "oldPasswordErrMessage");
      isValid = false;
    }

    if (!passwordChecker()) {
      isValid = false;
    }

    if (!values.confirmPassword) {
      handleError("Confirm password is Missing.", "cpasswordErrMessage");
      isValid = false;
    } else if (values.password !== values.confirmPassword) {
      handleError("Password didn't match.", "cpasswordErrMessage");
      isValid = false;
    } else if (values.password == values.oldPassword) {
      handleError(
        "New password cannot be the same as old.",
        "passwordErrMessage"
      );
      isValid = false;
    }

    if (isValid) {
      changePassword(values.oldPassword, values.password);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <LogoView label="Change Password" />
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => props.navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={hp(2.5)} />
      </TouchableOpacity>
      <View style={styles.inputsSection}>
        <FloatingInput
          label="Old Password*"
          value={values.oldPassword}
          onChangeText={(text) => {
            handleError(null, "oldPasswordErrMessage");
            setValues({ ...values, oldPassword: text });
          }}
          error={
            errMsgs.oldPasswordErrMessage
              ? errMsgs.oldPasswordErrMessage
              : false
          }
        />
        <FloatingInput
          label="New Password*"
          value={values.password}
          secureTextEntry={!showPass}
          showPass={showPass}
          togglePass={() => setShowPass(!showPass)}
          pass={true}
          onChangeText={(text) => {
            handleError(null, "passwordErrMessage");
            setValues({ ...values, password: text });
          }}
          error={
            errMsgs.passwordErrMessage ? errMsgs.passwordErrMessage : false
          }
        />
        <FloatingInput
          label="Confirm Password*"
          value={values.confirmPassword}
          secureTextEntry={!cShowPass}
          showPass={cShowPass}
          togglePass={() => setCShowPass(!cShowPass)}
          pass={true}
          onChangeText={(text) => {
            handleError(null, "cpasswordErrMessage");
            setValues({ ...values, confirmPassword: text });
          }}
          error={
            errMsgs.cpasswordErrMessage ? errMsgs.cpasswordErrMessage : false
          }
        />
        <GradBtn label="Change" height={50} onPress={checkValidations} />
      </View>
    </View>
  );
};
