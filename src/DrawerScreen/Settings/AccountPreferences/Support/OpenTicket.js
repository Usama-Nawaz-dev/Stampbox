import { Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { styles } from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { FloatingInput, GradBtn, Phone } from "../../../../../components";
import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import CustomDropDown from "../../../../../components/CustomDropDown";
import ErrorMessage from "../../../../forms/ErrorMessage";
import SupportAxios from "../../../../../support_apis/SupportAxios";
import supportEnv from "../../../../../support_apis/supportEnv";
import allActions from "../../../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import colors from "../../../../../constant/colors";
import Helper from "../../../../Helper";
let initialVal = {
  userName: "",
  email: "",
  title: "",
  description: "",
};
export const OpenTicket = (props) => {
  const focused = useIsFocused();
  const [values, setValues] = useState(initialVal);
  const [categories, setCategories] = useState();
  const [errMsgs, setErrMsgs] = useState({});
  const [phoneError, setPhoneErr] = useState(false);
  const [topic, setTopic] = useState();
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      setErrMsgs({});
      //   setTopic(null);
      await getCategories();
      // await getTicket();
    })();
  }, [focused]);

  const getCategories = async () => {
    const response = await SupportAxios.get(supportEnv.createUrl("categories"));
    console.log("response", response);
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

  const getTicket = async () => {
    const response = await SupportAxios.get(supportEnv.createUrl("tickets/2"));
    // console.log("response", response);
    if (response?.status == 200) {
      //   const {
      //     data: {
      //       result: {
      //         paginated_items: { data },
      //       },
      //     },
      //   } = response;
      //   console.log("data", data);
      //   const newData = data.map((item) => {
      //     let obj = {};
      //     obj.id = item.id;
      //     obj.value = item.name;
      //     return obj;
      //   });
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

    // if (!values.userName) {
    //   handleError("User name is Required.", "userNameErrMessage");
    //   isValid = false;
    // }
    // if (!values.phone?.length) {
    //   handleError("", "", "phone");
    //   isValid = false;
    // }
    // if (values.phone?.length < 7 || phoneError) {
    //   handleError("", "", "phone");
    //   isValid = false;
    // }

    // if (!values.email) {
    //   handleError(language?.email_is_missing, "emailErrMessage");
    //   isValid = false;
    // } else if (reg.test(values.email) == false) {
    //   handleError(language?.please_enter_valid_email, "emailErrMessage");
    //   isValid = false;
    // }
    if (!topic?.value) {
      handleError("Please select the topic", "topicErrMessage");
      isValid = false;
    }
    if (!values.title) {
      handleError("Title is missing", "titleErrMessage");
      isValid = false;
    }
    //   if (!values.description) {
    //     handleError("Please select the topic", "topicErrMessage");
    //     isValid = false;
    //   }
    // setLoading(false);
    if (isValid) {
      // console.log("valid", values);
      setLoading(true);
      const res = await SupportAxios.post(supportEnv.createUrl("tickets"), {
        title: values?.title,
        message: values?.description ? values?.description : "",
        status: "open",
        category_id: topic?.id,
        user_id: currentUser?.id,
      });
      setLoading(false);
      // console.log("res", res);
      if (res?.status === 200) {
        Helper.showToastMessage("Ticket Created Successfully", colors.green);
        setValues({ ...values, title: null, description: null });
        setTopic(null);
        props.navigation.navigate("Check Ticket");
      } else {
        Helper.showToastMessage(
          "There's some issue while creating Ticket",
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
              label={language?.userName}
              value={`${currentUser?.first_name} ${currentUser?.last_name}`}
              editable={false}
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
              value={currentUser?.email}
              autoCapitalize={"none"}
              editable={false}
              marginTop={errMsgs.emailErrMessage ? -1 : 0}
              onChangeText={(text) => {
                handleError(null, "emailErrMessage");
                setValues({ ...values, email: text });
              }}
              error={errMsgs.emailErrMessage ? errMsgs.emailErrMessage : false}
            />
            {currentUser?.phone ? (
              <FloatingInput
                label="Your contact no."
                value={currentUser?.phone}
                autoCapitalize={"none"}
                editable={false}
                marginTop={errMsgs.emailErrMessage ? -1 : 0}
              />
            ) : null}
            {/* <Phone
              phoneNumber={values.phone}
              setPhoneNumber={(number) =>
                setValues({ ...values, phone: number })
              }
              error={phoneError}
              setError={setPhoneErr}
            /> */}
            <FloatingInput
              label={"Title"}
              value={values.title}
              autoCapitalize={"none"}
              onChangeText={(text) => {
                handleError(null, "titleErrMessage");
                setValues({ ...values, title: text });
              }}
              error={errMsgs.titleErrMessage ? errMsgs.titleErrMessage : false}
            />
            <CustomDropDown
              data={categories}
              value={topic?.value ? topic?.value : ""}
              label={topic?.value ? "Topic" : "Select Topic"}
              position={-5}
              style={{ marginTop: topic?.value ? 5 : 0 }}
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
              loading={loading}
              height={50}
              onPress={checkValidations}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
