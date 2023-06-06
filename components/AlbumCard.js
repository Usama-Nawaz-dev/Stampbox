import React, { useContext, useEffect, useRef } from "react";
import {
  View,
  Animated,
  Pressable,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
} from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from "./AppText";
import BorderBtn from "./BorderBtn";
import colors from "../constant/colors";
import { images } from "../assets/images/Images";

import ThemeContext from "../src/Context/ThemeContext";
import Helper from "../src/Helper";

const btnWidth = wp(9);
const offset = [-btnWidth, 0];

const AlbumCard = (props) => {
  const { onViewAlbum, onEdit, ItemDetail, onDelete, btnTitle, onPress } =
    props;

  let panValue = { x: 0, y: 0 };
  let isOpenState = useRef(false).current;
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const itemTranslate = pan.x.interpolate({
    inputRange: offset,
    outputRange: offset,
    extrapolate: "clamp",
  });
  const translateRightBtns = pan.x.interpolate({
    inputRange: [0, 1 * btnWidth],
    outputRange: [0, 1 * btnWidth],
    extrapolate: "clamp",
  });
  const { theme, mood } = useContext(ThemeContext);
  useEffect(() => {
    pan.addListener((value) => {
      panValue = value;
    });
  }, []);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: (e, g) => Math.abs(g.dx) > 10,
      onMoveShouldSetPanResponder: (e, g) => false,
      onPanResponderGrant: () => {
        pan.setOffset({ x: panValue.x, y: panValue.y });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, g) => {
        pan.flattenOffset();
        if (g.vx < -0.5 || g.dx < -btnWidth / 2) {
          if (isOpenState && g.dx < 0) {
            reset();
            return;
          }
          move(true);
          return;
        }
        reset();
      },
      onPanResponderTerminate: () => {
        reset();
      },
    })
  ).current;
  const reset = () => {
    isOpenState = false;
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  };
  const move = (toLeft) => {
    isOpenState = true;
    Animated.spring(pan, {
      toValue: {
        x: toLeft ? -btnWidth : 0,
        y: 0,
      },
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  };

  return (
    <View
      style={[styles.card, { backgroundColor: theme?.white, borderRadius: 7 }]}
    >
      <Animated.View
        style={[
          styles.btnContainer,
          {
            transform: [{ translateX: translateRightBtns }],
            alignSelf: "flex-end",
          },
        ]}
      >
        <View style={{ height: 100, justifyContent: "space-between" }}>
          <TouchableOpacity onPress={onEdit}>
            <Image
              resizeMode="contain"
              source={images.EditIcon}
              tintColor={theme?.black}
              style={styles.bottomIcon1}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Image
              resizeMode="contain"
              source={images.Remove}
              tintColor={theme?.theme}
              style={styles.bottomIcon1}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
      <Animated.View
        style={[
          styles.upperView,
          {
            transform: [{ translateX: itemTranslate }],
            backgroundColor: theme?.cardColor,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Pressable onPress={onPress}>
          <Image
            style={styles.stampImg}
            source={{
              uri: ItemDetail
                ? ItemDetail?.image_url
                : "https://picsum.photos/600/600",
            }}
          />
        </Pressable>
        <View style={styles.section}>
          <AppText style={styles.albumText} numberOfLines={1}>
            {ItemDetail ? ItemDetail?.name : "My Album"}
          </AppText>
          <AppText style={[styles.itemText, { color: theme?.black }]}>
            {ItemDetail ? ItemDetail?.stamp_items_count : "0"} Items
          </AppText>

          <View style={styles.borderButton}>
            <BorderBtn
              label={btnTitle ? btnTitle : `View ${ItemDetail?.type}`}
              width={wp(33)}
              height={23}
              color={"lightgrey"}
              fontColor={colors.cBlack}
              fontSize={10}
              bold={false}
              borderWidth={1}
              onPress={onViewAlbum}
            />
          </View>
          <View style={styles.bottomSection}>
            <TouchableOpacity onPress={onEdit}>
              <Image
                resizeMode="contain"
                source={images.EditIcon}
                tintColor={theme?.black}
                style={styles.bottomIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete}>
              <Image
                resizeMode="contain"
                source={images.Remove}
                tintColor={theme?.black}
                style={styles.bottomIcon}
              />
            </TouchableOpacity>
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
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default AlbumCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    width: wp(43),
  },
  stampImg: {
    margin: wp(2),
    height: hp(18),
    borderRadius: 5,
    resizeMode: "contain",
  },
  section: {
    paddingHorizontal: wp(2),
    paddingBottom: hp(0.5),
  },
  albumText: {
    fontSize: 14,
    fontWeight: "500",
  },
  itemText: {
    color: colors.lightText,
    marginTop: hp(0.3),
    fontSize: 12,
  },
  borderButton: {
    alignSelf: "center",
    marginTop: hp(0.5),
  },
  bottomSection: {
    marginTop: hp(1),
    marginBottom: hp(0.3),
    flexDirection: "row",
    justifyContent: "space-around",
    // paddingHorizontal: wp(9),
  },
  upperView: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 7,
  },
  txt: {
    color: "#fff",
    letterSpacing: 1,
  },
  btnContainer: {
    height: "100%",
    width: btnWidth,
    position: "absolute",
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomIcon: {
    width: hp(2.5),
    height: hp(2.5),
  },
  bottomIcon1: {
    width: hp(2.8),
    height: hp(2.8),
  },
});
