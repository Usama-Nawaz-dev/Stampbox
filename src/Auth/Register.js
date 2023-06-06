import React, {
  useState,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from "react";

import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  ImageBackground,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import moment from "moment";
import MonthPicker from "react-native-month-year-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AntDesign from "react-native-vector-icons/AntDesign";
import * as Yup from "yup";
import AuthContext from "../Context/AuthContext";
import Env from "../../api/Env";
import colors from "../../constant/colors";
import LogoView from "../../components/LogoView";
import { useSelector, useDispatch } from "react-redux";
import allActions from "../../redux/actions";
import { languages, countries, genderData } from "../../constant/staticData";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import PickModal from "../../components/PickModal";
import InputButton from "../../components/InputButton";
import auth from "@react-native-firebase/auth";
import MindAxios from "../../api/MindAxios";
import { images } from "../../assets/images/Images";
import { TermsSheet } from "./TermsSheet";
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

import ThemeContext from "../Context/ThemeContext";
import { FloatingInput, GradBtn, BottomSheet, Phone } from "../../components";

// const validationSchema = Yup.object().shape({
//   firstName: Yup.string()
//     .min(2, "Mininum 2 characters")
//     .max(15, "Maximum 15 characters")
//     .required("First name is required"),
//   userName: Yup.string()
//     .min(2, "Mininum 2 characters")
//     .max(15, "Maximum 15 characters")
//     .required("User name is required"),
//   email: Yup.string().required().email().label("Email")
//     .test('Unique Email', 'Email already exists.', // <- key, message
//       async function (value) {
//         const body = { email: value }
//         const response = await MindAxios.post(
//           Env.createUrl("is-email-exist"), body);
//         if (response?.data?.result?.is_exist) {
//           console.log(response?.data?.result?.is_exist)
//           return false
//         } else {
//           return true
//         }
//       }
//     ),
//   password: Yup.string()
//     .min(6, "Mininum 6 characters")
//     .required("Password is required"),
//   confirmPassword: Yup.string().oneOf(
//     [Yup.ref("password"), null],
//     "Passwords must match"
//   ),
// });
import NewDropDown from "../../components/NewDropDown";
import GooglePlaces from "../../components/GooglePlaces";
import Helper from "../Helper";
import CustomDropDown from "../../components/CustomDropDown";

const Register = ({ navigation }) => {
  const { theme, mode } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState(null);
  const [selectedLang, setSelectedLang] = useState("");
  const [dob, setSelectedDob] = useState(null);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [age, setAge] = useState(null);
  const [topHeight, setTopHeight] = useState(0);
  const [animation, setAnimation] = useState(false);
  const {
    myState: { language },
  } = useContext(AuthContext);
  let initialVal = {
    firstName: "",
    lastName: "",
    userName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  let initialAddress = {
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  };
  const [values, setValues] = useState(initialVal);
  const [errMsgs, setErrMsgs] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [cShowPass, setCShowPass] = useState(false);
  const [address, setAddress] = useState(initialAddress);
  const [phoneError, setPhoneErr] = useState(false);

  // useEffect(()=>{
  //   setLoading(false)
  // },[])
  const termsSheetRef = useRef();

  // const viewRef = useRef();
  // useEffect(() => {
  //   dispatch(allActions.DataAction.ActivityModal(false));
  //   viewRef?.current &&
  //     viewRef.current.measure((fx, fy, width, height, px, py) => {
  //       console.log(fy);
  //       setTopHeight(fy);
  //     });
  // }, []);

  const showPicker = useCallback((value) => setShow(value), []);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;
      showPicker(false);
      setDate(selectedDate);
      let age = calculateAge(selectedDate);
      setAge(age);
      setSelectedDob(moment(selectedDate).format("YYYY"));
    },
    [date, showPicker]
  );
  // calculate age
  const calculateAge = (birthday) => {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  const resetValues = () => {
    setValues(initialVal);
    setAddress(initialAddress);
    setSelectedDob(null);
    setGender(null);
    setSelectedLang("");
    setAge("");
  };
  const handleConfirm = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    try {
      await auth().createUserWithEmailAndPassword(
        values.email,
        values.password
      );
      await goto();
      // await auth().currentUser.sendEmailVerification();
      // const user = auth().currentUser;
    } catch (error) {
      // console.log("error", error);
      dispatch(allActions.DataAction.AppLoader(false));
      alert(error);
      setCheck(false);
    }
  };
  const goto = async () => {
    // dispatch(allActions.DataAction.ActivityModal(false));
    const user = auth().currentUser;
    const firebaseToken = await user.getIdToken();
    const fcmToken = await Helper.getData("fcmToken");
    let getAddress = address?.address?.address ? address?.address : null;
    let my_address = getAddress !== null ? JSON.stringify(getAddress) : null;
    const body = {
      firebase_token: firebaseToken,
      first_name: values?.firstName,
      last_name: values?.lastName,
      username: values?.userName,
      email: values?.email,
      phone: values?.phone,
      language: selectedLang,
      address: my_address,
      gender: gender,
      dob: dob,
      fcm_token: fcmToken,
      device_name: "mobile",
      is_email_verified: 0,
    };
    // console.log("body-->", body);
    const response = await MindAxios.post(Env.createUrl("signup"), body);
    // console.log("response-->", response);
    if (response?.status == 200) {
      let result = response?.data?.result;
      let token = result?.token;
      let id = result?.user?.id;
      await Helper.storeData("loginToken", token);
      await Helper.storeData("userId", id.toString());
      let appendVal = Helper.deepCopy(values);
      appendVal.address = address?.address?.address ? address?.address : null;
      appendVal.dob = dob;
      appendVal.gender = gender;
      appendVal.language = selectedLang;
      appendVal.id = id;
      appendVal.token = token;
      // dispatch(allActions.DataAction.User(appendVal));
      // let sendParams = { email: values?.email, id, token };

      resetValues();
      dispatch(allActions.DataAction.AppLoader(false));
      navigation.navigate("confirm", { values: appendVal });
    } else {
      dispatch(allActions.DataAction.AppLoader(false));
      const {
        e: {
          response: {
            data: { message },
          },
        },
      } = response;
      alert(message);
    }
  };
  const validEmail = async () => {
    setLoading(true);
    const body = { email: values.email };
    const response = await MindAxios.post(
      Env.createUrl("is-email-exist"),
      body
    );
    if (response?.data?.result?.is_exist) {
      // console.log(response?.data?.result?.is_exist);
      setLoading(false);
      return true;
    } else {
      return false;
    }
  };

  // const handleError = (error, input) => {
  //   setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
  // };
  const handleError = (error, input, num) => {
    if (num !== undefined) {
      setPhoneErr(true);
    } else {
      setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
    }
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
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.firstName) {
      handleError("First name is Required.", "firstNameErrMessage");
      isValid = false;
    }

    if (!values.userName) {
      handleError("User name is Required.", "userNameErrMessage");
      isValid = false;
    }
    if (!values.phone?.length) {
      handleError("", "", "phone");
      isValid = false;
    }
    if (values.phone?.length < 7 || phoneError) {
      handleError("", "", "phone");
      isValid = false;
    }

    if (!values.email) {
      handleError(language?.email_is_missing, "emailErrMessage");
      isValid = false;
    } else if (reg.test(values.email) == false) {
      handleError(language?.please_enter_valid_email, "emailErrMessage");
      isValid = false;
    } else {
      let validate = await validEmail();
      if (validate) {
        handleError("Email already exist.", "emailErrMessage");
        isValid = false;
      }
    }

    if (!passwordChecker()) {
      isValid = false;
    }

    if (!values.confirmPassword) {
      handleError("Confirm password is Missing.", "cpasswordErrMessage");
      isValid = false;
    } else if (values.password !== values.confirmPassword) {
      handleError("Confirm password didn't match.", "cpasswordErrMessage");
      isValid = false;
    }

    setLoading(false);
    if (isValid) {
      return termsSheetRef?.current?.open();
    }
  };

  return (
    <View
      // onPress={() => setAnimation(false)}
      style={[styles.container, { backgroundColor: theme.white }]}
    >
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={22} />
        </TouchableOpacity>

        <ImageBackground style={styles.bgImage} source={images.Header}>
          <Text style={styles.heading}>Register Account</Text>
          <Text style={styles.subtitle}>
            Get your free StampBox account now
          </Text>
        </ImageBackground>

        <LogoView height={70} />

        <View
          style={{
            backgroundColor: "transparent",
            marginBottom: hp(6),
            marginTop: 40,
          }}
        >
          <View
            style={{
              width: "90%",
              alignSelf: "center",
            }}
          >
            <FloatingInput
              label={language?.firstName + "*"}
              value={values.firstName}
              onChangeText={(text) => {
                handleError(null, "firstNameErrMessage");
                setValues({ ...values, firstName: text });
              }}
              error={
                errMsgs.firstNameErrMessage
                  ? errMsgs.firstNameErrMessage
                  : false
              }
            />
            <FloatingInput
              label={language?.lastName}
              value={values.lastName}
              onChangeText={(text) => setValues({ ...values, lastName: text })}
            />
            <FloatingInput
              label={language?.userName + "*"}
              value={values.userName}
              autoCapitalize={"none"}
              onChangeText={(text) => {
                handleError(null, "userNameErrMessage");
                setValues({ ...values, userName: text });
              }}
              error={
                errMsgs.userNameErrMessage ? errMsgs.userNameErrMessage : false
              }
            />

            {/* <NewDropDown
              // viewref={viewRef}
              // topHeight={topHeight}
              width="60%"
              Data={genderData}
              state={gender}
              setState={setGender}
              visible={animation}
              setVisible={setAnimation}
              placeHolder={gender ? gender : language?.selectGender}
            /> */}

            <CustomDropDown
              data={genderData}
              position={-4}
              value={gender}
              label={gender ? "Gender" : "Select Gender"}
              onChangeText={(value) => setGender(value)}
            />

            <InputButton
              onPress={() => setShow(true)}
              placeHolder={dob ? dob : language?.dateOfBirth}
              selected={dob}
            />
            {age ? (
              <InputButton
                style={styles.dropdown}
                placeHolder={`${age} ${language?.years_old}`}
                selected={dob}
                showIcon={false}
              />
            ) : null}
            <InputButton
              onPress={() => setModalVisible(true)}
              placeHolder={
                selectedLang ? selectedLang : language?.preferredLanguage
              }
              selected={selectedLang}
            />
            <GooglePlaces
              address={address?.address}
              setAddress={(address) =>
                setAddress({
                  ...address,
                  address,
                })
              }
            />
            <FloatingInput
              label={language?.Town_City}
              value={address?.city?.toString()}
              marginTop={5}
              onChangeText={(text) =>
                setAddress({
                  ...address,
                  address: { city: text },
                })
              }
            />

            <FloatingInput
              label={language?.State_Province}
              value={address?.state?.toString()}
              onChangeText={(text) =>
                setAddress({
                  ...address,
                  state: text,
                })
              }
            />

            <FloatingInput
              label={language?.zipCode}
              value={address?.zipcode?.toString()}
              onChangeText={(text) =>
                setAddress({
                  ...address,
                  zipcode: text,
                })
              }
            />

            <FloatingInput
              label={language?.country}
              value={address?.country?.toString()}
              onChangeText={(text) =>
                setAddress({
                  ...address,
                  country: text,
                })
              }
            />
            {/* <FloatingInput
              label="Phone Number"
              value={values.phone}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType={"phone-pad"}
              onChangeText={(text) => setValues({ ...values, phone: text })}
            /> */}
            <Phone
              phoneNumber={values.phone}
              setPhoneNumber={(number) =>
                setValues({ ...values, phone: number })
              }
              error={phoneError}
              setError={setPhoneErr}
            />
            <FloatingInput
              label="Email"
              value={values.email}
              autoCapitalize={"none"}
              onChangeText={(text) => {
                handleError(null, "emailErrMessage");
                setValues({ ...values, email: text });
              }}
              error={errMsgs.emailErrMessage ? errMsgs.emailErrMessage : false}
            />
            <FloatingInput
              label="Password*"
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
                errMsgs.cpasswordErrMessage
                  ? errMsgs.cpasswordErrMessage
                  : false
              }
            />
            <GradBtn
              label="Continue"
              loading={loading}
              height={50}
              onPress={checkValidations}
            />
            <TouchableOpacity
              style={{ marginTop: 15, alignSelf: "center" }}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.memberText, { color: theme.davyGrey }]}>
                Already have an account?{" "}
                <Text style={{ fontFamily: "Roboto-Bold", color: theme.theme }}>
                  {language?.signIn}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}
        >
          <PickModal
            setModalVisible={() => setModalVisible(false)}
            modalData={languages}
            onPress={(item) => {
              setSelectedLang(item?.value);
              setModalVisible(false);
            }}
          />
        </Modal>
      </KeyboardAwareScrollView>
      {/* {show && (
        <MonthPicker
          onChange={onValueChange}
          value={date}
          maximumDate={new Date()}
          locale="en"
          mode="full"
          autoTheme={false}
        />
      )} */}

      {/* DOB Picker */}
      <DateTimePickerModal
        isVisible={show}
        mode="date"
        value={date}
        maximumDate={new Date()}
        display={"spinner"}
        onCancel={() => setShow(false)}
        onConfirm={(date) => {
          let age = calculateAge(date);
          setAge(age);
          setSelectedDob(moment(date).format("YYYY"));
          setShow(false);
        }}
      />

      <BottomSheet
        onPressClose={() => {
          termsSheetRef?.current?.close();
          // props.closeOpenedSheets();
        }}
        ref={termsSheetRef}
        sheetHeight={hp(50)}
        ChildComponent={
          <TermsSheet
            onPressTerms={() => {
              navigation.navigate("privacy", { termsSheetRef: termsSheetRef });
              termsSheetRef?.current?.close();
            }}
            onPressPolicy={() => {
              navigation.navigate("privacy", {
                termsSheetRef: termsSheetRef,
                isPolicy: true,
              });
              termsSheetRef?.current?.close();
            }}
            onPressClose={() => {
              termsSheetRef?.current?.close();
            }}
            onPressContinue={() => {
              termsSheetRef?.current?.close();
              setTimeout(() => {
                handleConfirm();
                // goto()
              }, 300);
            }}
          />
        }
      />
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backIcon: {
    width: 35,
    height: 35,
    backgroundColor: "white",
    padding: wp(1),
    borderRadius: hp(5),
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: hp(2),
    left: hp(1),
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  view: {
    height: 120,
    width: "50%",
    // marginVertical: 20,
    alignSelf: "center",
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  type: {
    color: "#000",
    fontSize: 17,
  },
  bgImage: {
    width: wp(100),
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontFamily: "IBMPlexSans-Bold",
    color: colors.cWhite,
  },
  subtitle: {
    color: colors.cWhite,
    fontFamily: "Roboto-Regular",
    marginTop: 5,
  },
  addressInput: {
    textInputContainer: {
      alignSelf: "center",
      height: 40,
      borderColor: colors.borderColor,
      borderBottomWidth: 1,
    },
    textInput: {
      height: "100%",
      color: colors.btnText,
      fontSize: 14,
      fontFamily: "Roboto-Regular",
    },
    listView: {
      width: "95%",
      alignSelf: "center",
    },
  },
  memberText: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
  },
});
