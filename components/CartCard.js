import React, { useContext } from "react";
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import Btn from "./Btn";
import AppText from "./AppText";

import { placeHolder } from "../constant/Paths";
import colors from "../constant/colors";
import { StarRatings } from "./StarRatings";
import ThemeContext from "../src/Context/ThemeContext";
import FastImage from "react-native-fast-image";

const stars = [1, 2, 3, 4, 5];

const CartCard = (props) => {
  const { item, onIncrement, onDecrement, count = 0, onDel } = props;
  const { theme } = useContext(ThemeContext);
  // console.log("item", item);
  return (
    <View
      style={[
        styles.card,
        { marginBottom: 10, backgroundColor: theme?.cardColor },
      ]}
    >
      <TouchableOpacity onPress={onDel} style={styles.removeBtn}>
        <MaterialIcons name="delete-outline" color={colors.theme} size={30} />
      </TouchableOpacity>
      <View style={styles.upperSection}>
        <FastImage
          style={styles.stampImg}
          source={{ uri: item?.product_img }}
        />
        <View style={[styles.nameSection, { width: "60%" }]}>
          <AppText
            numberOfLines={1}
            style={[styles.userName, { fontSize: 16 }]}
          >
            {item?.product_name}
          </AppText>

          <StarRatings ratingStyle={{ height: 12, width: 12 }} rating={3} />
        </View>
      </View>
      {/* <View style={styles.quantitySection}>
                <AppText style={styles.qtyText}>Quantity <AppText style={styles.avbText}>(1 Available)</AppText></AppText>
                <View style={styles.counterSection}>
                    <Pressable style={styles.countBtn} onPress={onDecrement}>
                        <AppText style={{ fontSize: 24 }}>-</AppText>
                    </Pressable>
                    <View style={styles.counterText} >
                        <AppText style={{ fontSize: 20 }}>{count}</AppText>
                    </View>
                    <Pressable style={styles.countBtn} onPress={onIncrement}>
                        <AppText style={{ fontSize: 24 }}>+</AppText>
                    </Pressable>
                </View>
            </View> */}
      <View style={styles.separator} />
      <View style={styles.priceSection}>
        <AppText style={styles.priceText}>
          Price:{" "}
          <AppText style={styles.valueText}>
            ${item?.sale_price ? item?.sale_price : 0}.00
          </AppText>
        </AppText>
        <AppText style={styles.priceText}>
          Total:{" "}
          <AppText style={styles.valueText}>
            ${item?.sale_price ? item?.sale_price : 0}.00
          </AppText>
        </AppText>
      </View>
    </View>
  );
};

export default CartCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 7,
    paddingTop: 5,
    paddingHorizontal: 7,
  },
  removeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 999,
  },
  separator: {
    height: 1,
    width: "98%",
    alignSelf: "center",
    backgroundColor: "lightgrey",
    marginTop: 15,
  },
  upperSection: {
    margin: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  stampImg: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    borderRadius: 2,
  },
  nameSection: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontFamily: "Roboto-Medium",
  },
  ratingStyle: {
    width: 18,
    height: 18,
    marginTop: hp(0.5),
    borderRadius: 30,
    tintColor: "orange",
  },
  quantitySection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    marginHorizontal: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "lightgrey",
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "500",
  },
  avbText: {
    fontWeight: "400",
    color: colors.lightText,
  },
  counterSection: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 100,
  },
  counterText: {
    padding: 8,
    paddingHorizontal: 18,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "grey",
  },
  countBtn: {
    paddingHorizontal: 18,
    // backgroundColor:'red'
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  priceText: {
    fontSize: 18,
  },
  valueText: {
    color: colors.theme,
    fontWeight: "500",
  },
});
