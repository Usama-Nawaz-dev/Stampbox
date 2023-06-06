import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Modal,
  Alert,
  Switch,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import {
  basicFeatures,
  basicPlanDes,
  businessFeatures,
  businessPlanDes,
  freePlanDes,
  premFeatures,
  premPlanDes,
  freeFeatures,
  defaulFeature,
} from "../../constant/staticData";
import {
  trialPlan,
  businessPlan,
  freeAcctPlan,
  premiumPlan,
  basicPlan,
} from "../../constant/planData";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import colors from "../../constant/colors";
import Fonts from "../../assets/fonts/Fonts";
import AppText from "../../components/AppText";
import AuthContext from "../Context/AuthContext";
import PlanCard from "../../components/PlanCard";
import { MainHeader, GradBtn } from "../../components";

import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Helper from "../Helper";
import Env from "../../api/Env";
import MindAxios from "../../api/MindAxios";
import allActions from "../../redux/actions";
import ThemeContext from "../Context/ThemeContext";
// import { dark as theme } from "../../constant/colorsConfig";

const ChoosePlan = ({ navigation }) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const user = useSelector((state) => state.ApiReducer.user);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  // console.log("lannngngng", language);

  const [isCoins, setIsCoins] = useState(false);
  const [loading, setLoading] = useState(false);
  const [planList, setPlanList] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const modalInfo = `All sales are charged in USD and all sales are final. You will be charged ${currentPlan?.amount} USD immediately. You will be charged ${currentPlan?.amount} USD every month there after while subscription is active.`;

  let subscription_plan_id;
  if (user?.subscriptions?.length) {
    subscription_plan_id = user?.subscriptions[0]?.subscription_plan_id;
  }

  useEffect(() => {
    if (focused) {
      fetchPlans();
      fetchAutoRenew();
    }
  }, [focused]);

  // useEffect(() => {
  //   console.log("user", user?.subscriptions[0]?.subscription_plan_id)
  //   if (user?.subscriptions?.length) {
  //     subscription_plan_id = user?.subscriptions[0]?.subscription_plan_id;
  //   }
  // }, [user?.subscriptions]);

  const onPurchase = async (planId) => {
    if (!user?.is_payment_method_attached) {
      if (isCoins) {
        changePlanApi(planId, "coin");
      } else {
        setModalVisible(false);
        navigation.navigate("BuyPlan", {
          planId: planId ? planId : currentPlan?.id,
        });
      }
    } else {
      const type = isCoins ? "coin" : "stripe";
      changePlanApi(planId, type);
    }
  };

  const changePlanApi = async (id, type) => {
    const body = {
      payment_method: type,
      plan_id: id ? id : currentPlan?.id,
    };
    setLoading(true);
    // dispatch(allActions.DataAction.AppLoader(true));
    const res = await MindAxios.post(
      Env.createUrl("subscriptions/change-plan"),
      body
    );
    setLoading(false);
    if (res?.status == 200) {
      setModalVisible(false);
      setIsCoins(false);
      dispatch(allActions.ApiAction.getUserApi());
      Helper.showToastMessage("Plan changed successfully.", colors.green);
      navigation.goBack();
    } else if (res?.e?.response?.status == 500) {
      Helper.showToastMessage(
        res?.e?.response?.data?.message,
        colors.blueTheme
      );
    } else {
      const error = res?.e?.response?.data?.message;
      Helper.showToastMessage(error, colors.danger);
    }
  };

  let planName;
  if (subscription_plan_id === 1) {
    planName = "Free";
  } else if (subscription_plan_id === 2) {
    planName = "Basic";
  } else if (subscription_plan_id === 3) {
    planName = "Premium";
  } else if (subscription_plan_id === 4) {
    planName = "Busniess";
  }

  const showOtherBtn = useCallback((id) => {
    // console.log("subscription_plan_id", subscription_plan_id);
    if (subscription_plan_id === undefined) {
      return true;
    } else {
      if (subscription_plan_id == id) {
        return false;
      } else {
        return true;
      }
    }
  }, []);

  const fetchPlans = async () => {
    const response = await MindAxios.get(Env.createUrl("subscriptions/plans"));
    if (response?.status === 200) {
      const _data = response?.data?.result.items;
      setPlanList(_data);
    }
  };

  const fetchAutoRenew = async () => {
    const response = await MindAxios.get(
      Env.createUrl("settings?property=subscriptions.plan-auto-renew")
    );
    if (response?.status === 200) {
      const responseVal = response?.data?.result?.paginated_items[0]?.value;
      if (responseVal > 0) {
        setIsEnabled(true);
      }
    }
  };

  const updateRenewOption = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.post(Env.createUrl("settings"), {
      "subscriptions.plan-auto-renew": isEnabled ? 0 : 1,
    });
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      Helper.showToastMessage("Auto renew option updated", colors.green);
      setIsEnabled(!isEnabled);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title={language?.choosePlan}
        onPressBack={() => {
          navigation.goBack();
          dispatch(allActions.ApiAction.getUserApi());
        }}
      />
      <AppText style={styles.title}>{language?.chooseYourPlan}</AppText>
      <AppText style={styles.subTitle}>
        {language?.buy_a_subscription_plan}
      </AppText>
      <AppText style={styles.planNow}>
        You have subscribed {planName} Plan
      </AppText>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.checkSection}>
          <AppText style={{ marginRight: wp(5) }}>Auto Renew</AppText>
          <Switch
            trackColor={{ false: "#767577", true: `${colors.theme}50` }}
            thumbColor={isEnabled ? colors.theme : "#f4f3f4"}
            disabled={!user?.is_payment_method_attached}
            ios_backgroundColor="lightgrey"
            onValueChange={updateRenewOption}
            value={isEnabled}
          />
        </View>
        <PlanCard
          id={1}
          plan="Free Membership Plan"
          // gradColor={["#2B3135", "#A6A6A6"]}
          gradColor={["#3B3B3B", "#585755"]}
          // gradColor={["#8098B0", "#A0BAD5"]}
          planDetails={{
            day: "30",
            interval: "Day Trial",
            coins: planList?.length ? `$${planList[0]?.amount}` : 0,
          }}
          des={freePlanDes}
          marginTop={hp(2.5)}
          features={freeFeatures}
          btnLabel2={language?.freeTrial}
          onPurchase={() => onPurchase(1)}
          showOtherBtn={() => showOtherBtn(1)}
          onDetail={() =>
            navigation.navigate("PlanDetail", { detail: freeAcctPlan })
          }
        />
        <PlanCard
          plan="Basic Membership Plan"
          id={2}
          features={defaulFeature}
          // gradColor={["#99B4A4", "#BAD2C4"]}
          gradColor={["#3B3B3B", "#585755"]}
          dollar="$"
          planDetails={{
            day: planList?.length ? `${planList[1]?.amount}` : 0,
            interval: " /Month",
            coins: "10 €s",
          }}
          onDetail={() =>
            navigation.navigate("PlanDetail", { detail: basicPlan })
          }
          onPurchase={() => {
            setModalVisible(true);
            setCurrentPlan(planList?.length ? planList[1] : null);
          }}
          des={basicPlanDes}
          btnLabel2={
            user?.is_payment_method_attached
              ? language?.change
              : language?.Purchase
          }
          marginTop={20}
          showOtherBtn={() => showOtherBtn(2)}
        />
        <PlanCard
          plan="Premium Membership Plan"
          id={3}
          features={defaulFeature}
          // gradColor={["#918770", "#B7AD98"]}
          gradColor={["#3B3B3B", "#585755"]}
          dollar="$"
          planDetails={{
            day: planList?.length ? `${planList[2]?.amount}` : 0,
            interval: " /Month",
            coins: "30 €s",
          }}
          onDetail={() =>
            navigation.navigate("PlanDetail", { detail: premiumPlan })
          }
          // onPurchase={() => onPurchase(3)}
          onPurchase={() => {
            setModalVisible(true);
            setCurrentPlan(planList?.length ? planList[2] : null);
          }}
          des={premPlanDes}
          btnLabel2={
            user?.is_payment_method_attached
              ? language?.change
              : language?.Purchase
          }
          marginTop={20}
          showOtherBtn={() => showOtherBtn(3)}
        />
        <PlanCard
          plan="Business Membership Plan"
          id={4}
          features={defaulFeature}
          // gradColor={["#BA4D3E", "#D27163"]}
          gradColor={["#3B3B3B", "#585755"]}
          dollar="$"
          planDetails={{
            day: planList?.length ? `${planList[3]?.amount}` : 0,
            interval: " /Month",
            coins: "50 €s",
          }}
          des={businessPlanDes}
          btnLabel2={
            user?.is_payment_method_attached
              ? language?.change
              : language?.Purchase
          }
          onDetail={() =>
            navigation.navigate("PlanDetail", { detail: businessPlan })
          }
          // onPurchase={() => onPurchase(4)}
          onPurchase={() => {
            setModalVisible(true);
            setCurrentPlan(planList?.length ? planList[3] : null);
          }}
          marginTop={20}
          marginBottom={hp(10)}
          showOtherBtn={() => showOtherBtn(4)}
        />
        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Join Event Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert(language?.modal_has_been_closed);
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.headerSection}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setIsCoins(false);
                }}
              >
                <EvilIcons
                  name="close"
                  size={hp(3.3)}
                  color={colors.lightTheme}
                />
              </TouchableOpacity>
              <View style={styles.switchSection}>
                <Switch
                  trackColor={{ false: "#767577", true: `${colors.theme}50` }}
                  thumbColor={isCoins ? colors.theme : "#f4f3f4"}
                  onValueChange={() => setIsCoins(!isCoins)}
                  ios_backgroundColor="lightgrey"
                  value={isCoins}
                />
                <AppText style={styles.coinText}>Buy with coins</AppText>
              </View>
            </View>
            <View style={styles.infoSection}>
              <View style={styles.upperSection}>
                <AppText style={styles.payText}>Payment Details</AppText>
              </View>
              <View style={styles.amountInfo}>
                <AppText style={styles.amountText}>Subtotal</AppText>
                <AppText>
                  {isCoins ? "€" : "$"}
                  {currentPlan?.amount * 100}
                </AppText>
              </View>
              <View style={styles.amountInfo}>
                <AppText style={styles.amountText}>
                  Yearly Plan Discount
                </AppText>
                <AppText>-0.00</AppText>
              </View>
              <View style={styles.amountInfo}>
                <AppText style={styles.amountText}>Total</AppText>
                <AppText style={styles.amountText}>
                  {isCoins ? "€" : "$"}
                  {currentPlan?.amount * 100}
                </AppText>
              </View>
              {isCoins ? (
                <AppText style={styles.detailText}>
                  <AppText style={{ fontWeight: "500" }}>
                    €{currentPlan?.amount * 100}{" "}
                  </AppText>
                  will be deducted from your wallet
                </AppText>
              ) : (
                <>
                  <AppText style={styles.detailText}>{modalInfo}</AppText>
                  <AppText style={styles.detailText}>Cancel any time</AppText>
                </>
              )}

              <GradBtn
                width="50%"
                fontSize={12}
                height={hp(4)}
                loading={loading}
                fontWeight={"500"}
                borderRadius={hp(100)}
                style={styles.modalBtn}
                label="Change Subscription"
                fontFamily={Fonts.IBM_Medium}
                onPress={() => onPurchase(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChoosePlan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  linearGradient: {
    alignSelf: "center",
    borderRadius: 15,
    // marginTop: 20,
    width: "85%",
    height: 340,
    top: -10,
  },
  actionButtonText: {
    textAlign: "center",
    // fontFamily: appStyles.fontFamily.bold,
    // color: appStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    marginTop: hp(2),
    fontWeight: "600",
    textAlign: "center",
    // color: colors.lightBlack,
    fontFamily: Fonts.Roboto_Regular,
  },
  subTitle: {
    fontSize: 12,
    textAlign: "center",
    marginVertical: hp(0.5),
    // color: colors.lightBlack,
    fontFamily: Fonts.Roboto_Regular,
  },
  planNow: {
    fontSize: 12,
    textAlign: "center",
    marginVertical: hp(0.5),
    // color: colors.lightBlack,
    fontFamily: Fonts.Roboto_Medium,
  },
  checkSection: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    paddingVertical: hp(1),
    paddingRight: wp(5),
  },

  //Subscription Modal styles
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  modalView: {
    width: wp(90),
    borderRadius: 7,
    backgroundColor: "#fff",
  },
  headerSection: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    alignItems: "flex-end",
  },
  switchSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1),
  },
  coinText: {
    fontSize: 12,
    fontWeight: "500",
    paddingLeft: wp(3),
  },
  infoSection: {
    width: "90%",
    alignSelf: "center",
  },
  msgText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightText,
  },
  modalBtn: {
    marginTop: hp(1.5),
    marginBottom: hp(1.5),
  },
  upperSection: {
    borderBottomWidth: 1,
    borderColor: colors.borderColor,
  },
  payText: {
    fontSize: 16,
    fontWeight: "600",
    paddingBottom: hp(1),
  },
  amountInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(0.5),
  },
  amountText: {
    fontWeight: "600",
  },
  detailText: {
    fontSize: 12,
    color: colors.lightText,
  },
});
