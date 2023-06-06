import React, { useContext } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from "../AppText";
import { GradBtn } from "../GradBtn";
import Helper from "../../src/Helper";
import colors from "../../constant/colors";

import AuthContext from "../../src/Context/AuthContext";
import ThemeContext from "../../src/Context/ThemeContext";

export const StampCard = (props) => {
  const { Item, onPress, evalItem, onReqAction, onReject } = props;

  const { theme, mood } = useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);

  let media_uri = Item?.medias[0]?.media_url;
  let stamp_status = Item?.status?.toString();

  const btnTitle = evalItem?.status === "Pending" ? "Accept" : "Valuate";
  const showBtn =
    evalItem?.status === "Pending" || evalItem?.status === "Accepted";

  return (
    <View style={[styles.card, { backgroundColor: theme?.cardColor }]}>
      <Pressable onPress={onPress}>
        <Image
          style={styles.stampImg}
          source={{
            uri: media_uri ? media_uri : "https://picsum.photos/600/600",
          }}
        />

        <View style={styles.infoSection}>
          <AppText style={styles.albumText} numberOfLines={1}>
            {Helper.capitalizeFirstLetter(Item?.name)}
          </AppText>
          <AppText style={styles.itemText} numberOfLines={1}>
            {language?.country}: {Item?.country ? Item?.country : "N/A"}
          </AppText>
          {Item?.catalogue_number?.length ? (
            <AppText style={styles.itemText} numberOfLines={1}>
              {language?.catalogue}:{" "}
              {Item?.catalogue_number[0]?.number
                ? Item?.catalogue_number[0]?.number
                : "N/A"}
            </AppText>
          ) : null}

          <AppText style={styles.itemText} numberOfLines={1}>
            {language?.status}: {stamp_status}
          </AppText>
        </View>
      </Pressable>
      {evalItem && showBtn ? (
        <View style={styles.btnSection}>
          <GradBtn
            width="45%"
            fontSize={11}
            height={hp(3.2)}
            label={btnTitle}
            style={styles.modalBtn}
            loading={evalItem?.loading}
            disabled={evalItem?.loading}
            fontFamily={Fonts.IBM_Medium}
            onPress={onReqAction}
          />
          <GradBtn
            width="45%"
            fontSize={11}
            label="Reject"
            height={hp(3.2)}
            style={styles.modalBtn}
            loading={evalItem?.loading1}
            disabled={evalItem?.loading1}
            fontFamily={Fonts.IBM_Medium}
            onPress={onReject}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: wp(43),
    shadowColor: "#000",
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    borderRadius: 7,
  },
  stampImg: {
    height: hp(18),
    borderRadius: 5,
    resizeMode: "contain",
    marginVertical: hp(0.2),
    marginHorizontal: wp(2),
  },
  infoSection: {
    paddingTop: hp(0.5),
    marginBottom: hp(1),
    paddingHorizontal: wp(2),
  },
  albumText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: hp(0.2),
  },
  itemText: {
    marginTop: hp(0.2),
    fontSize: 11,
  },
  btnSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(0.5),
    paddingHorizontal: wp(2),
  },
  modalBtn: {
    marginTop: -hp(0.5),
  },
});
