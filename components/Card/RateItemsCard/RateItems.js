import React, { useContext } from "react";
import { View, Image, Text, FlatList } from "react-native";

import { styles } from "./styles";
import AppText from "../../AppText";
import colors from "../../../constant/colors";
import { images } from "../../../assets/images/Images";

import Octicons from "react-native-vector-icons/Octicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StarRatings } from "../..";
import { Line } from "../../Line";
import Product from "./Product";
import AuthContext from "../../../src/Context/AuthContext";

export const RateItems = (props) => {
  const { orderDetail, storeItem, index, products } = props;
  const stampUri = storeItem?.products[0]?.productable?.medias[0]?.media_url;
  const shipping = orderDetail?.order_meta?.shipping_address;
  const {
    myState: { language },
  } = useContext(AuthContext);

  return (
    <View style={styles.card}>
      <View style={styles.headerSection}>
        <View style={styles.rowSection}>
          <FontAwesome5 name="gift" size={18} />
          <AppText style={styles.packageText}>Package {index + 1}</AppText>
        </View>
        <AppText style={styles.soldText}>
          {language?.STORE}{" "}
          <AppText style={styles.ownerName}>
            {products?.length ? products[0].store_name : ""}
          </AppText>
        </AppText>
      </View>
      <View
        style={{
          width: "100%",
          height: 1,
          backgroundColor: "lightgrey",
          alignSelf: "center",
          marginBottom: 10,
        }}
      />
      <View style={{ alignSelf: "flex-start", marginBottom: 10 }}>
        <AppText
          style={{
            // color: "grey",
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Products
        </AppText>
      </View>
      <FlatList
        scrollEnabled={false}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        data={products}
        numColumns={2}
        renderItem={({ item, index }) => {
          return <Product item={item} index={index} style={{ width: "45%" }} />;
        }}
      />
      <View
        style={{
          width: "100%",
          height: 1,
          backgroundColor: "lightgrey",
          alignSelf: "center",
          marginBottom: 10,
        }}
      />

      {/* <AppText
        style={{
          position: "absolute",
          bottom: 2,
          right: 10,
          color: "grey",
          fontSize: 12,
        }}
      >
        see all
      </AppText> */}
    </View>
  );
};
