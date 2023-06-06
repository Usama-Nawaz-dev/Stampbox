import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import AppText from "../AppText";
import colors from "../../constant/colors";
import AuthContext from "../../src/Context/AuthContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ThemeContext from "../../src/Context/ThemeContext";
// import { dark as theme } from "../../constant/colorsConfig";

export const OrdersCard = (props) => {
  const { onPress, id, amount, shipping, status, date, shipTo } = props;
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme?.cardColor }]}
      onPress={onPress}
    >
      <View style={styles.itemSection}>
        <AppText style={styles.heading}>Order ID</AppText>
        <AppText style={styles.value}>{id}</AppText>
      </View>
      {shipTo && (
        <View style={styles.itemSection}>
          <AppText style={styles.heading}>Shipping To</AppText>
          <AppText style={styles.value}>{shipTo}</AppText>
        </View>
      )}
      {date && (
        <View style={styles.itemSection}>
          <AppText style={styles.heading}>{language?.date}</AppText>
          <AppText style={styles.value}>{date}</AppText>
        </View>
      )}
      {amount && (
        <View style={styles.itemSection}>
          <AppText style={styles.heading}>Amount</AppText>
          <AppText style={styles.value}>${amount}</AppText>
        </View>
      )}
      {shipping && (
        <View style={styles.itemSection}>
          <AppText style={styles.heading}>Shipping</AppText>
          <AppText style={styles.value}>${shipping}</AppText>
        </View>
      )}
      {status && (
        <View style={styles.itemSection}>
          <AppText style={styles.heading}>Status</AppText>
          <AppText
            style={[
              styles.value,
              {
                color: status === "Delivered" ? colors.red : colors.green,
              },
            ]}
          >
            {status}
          </AppText>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.cWhite,
    marginTop: hp(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    borderRadius: 5,
    padding: 7,
    paddingHorizontal: wp(6),
  },
  itemSection: {
    alignItems: "center",
  },
  heading: {
    fontSize: 12,
    fontWeight: "500",
    // color: colors.lightBlack,
  },
  value: {
    fontSize: 12,
    // color: colors.lightBlack,
    marginTop: 5,
  },
});
