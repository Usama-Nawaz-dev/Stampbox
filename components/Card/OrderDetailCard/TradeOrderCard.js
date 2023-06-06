import React, { useContext } from 'react'
import { View, Image } from 'react-native'

import { styles } from "./styles";
import AppText from "../../AppText";
import colors from "../../../constant/colors";
import { images } from "../../../assets/images/Images";

import Octicons from "react-native-vector-icons/Octicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import moment from "moment";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AuthContext from "../../../src/Context/AuthContext";

export const TradeOrderCard = (props) => {
  const { orderDetail, trade, trade_order } = props;
  const {
    myState: { language },
  } = useContext(AuthContext);
  const stampUri = trade?.medias[0]?.media_url;
  const senderUri = trade_order?.sender?.image_url;
  const receiverUri = trade_order?.receiver?.image_url;
  const shipping = trade_order?.order_meta?.shipping_address;
  const agoTime = moment(trade_order?.created_at).fromNow();
  const total = parseFloat(0.0) + parseFloat(0.0);
  const status = trade_order?.status;
  let current;
  if (status === "Processing") {
    current = 1;
  } else if (status === "Shipping") {
    current = 2;
  } else if (status === "Shipped") {
    current = 3;
  } else if (status === "Delivered") {
    current = 4;
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerSection}>
        <View style={styles.rowSection}>
          <AppText style={styles.packageText}>
            Order #{trade_order?.order_meta?.id}
          </AppText>
        </View>
        <AppText style={styles.soldText}>Placed on: {agoTime}</AppText>
        <AppText style={styles.soldText}>
          Sold By{" "}
          <AppText style={styles.ownerName}>
            {trade_order?.sender?.full_name}
          </AppText>
        </AppText>
      </View>
      <View style={styles.topSection}>
        <Image source={{ uri: stampUri }} style={styles.stampImg} />
        <View style={styles.userSection}>
          <AppText style={styles.nameText}>{trade?.name}</AppText>
          <AppText style={styles.infoText}>
            {language?.country}: {trade?.country}
          </AppText>
          <AppText style={styles.infoText}>SCV: {trade?.coins_value}</AppText>
          <AppText style={styles.infoText}>
            Condition: {trade?.condition}
          </AppText>
        </View>
      </View>
      <View style={styles.addressSection}>
        <AppText style={styles.detailText}>Shipping Address:</AppText>
        <AppText style={styles.addressText}>
          {shipping?.name}({shipping?.email})
        </AppText>
        <AppText style={styles.addressText}>{shipping?.address}</AppText>
      </View>
      <View style={styles.orderSection}>
        <View style={{ justifyContent: "space-between" }}>
          <Image
            source={senderUri ? { uri: senderUri } : images.Profile}
            style={styles.userImg}
          />
          <Image source={{ uri: receiverUri }} style={styles.userImg} />
        </View>
        <View style={{ marginLeft: wp(5) }}>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.dotSection}>
              <Octicons
                name="dot-fill"
                size={16}
                color={current == 1 ? colors.facebook : colors.green}
              />
              <View
                style={[
                  styles.verticleLine1,
                  {
                    backgroundColor:
                      current > 1 ? colors.green : colors.borderColor,
                  },
                ]}
              ></View>
            </View>
            <View style={styles.iconSection}>
              <Image source={images.OrderPlace} style={styles.iconStyle} />
              <View style={{ marginLeft: 10 }}>
                <AppText style={styles.heading}>Order Placed</AppText>
                <AppText style={styles.text}>Your Order has Placed</AppText>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.dotSection}>
              <Octicons
                name="dot-fill"
                size={16}
                color={
                  current == 2
                    ? colors.facebook
                    : current > 2
                    ? colors.green
                    : colors.borderColor
                }
              />
              <View
                style={[
                  styles.verticleLine,
                  {
                    backgroundColor:
                      current > 2 ? colors.green : colors.borderColor,
                  },
                ]}
              ></View>
            </View>
            <View style={styles.iconSection}>
              <Image source={images.ShipOrder} style={styles.iconStyle} />
              <View style={{ marginLeft: 10 }}>
                <AppText style={styles.heading}>Order Shipping</AppText>
                <AppText style={styles.text}>Your Order is Shipping</AppText>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.dotSection}>
              <Octicons
                name="dot-fill"
                size={16}
                color={
                  current == 3
                    ? colors.facebook
                    : current > 3
                    ? colors.green
                    : colors.borderColor
                }
              />
              <View
                style={[
                  styles.verticleLine1,
                  {
                    backgroundColor:
                      current > 3 ? colors.green : colors.borderColor,
                  },
                ]}
              ></View>
            </View>
            <View style={styles.iconSection}>
              <Image source={images.OrderShipped} style={styles.iconStyle} />
              <View style={{ marginLeft: 10 }}>
                <AppText style={styles.heading}>Order Shipped</AppText>
                <AppText style={styles.text}>Your Order has Shipped</AppText>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.dotSection}>
              <Octicons
                name="dot-fill"
                size={16}
                color={current == 4 ? colors.green : colors.borderColor}
              />
            </View>
            <View style={styles.iconSection}>
              <Image source={images.OrderDeliver} style={styles.iconStyle} />
              <View style={{ marginLeft: 10 }}>
                <AppText style={styles.heading}>Order Delivered</AppText>
                <AppText style={styles.text}>Your Order has Delivered</AppText>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.addressSection}>
        <View style={styles.priceSection}>
          <AppText style={styles.priceText}>Sub Total:</AppText>
          <AppText style={styles.amountText}>${"0.00"}</AppText>
        </View>
        <View style={[styles.priceSection, { borderTopWidth: 0 }]}>
          <AppText style={styles.priceText}>Shipping Charges:</AppText>
          <AppText style={[styles.priceText, { fontWeight: "400" }]}>
            ${"0.00"}
          </AppText>
        </View>
      </View>
      <View style={styles.totalSection}>
        <AppText style={styles.priceText}>Total</AppText>
        <AppText style={styles.amountText}>${total.toFixed(2)}</AppText>
      </View>
    </View>
  );
};
