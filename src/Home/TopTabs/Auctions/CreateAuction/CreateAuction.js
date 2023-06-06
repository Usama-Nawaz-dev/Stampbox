import React, { useContext, useEffect, useState } from "react";
import { Text, View, Image, Switch } from "react-native";

import {
  FloatingInput,
  MainHeader,
  GradBtn,
  CustomButton,
  DatePickerTime,
} from "../../../../../components";

import { styles } from "./styles";
import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";
import ErrorMessage from "../../../../forms/ErrorMessage";
import { images } from "../../../../../assets/images/Images";
import CustomDropDown from "../../../../../components/CustomDropDown";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useSelector, useDispatch } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";

import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";

const shippingData = [
  { value: "Pickup Only" },
  { value: "Shipping Local/Domestic Only (Country)" },
  { value: "Shipping International" },
];

const policyData = [
  { value: "Domestic Returns Accepted" },
  { value: "International Returns Accepted" },
];

export const CreateAuction = (props) => {
  const { navigation } = props;
  const { item } = props.route.params;

  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const [values, setValues] = useState({
    currentPrice: "",
    initialBid: "",
    reservePrice: "",
    buyIt: false,
  });

  const auctionTime = item?.expiry_time
    ? Helper.utcToLocalTime(item?.expiry_time).split(" ")
    : null;

  const [errMsgs, setErrMsgs] = useState({});
  const [shippingOption, setShippingOption] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const handleError = (error, input) => {
    setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
  };

  const resetValues = () => {
    setDate(null);
    setTime(null);
    setValues(null);
    setPolicy(null);
    setShippingOption(null);
  };

  useEffect(() => {
    if (item?.auctionable) {
      setValues({
        currentPrice: item?.price,
        initialBid: item?.initial_bid,
        reservePrice: item?.reserve_price,
        buyIt: item?.can_buy_now ? true : false,
      });
      setDate(auctionTime ? auctionTime[0] : null);
      setTime(auctionTime ? auctionTime[1] : null);
      setShippingOption(item?.shiping_option);
      setPolicy(item?.return_policy);
    }
  }, []);

  const checkValidations = async (check) => {
    let isValid = true;
    if (!values?.currentPrice) {
      handleError("Current Price is Required.", "currentPriceErrMessage");
      isValid = false;
    }
    if (!values?.initialBid) {
      handleError("Initial bid is Required.", "bidErrMessage");
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
    if (!time && !date) {
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
      if (item?.auctionable) {
        updateAuction(check);
      } else {
        createAuction(check);
      }
    }
  };

  const createAuction = async (check) => {
    let UtcDate = Helper.changeDateTimeToUTCZero(`${date}T${time}`);

    const body = {
      price: values?.currentPrice,
      initial_bid: values?.initialBid,
      expiry_time: UtcDate,
      auctionable_id: item?.id,
      auctionable_type: item?.type ? "Album" : "StampItem",
      is_published: check ? 1 : 0,
      reserve_price: values?.reservePrice,
      shiping_option: shippingOption,
      return_policy: policy,
      can_buy_now: values?.buyIt ? 1 : 0,
    };
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.post(
      // Auction -> Create
      Env.createUrl("auctions"),
      body
    );
    dispatch(allActions.DataAction.AppLoader(false));
    // console.log("------------>>>>>>>>",response)
    if (response.status == 200) {
      dispatch(allActions.DataAction.SelectedImg([]));
      // console.log('res------->', response);
      resetValues();
      props.navigation.goBack();
    }
  };

  const updateAuction = async (check) => {
    let UtcDate = Helper.changeDateTimeToUTCZero(`${date}T${time}`);
    const body = {
      price: values?.currentPrice,
      initial_bid: values?.initialBid,
      expiry_time: UtcDate,
      is_published: check ? 1 : 0,
      reserve_price: values?.reservePrice,
      shiping_option: shippingOption,
      return_policy: policy,
      can_buy_now: values?.buyIt ? 1 : 0,
    };
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.post(
      // Auction -> Create
      Env.createUrl(`auctions/${item?.id}`),
      body
    );
    dispatch(allActions.DataAction.AppLoader(false));
    // console.log("------------>>>>>>>>", response);
    if (response.status == 200) {
      dispatch(allActions.DataAction.SelectedImg([]));
      // console.log('res------->', response);
      resetValues();
      fetchSingle();
      props.navigation.goBack();
    }
  };

  const fetchSingle = async () => {
    const response = await MindAxios.get(Env.createUrl(`auctions/${item?.id}`));
    if (response?.status === 200) {
      const _data = response?.data?.result?.item;
      //   console.log("_data.....", _data);
      dispatch(allActions.DetailAction.AuctionDetail(_data));
    } else {
      alert(language?.serverError);
    }
  };

  let mediaUri = null;

  if (item?.auctionable_type === "Album") {
    mediaUri = item?.auctionable?.image_url
      ? item?.auctionable?.image_url
      : null;
  } else {
    mediaUri = item?.auctionable?.medias?.length
      ? item?.auctionable?.medias[0]?.media_url
      : null;
  }

  let itemUri = null;
  if (item?.type === "Lot") {
    itemUri = item?.image_url;
  } else {
    item?.medias?.length ? (itemUri = item?.medias[0]?.media_url) : null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title={`${item?.auctionable ? "Edit" : "Create"} Auction`}
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
          <Text style={[styles.heading, { color: theme?.darkGrey }]}>
            List this Item
          </Text>
          <View style={styles.infoCard}>
            <Image
              source={
                item
                  ? item?.auctionable
                    ? { uri: mediaUri }
                    : { uri: itemUri }
                  : images.Stamp2
              }
              style={styles.stampImg}
              resizeMode="contain"
            />
            <View>
              <AppText style={styles.heading} numberOfLines={2}>
                {item?.auctionable ? item?.auctionable?.name : item?.name}
              </AppText>
              {item?.auctionable_type === "Album" || item?.type ? (
                <AppText style={styles.text}>
                  {Helper.capitalizeFirstLetter(language?.collection)}:{" "}
                  <AppText style={styles.infoText}>
                    {item?.auctionable
                      ? item?.auctionable?.stamp_items_count
                      : item?.stamp_items_count}
                  </AppText>
                </AppText>
              ) : (
                <>
                  <AppText style={styles.text}>
                    {language?.country}:{" "}
                    <AppText style={styles.infoText}>
                      {item?.auctionable
                        ? item?.auctionable?.country
                        : item?.country}
                    </AppText>
                  </AppText>
                  <AppText style={styles.text}>
                    {language?.year}:{" "}
                    <AppText style={styles.infoText}>
                      {item?.auctionable
                        ? item?.auctionable?.year_issued
                        : item?.year_issued}
                    </AppText>
                  </AppText>
                  <AppText style={styles.text}>
                    {language?.scott}:{" "}
                    {/* <AppText style={styles.infoText}>
                  {item?.auctionable
                    ? item?.auctionable?.catalogue_number[0]?.number
                    : item?.catalogue_number[0]?.number}
                </AppText> */}
                  </AppText>
                </>
              )}
            </View>
          </View>
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
          <FloatingInput
            label="Buy It Now Pirce*"
            value={values?.currentPrice}
            keyboardType="numeric"
            onChangeText={(text) => {
              handleError(null, "currentPriceErrMessage");
              setValues({ ...values, currentPrice: text });
            }}
            error={
              errMsgs.currentPriceErrMessage
                ? errMsgs.currentPriceErrMessage
                : false
            }
          />
          <FloatingInput
            label={language?.initialBid + "*"}
            keyboardType="numeric"
            value={values?.initialBid}
            onChangeText={(text) => {
              handleError(null, "bidErrMessage");
              setValues({ ...values, initialBid: text });
            }}
            error={errMsgs.bidErrMessage ? errMsgs.bidErrMessage : false}
          />
          <FloatingInput
            label="Reserve Price"
            keyboardType="numeric"
            value={values?.reservePrice}
            onChangeText={(text) => {
              setValues({ ...values, reservePrice: text });
            }}
            Ï
          />
          <CustomDropDown
            data={shippingData}
            value={shippingOption}
            label={
              shippingOption ? "Shipping Option*" : "Select Shipping Option"
            }
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
                ? language?.Return_Policy + "*"
                : language?.selectReturnPolicy
            }
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
          <View style={styles.checkSection}>
            <AppText style={styles.buyText}>Can Buy It</AppText>
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
              label={language?.Publish}
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
