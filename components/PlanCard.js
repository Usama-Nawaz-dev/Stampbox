import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  Animated,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import BorderBtn from "./BorderBtn";
import colors from "../constant/colors";
import Fonts from "../assets/fonts/Fonts";
import AuthContext from "../src/Context/AuthContext";
import { CustomButton, GradBtn } from "../components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient";
import Helper from "../src/Helper";

const PlanCard = (props) => {
  const {
    plan,
    planDetails,
    dollar,
    des,
    btnLabel2,
    gradColor,
    features,
    marginTop,
    marginBottom,
    onPurchase,
    id,
    showOtherBtn,
    onDetail,
  } = props;

  const [height] = useState(new Animated.Value(0));
  const [toggle, setToggle] = useState(false);
  const hiphens = [...Array(40).keys()];

  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    Animated.timing(height, {
      toValue: check(),
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [toggle, height]);

  var check = () => {
    if (toggle) {
      // toggle ? 200 : 0
      if (id == 1) {
        return hp(31);
      } else if (id == 2) {
        return hp(44);
      } else if (id == 3) {
        return hp(44);
      } else if (id == 4) {
        return hp(44);
      }
    } else {
      return 0;
    }
  };

  if (toggle)
    return (
      <Animated.View style={{ height }}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={gradColor}
          style={[
            styles.linearGradient,
            {
              height: undefined,
              marginTop: marginTop,
              marginBottom: marginBottom,
            },
          ]}
        >
          <Pressable style={styles.header} onPress={() => setToggle(!toggle)}>
            <Text style={styles.heading}> {plan} </Text>
            <Feather
              size={22}
              name={"chevron-up"}
              color={colors.cWhite}
              style={{ marginTop: 5 }}
            />
          </Pressable>
          <View style={styles.dashedSection}>
            {hiphens.map((item) => (
              <Text
                ellipsizeMode="clip"
                numberOfLines={1}
                style={{ color: colors.cWhite, letterSpacing: 1 }}
              >
                -
              </Text>
            ))}
          </View>

          <View style={styles.daysSection}>
            {dollar ? <Text style={styles.dollarText}>$</Text> : null}
            <Text style={[styles.daysText, { left: dollar ? wp(5) : 0 }]}>
              {planDetails.day}
              <Text style={styles.yearText}> {planDetails.interval}</Text>
            </Text>
            <Text style={styles.coinsText}>{planDetails.coins}/Month</Text>
          </View>

          {/* <View style={{ alignSelf: "center", width: "88%" }}>
            <Text style={styles.featureText}>{des}</Text>
          </View> */}

          {features?.length && (
            <>
              {features.map((item, index) => {
                return (
                  <View key={index} style={styles.listSection}>
                    <Entypo
                      name="dot-single"
                      color={colors.cWhite}
                      size={hp(3)}
                    />
                    <Text style={styles.listText}>{item}</Text>
                  </View>
                );
              })}
            </>
          )}

          <View style={styles.buttonSection}>
            <CustomButton
              bg={colors.background}
              label={"Details"}
              textColor={colors.btnText}
              fontWeight="600"
              width={"36%"}
              height={45}
              fontSize={14}
              onPress={() => {
                onDetail();
                // Helper.showToastMessage("Coming Soon.", colors.blueTheme);
              }}
            />
            {showOtherBtn() ? (
              <GradBtn
                height={45}
                fontSize={14}
                label={btnLabel2}
                fontWeight={"600"}
                style={styles.button}
                width={"50%"}
                onPress={() => {
                  if (onPurchase) onPurchase();
                }}
              />
            ) : (
              <View style={{ height: hp(5), width: "50%" }} />
            )}
          </View>
          <View style={{ height: hp(1.2) }} />
        </LinearGradient>
      </Animated.View>
    );
  else
    return (
      <TouchableOpacity
        style={styles.header1}
        onPress={() => setToggle(!toggle)}
      >
        <Text style={[styles.heading, { color: colors.cBlack, fontSize: 18 }]}>
          {" "}
          {plan}{" "}
        </Text>
        <Feather
          name={"chevron-down"}
          size={22}
          color={colors.lightBlack}
          style={{ marginTop: 5 }}
        />
      </TouchableOpacity>
    );
};

export default PlanCard;

const styles = StyleSheet.create({
  linearGradient: {
    alignSelf: "center",
    borderRadius: 15,
    top: -hp(1.2),
    width: "90%",
  },
  actionButtonText: {
    textAlign: "center",
    fontSize: 16,
  },
  header1: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background,
    paddingHorizontal: wp(3),
    marginVertical: hp(1),
    borderRadius: 5,
    height: hp(6.5),
    width: "90%",
  },
  header: {
    width: "92%",
    height: hp(4.5),
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 20,
    color: colors.cWhite,
    fontFamily: Fonts.Roboto_Medium,
  },
  dashedSection: {
    width: "88%",
    alignSelf: "center",
    flexDirection: "row",
    alignSelf: "center",
  },
  daysSection: {
    width: "88%",
    height: hp(8),
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dollarText: {
    top: hp(2),
    fontSize: 30,
    color: "#fff",
    position: "absolute",
  },
  daysText: {
    fontSize: 36,
    fontWeight: "500",
    color: colors.cWhite,
    fontFamily: Fonts.IBM_Regular,
  },
  yearText: {
    fontSize: 12,
    color: colors.cWhite,
    fontFamily: Fonts.Roboto_Regular,
  },
  coinsText: {
    top: 10,
    right: 15,
    fontSize: 12,
    color: colors.white,
    fontFamily: Fonts.Roboto_Regular,
  },
  featureText: {
    fontSize: 14,
    letterSpacing: 1,
    fontWeight: "500",
    textAlign: "left",
    color: colors.cWhite,
    fontFamily: Fonts.IBM_Regular,
  },
  listSection: {
    width: "88%",
    height: hp(3.3),
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  listText: {
    fontSize: 15,
    textAlign: "left",
    color: colors.cWhite,
    marginHorizontal: 12,
    fontFamily: Fonts.Roboto_Regular,
  },
  buttonSection: {
    height: hp(8.5),
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  button: {
    marginTop: 0,
    marginBottom: 0,
  },
});
