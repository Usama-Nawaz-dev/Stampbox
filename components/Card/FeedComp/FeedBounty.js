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
import OnlyDropDown from "../../OnlyDropDown";
import { images } from "../../../assets/images/Images";
import { ownerOptions } from "../../../src/utils/constant";
import { ImageListSlider } from "../../ImageSwiper/ImageListSlider";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import Helper from "../../../src/Helper";
import allActions from "../../../redux/actions";

import Fonts from "../../../assets/fonts/Fonts";
import Entypo from "react-native-vector-icons/Entypo";

import { useDispatch } from "react-redux";

export const FeedBounty = (props) => {
  const { userName, bounty_item, navigation, user, owner } = props;
  const { width, height } = Dimensions.get("window");
  const dispatch = useDispatch();
  const item = Helper.deepCopy(bounty_item);
  if (item?.searchable) {
    item.feedable = item?.searchable;
    delete item.searchable;
  }
  // console.log("item", item);
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
            // navigation.navigate("OtherUser", { user: user });
            dispatch(allActions.DetailAction.OtherUser(user));
            navigation.navigate("ProfileStack");
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
                  item?.created_at
                    ? item?.created_at
                    : item?.feedable?.created_at
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
        <View>
          {owner ? (
            <OnlyDropDown
              data={ownerOptions}
              value={itemOption}
              onChangeText={(value) => {
                if (value == "Edit") {
                  let des = item?.feedable?.content;
                  let uri = item?.feedable?.media_url;
                  let privacy = item?.feedable?.privacy_type;
                  let id = item?.feedable_id;
                  let sendParams = { des, uri, privacy, id };
                  setTimeout(() => {
                    onUpdate(sendParams);
                  }, 200);
                } else if (value == "Delete") {
                  setTimeout(() => {
                    Alert.alert(
                      "Delete Post?",
                      "Are you sure to delete this post?",
                      [
                        { text: "Cancel" },
                        {
                          text: "OK",
                          onPress: () =>
                            deletePost(item?.feedable_id, loader, getFeeds),
                        },
                      ]
                    );
                  }, 500);
                }
              }}
              dropdownOffset={hp(-1.5)}
              position={-3.2}
              width="35%"
              left={wp(15)}
              icon={() => (
                <Entypo
                  name="dots-three-horizontal"
                  size={hp(2.8)}
                  color={colors.cBlack}
                />
              )}
            />
          ) : (
            <Entypo
              onPress={() => Helper.showToastMessage("Coming Soon")}
              name="dots-three-horizontal"
              size={hp(2.8)}
              color={colors.cBlack}
              style={{ marginTop: -hp(0.5) }}
            />
          )}
        </View>
      </View>
      <Text style={styles.wantedText}>WANTED</Text>
      <View style={styles.amountSection}>
        <Text style={styles.awardText}>AWARD</Text>
        {Number(item?.feedable?.offered_amount) > 0 && (
          <Text style={styles.amountText}>
            ${item?.feedable?.offered_amount}
          </Text>
        )}
        {Number(item?.feedable?.offered_coins) > 0 && (
          <Text style={styles.amountText}>
            COINS: {item?.feedable?.offered_coins}
          </Text>
        )}
      </View>
      <View style={styles.sliderStyle}>
        <ImageListSlider
          data={item?.feedable?.medias}
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
        SUBMISSION: {item?.feedable?.offers_count}
      </Text>
      <Pressable
        style={styles.offerBtn}
        onPress={() => {
          dispatch(allActions.DetailAction.BountyDetail(item));
          navigation.navigate("BountyStack");
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
