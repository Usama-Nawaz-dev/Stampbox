import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import AppText from "./AppText";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import Helper from "../src/Helper";
import colors from "../constant/colors";
import CountDown from "react-native-countdown-component";

import AuthContext from "../src/Context/AuthContext";
import ThemeContext from "../src/Context/ThemeContext";

export const TimeLeft = (props) => {
  const {
    bid,
    top,
    item,
    label,
    width,
    style,
    fontSize,
    marginTop,
    labelColor,
    digitColor,
    lableStyle,
    marginLeft,
  } = props;

  let expiryTime = item?.feedable?.expiry_time
    ? item?.feedable?.expiry_time
    : item?.expiry_time
    ? item?.expiry_time
    : undefined;

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme, mood } = useContext(ThemeContext);
  if (expiryTime) {
    let myTimeStamp = expiryTime;
    let myTime = Helper.convert(myTimeStamp);
    var today = new Date();
    let timeDiff = myTime - today;
    let seconds = timeDiff / 1000 + 18000;
    let bidCount = item?.feedable?.bids_count;

    // console.log("time", seconds);

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          top: top ? top : null,
          // backgroundColor: "orange",
          marginTop: marginTop ? marginTop : null,
        }}
      >
        <AppText
          style={[
            styles.descriptionText,
            {
              marginLeft: typeof marginLeft == "undefined" ? wp(3) : marginLeft,
              fontSize: fontSize ? fontSize : 14,
              color: labelColor ? labelColor : theme.darkGrey,
            },
            lableStyle,
          ]}
        >
          {label}:{" "}
        </AppText>
        <CountDown
          showSeparator
          until={seconds}
          // onFinish={() => localNotification()}
          digitStyle={{
            backgroundColor: digitColor ? digitColor : theme.cardColor,
            // backgroundColor: "red",
            height: 20,
            width: width ? width : undefined,
          }}
          separatorStyle={
            style ? style[1] : [styles.separator, { color: theme.dovGray }]
          }
          digitTxtStyle={
            style ? style[0] : [styles.digitTxtStyle, { color: theme.black }]
          }
          // digitTxtStyle={{ color: theme.black }}
          timeToShow={["D", "H", "M", "S"]}
          timeLabels={{ m: null, s: null }}
          // separatorStyle={{ color: "red" }}
        />
        {bid ? (
          <>
            <AppText style={{ fontSize: 21, color: theme?.white }}>.</AppText>
            <AppText
              style={[
                styles.descriptionText,
                { fontSize: fontSize ? fontSize : 14 },
              ]}
            >
              {bidCount} {bidCount > 1 ? language?.BIDS : "Bid"}
            </AppText>
          </>
        ) : null}
      </View>
    );
  }
  return (
    <View>
      <AppText style={styles.expiryText}>
        {language?.endsIn}:{" "}
        <AppText style={{ color: theme?.darkGrey, fontSize: 12 }}>
          No Expiry Time
        </AppText>
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 10,
    marginLeft: wp(3),
    borderRadius: 5,
  },
  descriptionText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    // marginLeft: wp(3),
  },
  expiryText: {
    marginVertical: 12,
    fontSize: 12,
    marginLeft: wp(3),
    // color: theme.iridium,
  },
  postImage: {
    width: wp(100),
    height: hp(26),
  },
  digitTxtStyle: {
    // color: theme.iridium,
    fontFamily: Fonts.Inter_Regular,
  },
  separator: { fontSize: 14, fontWeight: "400" },
});
