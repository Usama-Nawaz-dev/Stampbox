import React, { useContext } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";

import Image from "react-native-fast-image";
import colors from "../constant/colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CountDown from "react-native-countdown-component";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import VideoPlayer from "../components/VideoPlayer";
import Btn from "./Btn";
import Helper from "../src/Helper";
import moment from "moment";
import AppText from "./AppText";
import Fonts from "../assets/fonts/Fonts";

import { ImageListSlider } from "./ImageSwiper/ImageListSlider";
import { TimeLeft } from "./TimeLeft";
const { width } = Dimensions.get("window");

import { useSelector, useDispatch } from "react-redux";
import allActions from "../redux/actions";
import AuthContext from "../src/Context/AuthContext";
import _ from "lodash";
import { pushNavigation } from "../constant/navigationMethods";
import ThemeContext from "../src/Context/ThemeContext";
// import { dark as theme } from "../constant/colorsConfig";

const IconView = ({ icon, label, iconName, left }) => {
  const { theme, mood } = useContext(ThemeContext);
  return (
    <View
      style={{
        flexDirection: "row",
        // backgroundColor: "orange",
        marginLeft: left ? left : 0,
        alignItems: "center",
      }}
    >
      {iconName ? (
        <Ionicons name={iconName} size={14} color={theme?.black} />
      ) : (
        icon
      )}
      <Text style={{ marginHorizontal: 5, color: theme?.black, fontSize: 12 }}>
        {label}
      </Text>
    </View>
  );
};

const checkLastChr = (str, data) => {
  if (str) {
    // console.log(data)
    return (
      <ImageListSlider
        data={data}
        timer={2000}
        imageKey={"media_url"}
        width={width}
        height={hp(26)}
        local={false}
        separator={0}
        loop={false}
        autoscroll={false}
        // currentIndexCallback={index => console.log('Index', index)}
        onPress={(index, item) => {
          // console.log(index, item)
        }}
        indicator
        animation
      />
    );
    // return <Image style={styles.postImage}
    //   source={{ uri: str }} />;
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
function tConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
}

const GetItem = ({ item, cover, desc, navigation, time, vote, eventUi }) => {
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const owner = item?.feedable?.user?.id == currentUser?.id;
  // item?.feedable_type == "FlagTicket" && console.log(item);
  const dispatch = useDispatch();
  const { theme, mood } = useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const media = item?.feedable?.medias;
  if (item?.feedable_type == "Event") {
    // console.log("imgUrl", item?.feedable?.medias[0]?.media_url);
    // console.log("item", item);
    if (cover) {
      let uri = media?.length ? media[0]?.media_url : null;
      return checkLastChr(uri, item?.feedable?.medias);
    }
    if (desc) {
      return null;
    }
    if (eventUi) {
      let address = item?.feedable?.address
        ? `${item?.feedable?.address?.city}, ${item?.feedable?.address?.country}`
        : null;
      let event_schedules = item?.feedable?.event_schedules?.length
        ? item?.feedable?.event_schedules[0]
        : null;
      let eventExpTime = {};
      if (!_.isEmpty(event_schedules)) {
        let startDate = event_schedules?.start_at_date;
        let startTime = event_schedules?.start_at_time;
        let combine = `${startDate} ${startTime}`;
        let eventFeedable = (eventExpTime.feedable = {});
        eventFeedable.expiry_time = combine;
        var isExpired = event_schedules?.is_expired;
        // console.log("combine", eventExpTime);
      }

      // let createdAt = moment(item?.created_at).format("YYYY-MM-DD [at] h:mm a");
      return (
        <View
          style={{
            height: item?.feedable?.address?.city ? 130 : 110,
            width: "95%",
            alignSelf: "center",
            backgroundColor: theme?.cardColor,
            // backgroundColor: "orange",
            justifyContent: "space-around",
          }}
        >
          <AppText
            style={[
              // styles.descriptionText,
              {
                // marginBottom: 0,
                // marginTop: 5,
                fontSize: 16,
                fontWeight: "500",
                color: theme.black,
              },
            ]}
          >
            {item?.feedable?.title}
          </AppText>
          <View style={{ flexDirection: "row" }}>
            <IconView label="Online" iconName="ios-videocam-outline" />
            <IconView
              label={`Participants ${item?.feedable?.participants_count}`}
              icon={<AntDesign name="user" size={14} color={theme?.black} />}
            />
          </View>
          {/* <IconView label={address} iconName="location-outline" /> */}
          {item?.feedable?.address?.city ? (
            <IconView left={-2} label={address} iconName="location-outline" />
          ) : null}
          {event_schedules && !isExpired ? (
            <TimeLeft
              label="Starts in"
              item={eventExpTime}
              labelColor={theme?.black}
              digitColor={theme?.cardColor}
              marginLeft={0}
              style={[{ color: theme?.black }, { color: theme?.black }]}
              // top={-5}
            />
          ) : (
            <Text style={{ color: colors.danger }}>Event Expired</Text>
          )}
          <Btn
            label={isExpired ? "Detail" : "Join Now"}
            fontSize={12}
            height={28}
            width={90}
            textColor="#000"
            fontWeight="400"
            // style={{ borderRadius: 5 }}
            bg={colors.borderColor}
            onPress={() => {
              dispatch(allActions.SheetAction.initialRoute("EventDetail"));
              dispatch(allActions.SheetAction.EventType("Event"));
              dispatch(allActions.DetailAction.EventDetail(item?.feedable));
              // dispatch(allActions.DataAction.show_tabs(true));
              navigation.navigate("Generals");
              // navigation.reset({
              //   index: 0,
              //   routes: [{ name: "GeneralStack" }],
              // });
            }}
          />
        </View>
      );
    } else {
      return null;
    }
  } else if (item?.feedable_type == "Product") {
    if (cover) {
      // console.log("imgUrl", item?.feedable?.productable?.medias[0]?.media_url);
      let uri = item?.feedable?.productable?.medias[0]?.media_url;
      // let uri = media?.length ? media[0]?.media_url : null;
      return checkLastChr(uri, item?.feedable?.productable?.medias);
    } else if (desc) {
      return (
        <AppText style={styles.descriptionText}>
          {item?.feedable?.productable?.name}
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
          // iconLeft={<AntDesign name="swap" color={"#fff"} size={18} />}
          onPress={() => {
            Helper.fbEvent("product_open_from_home_screen");
            dispatch(allActions.DetailAction.StampDetail(item?.feedable));
            navigation.navigate("ProductStack");
          }}
        />
      );
    }
    return null;
  } else if (item?.feedable_type == "Auction") {
    if (cover) {
      let uri = item?.feedable?.auctionable?.medias?.length
        ? item?.feedable?.auctionable?.medias[0]?.media_url
        : item?.feedable?.auctionable?.image_url;

      const mediaList = item?.feedable?.auctionable?.medias?.length
        ? item?.feedable?.auctionable?.medias
        : [{ media_url: item?.feedable?.auctionable?.image_url }];

      return checkLastChr(uri, mediaList);
    } else if (desc) {
      return (
        <AppText style={styles.descriptionText}>
          {item?.feedable?.auctionable?.name}
        </AppText>
      );
    }
    if (time) {
      return (
        <TimeLeft
          label="Time Left"
          labelColor={theme?.black}
          digitColor={theme?.cardColor}
          style={[{ color: theme?.black }, { color: theme?.black }]}
          item={item}
          bid
        />
      );
    }
    if (!time) {
      return (
        !owner &&
        !item?.feedable?.is_expired && (
          <Btn
            label={language?.placeBids}
            fontSize={12}
            height={32}
            width={100}
            style={styles.button}
            bg={colors.greenish}
            //   iconLeft={<AntDesign name="swap" color={"#fff"} size={18} />}
            onPress={() => {
              // console.log("auction-item->", item);
              if (currentUser?.store) {
                dispatch(allActions.DetailAction.AuctionDetail(item));
                navigation.navigate("AuctionStack", {
                  screen: "AuctionDetail",
                });
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
  } else if (item?.feedable_type == "Trade") {
    if (cover) {
      // console.log("imgUrl", item?.feedable?.tradeables[0]?.tradeable?.medias[0]?.media_url);
      let uri = item?.feedable?.tradeables[0]?.tradeable?.medias[0]?.media_url;
      return checkLastChr(
        uri,
        item?.feedable?.tradeables[0]?.tradeable?.medias
      );
    } else if (desc) {
      return (
        <AppText style={styles.descriptionText}>
          {item?.feedable?.tradeables[0]?.tradeable?.name}
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
                // console.log("item", item);
                dispatch(allActions.DetailAction.TradeDetail(item?.feedable));
                navigation.navigate("TradeStack", { screen: "TradeDetail" });
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
  } else if (item?.feedable_type == "Post") {
    if (cover) {
      let uri = item?.feedable?.media_url;
      // console.log("uri--->", uri)
      return postLastChr(uri);
    } else if (desc) {
      return null;
    } else {
      return null;
    }
  } else if (item?.feedable_type == "FlagTicket") {
    let flaggable = item?.feedable?.flaggable;
    if (cover) {
      // let uri = item?.feedable?.media_url;
      let uri = flaggable?.medias[0]?.media_url;
      // console.log("uri--->", uri)
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
            // backgroundColor: "orange",
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
            <Text style={{ color: theme.black }}>
              Owner Votes: {item?.feedable?.vote_for_item_owner}
            </Text>
            <Text style={{ color: theme.black }}>
              Flagger Votes: {item?.feedable?.vote_for_flagger}
            </Text>
          </View>
          <Text style={{ color: theme.black }}>
            Flag ends in: {item?.feedable?.time_counts}
          </Text>
          <Btn
            label="Vote Now"
            fontSize={12}
            height={28}
            width={80}
            // style={styles.button}
            textColor="#000"
            fontWeight="500"
            bg="lightgrey"
            onPress={() => {
              // console.log('item', item)
              dispatch(
                allActions.DetailAction.StampDetail(item?.feedable?.flaggable)
              );
              // dispatch(allActions.SheetAction.FlagType(props?.type));
              // navigation.navigate("GeneralStack", { screen: "StampDetail" });
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
        <AppText style={styles.descriptionText}>
          {item?.feedable?.title}
        </AppText>
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
            navigation.navigate("BountyStack", {
              screen: "Bounty",
              params: { ItemDetail: item },
            });
          }}
        />
      );
    }
    return null;
  }
};

export default GetItem;

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
