import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";

import AppText from "../AppText";
import colors from "../../constant/colors";
import Fonts from "../../assets/fonts/Fonts";
import { images } from "../../assets/images/Images";

import moment from "moment";
import { GradBtn } from "../GradBtn";
import { CustomButton } from "../Buttons/CustomButton";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ThemeContext from "../../src/Context/ThemeContext";

export const HunterCard = (props) => {
  const {
    ItemDetail,
    onPress,
    onDecline,
    onAccept,
    showBtn,
    onChat,
    btnText,
    showAccept = true,
  } = props;
  const { theme } = useContext(ThemeContext);
  const date = moment(ItemDetail?.created_at).format("YYYY-MM-DD [at] h:mm a");

  return (
    <Pressable
      style={[styles.card, { backgroundColor: theme?.cardColor }]}
      onPress={onPress}
    >
      <View style={styles.topSection}>
        <View style={styles.leftSection}>
          <Image
            style={styles.userImg}
            source={{ uri: ItemDetail?.user?.image_url }}
          />
          <View style={styles.nameSection}>
            <AppText style={[styles.dateText, { color: theme?.theme }]}>
              {date}
            </AppText>
            <AppText style={styles.userName} numberOfLines={1}>
              {ItemDetail?.user?.full_name}
            </AppText>
          </View>
        </View>
        <TouchableOpacity style={{ zIndex: 999 }} onPress={onChat}>
          <Image
            style={[styles.commentIcon, { tintColor: theme?.black }]}
            source={images.Comments}
          />
        </TouchableOpacity>
      </View>
      {ItemDetail?.description && (
        <AppText style={styles.infoText}>{ItemDetail?.description}</AppText>
      )}
      {showBtn && (
        <View
          style={[
            styles.btnSection,
            { justifyContent: showAccept ? 'space-around' : "space-between" },
          ]}
        >
          <CustomButton
            height={32}
            fontSize={12}
            width={wp(35)}
            fontWeight={"500"}
            onPress={onDecline}
            bg={colors.background}
            textColor={colors.btnText}
            label={btnText ? btnText : "Reject"}
          />
          {showAccept && (
            <GradBtn
              height={32}
              fontSize={12}
              label={"Accept"}
              fontWeight={"500"}
              onPress={onAccept}
              style={styles.button}
            />
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowOffset: { width: 0, height: 0 },
    backgroundColor: colors.cWhite,
    marginBottom: hp(1.5),
    shadowOpacity: 0.25,
    shadowColor: "#000",
    shadowRadius: 1.84,
    borderRadius: 7,
    padding: wp(3),
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImg: {
    borderRadius: 100,
    height: hp(5),
    width: hp(5),
  },
  commentIcon: {
    height: hp(2.6),
    width: hp(2.6),
    resizeMode: "contain",
  },
  nameSection: {
    marginLeft: wp(3),
  },
  userName: {
    fontSize: 14,
    maxWidth: wp(60),
    fontWeight: "500",
    fontFamily: "IBMPlexSans-Regular",
  },
  dateText: {
    fontSize: 12,
    color: colors.lightTheme,
    fontFamily: Fonts.IBM_Regular,
    marginBottom: hp(0.3),
  },
  infoText: {
    fontSize: 12,
    marginTop: hp(0.5),
  },
  btnSection: {
    marginTop: hp(1),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    width: wp(35),
    marginTop: 0,
  },
});
