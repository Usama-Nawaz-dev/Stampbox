import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import AppText from "../AppText";
import { images } from "../../assets/images/Images";
import { light } from "../../constant/colorsConfig";
import ThemeContext from "../../src/Context/ThemeContext";

const HistoryCard = (props) => {
  const { icon, labels, style } = props;
  const { theme } = useContext(ThemeContext);
  return (
    <View
      style={[
        {
          height: hp(9),
          width: "95%",
          alignSelf: "center",
          justifyContent: "space-between",
          backgroundColor: theme?.cardColor,
          flexDirection: "row",
          borderRadius: 5,
          marginTop: hp(1),
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          elevation: 4,
        },
        style,
      ]}
    >
      <View
        style={{
          width: "55%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <View
          style={{
            height: hp(6),
            width: hp(6),
            backgroundColor: light.theme,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <Image source={images.Trade} style={{ height: 20, width: 20 }} /> */}
          {icon ? icon : null}
        </View>
        <View
          style={{
            // backgroundColor: "red",
            width: "60%",
          }}
        >
          <AppText style={styles.text}>{labels.title}</AppText>
          <AppText
            style={[
              styles.text,
              { fontSize: 11, fontWeight: "400", color: theme?.lightText },
            ]}
            numberOfLines={1}
          >
            {labels.lower}
          </AppText>
        </View>
      </View>
      <View
        style={{
          width: "45%",
          // backgroundColor: "skyblue",
          alignItems: "flex-end",
          justifyContent: "center",
          right: wp(2),
        }}
      >
        <AppText style={styles.text}>
          {labels.sign} {labels.val}
        </AppText>
        <AppText
          numberOfLines={1}
          style={[
            styles.text,
            { fontSize: 11, fontWeight: "400", color: theme?.lightText },
          ]}
        >
          {labels.time}
        </AppText>
      </View>
    </View>
  );
};

export { HistoryCard };

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    // color: "#fff",
    fontWeight: "600",
    // textAlign: "center",
  },
});
