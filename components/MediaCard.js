import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import moment from "moment";
import FastImage from "react-native-fast-image";
import Foundation from "react-native-vector-icons/Foundation";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from "./AppText";
import colors from "../constant/colors";
import ThemeContext from "../src/Context/ThemeContext";

const MediaCard = (props) => {
  const {
    item,
    onEdit,
    editImg,
    onRemove,
    rightIcon,
    mediaCount,
    showEdit = true,
    showInfo = true,
  } = props;
  const { theme } = useContext(ThemeContext);

  let createdAt = moment(item?.created_at).format("YYYY-MM-DD [at] h:mm a");

  return (
    <View style={[styles.card, { backgroundColor: theme?.cardColor }]}>
      {showInfo && (
        <Foundation
          name="info"
          color={mediaCount < 1 ? colors.theme : "green"}
          size={hp(2.7)}
          style={{ alignSelf: "flex-end", position: "absolute" }}
        />
      )}
      {item?.is_album_attached ? (
        <AppText style={styles.albumInfo}>Uploaded to album(s)</AppText>
      ) : null}
      <FastImage
        style={styles.stampImg}
        resizeMode="contain"
        source={{
          uri: item.media_url
            ? item.media_url
            : "https://picsum.photos/600/600",
        }}
      />
      <AppText style={styles.timeText}>{createdAt}</AppText>
      <View style={styles.buttonSection}>
        {showEdit && (
          <TouchableOpacity onPress={onEdit}>
            <MaterialIcons name="edit" size={hp(2.4)} color={theme?.black} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={editImg}>
          <MaterialCommunityIcons
            name="image-plus"
            size={hp(2.4)}
            color={theme?.black}
            style={{ transform: [{ rotateX: "180deg" }] }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ left: 5 }} onPress={onRemove}>
          <MaterialCommunityIcons
            name="delete-outline"
            size={hp(2.4)}
            color={theme?.black}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={onOption}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={hp(2.4)}
            color={theme?.black}
          />
        </TouchableOpacity> */}
        {rightIcon && <View>{rightIcon}</View>}
      </View>
    </View>
  );
};

export default MediaCard;

const styles = StyleSheet.create({
  card: {
    width: wp(40),
    backgroundColor: "white",
    borderRadius: 5,
    padding: wp(0.2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  stampImg: {
    width: wp(28),
    height: hp(15),
    alignSelf: "center",
    marginTop: hp(1),
  },
  buttonSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: hp(0.5),
    paddingHorizontal: wp(3),
    marginBottom: hp(0.7),
  },
  timeText: {
    fontSize: 10,
    marginTop: hp(0.5),
    alignSelf: "center",
  },
  albumInfo: {
    fontSize: 10,
    paddingLeft: wp(2),
    paddingTop: hp(0.2),
  },
});
