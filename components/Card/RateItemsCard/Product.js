import React, { useContext } from "react";
import { View, Image, Text } from "react-native";

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
import AuthContext from "../../../src/Context/AuthContext";
const Product = (props) => {
  const { orderDetail, storeItem, index, item } = props;
  const stampUri = storeItem?.products[0]?.productable?.medias[0]?.media_url;
  const {
    myState: { language },
  } = useContext(AuthContext);
  //   console.log("index", index);
  return (
    <View style={styles.topSection}>
      <Image source={{ uri: item?.product_img }} style={styles.stampImg} />
      <View style={styles.userSection}>
        <View
          style={{
            maxWidth: 80,
            // backgroundColor: "orange"
          }}
        >
          <AppText numberOfLines={1} style={styles.nameText}>
            {item?.product_name}
          </AppText>
        </View>
        <StarRatings size={8} rating={3} />
        <AppText style={[styles.infoText, { top: 2 }]}>
          {language?.price}:{" "}
          <Text style={{ color: "#BA4D3E", fontWeight: "500" }}>
            ${item?.sale_price}
          </Text>
        </AppText>
        <AppText style={[styles.infoText, { top: 2 }]}>
          {language?.quantity}:{" "}
          <Text style={{ fontWeight: "500" }}>{item?.quantity}</Text>
        </AppText>
      </View>
    </View>
  );
};

export default Product;
