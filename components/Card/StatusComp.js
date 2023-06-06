import React, { useContext, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";

import AppText from "../AppText";
import Helper from "../../src/Helper";
import colors from "../../constant/colors";
import { images } from "../../assets/images/Images";
import { CustomButton } from "../Buttons/CustomButton";

import { useDispatch } from "react-redux";
import allActions from "../../redux/actions";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import Feather from "react-native-vector-icons/Feather";
import ThemeContext from "../../src/Context/ThemeContext";

export const StatusComp = (props) => {
  const {
    user,
    userName,
    navigation,
    subscription,
    currentUser = true,
  } = props;
  const dispatch = useDispatch();

  const [showDetail, setShowDetail] = useState(false);
  const { theme, mode } = useContext(ThemeContext);

  let planPath, planName;
  if (subscription?.name == "Free") {
    planName = "Trial";
    planPath = images.None;
  } else if (subscription?.name == "Bronze") {
    planName = "Bronze";
    planPath = images.Bronze;
  } else if (subscription?.name == "Silver") {
    planName = "Silver";
    planPath = images.Silver;
  } else if (subscription?.name == "Basic") {
    planName = "Gold";
    planPath = images.Gold;
  } else if (subscription?.name == "Premium") {
    planName = "Platinum";
    planPath = images.Platinum;
  } else if (subscription?.name == "Business") {
    planName = "Diamond";
    planPath = images.Diamond;
  }

  return (
    <View style={[styles.card, { backgroundColor: theme?.cardColor }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setShowDetail(!showDetail)}
      >
        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}> */}
        {/* <FastImage source={images.User} style={styles.userIcon} /> */}
        <AppText style={[styles.heading, { color: theme?.black }]}>
          Membership Status
        </AppText>
        {/* // </View>  */}
        <Feather
          name={showDetail ? "chevron-up" : "chevron-down"}
          size={20}
          style={{ marginTop: 5, color: theme?.black }}
        />
      </TouchableOpacity>
      {showDetail && (
        <View style={styles.infoSection}>
          <View
            style={[
              styles.badgeSection,
              { justifyContent: currentUser ? "space-between" : "center" },
            ]}
          >
            <FastImage style={styles.planImage} source={planPath} />
            {currentUser && (
              <View style={{ justifyContent: "space-around" }}>
                <CustomButton
                  bg={colors.background}
                  borderRadius={10}
                  label="TFS"
                  textColor={colors.cBlack}
                  width={wp(30)}
                  height={36}
                  fontSize={12}
                  iconLeft={
                    <FastImage
                      style={{
                        width: 22,
                        height: 24,
                        marginLeft: 15,
                        marginRight: 6,
                      }}
                      source={images.TFS}
                      resizeMode="contain"
                    />
                  }
                  onPress={() => {
                    navigation.navigate("MyTfs");
                  }}
                />
                <CustomButton
                  bg={colors.background}
                  borderRadius={10}
                  label="Wishlist"
                  textColor={colors.cBlack}
                  width={wp(30)}
                  height={36}
                  fontSize={12}
                  iconLeft={
                    <FastImage
                      style={{
                        width: 18,
                        height: 24,
                        marginLeft: 15,
                        marginRight: 10,
                      }}
                      source={images.Wishlist}
                      resizeMode="contain"
                    />
                  }
                  onPress={() => {
                    Helper.fbEvent("open_wishlist_from_profile_activity");
                    dispatch(allActions.DetailAction.OtherUser(user));
                    navigation.navigate("MyWishlist");
                  }}
                />
                <CustomButton
                  bg={colors.background}
                  borderRadius={10}
                  label="Cards"
                  textColor={colors.cBlack}
                  width={wp(30)}
                  height={36}
                  fontSize={12}
                  iconLeft={
                    <FastImage
                      style={{
                        width: 22,
                        height: 26,
                        marginLeft: 15,
                        marginRight: 8,
                      }}
                      source={images.Meter}
                      resizeMode="contain"
                    />
                  }
                  onPress={() => {
                    navigation.navigate("CreditCards");

                    // Helper.showToastMessage("Coming Soon", colors.blueTheme);
                  }}
                />
              </View>
            )}
          </View>
          <AppText style={[styles.statusText, { color: theme?.black }]}>
            {userName ? userName : "You are"} standing with
          </AppText>
          <AppText style={[styles.statusText, { color: theme?.black }]}>
            {planName} Status in Community
          </AppText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cWhite,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    borderRadius: 5,
  },
  header: {
    flexDirection: "row",
    height: 55,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(3),
  },
  userIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  heading: {
    fontSize: 16,
    color: colors.lightBlack,
    fontFamily: Fonts.IBM_Medium,
  },
  infoSection: {
    paddingBottom: hp(2),
  },

  //Detail Styles
  badgeSection: {
    marginTop: 20,
    flexDirection: "row",
    paddingHorizontal: wp(5),
    marginBottom: 20,
  },
  planImage: {
    width: 180,
    height: 160,
    resizeMode: "contain",
  },
  statusText: {
    fontSize: 14,
    color: colors.lightText,
    textAlign: "center",
    letterSpacing: 0.5,
    lineHeight: 20,
  },
});
