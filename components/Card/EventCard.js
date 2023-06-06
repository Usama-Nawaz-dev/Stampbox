import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from "../AppText";
import UserCard from "../UserCard";
import { GradBtn } from "../GradBtn";
import colors from "../../constant/colors";
import Fonts from "../../assets/fonts/Fonts";
import { images } from "../../assets/images/Images";
import Octicons from "react-native-vector-icons/Octicons";
import CountDown from "react-native-countdown-component";
import Helper from "../../src/Helper";
import { ImageBackground } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import AuthContext from "../../src/Context/AuthContext";
import ThemeContext from "../../src/Context/ThemeContext";
// import { dark as theme } from "../../constant/colorsConfig";

export const EventCard = (props) => {
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const { ItemDetail, onPressDetail, isAttending } = props;
  const medias = ItemDetail?.medias;
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  let currentItem;
  let countTitle;
  let countdown;
  const eventDays = ItemDetail?.event_schedules?.length - 1;
  if (ItemDetail?.duration_type === "Recurring") {
    if (ItemDetail?.event_schedules[0]?.is_expired) {
      currentItem = ItemDetail?.event_schedules[eventDays];
      countTitle = "Ends In";
      countdown = currentItem?.end_at_date + " " + currentItem?.end_at_time;
    } else {
      currentItem = ItemDetail?.event_schedules[0];
      countTitle = currentItem?.is_ongoing ? "Ends In" : "Start In";
      countdown = currentItem?.is_ongoing
        ? currentItem?.end_at_date + " " + currentItem?.end_at_time
        : currentItem?.start_at_date + " " + currentItem?.start_at_time;
    }
  } else {
    currentItem = ItemDetail?.event_schedules[0];
    countTitle = currentItem?.is_ongoing ? "Ends In" : "Start In";
    countdown = currentItem?.is_ongoing
      ? currentItem?.end_at_date + " " + currentItem?.end_at_time
      : currentItem?.start_at_date + " " + currentItem?.start_at_time;
  }

  const owner = ItemDetail?.user?.id == currentUser?.id;
  const endTime =
    currentItem?.end_at_date +
    " " +
    ItemDetail?.event_schedules[eventDays]?.end_at_time;
  const startTime = ItemDetail?.event_schedules[0]?.is_ongoing
    ? ItemDetail?.event_schedules[0]?.end_at_date +
      " " +
      ItemDetail?.event_schedules[0]?.end_at_time
    : ItemDetail?.event_schedules[0]?.start_at_date +
      " " +
      ItemDetail?.event_schedules[0]?.start_at_time;

  const myTime = Helper.convert(countdown);
  const today = new Date();
  const timeDiff = myTime - today;
  const seconds = timeDiff / 1000 + 18000;

  const isExpired =
    ItemDetail?.event_schedules[ItemDetail?.event_schedules?.length - 1]
      ?.is_expired;

  return (
    <View style={[styles.card, { backgroundColor: theme?.cardColor }]}>
      {isAttending && !isExpired && (
        <View style={styles.mediaType}>
          <AppText style={styles.typeText}>{isAttending}</AppText>
        </View>
      )}
      <View>
        {medias?.length ? (
          <ImageBackground
            imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
            style={[styles.stampImg]}
            source={{ uri: medias[0].media_url }}
          >
            <View
              style={[styles.stampImg, { backgroundColor: "rgba(0,0,0, 0.3)" }]}
            ></View>
          </ImageBackground>
        ) : (
          <ImageBackground
            style={[styles.stampImg]}
            imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
            source={images.noImg}
          >
            <View
              style={[styles.stampImg, { backgroundColor: "rgba(0,0,0, 0.3)" }]}
            ></View>
          </ImageBackground>
        )}
      </View>
      <View style={[styles.infoSection, { backgroundColor: theme?.cardColor }]}>
        <AppText style={styles.nameText} numberOfLines={1}>
          {ItemDetail?.title}
        </AppText>
        <AppText style={styles.text} numberOfLines={1}>
          {ItemDetail?.event_desc}
        </AppText>
        <AppText style={[styles.text, { marginTop: hp(0.5) }]}>
          {language?.participants}: {ItemDetail?.participants_count}
        </AppText>
      </View>
      <View style={styles.counterSection}>
        <AppText style={styles.text}>{countTitle}: </AppText>
        {ItemDetail?.event_schedules[eventDays]?.is_expired ? (
          <AppText style={styles.timeText}>{language?.EXPIRED}</AppText>
        ) : (
          <CountDown
            showSeparator
            until={seconds}
            digitStyle={{ width: wp(6), height: 25 }}
            separatorStyle={[styles.separator, { color: theme?.theme }]}
            digitTxtStyle={[styles.digitTxtStyle, { color: theme?.theme }]}
            timeToShow={["D", "H", "M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        )}
      </View>
      <View style={styles.locSection}>
        <Octicons
          name="location"
          color={theme.lightText}
          style={{ marginRight: wp(1) }}
        />
        <AppText
          style={[styles.text, { fontSize: 10, marginRight: wp(2) }]}
          numberOfLines={1}
        >
          {ItemDetail?.address?.address ? ItemDetail?.address?.address : "N/A"}
        </AppText>
      </View>
      <TouchableOpacity style={styles.tradeBtn} onPress={onPressDetail}>
        <AppText style={styles.tradeText}>{language?.detail}</AppText>
      </TouchableOpacity>
      <View style={styles.bottomSection}>
        <UserCard User={ItemDetail?.user ? ItemDetail?.user : currentUser} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cWhite,
    width: wp(45),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
    borderRadius: 10,
    marginRight: wp(3),
    marginBottom: hp(1.5),
  },
  stampImg: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoSection: {
    marginTop: -10,
    backgroundColor: colors.cWhite,
    paddingHorizontal: wp(2),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  nameText: {
    marginVertical: 5,
    // color: colors.heading,
    fontFamily: Fonts.Inter_Medium,
  },
  text: {
    fontSize: 12,
    // color: colors.lightText,
    // marginBottom: 2,
  },
  tradeBtn: {
    padding: 6,
    borderRadius: 5,
    marginTop: hp(0.5),
    marginHorizontal: wp(3),
    backgroundColor: colors.color8,
  },
  tradeText: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
    color: colors.cWhite,
  },
  timeContainer: {
    flexDirection: "row",
    // justifyContent: 'space-evenly',
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: wp(2),
  },
  timeText: {
    color: colors.theme,
    fontWeight: "600",
    fontSize: 11,
  },
  locSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2),
  },
  bottomSection: {
    marginTop: hp(0.5),
    borderTopWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: wp(3),
    borderColor: colors.borderColor,
  },
  digitTxtStyle: {
    fontFamily: Fonts.Inter_Regular,
    fontSize: 12,
    color: colors.lightTheme,
  },
  separator: {
    color: colors.theme,
    fontSize: 12,
    fontWeight: "400",
  },
  counterSection: {
    height: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2),
  },

  mediaType: {
    height: hp(2.7),
    zIndex: 999,
    top: wp(2),
    left: wp(2),
    borderRadius: 20,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(19,127,19, .6)",
    paddingHorizontal: wp(2),
  },
  typeText: {
    fontSize: 12,
    color: colors.background,
  },
});
