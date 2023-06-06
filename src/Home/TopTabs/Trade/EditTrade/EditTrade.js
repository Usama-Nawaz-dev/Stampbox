import React, { useContext, useState } from "react";
import { View, Image, Switch, Linking } from "react-native";
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
import ErrorMessage from "../../../../forms/ErrorMessage";
import CustomDropDown from "../../../../../components/CustomDropDown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDispatch } from "react-redux";

import Env from "../../../../../api/Env";
import Helper from "../../../../Helper";
import allActions from "../../../../../redux/actions";
import MindAxios from "../../../../../api/MindAxios";

import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";

const barterData = [
  { value: "coins" },
  { value: "stamps" },
  { value: "coins_and_stamps" },
];

const policyData = [
  { value: "Domestic Returns Accepted" },
  { value: "International Returns Accepted" },
];

const shippingData = [
  { value: "Pickup Only" },
  { value: "Shipping Local/Domestic Only (Country)" },
  { value: "Shipping International" },
];

export const EditTrade = (props) => {
  const { navigation } = props;
  const { Item } = props.route.params;
  const dispatch = useDispatch();

  const item = Item?.tradeables?.length ? Item?.tradeables[0]?.tradeable : null;
  const tradeTime = Item?.expiry_time
    ? Helper.utcToLocalTime(Item?.expiry_time).split(" ")
    : null;
  // console.log("Item?.expiry_time", Helper.utcToLocalTime(Item?.expiry_time));

  let initial = {
    terms: Item?.description,
    coins: Item?.offer_amount?.toString(),
    withOutExpiry: !Item?.expiry_time ? true : false,
  };

  const [values, setValues] = useState(initial);
  const [errMsgs, setErrMsgs] = useState({});
  const [barterOption, setBarterOption] = useState(Item?.accepting_offer);
  const [shippingOption, setShippingOption] = useState(Item?.shiping_option);
  const [policy, setPolicy] = useState(Item?.return_policy);
  const [date, setDate] = useState(tradeTime ? tradeTime[0] : null);
  const [time, setTime] = useState(tradeTime ? tradeTime[1] : null);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme }= useContext(ThemeContext);

  const handleError = (error, input) => {
    setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
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
    if (!shippingOption) {
      handleError("Shipping option is Required.", "optionErrMessage");
      isValid = false;
    }
    if (!policy) {
      handleError("Policy is Required.", "policyErrMessage");
      isValid = false;
    }
    if (barterOption !== "stamps") {
      if (!values?.coins) {
        handleError("Coins is Required.", "coinsError");
        isValid = false;
      }
    }
    if (!values.withOutExpiry) {
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
        await updateTrade(check);
      }
    } else {
      if (isValid) {
        await updateTrade(check);
      }
    }
  };

  const updateTrade = async (check) => {
    let UtcDate;
    if (!values?.withOutExpiry) {
      UtcDate = Helper.changeDateTimeToUTCZero(`${date}T${time}`);
    }
    let body = {
      tradeable_type: Item?.tradeables[0]?.tradeable_type,
      tradeable_ids: [item?.id],
      expiry_time: values.withOutExpiry ? null : UtcDate,
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
      // Trade -> Update
      Env.paramUrl("trades", Item?.id),
      body
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response.status == 200) {
      fetchTrade();
    }
  };

  const fetchTrade = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      // Trade -> Update
      Env.paramUrl("trades", Item?.id)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response.status == 200) {
      const _data = response.data.result?.item;
      Helper.showToastMessage("Trade updated successfully", colors.green);
      dispatch(allActions.DetailAction.TradeDetail(_data));
      props.navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <MainHeader
        title={language?.edit + " " + language?.TRADE}
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
          <AppText style={styles.heading}>{language?.trade_this_Item}</AppText>
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
                {language?.year}:{" "}
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
          {!values?.withOutExpiry ? (
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
            label={language?.tradersTermsAndConditions}
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
            value={barterOption}
            label={
              barterOption
                ? language?.barterOption
                : language?.selectBarterOption
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
              label={language?.coin}
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
              thumbColor={values?.withOutExpiry ? colors.theme : "#f4f3f4"}
              ios_backgroundColor="lightgrey"
              onValueChange={() => {
                setValues({ ...values, withOutExpiry: !values.withOutExpiry });
                handleError(null, "dateErrMessage");
              }}
              value={values?.withOutExpiry}
            />
          </View>
          <View style={styles.btnSection}>
            <CustomButton
              bg={colors.cWhite}
              style={{ borderWidth: 1, borderColor: colors.borderColor }}
              label={language?.draft}
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
