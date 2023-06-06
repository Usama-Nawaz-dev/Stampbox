import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { AlertIOS, Alert } from "react-native";
import FingerprintScanner from "react-native-fingerprint-scanner";
import Helper from "../src/Helper";
import MindAxios from "../api/MindAxios";
import AuthContext from "../src/Context/AuthContext";
import allActions from "../redux/actions";
import auth from "@react-native-firebase/auth";

import { useSelector, useDispatch } from "react-redux";
import Env from "../api/Env";

const FingerprintPopup = (props) => {
  const { signIn, myState: {language} } = useContext(AuthContext);
  const dispatch = useDispatch();

  const loginWithEmailAndPassword = async () => {
    // setLoading(true);
    dispatch(allActions.DataAction.ActivityModal(true));
    try {
      let email = await Helper.getData("email");
      let password = await Helper.getData("password");
      await auth().signInWithEmailAndPassword(email, password);
      const user = auth().currentUser;
      const firebaseToken = await user.getIdToken();
      // console.log("firebase", firebaseToken);

      const { data } = await MindAxios.post(Env.createUrl("signin"), {
        firebase_token: firebaseToken,
        device_name: "mobile",
      });
      // console.log("data", data);
      // dispatch(allActions.DataAction.ActivityModal(false));
      if (data?.success) {
        let token = data?.result?.token;
        // console.log("token", token);
        await Helper.storeData("loginToken", token);
        await Helper.storeData("homeToken", token);
        // FINGER PRINT AUTH

        dispatch(allActions.DataAction.ActivityModal(false));
        await Helper.showToastMessage("Welcome");
        signIn(token);
      }
    } catch (error) {
      dispatch(allActions.DataAction.ActivityModal(false));
      // console.log("error", error);
      alert(language?.invalid_email_password);
    }
  };
  async function onGoogleButtonPress() {
    dispatch(allActions.DataAction.ActivityModal(true));
    try {
      let token = await Helper.getData("google");
      const googleCredential = {
        token: token,
        providerId: "google.com",
        secret: undefined,
      };
      // console.log("googleCredential---->", googleCredential);
      // Sign-in the user with the credential
      let res = await auth().signInWithCredential(googleCredential);

      const {
        additionalUserInfo: { isNewUser },
      } = res;
      let user = auth().currentUser;
      const f_token = await user.getIdToken();
      if (isNewUser) {
        alert("User is removed");
      } else {
        const { data } = await MindAxios.post(Env.createUrl("signin"), {
          firebase_token: f_token,
          device_name: "mobile",
        });
        // console.log("data", data);
        // dispatch(allActions.DataAction.ActivityModal(false));
        if (data?.success) {
          // resetForm();
          let token = data?.result?.token;
          let id = data?.result?.user?.id;
          // console.log("token", token);
          await Helper.storeData("loginToken", token);
          await Helper.storeData("userId", id.toString());
          await Helper.storeData("homeToken", token);
          dispatch(allActions.DataAction.ActivityModal(false));
          await Helper.showToastMessage("Welcome");
          signIn(token);
        }
      }
    } catch (error) {
      dispatch(allActions.DataAction.ActivityModal(false));
      console.log("error", error);
      alert("Invalid creds!");
    }
  }

  // componentDidMount() {
  //   FingerprintScanner
  //     .authenticate({ description: 'Scan your fingerprint on the device scanner to continue' })
  //     .then(async () => {
  //       this.props.handlePopupDismissed();
  //       this.loginWithEmailAndPassword()
  //       Alert.alert('Authenticated successfully');
  //     })
  //     .catch((error) => {
  //       this.props.handlePopupDismissed();
  //       Alert.alert(error.message);
  //     });
  // }
  useEffect(() => {
    FingerprintScanner.authenticate({
      description: "Scan your fingerprint on the device scanner to continue",
    })
      .then(async () => {
        props.handlePopupDismissed();
        let method = await Helper.getData("loginMethod");
        if (method == "email") {
          loginWithEmailAndPassword();
        } else {
          onGoogleButtonPress();
        }

        // Alert.alert('Authenticated successfully');
      })
      .catch((error) => {
        props.handlePopupDismissed();
        Alert.alert(error.message);
      });
  }, []);

  return false;
};

FingerprintPopup.propTypes = {
  handlePopupDismissed: PropTypes.func.isRequired,
};

export default FingerprintPopup;
