import React, { useContext, useState, useEffect } from "react";
import { View } from "react-native";

import { styles } from "./styles";
import colors from "../../../../../constant/colors";
import ErrorMessage from "../../../../forms/ErrorMessage";
import CustomDropDown from "../../../../../components/CustomDropDown";

import { loremText } from "./utils";
import { ThemeDescription } from "./ThemeDescription";
import { FloatingInput, GradBtn, Phone } from "../../../../../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";

import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import Helper from "../../../../Helper";
import supportEnv from "../../../../../support_apis/supportEnv";
import SupportAxios from "../../../../../support_apis/SupportAxios";

export const ContactUs = () => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [topic, setTopic] = useState();
  const [errMsgs, setErrMsgs] = useState({});
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState();

  let initialVal = {
    userName: currentUser?.full_name
      ? currentUser?.full_name
      : currentUser?.first_name,
    email: currentUser?.email,
    phone: currentUser?.phone,
    description: "",
  };

  const [values, setValues] = useState(initialVal);
  const [phoneError, setPhoneErr] = useState(false);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (focused) {
      setErrMsgs({});
      getCategories();
    }
  }, [focused]);

  const getCategories = async () => {
    const response = await SupportAxios.get(supportEnv.createUrl("categories"));
    // console.log("response", response);
    if (response?.status == 200) {
      const {
        data: {
          result: {
            paginated_items: { data },
          },
        },
      } = response;
      // console.log("data", data);
      const newData = data.map((item) => {
        let obj = {};
        obj.id = item.id;
        obj.value = item.name;
        return obj;
      });
      setCategories(newData);
    }
  };

  const handleError = (error, input, num) => {
    if (num !== undefined) {
      setPhoneErr(true);
    } else {
      setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
    }
  };
  const checkValidations = async () => {
    let isValid = true;
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    }
    if (!topic) {
      handleError("Please select the topic", "topicErrMessage");
      isValid = false;
    }
    if (isValid) {
      setLoading(true);
      const body = {
        message: values?.description ? values?.description : "",
        email: values.email,
        name: values.userName,
        phone: values?.phone,
        subject: topic?.value,
      };
      const res = await SupportAxios.post(
        supportEnv.createUrl("contacts"),
        body
      );
      setLoading(false);
      // console.log("res", res);
      if (res?.status === 200) {
        Helper.showToastMessage("Conatact Created Successfully.", colors.green);
        setValues(initialVal);
        setTopic(null);
      } else {
        Helper.showToastMessage(
          "There's some issue while creating Contact.",
          colors.danger
        );
      }
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemeDescription title={"Contact Us"} body={loremText} />
        <View
          style={{
            backgroundColor: "transparent",
            marginBottom: hp(6),
            // marginTop: 40,
          }}
        >
          <View
            style={{
              width: "90%",
              alignSelf: "center",
            }}
          >
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
            <FloatingInput
              label="Email"
              value={values.email}
              autoCapitalize={"none"}
              marginTop={errMsgs.emailErrMessage ? -1 : 0}
              onChangeText={(text) => {
                handleError(null, "emailErrMessage");
                setValues({ ...values, email: text });
              }}
              error={errMsgs.emailErrMessage ? errMsgs.emailErrMessage : false}
            />
            <Phone
              phoneNumber={values.phone}
              setPhoneNumber={(number) =>
                setValues({ ...values, phone: number })
              }
              error={phoneError}
              setError={setPhoneErr}
            />
            <CustomDropDown
              data={categories}
              value={topic?.value ? topic?.value : ""}
              label={topic?.value ? "Topic" : "Select Topic"}
              position={-5}
              height={hp(25)}
              style={{ marginTop: 10 }}
              onChangeText={(value) => {
                // console.log("val", value);
                const objectWithVal = categories?.find(
                  (obj) => obj.value === value
                );
                setTopic(objectWithVal);
                handleError(null, "topicErrMessage");
              }}
            />
            {
              <ErrorMessage
                visible={errMsgs.topicErrMessage ? true : false}
                error={errMsgs.topicErrMessage}
              />
            }
            <FloatingInput
              label={"Description"}
              value={values.description}
              autoCapitalize={"none"}
              onChangeText={(text) => {
                handleError(null, "descriptionErrMessage");
                setValues({ ...values, description: text });
              }}
              error={
                errMsgs.descriptionErrMessage
                  ? errMsgs.descriptionErrMessage
                  : false
              }
            />

            <GradBtn
              label="Submit"
              height={hp(5.5)}
              loading={loading}
              onPress={checkValidations}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
