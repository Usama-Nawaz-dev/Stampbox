import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { TimeLeft } from ".";
import AppText from "./AppText";
import colors from "../constant/colors";
import Fonts from "../assets/fonts/Fonts";
import UserCard from "../components/UserCard";
import { images } from "../assets/images/Images";
import AuthContext from "../src/Context/AuthContext";
import ThemeContext from "../src/Context/ThemeContext";

const BidCard = (props) => {
  const { Item, type, onPress, isWinner } = props;

  const winner = Item?.last_bid?.bidder;

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  let media_uri = null;
  let mediaType = null;

  if (Item?.auctionable_type === "Album") {
    media_uri = Item?.auctionable?.image_url
      ? Item?.auctionable?.image_url
      : null;
  } else {
    media_uri = Item?.auctionable?.medias?.length
      ? Item?.auctionable?.medias[0]?.media_url
      : null;

    mediaType = Item?.auctionable?.medias?.length
      ? Item?.auctionable?.medias[0]?.type
      : null;
  }

  return (
    <View style={[styles.card, { backgroundColor: theme?.cardColor }]}>
      {mediaType && (
        <View style={styles.mediaType}>
          <AppText style={styles.typeText}>{mediaType}</AppText>
        </View>
      )}
      <View>
        <Image
          style={styles.stampImg}
          source={{
            uri: media_uri ? media_uri : "https://picsum.photos/600/600",
          }}
        />
      </View>
      <View style={[styles.infoSection, { backgroundColor: theme?.cardColor }]}>
        <AppText style={[styles.stampId, { color: theme?.theme }]}>
          {Item?.uuid}
        </AppText>
        <AppText style={styles.nameText} numberOfLines={1}>
          {Item?.auctionable
            ? Item?.auctionable?.name
            : "Deutsche Bundespost Rare Stamp 1931"}
        </AppText>
        <View>
          <AppText style={styles.text}>
            {language?.totalBids}: {Item?.bids_count ? Item?.bids_count : 0}
          </AppText>
          <AppText style={styles.text}>
            {language?.initialBid}: {Item?.initial_bid}
          </AppText>
          <AppText style={styles.text}>
            {language?.buyingPrice}: {Item?.price}
          </AppText>
        </View>

        <TouchableOpacity
          onPress={onPress}
          style={[styles.bidBtn, { backgroundColor: theme.orangeSalmon }]}
        >
          <Image
            source={images.N_Auction}
            tintColor="#fff"
            style={styles.btnImg}
          />
          <AppText style={styles.tradeText}>
            {type == "won" ? language?.next : language?.detail}
          </AppText>
        </TouchableOpacity>
      </View>

      <TimeLeft
        item={Item}
        fontSize={12}
        marginLeft={wp(2)}
        marginTop={-hp(0.5)}
        label={Item?.is_expired ? language?.EXPIRED : language?.endsIn}
        digitColor={theme?.cardColor}
        style={[
          [styles.digitTxtStyle, { color: theme?.darkGrey }],
          [styles.separatorStyle, { color: theme?.darkGrey }],
        ]}
      />

      <View
        style={{
          height: 1,
          backgroundColor: "lightgrey",
          marginBottom: hp(0.5),
        }}
      />

      <View style={styles.userSection}>
        {isWinner ? (
          <View style={styles.winnerSection}>
            <Image
              resizeMode="contain"
              source={images.Winner}
              style={styles.winIcon}
              tintColor={colors.lightTheme}
            />
            <View>
              <AppText numberOfLines={1} style={styles.wonText}>
                {winner?.full_name}
              </AppText>
              <AppText style={{ fontSize: 10 }}>
                Last Bid:{" "}
                <AppText style={styles.wonText}>
                  ${Item?.last_bid?.amount}
                </AppText>{" "}
              </AppText>
            </View>
          </View>
        ) : (
          <UserCard
            imgSize={hp(4)}
            starSize={hp(1.5)}
            starColor={colors.theme}
            User={Item?.user}
          />
        )}
      </View>
    </View>
  );
};

export default BidCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cWhite,
    width: wp(45),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
    borderRadius: 10,
  },
  stampId: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.theme,
    alignSelf: "center",
  },
  stampImg: {
    width: "100%",
    height: hp(18),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoSection: {
    marginTop: -hp(1),
    backgroundColor: colors.cWhite,
    paddingHorizontal: wp(2),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  nameText: {
    marginBottom: hp(0.5),
    fontWeight: "500",
    fontFamily: Fonts.IBM_Regular,
  },
  text: {
    fontSize: 12,
    marginBottom: hp(0.2),
  },
  bidBtn: {
    width: wp(25),
    padding: hp(0.7),
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#F2F2F2",
    marginTop: hp(0.2),
    borderRadius: 5,
  },
  btnImg: {
    height: hp(1.2),
    width: hp(1.2),
    resizeMode: "contain",
    marginRight: wp(1.5),
  },
  tradeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
    marginLeft: hp(0.5),
  },
  separatorStyle: {
    fontSize: 10,
    fontWeight: "400",
  },
  digitTxtStyle: {
    fontSize: 10,
    fontFamily: Fonts.Inter_Regular,
  },
  mediaType: {
    zIndex: 999,
    top: wp(2),
    left: wp(2),
    height: hp(2.6),
    borderRadius: 20,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(19,127,19, .6)",
    paddingHorizontal: wp(1.5),
  },
  typeText: {
    fontSize: 12,
    color: colors.background,
  },
  userSection: {
    paddingHorizontal: wp(2),
    paddingBottom: hp(0.5),
  },
  winnerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  winIcon: {
    width: hp(2.5),
    height: hp(2.5),
    marginRight: wp(2),
  },
  wonText: {
    fontSize: 12,
    fontWeight: "600",
    maxWidth: wp(30),
  },
});
