import React, { useContext, useState } from "react";
import { Text, View, Image, Switch, TouchableOpacity } from "react-native";
import { styles } from "./styles";

import {
  FloatingInput,
  MainHeader,
  GradBtn,
  CustomButton,
  DatePickerTime,
} from "../../../../../components";

import AppText from "../../../../../components/AppText";
import { images } from "../../../../../assets/images/Images";

import colors from "../../../../../constant/colors";
import CustomDropDown from "../../../../../components/CustomDropDown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useSelector, useDispatch } from "react-redux";
import ErrorMessage from "../../../../forms/ErrorMessage";
import AuthContext from "../../../../Context/AuthContext";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";

const barterData = [
  { value: "coins" },
  { value: "stamps" },
  { value: "coins_and_stamps" },
];

const shippingData = [
  { value: "Pickup Only" },
  { value: "Shipping Local/Domestic Only (Country)" },
  { value: "Shipping International" },
];

const policyData = [
  { value: "Domestic Returns Accepted" },
  { value: "International Returns Accepted" },
];

export const CreateTrade = (props) => {
  const { navigation } = props;
  const { item } = props.route.params;
  const dispatch = useDispatch();
  //   console.log(item)
  let initial = {
    terms: "",
    coins: "",
    reservePrice: "",
    buyIt: false,
  };
  const [values, setValues] = useState(initial);
  const [errMsgs, setErrMsgs] = useState({});
  const [barterOption, setBarterOption] = useState(null);
  const [shippingOption, setShippingOption] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const handleError = (error, input) => {
    setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
  };
  const valid = async (check) => {
    let UtcDate;
    if (!values.buyIt) {
      UtcDate = Helper.changeDateTimeToUTCZero(`${date}T${time}`);
    }
    let body = {
      tradeable_type: "StampItem",
      tradeable_ids: [item?.id],
      expiry_time: values.buyIt ? null : UtcDate,
      is_published: check ? 1 : 0,
      accepting_offer: barterOption,
      offer_amount: values?.coins,
      description: values?.terms,
      shiping_option: shippingOption,
      return_policy: policy,
    };
    // console.log("body", body);

    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.post(
      // Trade -> Create
      Env.createUrl("trades"),
      body
    );
    dispatch(allActions.DataAction.AppLoader(false));
    // console.log("------------>>>>>>>>", response);
    if (response.status == 200) {
      dispatch(allActions.DataAction.SelectedImg([]));
      // console.log('res------->', response);
      resetValues();
      props.navigation.goBack();
    }
  };
  const resetValues = () => {
    setDate(null);
    setTime(null);
    setValues(initial);
    // setPolicy(null);
    setBarterOption(null);
  };

  const checkValidations = async (check) => {
    let isValid = true;
    if (!values?.terms) {
      handleError("Terms&Conditions is Required.", "termsError");
      isValid = false;
    }
    if (!barterOption) {
      handleError("An option is Required.", "optionError");
      isValid = false;
    }
    if (barterOption !== "stamps") {
      if (!values?.coins) {
        handleError("Coins is Required.", "coinsError");
        isValid = false;
      }
    }
    if (!shippingOption) {
      handleError("Shipping option is Required.", "optionErrMessage");
      isValid = false;
    }
    if (!policy) {
      handleError("Policy is Required.", "policyErrMessage");
      isValid = false;
    }
    if (!values.buyIt) {
      if (!time && !date) {
        // console.log("data", date);
        // console.log("time", time);
        handleError("Date and time is Required.", "dateErrMessage");
        isValid = false;
      } else if (!date) {
        handleError("Date is Required.", "dateErrMessage");
        isValid = false;
      } else if (!time) {
        handleError("Time is Required.", "dateErrMessage");
        isValid = false;
      }
      if (isValid) {
        await valid(check);
      }
    } else {
      if (isValid) {
        await valid(check);
      }
    }
  };

  return (
    <View style={styles.container}>
      <MainHeader
        title="Create Trade"
        onPressBack={() => {
          navigation.goBack();
          resetValues();
        }}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoSection}>
          <Text style={styles.heading}>{language?.trade_this_Item}</Text>
          <View style={styles.infoCard}>
            <Image
              source={
                item ? { uri: item?.medias[0]?.media_url } : images.Stamp2
              }
              style={styles.stampImg}
              resizeMode="contain"
            />
            <View>
              <AppText style={styles.heading}>{item?.name}</AppText>
              <AppText style={styles.text}>
                {language?.country}:{" "}
                <AppText style={styles.infoText}>{item?.country}</AppText>
              </AppText>
              <AppText style={styles.text}>
                Year:{" "}
                <AppText style={styles.infoText}>{item?.year_issued}</AppText>
              </AppText>
              <AppText style={styles.text}>
                {language?.scott}:{" "}
                <AppText style={styles.infoText}>
                  {item?.catalogue_number[0]?.number}
                </AppText>
              </AppText>
            </View>
          </View>
          {!values?.buyIt ? (
            <View style={{ marginTop: hp(2) }}>
              <DatePickerTime
                date={date}
                time={time}
                setDate={setDate}
                setTime={setTime}
              />
              <ErrorMessage
                visible={errMsgs.dateErrMessage ? true : false}
                error={errMsgs.dateErrMessage}
              />
            </View>
          ) : null}
          <FloatingInput
            label={language?.tradersTermsAndConditions + "*"}
            value={values?.terms}
            // keyboardType="numeric"
            onChangeText={(text) => {
              handleError(null, "termsError");
              setValues({ ...values, terms: text });
            }}
            error={errMsgs.termsError ? errMsgs.termsError : false}
          />
          <CustomDropDown
            data={shippingData}
            value={shippingOption}
            label={
              shippingOption ? "Shipping Option" : "Select Shipping Option*"
            }
            left={15}
            position={-4}
            width="70%"
            onChangeText={(value) => {
              handleError(null, "optionErrMessage");
              setShippingOption(value);
            }}
          />
          <ErrorMessage
            visible={errMsgs.optionErrMessage ? true : false}
            error={errMsgs.optionErrMessage}
          />
          <CustomDropDown
            data={policyData}
            value={policy}
            label={
              policy
                ? language?.Return_Policy
                : language?.selectReturnPolicy + "*"
            }
            left={15}
            position={-3}
            width="60%"
            onChangeText={(value) => {
              handleError(null, "policyErrMessage");
              setPolicy(value);
            }}
          />
          <ErrorMessage
            visible={errMsgs.policyErrMessage ? true : false}
            error={errMsgs.policyErrMessage}
          />
          <CustomDropDown
            data={barterData}
            label={
              barterOption
                ? language?.barterOption
                : language?.selectBarterOption + "*"
            }
            left={15}
            position={-4}
            width="70%"
            onChangeText={(value) => {
              handleError(null, "optionError");
              setBarterOption(value);
            }}
          />
          <ErrorMessage
            visible={errMsgs.optionError ? true : false}
            error={errMsgs.optionError}
          />
          {barterOption !== "stamps" && (
            <FloatingInput
              label={language.coins + "*"}
              keyboardType="numeric"
              value={values?.coins}
              onChangeText={(text) => {
                handleError(null, "coinsError");
                setValues({ ...values, coins: text });
              }}
              error={errMsgs.coinsError ? errMsgs.coinsError : false}
            />
          )}

          <View style={styles.checkSection}>
            <AppText style={styles.buyText}>{language?.withoutExpiry}</AppText>
            <Switch
              trackColor={{ false: "#767577", true: `${colors.theme}50` }}
              thumbColor={values?.buyIt ? colors.theme : "#f4f3f4"}
              ios_backgroundColor="lightgrey"
              onValueChange={() => {
                setValues({ ...values, buyIt: !values.buyIt });
              }}
              value={values?.buyIt}
            />
          </View>
          <View style={styles.btnSection}>
            <CustomButton
              bg={colors.cWhite}
              style={{ borderWidth: 1, borderColor: colors.borderColor }}
              label="Draft"
              textColor={colors.placeholderText}
              fontWeight="600"
              width={wp(45)}
              height={45}
              fontSize={16}
              onPress={() => checkValidations(false)}
            />
            <GradBtn
              label="Place"
              height={45}
              width={wp(45)}
              style={{ marginTop: 0 }}
              fontWeight="600"
              onPress={() => checkValidations(true)}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
