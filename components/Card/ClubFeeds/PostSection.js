import React, { useContext } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";

import Image from "react-native-fast-image";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import Btn from "../../Btn";
import AppText from "../../AppText";
import VideoPlayer from "../../VideoPlayer";
import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";

import { TimeLeft } from "../../TimeLeft";
import { ImageListSlider } from "../../ImageSwiper/ImageListSlider";

import _ from "lodash";
const { width } = Dimensions.get("window");
import { useSelector, useDispatch } from "react-redux";

import Helper from "../../../src/Helper";
import allActions from "../../../redux/actions";
import AuthContext from "../../../src/Context/AuthContext";
import ThemeContext from "../../../src/Context/ThemeContext";
// import { dark as theme } from "../../../constant/colorsConfig";

const IconView = ({ icon, label, iconName, left }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <View
      style={{
        flexDirection: "row",
        marginLeft: left ? 13 : 10,
        alignItems: "center",
      }}
    >
      {iconName ? (
        <Ionicons name={iconName} size={18} color={theme?.darkGrey} />
      ) : (
        icon
      )}
      <Text
        style={{ marginHorizontal: 5, color: theme?.darkGrey, fontSize: 12 }}
      >
        {label}
      </Text>
    </View>
  );
};

const checkLastChr = (str, data) => {
  if (str) {
    return (
      <ImageListSlider
        indicator
        animation
        data={data}
        loop={false}
        timer={2000}
        width={width}
        local={false}
        separator={0}
        height={hp(26)}
        imageKey={"media_url"}
        autoscroll={false}
        onPress={(index, item) => {}}
      />
    );
  }
  return null;
};

const postLastChr = (str) => {
  if (str) {
    let last = str?.charAt(str.length - 1);
    if (last !== "g" && last !== "f" && last !== "p") {
      return <VideoPlayer from="home" uri={str} />;
    } else {
      return <Image style={styles.postImage} source={{ uri: str }} />;
    }
  }
  return null;
};

export const PostSection = (props) => {
  const {
    item,
    feedType,
    feedItem,
    cover,
    desc,
    navigation,
    time,
    vote,
    eventUi,
  } = props;

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const owner = feedItem?.user?.id == currentUser?.id;
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const media = feedItem?.medias;
  if (feedType == "Event") {
    if (cover) {
      let uri = media?.length ? media[0]?.media_url : null;
      return checkLastChr(uri, feedItem?.medias);
    }
    if (desc) {
      return null;
    }
    if (eventUi) {
      let address = feedItem?.address
        ? `${feedItem?.address?.city}, ${feedItem?.address?.country}`
        : null;
      let event_schedules = feedItem?.event_schedules?.length
        ? feedItem?.event_schedules[0]
        : null;
      let eventExpTime = {};
      if (!_.isEmpty(event_schedules)) {
        let startDate = event_schedules?.start_at_date;
        let startTime = event_schedules?.start_at_time;
        let combine = `${startDate} ${startTime}`;
        let eventFeedable = (eventExpTime.feedable = {});
        eventFeedable.expiry_time = combine;
        var isExpired = event_schedules?.is_expired;
      }
      return (
        <View
          style={{
            height: 165,
            width: "100%",
            // backgroundColor: colors.color2,
            justifyContent: "space-between",
          }}
        >
          <AppText
            style={[
              styles.descriptionText,
              {
                marginBottom: 0,
                marginTop: 5,
                fontWeight: "500",
                color: theme.darkGrey,
              },
            ]}
          >
            {feedItem?.title}
          </AppText>
          <View style={{ flexDirection: "row" }}>
            <IconView left={5} label="Online" iconName="ios-videocam-outline" />
            <IconView
              label={`Participants ${feedItem?.participants_count}`}
              icon={<AntDesign name="user" size={14} color={theme.darkGrey} />}
            />
          </View>

          <IconView label={address} iconName="location-outline" />
          {event_schedules && !isExpired ? (
            <TimeLeft
              label="Starts in"
              item={eventExpTime}
              digitColor={theme?.cardColor}
              top={-5}
            />
          ) : (
            <Text style={{ marginLeft: 18, color: colors.danger }}>
              Event Expired
            </Text>
          )}
          <Btn
            label={isExpired ? "Detail" : "Join Now"}
            fontSize={12}
            height={28}
            width={90}
            textColor="#000"
            fontWeight="400"
            style={styles.button}
            bg={colors.borderColor}
            onPress={() => {
              dispatch(allActions.SheetAction.EventType("Event"));
              dispatch(allActions.DetailAction.EventDetail(feedItem));
              navigation.navigate("EventDetail");
            }}
          />
        </View>
      );
    } else {
      return null;
    }
  } else if (feedType == "Product") {
    if (cover) {
      let uri = feedItem?.productable?.medias[0]?.media_url;
      return checkLastChr(uri, feedItem?.productable?.medias);
    } else if (desc) {
      return (
        <AppText style={styles.descriptionText}>
          {feedItem?.productable?.name}
        </AppText>
      );
    }
    if (!time) {
      return (
        <Btn
          label="Product Detail"
          fontSize={12}
          height={32}
          width={120}
          style={styles.button}
          bg={colors.greenish}
          onPress={() => {
            dispatch(allActions.DetailAction.StampDetail(feedItem));
            navigation.navigate("ProductDetail");
          }}
        />
      );
    }
    return null;
  } else if (feedType == "Auction") {
    if (cover) {
      let uri = feedItem?.auctionable?.medias?.length
        ? feedItem?.auctionable?.medias[0]?.media_url
        : feedItem?.auctionable?.image_url;

      const mediaList = feedItem?.auctionable?.medias?.length
        ? feedItem?.auctionable?.medias
        : [{ media_url: feedItem?.auctionable?.image_url }];

      return checkLastChr(uri, mediaList);
    } else if (desc) {
      return (
        <AppText style={styles.descriptionText}>
          {feedItem?.auctionable?.name}
        </AppText>
      );
    }
    if (time) {
      return <TimeLeft label="Time Left" item={item} bid />;
    }
    if (!time) {
      return (
        !owner &&
        !feedItem?.is_expired && (
          <Btn
            label={language?.placeBids}
            fontSize={12}
            height={32}
            width={100}
            style={styles.button}
            bg={colors.greenish}
            onPress={() => {
              if (currentUser?.store) {
                dispatch(allActions.DetailAction.AuctionDetail(feedItem));
                navigation.navigate("AuctionDetail");
              } else {
                Helper.showToastMessage(
                  "Please create your store first.",
                  colors.blueTheme
                );
              }
            }}
          />
        )
      );
    }
    return null;
  } else if (feedType == "Trade") {
    if (cover) {
      let uri = feedItem?.tradeables[0]?.tradeable?.medias[0]?.media_url;
      return checkLastChr(uri, feedItem?.tradeables[0]?.tradeable?.medias);
    } else if (desc) {
      return (
        <AppText style={styles.descriptionText}>
          {feedItem?.tradeables[0]?.tradeable?.name}
        </AppText>
      );
    }
    if (time) {
      return <TimeLeft label="Time Left" item={item} />;
    }
    if (!time) {
      return (
        !owner && (
          <Btn
            label="Trade"
            fontSize={12}
            height={32}
            width={100}
            style={styles.button}
            bg={colors.greenish}
            iconLeft={<AntDesign name="swap" color={"#fff"} size={18} />}
            onPress={() => {
              if (currentUser?.store) {
                dispatch(allActions.DetailAction.TradeDetail(feedItem));
                navigation.navigate("TradeDetail");
              } else {
                Helper.showToastMessage(
                  "Please create your store first.",
                  colors.blueTheme
                );
              }
            }}
          />
        )
      );
    }
    return null;
  } else if (feedType == "Post") {
    if (cover) {
      let uri = feedItem?.media_url;
      return postLastChr(uri);
    } else if (desc) {
      return null;
    } else {
      return null;
    }
  } else if (feedType == "FlagTicket") {
    let flaggable = feedItem?.flaggable;
    if (cover) {
      let uri = flaggable?.medias[0]?.media_url;
      return postLastChr(uri);
    } else if (desc) {
      return (
        <AppText style={styles.descriptionText}>{flaggable?.name}</AppText>
      );
    } else if (vote) {
      return (
        <View
          style={{
            height: 90,
            width: "95%",
            top: -5,
            alignSelf: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "70%",
              // backgroundColor: "red",
              justifyContent: "space-between",
            }}
          >
            <Text>Owner Votes: {feedItem?.vote_for_item_owner}</Text>
            <Text>Flagger Votes: {feedItem?.vote_for_flagger}</Text>
          </View>
          <Text>Flag ends in: {feedItem?.time_counts}</Text>
          <Btn
            label="Vote Now"
            fontSize={12}
            height={28}
            width={80}
            textColor="#000"
            fontWeight="500"
            bg="lightgrey"
            onPress={() => {
              dispatch(
                allActions.DetailAction.StampDetail(feedItem?.flaggable)
              );
              dispatch(allActions.SheetAction.initialRoute("StampDetail"));
              navigation.reset({
                index: 0,
                routes: [{ name: "GeneralStack" }],
              });
            }}
          />
        </View>
      );
    } else {
      return null;
    }
  } else {
    if (cover) {
      let uri = media?.length ? media[0]?.media_url : null;
      return postLastChr(uri);
    } else if (desc) {
      return (
        <AppText style={styles.descriptionText}>{feedItem?.title}</AppText>
      );
    }
    if (!time) {
      return (
        <Btn
          label="Bounty"
          fontSize={12}
          height={32}
          width={100}
          style={styles.button}
          bg={colors.greenish}
          iconLeft={
            <MaterialCommunityIcons name="target" color={"#fff"} size={18} />
          }
          onPress={() => {
            navigation.navigate("Bounty", { ItemDetail: feedItem });
          }}
        />
      );
    }
    return null;
  }
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 10,
    marginLeft: wp(2.5),
    borderRadius: 5,
  },
  descriptionText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    marginLeft: wp(2.5),
    // color: colors.lightText,
  },
  postImage: {
    width: wp(100),
    height: hp(26),
  },
  digitTxtStyle: {
    color: colors.lightText,
    fontFamily: Fonts.Inter_Regular,
  },
});
