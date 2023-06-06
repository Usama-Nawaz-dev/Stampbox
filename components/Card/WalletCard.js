import React from "react";
import { StyleSheet, View, Image } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Btn from "../Btn";
import AppText from "../AppText";
import { images } from "../../assets/images/Images";

const WalletCard = (props) => {
  const { label, time, val, btnLabel, icon, iconSize, onPress } = props;
  return (
    <View
      style={{
        width: wp(45),
        height: hp(25),
        borderRadius: 7,
        padding: wp(1.5),
        alignItems: "center",
        backgroundColor: "#585755",
        justifyContent: "space-evenly",
      }}
    >
      <Image
        resizeMode="contain"
        source={icon}
        style={{ height: iconSize, width: iconSize }}
      />
      <View>
        <AppText style={styles.text}>{label}</AppText>
        <AppText style={[styles.text, { fontSize: 11, fontWeight: "400" }]}>
          {time}
        </AppText>
      </View>

      <AppText style={[styles.text, { fontSize: 22 }]}>{val}</AppText>

      {/* <Image source={images.sack_dollar} style={{height: 20, width: 20}}/> */}
      <Btn
        bg="#fff"
        onPress={onPress}
        label={btnLabel}
        height={hp(3.6)}
        textColor="#585755"
        fontSize={11}
      />
    </View>
  );
};

export { WalletCard };

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
