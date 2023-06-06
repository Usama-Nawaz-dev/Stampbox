import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AppFormField from "../forms/AppFormField";
import AppForm from "../forms/AppForm";
import * as Yup from "yup";
import ErrorMessage from "../forms/ErrorMessage";
import SubmitButton from "../forms/SubmitButton";
import Helper from "../Helper";
import AuthContext from "../Context/AuthContext";
import Env from "../../api/Env";
import colors from "../../constant/colors";
import LogoView from "../../components/LogoView";
import AuthBtn from "./AuthBtn";
import { useSelector, useDispatch } from "react-redux";
import allActions from "../../redux/actions";
import auth from "@react-native-firebase/auth";
import MindAxios from "../../api/MindAxios";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import FingerprintPopup from "../../components/FingerPrint";
const { width } = Dimensions.get("window");
import { images } from "../../assets/images/Images";
import ThemeContext from "../Context/ThemeContext";

import { FloatingInput, GradBtn } from "../../components";
import { useFocusEffect } from "@react-navigation/native";
import database from "@react-native-firebase/database";

const Login = ({ navigation }) => {
  const { signIn } = useContext(AuthContext);
  const { theme, mode } = useContext(ThemeContext);
  // console.log('theme--->', mode)
  const dispatch = useDispatch();
  const [showSccaner, setShowSccaner] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errMsgs, setErrMsgs] = useState({});
  const {
    myState: { language },
  } = useContext(AuthContext);
  // console.log(".....!", language);
  useFocusEffect(
    useCallback(() => {
      // setStoreName(Data?.name);
      resetForm();
      // Do something when the screen is focused
      return () => {
        // alert('Screen was unfocused');
        // setNewImage(null);
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );
  const resetForm = () => {
    setEmail("");
    setPassword("");
  };
  const online = async (id) => {
    if (id) {
      await database().ref(`/Userstatus/${id}`).set({ onlineStatus: "online" });
    }
  };
  // ERROR To Be Fixed: "When no internet it shows invalid credentials"
  const loginWithEmailAndPassword = async () => {
    dispatch(allActions.DataAction.ActivityModal(true));
    try {
      await auth().signInWithEmailAndPassword(email.trim(), password);
      let user = auth().currentUser;
      const firebaseToken = await user.getIdToken();
      // console.log("firebase", firebaseToken);

      const { data, e } = await MindAxios.post(Env.createUrl("signin"), {
        firebase_token: firebaseToken,
        device_name: "mobile",
        // fcm_token: fcmToken,
      });
      // console.log("data====--===>", data);
      const error = e?.response?.data;
      // dispatch(allActions.DataAction.ActivityModal(false));
      if (data?.success) {
        const {
          result: { user, token },
        } = data;
        let { id, is_email_verified, first_name } = user;
        await dispatch(allActions.ApiAction.setSupportToken(user));
        await online(id);
        dispatch(allActions.DataAction.ActivityModal(false));
        // console.log("user", user);
        if (is_email_verified == 1) {
          await Helper.setUser(user);
          await Helper.storeData("loginMethod", "email");
          await Helper.storeData("loginToken", token);
          await Helper.storeData("userId", id.toString());
          await Helper.storeData("homeToken", token);
          // FINGER PRINT AUTH
          let savedEmail = await Helper.getData("email");
          if (savedEmail && savedEmail !== email) {
            await AsyncStorage.removeItem("fingerPrintVAlidation");
          } else {
            await Helper.storeData("email", email);
            await Helper.storeData("password", password);
          }
          dispatch(allActions.DataAction.ActivityModal(false));
          await Helper.showToastMessage("Welcome");
          signIn(token);
        } else {
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
            await Helper.showToastMessage(language?.pleaseVerifyFirst);
            await Helper.storeData("loginToken", token);
            await Helper.storeData("userId", id.toString());
            navigation.navigate("confirm", {
              values: { email, id, firstName: first_name },
            });
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
        }
      } else if (error) {
        dispatch(allActions.DataAction.ActivityModal(false));
        alert(error?.message);
      }
    } catch (error) {
      dispatch(allActions.DataAction.ActivityModal(false));
      // console.log("error", error);
      alert(language?.invalid_email_password);
    }
  };

  //Firebase Google Authentication

  GoogleSignin.configure({
    webClientId:
      "539029360423-h5bqk74p1mb9cqcq6pvb4ema7ud7uvqu.apps.googleusercontent.com",
  });

  async function onGoogleButtonPress() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
    await Helper.storeData("loginMethod", "google");
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // console.log("googleCredential---->", googleCredential);
    await Helper.storeData("google", googleCredential?.token);
    // Sign-in the user with the credential
    let authentication = await auth().signInWithCredential(googleCredential);
    dispatch(allActions.DataAction.ActivityModal(true));
    // let user = auth().currentUser;
    //  const f_token = await user.getIdToken();
    return authentication;
  }

  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);

    if (result.isCancelled) {
      throw "User cancelled the login process";
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw "Something went wrong obtaining access token";
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken
    );
    // console.log("fireBase", facebookCredential);
    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }

  const handleError = (error, input) => {
    setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
  };

  const checkValidations = () => {
    let isValid = true;
    // const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var re = /^(?!.* )/;
    if (!email) {
      handleError(language?.email_is_missing, "emailErrMessage");
      isValid = false;
    } else if (reg.test(email.trim()) == false) {
      console.log("comming here", email);
      handleError(language?.please_enter_valid_email, "emailErrMessage");
      isValid = false;
    }

    if (!password) {
      handleError(language?.password_is_missing, "passwordErrMessage");
      isValid = false;
    } else if (re.test(password) == false) {
      handleError(
        language?.password_can_not_contain_white_spaces,
        "passwordErrMessage"
      );
      isValid = false;
    }

    if (isValid) {
      loginWithEmailAndPassword();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.white }}>
      <LogoView />
      <View style={{ flex: 0.7 }}>
        <View
          style={{
            flex: 0.55,
            width: "90%",
            alignSelf: "center",
          }}
        >
          <FloatingInput
            label={language?.email}
            value={email}
            autoCapitalize={"none"}
            onChangeText={(text) => {
              handleError(null, "emailErrMessage");
              setEmail(text);
            }}
            error={errMsgs.emailErrMessage ? errMsgs.emailErrMessage : false}
          />
          <FloatingInput
            label={language?.password}
            value={password}
            secureTextEntry={!showPass}
            showPass={showPass}
            togglePass={() => setShowPass(!showPass)}
            pass={true}
            onChangeText={(text) => {
              handleError(null, "passwordErrMessage");
              setPassword(text);
            }}
            error={
              errMsgs.passwordErrMessage ? errMsgs.passwordErrMessage : false
            }
          />
          <GradBtn
            label={language?.signIn}
            height={50}
            onPress={checkValidations}
          />
          <View style={styles.forgotSection}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("register");
                // navigation.navigate("confirm");
              }}
            >
              <Text style={[styles.memberText, { color: theme.davyGrey }]}>
                {language?.not_a_member}?{" "}
                <Text style={{ fontFamily: "Roboto-Bold" }}>
                  {language?.Register}
                </Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("forgot")}>
              <Text style={[styles.memberText, { color: theme.davyGrey }]}>
                {language?.forgotPassword}?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flex: 0.45,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <View>
            <View style={styles.socialSection}>
              <AuthBtn
                onPress={() =>
                  onGoogleButtonPress()
                    .then(async (res) => {
                      const { isNewUser, profile } = res.additionalUserInfo;
                      let user = auth().currentUser;
                      const f_token = await user.getIdToken();
                      if (isNewUser) {
                        const body = {
                          firebase_token: f_token,
                          first_name: profile.given_name?.trim(),
                          last_name: profile.family_name,
                          username: profile.name,
                          email: profile.email,
                          phone: "",
                          language: "",
                          address: null,
                          gender: null,
                          dob: null,
                          device_name: "mobile",
                          is_email_verified: 1,
                        };
                        // console.log("Signed in with Google!", body);
                        const response = await MindAxios.post(
                          Env.createUrl("signup"),
                          body
                        );
                        const { data, e, status } = response;
                        // dispatch(allActions.DataAction.ActivityModal(false));
                        // console.log("response-->", response);
                        if (status == 200) {
                          // console.log('response-->', response);
                          // dispatch(allActions.DataAction.ActivityModal(false));
                          let result = data?.result;
                          let token = result?.token;
                          let id = result?.user?.id;
                          await dispatch(
                            allActions.ApiAction.setSupportToken(result?.user)
                          );
                          dispatch(allActions.DataAction.ActivityModal(false));
                          await Helper.storeData("loginToken", token);
                          await Helper.storeData("userId", id.toString());
                          await navigation.navigate("category");
                        } else {
                          dispatch(allActions.DataAction.ActivityModal(false));
                          if (e) {
                            const {
                              response: {
                                data: {
                                  errors: { email: err },
                                },
                              },
                            } = e;
                            if (err?.length) {
                              let msg = err[0];
                              alert(msg);
                            }
                            // console.log("this one here-->", err);
                          }
                          // alert(message)
                        }
                      } else {
                        // const fcmToken = await Helper.getData("fcmToken");
                        const response = await MindAxios.post(
                          Env.createUrl("signin"),
                          {
                            firebase_token: f_token,
                            device_name: "mobile",
                            // fcm_token: fcmToken,
                          }
                        );
                        const { data, e, status } = response;
                        console.log("data", response);
                        // dispatch(allActions.DataAction.ActivityModal(false));
                        if (status == 200) {
                          // resetForm();
                          // const {data} = response;
                          const {
                            result: { user, token },
                          } = data;
                          let { id } = user;
                          // let token = data?.result?.token;
                          // let id = data?.result?.user?.id;
                          await dispatch(
                            allActions.ApiAction.setSupportToken(user)
                          );
                          await online(id);
                          await Helper.setUser(user);
                          // console.log("token", token);
                          await Helper.storeData("loginToken", token);
                          await Helper.storeData("userId", id.toString());
                          await Helper.storeData("homeToken", token);
                          // await Helper.storeData("email", email);
                          // await Helper.storeData("password", password);
                          dispatch(allActions.DataAction.ActivityModal(false));
                          await Helper.showToastMessage("Welcome");
                          signIn(token);
                        } else {
                          dispatch(allActions.DataAction.ActivityModal(false));
                          const {
                            response: {
                              data: { message },
                            },
                          } = e;
                          // console.log(message);
                          alert(message);
                        }
                      }
                    })
                    .catch((error) => {
                      dispatch(allActions.DataAction.ActivityModal(false));
                      // console.log("Error", error);
                    })
                }
                icon={
                  <Image
                    source={require("../../assets/icons/google.png")}
                    style={{ height: 40, width: 40 }}
                    resizeMode="contain"
                  />
                }
              />
              <AuthBtn
                onPress={() =>
                  onFacebookButtonPress().then(() => {
                    // console.log("Signed in with Facebook!")
                  })
                }
                icon={
                  <Image
                    source={require("../../assets/icons/fb.png")}
                    style={{ height: 40, width: 40 }}
                    resizeMode="contain"
                  />
                }
              />
              <AuthBtn
                onPress={async () => {
                  let checker = await Helper.getData("fingerPrintVAlidation");
                  let email = await Helper.getData("email");
                  let password = await Helper.getData("password");
                  if (checker == "true") {
                    setShowSccaner(true);
                  } else {
                    alert("Please enable finger auth from settings");
                  }
                }}
                icon={
                  <Image
                    source={
                      mode == "dark"
                        ? images.FingerPrintDark
                        : images.FingerPrint
                    }
                    style={{ height: 40, width: 40 }}
                    resizeMode="contain"
                  />
                }
              />
            </View>
            {showSccaner && (
              <FingerprintPopup
                style={styles.popup}
                handlePopupDismissed={() => setShowSccaner(false)}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  loginbox: {
    width: "90%",
    height: hp("60%"),
    alignSelf: "center",
    backgroundColor: "#FFF",
    borderRadius: hp("2%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  header: {
    height: 60,
    backgroundColor: "#449F45",
    justifyContent: "center",
    alignItems: "center",
    // borderRadius: 10,
    borderTopRightRadius: hp("2%"),
    borderTopLeftRadius: hp("2%"),
    marginBottom: 30,
  },
  textinput: {
    borderWidth: 1,
    padding: 16,
    borderColor: "#449F45",
    borderRadius: 30,
  },
  button: {
    height: 55,
    borderRadius: 30,
    backgroundColor: "#449F45",
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  popup: {
    width: width * 0.8,
  },
  forgotSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  memberText: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
  },
  socialSection: {
    flexDirection: "row",
    width: "55%",
    alignSelf: "center",
    justifyContent: "space-around",
  },
});
