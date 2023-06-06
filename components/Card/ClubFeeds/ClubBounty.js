import React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  Pressable,
  Dimensions,
} from "react-native";
import FastImage from "react-native-fast-image";

import TimeAgo from "../../TimeAgo";
import colors from "../../../constant/colors";
import { images } from "../../../assets/images/Images";
import { ImageListSlider } from "../../ImageSwiper/ImageListSlider";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import Helper from "../../../src/Helper";
import Entypo from "react-native-vector-icons/Entypo";

import { useDispatch } from "react-redux";
import allActions from "../../../redux/actions";

export const ClubBounty = (props) => {
  const dispatch = useDispatch();

  const { userName, item, navigation, user, feedItem } = props;
  const { width, height } = Dimensions.get("window");

  // Use iPhone6 as base size which is 375 x 667
  const baseWidth = 375;
  const baseHeight = 667;

  const scaleWidth = width / baseWidth;
  const scaleHeight = height / baseHeight;
  const scale = Math.min(scaleWidth, scaleHeight);

  const scaledSize = (size) => Math.ceil(size * scale);

  return (
    <ImageBackground
      source={images.paper}
      style={styles.coverImg}
      resizeMode="stretch"
    >
      <FastImage
        resizeMode="contain"
        style={styles.nailStyle}
        source={images.nail}
      />
      <FastImage
        resizeMode="contain"
        style={styles.rightNail}
        source={images.nail}
      />
      <FastImage
        resizeMode="contain"
        style={styles.blNail}
        source={images.nail}
      />
      <FastImage
        resizeMode="contain"
        style={styles.brNail}
        source={images.nail}
      />
      <View style={styles.cardHeader}>
        <Pressable
          onPress={() => {
            Helper.fbEvent("open_profile_from_home");
            navigation.navigate("OtherUser", { user: user });
          }}
          style={styles.upperSection}
        >
          <FastImage style={styles.userImg} source={{ uri: user?.image_url }} />
          <View style={styles.nameSection}>
            <Text style={styles.nameText}>
              {userName ? Helper.capitalizeFirstLetter(userName) : "Edie brown"}
            </Text>
            <View style={styles.timeSection}>
              <TimeAgo
                time={
                  item?.created_at ? item?.created_at : feedItem?.created_at
                }
                style={styles.agoText}
              />
              <Entypo name="dot-single" size={hp(2)} color={colors.lightText} />
              <FastImage
                style={styles.earthIcon}
                tintColor={colors.theme}
                source={require("../../../assets/icons/earth.png")}
              />
            </View>
          </View>
        </Pressable>
      </View>
      <Text style={styles.wantedText}>WANTED</Text>
      <View style={styles.amountSection}>
        <Text style={styles.awardText}>AWARDS</Text>
        {Number(feedItem?.offered_amount) > 0 && (
          <Text style={styles.amountText}>${feedItem?.offered_amount}</Text>
        )}
        {Number(feedItem?.offered_coins) > 0 && (
          <Text style={styles.amountText}>
            COINS: {feedItem?.offered_coins}
          </Text>
        )}
      </View>
      <View style={styles.sliderStyle}>
        <ImageListSlider
          data={feedItem?.medias}
          timer={2000}
          imageKey={"media_url"}
          width={wp(90)}
          height={hp(24)}
          local={false}
          separator={0}
          loop={false}
          autoscroll={false}
          indicator
          animation
          onPress={(index, item) => {}}
          borderRadius={10}
          resizeMode={"stretch"}
        />
      </View>
      <Text style={styles.submitText}>
        SUBMISSION: {feedItem?.offers_count}
      </Text>
      <Pressable
        style={styles.offerBtn}
        onPress={() => {
          dispatch(allActions.DetailAction.BountyDetail(feedItem));
          navigation.navigate("BountyDetail");
        }}
      >
        <Text style={styles.offerText}>PLACE OFFER</Text>
      </Pressable>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  coverImg: {
    width: wp(96),
    height: hp(60),
    alignSelf: "center",
  },
  nailStyle: {
    top: hp(2),
    zIndex: 999,
    left: wp(2.5),
    position: "absolute",
    width: hp(3.2),
    height: hp(3.2),
  },
  rightNail: {
    top: hp(2),
    zIndex: 999,
    right: wp(2.5),
    position: "absolute",
    width: hp(3.2),
    height: hp(3.2),
  },
  blNail: {
    zIndex: 999,
    bottom: hp(2),
    left: wp(2.5),
    position: "absolute",
    width: hp(3.2),
    height: hp(3.2),
  },
  brNail: {
    zIndex: 999,
    bottom: hp(2),
    right: wp(2.5),
    position: "absolute",
    width: hp(3.2),
    height: hp(3.2),
  },

  //Card Styles
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(3),
    marginTop: hp(6),
  },
  upperSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImg: {
    width: hp(4),
    height: hp(4),
    borderRadius: hp(10),
  },
  nameSection: {
    marginLeft: wp(3),
  },
  timeSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameText: {
    fontSize: 16,
    color: colors.heading,
    fontFamily: Fonts.IBM_Medium,
  },
  agoText: {
    fontSize: 12,
    color: colors.lightText,
    fontFamily: Fonts.Inter_Medium,
  },
  earthIcon: {
    width: hp(1.5),
    height: hp(1.5),
  },

  //Texts Style
  wantedText: {
    fontSize: 50,
    alignSelf: "center",
    paddingVertical: hp(0.5),
    color: colors.lightBlack,
    fontFamily: Fonts.Dead_Saloon,
  },
  amountSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: hp(1),
    marginLeft: wp(6),
  },
  awardText: {
    fontSize: 26,
    marginRight: wp(3),
    color: colors.color9,
    fontFamily: Fonts.Dead_Saloon,
  },
  amountText: {
    fontSize: 16,
    borderRadius: 5,
    padding: wp(0.5),
    overflow: "hidden",
    marginRight: wp(2),
    color: colors.cWhite,
    paddingHorizontal: wp(1.5),
    fontFamily: Fonts.Dead_Saloon,
    backgroundColor: colors.color9,
  },
  submitText: {
    fontSize: 22,
    paddingTop: hp(0.5),
    alignSelf: "center",
    color: colors.lightBlack,
    fontFamily: Fonts.Dead_Saloon,
  },
  offerBtn: {
    padding: wp(1),
    borderRadius: 5,
    marginTop: hp(1),
    alignSelf: "center",
    paddingHorizontal: wp(3),
    backgroundColor: colors.greenish,
  },
  offerText: {
    fontSize: 18,
    color: colors.cWhite,
    fontFamily: Fonts.Dead_Saloon,
  },

  //Slider Style
  sliderStyle: {
    height: hp(24),
    marginTop: hp(1),
    alignSelf: "center",
  },
});
