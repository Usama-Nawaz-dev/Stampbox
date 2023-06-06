import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";

import colors from "../../constant/colors";
import Fonts from "../../assets/fonts/Fonts";
import AppText from "../../components/AppText";

import UserCard from "../../components/UserCard";
import { CustomButton } from "../../components";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AuthContext from "../Context/AuthContext";
import ThemeContext from "../Context/ThemeContext";

export const BountyOfferSheet = (props) => {
  const { offerItem, onClose, onOfferAction, pendingAction } = props;
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  // console.log(offerItem)

  let title;
  let country;
  let stampUri;

  if (offerItem?.referable?.medias?.length) {
    stampUri = offerItem?.referable?.medias[0]?.media_url;
    title = offerItem?.referable?.name;
    country = offerItem?.referable?.country;
  } else if (offerItem?.referable?.tradeables) {
    stampUri =
      offerItem?.referable?.tradeables[0]?.tradeable?.medias[0]?.media_url;
    title = offerItem?.referable?.tradeables[0]?.tradeable?.name;
    country = offerItem?.referable?.tradeables[0]?.tradeable?.country;
  } else if (offerItem?.referable?.auctionable) {
    stampUri = offerItem?.referable?.auctionable?.medias[0]?.media_url;
    title = offerItem?.referable?.auctionable?.name;
    country = offerItem?.referable?.auctionable?.country;
  } else if (offerItem?.referable?.productable) {
    stampUri = offerItem?.referable?.productable?.medias[0]?.media_url;
    title = offerItem?.referable?.productable?.name;
    country = offerItem?.referable?.productable?.country;
  } else {
    stampUri = null;
    title = "Default Data";
    country = "Pakistan";
  }
  // const stampUri = offerItem?.referable?.medias?.length ? offerItem?.referable?.medias[0]?.media_url : offerItem?.referable?.tradeables[0]?.tradeable?.medias[0]?.media_url;
  return (
    <View style={[styles.container, { backgroundColor: theme?.cardColor }]}>
      <View style={styles.topSection}>
        <UserCard
          User={offerItem?.user}
          imgSize={hp(5)}
          starSize={14}
          nameStyle={{ fontSize: 14, maxWidth: wp(50) }}
        />
        <AppText
          style={[
            styles.info,
            {
              color: colors.color8,
              fontWeight: "500",
              fontSize: 12,
            },
          ]}
        >
          {offerItem?.status}
        </AppText>
      </View>
      <AppText style={styles.description} numberOfLines={3}>
        {offerItem?.description}
      </AppText>
      <View style={styles.stampSection}>
        <Image style={styles.img} source={{ uri: stampUri }} />
        <View style={styles.infoSection}>
          <AppText style={styles.nameStyle}>{title}</AppText>
          <AppText style={styles.info}>
            Referable Type: {offerItem?.referable_type}
          </AppText>
          <AppText style={styles.info}>
            {language?.country}: {country}
          </AppText>
        </View>
      </View>
      {offerItem?.status !== "Accepted" && (
        <>
          {offerItem?.status !== "Rejected" && (
            <View style={styles.btnSection}>
              <CustomButton
                bg={colors.background}
                label={language?.reject}
                textColor={colors.placeholderText}
                width={wp(45)}
                height={hp(4)}
                fontSize={12}
                onPress={() => onOfferAction(false)}
              />
              <CustomButton
                bg={colors.color8}
                label={language?.accept}
                textColor={colors.cWhite}
                width={wp(45)}
                height={hp(4)}
                fontSize={12}
                onPress={() => onOfferAction(true)}
              />
            </View>
          )}
          {offerItem?.status !== "Rejected" &&
            offerItem?.status !== "Pending_evaluation" && (
              <CustomButton
                bg={colors.color8}
                label={"Under Considration"}
                textColor={colors.cWhite}
                width={wp(45)}
                height={hp(4)}
                fontSize={12}
                onPress={pendingAction}
                style={styles.button}
              />
            )}
        </>
      )}
      <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
        <AppText style={styles.cancelText}>Cancel</AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(3),
    backgroundColor: colors.cWhite,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  description: {
    marginTop: hp(0.5),
    // color: colors.lightBlack
  },
  stampSection: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    // borderRadius: 5,
    marginVertical: hp(3),
    // backgroundColor: colors.cWhite,
  },
  img: {
    height: hp(10.5),
    width: hp(11.5),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  infoSection: {
    flex: 1,
    height: hp(10.5),
    marginLeft: -hp(1.5),
    paddingLeft: wp(3),
    borderRadius: 10,
    justifyContent: "center",
    backgroundColor: colors.cWhite,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nameStyle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: hp(0.5),
    color: colors.heading,
    fontFamily: Fonts.IBM_Regular,
  },
  info: {
    fontFamily: Fonts.IBM_Regular,
    color: colors.lightText,
    marginBottom: hp(0.3),
    fontSize: 12,
  },
  btnSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cancelBtn: {
    marginVertical: hp(2),
    alignItems: "center",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    marginTop: hp(1.5),
    alignSelf: "center",
  },
});
