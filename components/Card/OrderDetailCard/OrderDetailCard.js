import React, { useContext } from 'react'
import { View, Image } from 'react-native'

import { styles } from './styles'
import AppText from '../../AppText'
import colors from '../../../constant/colors';
import { images } from '../../../assets/images/Images';

import Octicons from "react-native-vector-icons/Octicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ThemeContext from '../../../src/Context/ThemeContext';

export const OrderDetailCard = (props) => {
  const { orderDetail, storeItem, index } = props;
  const stampUri = storeItem?.products[0]?.productable?.medias[0]?.media_url;
  const shipping = orderDetail?.order_meta?.shipping_address;
  const total = parseFloat(storeItem?.subtotal) + parseFloat(storeItem?.shipping_fee);
  const status = storeItem?.status;
  const { theme }= useContext(ThemeContext);

  let current;
  if (status === 'Processing') {
    current = 1;
  } else if (status === 'Shipping') {
    current = 2;
  } else if (status === 'Shipped') {
    current = 3;
  } else if (status === 'Delivered') {
    current = 4
  }
  return (
    <View style={[styles.card, { backgroundColor: theme?.cardColor}]}>
      <View style={styles.headerSection}>
        <View style={styles.rowSection}>
          <FontAwesome5 name="gift" size={18} color={theme?.black} />
          <AppText style={styles.packageText}>Package {index + 1}</AppText>
        </View>
        <AppText style={styles.soldText}>Sold By <AppText style={styles.ownerName}>Store Owner Name</AppText></AppText>
      </View>
      <View style={styles.topSection}>
        <Image source={{ uri: stampUri }} style={styles.stampImg} />
        <View style={styles.userSection}>
          <AppText style={styles.nameText}>{storeItem?.products[0]?.name}</AppText>
          <AppText style={[styles.infoText, { color: theme?.lightText}]}>Traking Code: {storeItem?.shipment?.tracking_code}</AppText>
          <AppText style={[styles.infoText, { color: theme?.lightText}]}>Carrier: {storeItem?.shipment?.carrier}</AppText>
          <AppText style={[styles.infoText, { color: theme?.lightText}]}>Service: {storeItem?.shipment?.service}</AppText>
        </View>
      </View>
      <View style={styles.addressSection}>
        <AppText style={styles.detailText}>Shipping Address:</AppText>
        <AppText style={styles.addressText}>{shipping?.name}({shipping?.email})</AppText>
        <AppText style={styles.addressText}>{shipping?.address}</AppText>
      </View>
      <View style={styles.orderSection}>
        <View style={{ justifyContent: 'space-between' }}>
          {/* <Image source={images.Profile} style={styles.userImg} /> */}
          <AppText></AppText>
          <Image source={{ uri: orderDetail?.user?.image_url }} style={styles.userImg} />
        </View>
        <View style={{ marginLeft: wp(5) }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.dotSection}>
              <Octicons name="dot-fill" size={16}
                color={current == 1 ? colors.facebook : colors.green} />
              <View style={[styles.verticleLine1,
              { backgroundColor: current > 1 ? colors.green : colors.borderColor }]}
              ></View>
            </View>
            <View style={styles.iconSection}>
              <Image source={images.OrderPlace}  style={[styles.iconStyle, {tintColor: theme?.black}]} />
              <View style={{ marginLeft: 10 }}>
                <AppText style={styles.heading}>Order Placed</AppText>
                <AppText style={[styles.text, {color: theme?.lightText }]}>Your Order has Placed</AppText>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.dotSection}>
              <Octicons name="dot-fill" size={16}
                color={current == 2 ? colors.facebook : current > 2 ? colors.green : colors.borderColor} />
              <View style={[styles.verticleLine,
              { backgroundColor: current > 2 ? colors.green : colors.borderColor }]}
              ></View>
            </View>
            <View style={styles.iconSection}>
              <Image source={images.ShipOrder} style={[styles.iconStyle, {tintColor: theme?.black}]} />
              <View style={{ marginLeft: 10 }}>
                <AppText style={styles.heading}>Order Shipping</AppText>
                <AppText style={[styles.text, {color: theme?.lightText }]}>Your Order is Shipping</AppText>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.dotSection}>
              <Octicons name="dot-fill" size={16}
                color={current == 3 ? colors.facebook : current > 3 ? colors.green : colors.borderColor} />
              <View style={[styles.verticleLine1,
              { backgroundColor: current > 3 ? colors.green : colors.borderColor }]}
              ></View>
            </View>
            <View style={styles.iconSection}>
              <Image source={images.OrderShipped} style={[styles.iconStyle, {tintColor: theme?.black}]} />
              <View style={{ marginLeft: 10 }}>
                <AppText style={styles.heading}>Order Shipped</AppText>
                <AppText style={[styles.text, {color: theme?.lightText }]}>Your Order has Shipped</AppText>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.dotSection}>
              <Octicons name="dot-fill" size={16}
                color={current == 4 ? colors.green : colors.borderColor} />
            </View>
            <View style={styles.iconSection}>
              <Image source={images.OrderDeliver} style={[styles.iconStyle, {tintColor: theme?.black}]} />
              <View style={{ marginLeft: 10 }}>
                <AppText style={styles.heading}>Order Delivered</AppText>
                <AppText style={[styles.text, {color: theme?.lightText }]}>Your Order has Delivered</AppText>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.addressSection}>
        <View style={styles.priceSection}>
          <AppText style={styles.priceText}>Sub Total:</AppText>
          <AppText style={styles.amountText}>${storeItem?.subtotal}</AppText>
        </View>
        <View style={[styles.priceSection, { borderTopWidth: 0 }]}>
          <AppText style={styles.priceText}>Shipping Charges:</AppText>
          <AppText style={[styles.priceText, { fontWeight: '400' }]}>${storeItem?.shipping_fee}</AppText>
        </View>
      </View>
      <View style={styles.totalSection}>
        <AppText style={styles.priceText}>Total</AppText>
        <AppText style={styles.amountText}>${total.toFixed(2)}</AppText>
      </View>
    </View>
  )
}
