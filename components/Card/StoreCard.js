import React, { useContext } from "react";
import {
  View,
  Pressable,
  Clipboard,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Feather from "react-native-vector-icons/Feather";

import AppText from "../AppText";
import Helper from "../../src/Helper";
import colors from "../../constant/colors";
import { placeHolder } from "../../constant/Paths";
import { images } from "../../assets/images/Images";

import { useSelector } from "react-redux";

import AuthContext from "../../src/Context/AuthContext";
import ThemeContext from "../../src/Context/ThemeContext";

export const StoreCard = (props) => {
  const { ItemDetail, onPressUser, onSaveStore, onShowStore } = props;

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const { closeSheet, openPermissionSheet } = useContext(AuthContext);

  const mediaUri = ItemDetail?.profile_media?.media_url;
  const owner = ItemDetail?.user_id == currentUser?.id;
  const User = ItemDetail?.owner;

  return (
    <View style={[styles.card, { backgroundColor: theme?.cardColor }]}>
      <View style={styles.mediaType}>
        <AppText style={styles.typeText}>{ItemDetail?.type}</AppText>
      </View>

      <Pressable onPress={onShowStore}>
        <Image style={styles.stampImg} source={{ uri: mediaUri }} />
      </Pressable>
      <View style={[styles.infoSection, { backgroundColor: theme?.cardColor }]}>
        <View style={styles.uidSection}>
          <AppText style={[styles.stampId, { color: theme?.theme }]}>
            {ItemDetail?.uuid}
          </AppText>
          <TouchableOpacity
            onPress={() => {
              Clipboard.setString(ItemDetail?.uuid);
              Helper.showToastMessage("Copied to Clipboard.", colors.green);
            }}
          >
            <Feather name="copy" size={hp(1.8)} color={theme?.black} />
          </TouchableOpacity>
        </View>
        <AppText style={styles.nameText} numberOfLines={1}>
          {ItemDetail?.name}
        </AppText>
        <AppText
          style={[styles.text, { color: theme?.lightText }]}
          numberOfLines={2}
        >
          {language?.location}: {ItemDetail?.address?.address}
        </AppText>
        <AppText
          numberOfLines={2}
          style={[styles.text, { color: theme?.lightText }]}
        >
          {language?.description}: {ItemDetail?.description}
        </AppText>
      </View>
      <Pressable style={styles.bottomSection} onPress={onPressUser}>
        <View style={styles.upperSection}>
          {User?.image_url ? (
            <Image style={styles.userImg} source={{ uri: User?.image_url }} />
          ) : (
            <Image style={styles.userImg} source={placeHolder} />
          )}

          <View style={styles.nameSection}>
            <AppText
              style={[styles.userName, { color: theme?.darkGrey }]}
              numberOfLines={1}
            >
              {User
                ? User?.full_name
                  ? Helper.capitalizeFirstLetter(User?.full_name)
                  : Helper.capitalizeFirstLetter(User?.username)
                : "Name Not-Found"}
            </AppText>
            <AppText style={[styles.infoText, { color: theme?.theme }]}>
              See this store item on marketplace
            </AppText>
          </View>
        </View>
        {!owner && (
          <TouchableOpacity onPress={onSaveStore}>
            <Image
              resizeMode="contain"
              style={styles.iconSave}
              source={images.SaveSeller}
              tintColor={
                ItemDetail?.is_book_marked ? theme?.theme : theme?.black
              }
            />
          </TouchableOpacity>
        )}
      </Pressable>
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
  },
  uidSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(0.2),
  },
  stampId: {
    fontSize: 12,
    color: colors.theme,
    marginRight: wp(1),
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
    fontWeight: "500",
    marginBottom: hp(0.2),
    fontFamily: "IBMPlexSans-Regular",
  },
  text: {
    fontSize: 12,
    color: colors.lightText,
    marginBottom: hp(0.2),
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: colors.borderColor,
    paddingHorizontal: wp(2),
    borderTopWidth: 1,
    marginTop: hp(0.5),
    paddingVertical: hp(0.5),
  },
  mediaType: {
    height: hp(2.6),
    width: 55,
    zIndex: 999,
    top: wp(2),
    left: wp(2),
    borderRadius: hp(10),
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightTheme,
  },
  typeText: {
    fontSize: 10,
    color: colors.background,
  },

  //User Section Styles
  upperSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImg: {
    borderRadius: 100,
    height: hp(4),
    width: hp(4),
  },
  nameSection: {
    marginLeft: wp(2),
  },
  userName: {
    fontSize: 11,
    color: "#3B3B3B",
    maxWidth: wp(25),
    fontFamily: Fonts.IBM_Medium,
  },
  iconSave: {
    height: hp(2.6),
    width: hp(2.6),
  },
  infoText: {
    fontSize: 8,
    maxWidth: wp(25),
  },
});
