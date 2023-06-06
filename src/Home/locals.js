import React from "react";
import { Image, StyleSheet } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { images } from "../../assets/images/Images";

const feed_img = (color) => (
  <Image
    source={images.Album}
    style={[styles?.icon, { tintColor: color }]}
    resizeMode="contain"
  />
);

const auction_img = (color) => (
  <Image
    source={images.Auction}
    style={[styles?.icon, { tintColor: color }]}
    resizeMode="contain"
  />
);
const trade_img = (color) => (
  <Image
    source={images.Trade}
    style={[styles?.icon, { tintColor: color }]}
    resizeMode="contain"
  />
);
const bounty_img = (cl, color) => (
  <Image
    source={images.Bounty}
    style={[styles?.icon, { tintColor: color }]}
    resizeMode="contain"
  />
);
const post_img = (color) => (
  <Image
    source={images.Report}
    style={[styles?.icon, { tintColor: color }]}
    resizeMode="contain"
  />
);
const events_img = (color) => (
  <Image
    source={images.Events}
    style={[styles?.icon, { tintColor: color }]}
    resizeMode="contain"
  />
);
const flag_img = (cl, color) => (
  <Image
    source={images.N_Flag}
    style={[styles?.icon, { tintColor: color }]}
    resizeMode="contain"
  />
);
const product_img = (cl, color) => (
  <Image
    source={images.Sale}
    style={[styles?.icon, { tintColor: color }]}
    resizeMode="contain"
  />
);

const styles = StyleSheet.create({
  icon: {
    width: hp(3),
    height: hp(3),
    // tintColor: "#000",
  },
});

export default {
  feed_img,
  trade_img,
  auction_img,
  bounty_img,
  events_img,
  post_img,
  flag_img,
  product_img,
};
