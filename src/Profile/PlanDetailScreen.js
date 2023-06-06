import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import colors from "../../constant/colors";
import { MainHeader } from "../../components";
import LinearGradient from "react-native-linear-gradient";
import Fonts from "../../assets/fonts/Fonts";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ThemeContext from "../Context/ThemeContext";

const hiphens = [...Array(45).keys()];
const PlanDetailScreen = ({ navigation, route }) => {
  const { detail } = route.params;
  const { theme } = useContext(ThemeContext);
  //   console.log("detail", detail);
  return (
    <View style={{ flex: 1, backgroundColor: theme.white }}>
      <MainHeader
        title="Plan Details"
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.keys(detail).map((key, index) => {
          let plan = detail[key];
          return (
            <>
              {key == "feature" ? (
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  colors={["#3B3B3B", "#585755"]}
                  style={[
                    styles.linearGradient,
                    {
                      height: undefined,
                      marginTop: 10,
                      marginBottom: 10,
                    },
                  ]}
                >
                  <Text style={[styles.heading, { marginLeft: 20, top: 10 }]}>
                    {plan.title}
                  </Text>
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
                  <Text
                    style={[
                      styles.heading,
                      {
                        fontSize: 15,
                        marginLeft: 20,
                        marginTop: 20,
                        marginBottom: 10,
                      },
                    ]}
                  >
                    Access: {plan.access}
                  </Text>
                  <Text
                    style={[
                      styles.heading,
                      {
                        fontSize: 15,
                        marginLeft: 20,
                        marginBottom: 10,
                      },
                    ]}
                  >
                    Coins Allocation: {plan.coinsAllocation}
                  </Text>
                  <Text
                    style={[
                      styles.heading,
                      {
                        fontSize: 15,
                        marginLeft: 20,
                        marginBottom: 10,
                      },
                    ]}
                  >
                    {plan.ad}
                  </Text>
                </LinearGradient>
              ) : (
                <View
                  style={[
                    styles.shadow,
                    {
                      width: "90%",
                      backgroundColor: theme.cardColor,
                      borderRadius: 5,
                      marginTop: 10,
                      alignSelf: "center",
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "500",
                      padding: 7,
                      color: theme.black,
                    }}
                  >
                    {key}
                  </Text>
                  <View
                    style={{
                      width: "100%",
                      height: 1,
                      backgroundColor: "lightgrey",
                    }}
                  />
                  {plan.map((item, index) => {
                    return (
                      <>
                        {index !== 0 ? (
                          <View
                            style={{
                              marginHorizontal: 15,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Icon
                              name="check"
                              color={colors.lightTheme}
                              size={16}
                              // style={{ right: 10 }}
                            />
                            <Text style={{ padding: 7, color: theme.black }}>
                              {item}
                            </Text>
                          </View>
                        ) : (
                          <Text style={{ padding: 7, color: theme.black }}>
                            {item}
                          </Text>
                        )}
                      </>
                    );
                  })}
                </View>
              )}
            </>
          );
        })}
        <View style={{ marginBottom: hp(5) }} />
      </ScrollView>
    </View>
  );
};

export { PlanDetailScreen };

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  linearGradient: {
    alignSelf: "center",
    borderRadius: 5,
    // top: -hp(1.2),
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
    top: 10,
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
