import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";

import AppText from "../AppText";
import BorderBtn from "../BorderBtn";
import Helper from "../../src/Helper";
import colors from "../../constant/colors";
import { images } from "../../assets/images/Images";

import { useSelector } from "react-redux";
import ThemeContext from "../../src/Context/ThemeContext";
// import { dark as theme } from "../../constant/colorsConfig";

export const UserAlbumCard = (props) => {
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const { onViewAlbum, ItemDetail, btnTitle, onToggle, disabled } = props;
  //   console.log(ItemDetail);

  const { theme, mode } = useContext(ThemeContext);
  const owner = ItemDetail?.user_id === currentUser?.id;

  return (
    <View style={[styles.card, { backgroundColor: theme?.cardColor }]}>
      <Image
        style={styles.stampImg}
        source={{
          uri: ItemDetail
            ? ItemDetail?.image_url
            : "https://picsum.photos/600/600",
        }}
      />
      <AppText style={styles.albumText} numberOfLines={1}>
        {ItemDetail ? ItemDetail?.name : "My Album"}
      </AppText>
      <View style={styles.section}>
        <AppText style={styles.itemText}>
          {ItemDetail ? ItemDetail?.stamp_items_count : "0"} Items
        </AppText>
        <View style={styles.rowSection}>
          <TouchableOpacity
            onPress={() => {
              Helper.showToastMessage(
                ItemDetail?.is_private
                  ? `Private ${ItemDetail?.type}. Only connections can view.`
                  : "Open to View",
                colors.blueTheme
              );
            }}
          >
            <Image
              resizeMode="contain"
              tintColor={theme?.black}
              style={styles.bottomIcon}
              source={ItemDetail?.is_private ? images.Lock : images.Eye}
            />
          </TouchableOpacity>
          {!owner && (
            <TouchableOpacity onPress={onToggle}>
              <Ionicons
                name={ItemDetail?.is_wishable ? "heart" : "heart-outline"}
                color={colors.color8}
                size={23}
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.borderButton}>
        <BorderBtn
          height={22}
          bold={false}
          fontSize={10}
          width={wp(33)}
          borderWidth={1}
          disabled={disabled}
          onPress={onViewAlbum}
          color={disabled ? "lightgrey" : "grey"}
          label={btnTitle ? btnTitle : "View Album"}
          fontColor={disabled ? colors.lightText : colors.cBlack}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cWhite,
    width: wp(43),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 7,
  },
  stampImg: {
    height: hp(18),
    margin: 10,
    resizeMode: "contain",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(2),
    height: 22,
  },
  albumText: {
    fontSize: 14,
    fontWeight: "500",
    paddingHorizontal: wp(2),
  },
  itemText: {
    // color: colors.lightText,
    marginTop: 3,
    fontSize: 12,
  },
  borderButton: {
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  txt: {
    color: "#fff",
    letterSpacing: 1,
  },
  rowSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomIcon: {
    width: 18,
    height: 18,
  },
});
