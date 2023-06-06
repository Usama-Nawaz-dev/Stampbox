import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SimpleHeader, WalletCard } from "../../components";
import { images } from "../../assets/images/Images";
import AppText from "../../components/AppText";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Btn from "../../components/Btn";
const Card = (props) => {
  const { label, time, val, btnLabel, btnLabel2, icon, reserve, onPress } =
    props;
  return (
    <View
      style={{
        width: "90%",
        marginTop: hp(1.5),
        borderRadius: 5,
        alignSelf: "center",
        backgroundColor: "#585755",
      }}
    >
      <View
        style={{
          height: hp(8),
          marginTop: hp(1),
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View
          style={{
            width: "60%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Image
            resizeMode="contain"
            source={icon}
            style={{ height: hp(5.5), width: hp(5.5) }}
          />
          <View>
            <AppText style={styles.text}>{label}</AppText>
            <AppText style={[styles.text, { fontSize: 11, fontWeight: "400" }]}>
              {time}
            </AppText>
          </View>
        </View>

        <AppText
          style={[styles.text, { fontSize: 20, fontWeight: "600"}]}
        >
          {val}
        </AppText>
      </View>
      <View
        style={{
          height: hp(8),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        {reserve !== undefined ? (
          <View
            style={{
              height: hp(3),
              // width: "40%",
              // backgroundColor: "blue",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <AppText style={[styles.text, { fontSize: 14, fontWeight: "600" }]}>
              Reserve Balance: ${reserve}
            </AppText>
          </View>
        ) : null}

        <Btn
          bg="#fff"
          width="40%"
          fontSize={11}
          label={btnLabel}
          height={hp(3.5)}
          onPress={onPress}
          textColor="#585755"
        />
      </View>
      {/* to display 2 buttons */}
      {/* <View
        style={{
          height: hp(8),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Btn
          label={btnLabel}
          height={30}
          width="40%"
          bg="#fff"
          textColor="#585755"
          fontSize={12}
        />
        <Btn
          label={btnLabel2}
          height={30}
          width="40%"
          bg="#fff"
          textColor="#585755"
          fontSize={12}
        />
      </View> */}
    </View>
  );
};

export { Card };

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});
