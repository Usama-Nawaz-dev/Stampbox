import React, { useEffect, useRef, useContext } from "react";
import {
  View,
  Image,
  Pressable,
  Animated,
  PanResponder,
  TouchableOpacity,
} from "react-native";

import { styles } from "./styles";
import colors from "../../constant/colors";
import AppText from "../../components/AppText";

import moment from "moment";
import Octicons from "react-native-vector-icons/Octicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import ThemeContext from "../Context/ThemeContext";

export const NotifyComp = (props) => {
  const { item, onPress, onDelete } = props;
  const subject = item?.data?.subject;
  const message = item?.data?.message;
  const time = moment(item.created_at).format("YYYY-MM-DD [at] h:mmA");
  const { theme } = useContext(ThemeContext);
  let img_url;
  if (item?.data?.type === "FOLLOW_USER") {
    img_url = item?.data?.property?.follower?.image_url;
  } else if (item?.data?.property?.user) {
    img_url = item?.data?.property?.user?.image_url;
  } else if (item?.data?.property?.sender) {
    img_url = item?.data?.property?.sender?.image_url;
  } else if (item?.data?.property?.flagger) {
    img_url = item?.data?.property?.flagger?.image_url;
  } else if (item?.data?.property?.sale_order) {
    img_url = item?.data?.property?.sale_order?.user?.image_url;
  } else {
    img_url = item?.data?.property?.image_url;
  }

  let panValue = { x: 0, y: 0 };
  let isOpenState = useRef(false).current;
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const itemTranslate = pan.x.interpolate({
    inputRange: [-50, 0],
    outputRange: [-50, 0],
    extrapolate: "clamp",
  });
  const translateRightBtns = pan.x.interpolate({
    inputRange: [0, 1 * 50],
    outputRange: [0, 1 * 50],
    extrapolate: "clamp",
  });
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
        if (g.vx < -0.5 || g.dx < -50 / 2) {
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
        x: toLeft ? -50 : 0,
        y: 0,
      },
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  };

  return (
    <View style={styles.mainSection}>
      <Animated.View
        style={[
          styles.btnContainer,
          {
            transform: [{ translateX: translateRightBtns }],
            alignSelf: "flex-end",
          },
        ]}
      >
        <TouchableOpacity onPress={onDelete}>
          <MaterialIcons name="delete-outline" size={30} color={colors.theme} />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={[
          styles.upperView,
          { transform: [{ translateX: itemTranslate }] },
        ]}
        {...panResponder.panHandlers}
      >
        <Pressable
          onPress={onPress}
          style={[
            styles.conatiner,
            {
              backgroundColor: item?.read_at
                ? theme?.cardColor
                : colors.background,
            },
          ]}
        >
          {!item?.read_at && (
            <Octicons
              name="dot-fill"
              style={styles.dotIcon}
              color={colors.blueTheme}
              size={18}
            />
          )}
          <Image source={{ uri: img_url }} style={styles.userImg} />
          <View>
            <AppText
              style={[
                styles.heading,
                { color: item?.read_at ? theme?.darkGrey : colors.heading },
              ]}
            >
              {subject}
            </AppText>
            <AppText
              style={[
                styles.info,
                { color: item?.read_at ? theme?.darkGrey : colors.heading },
              ]}
              numberOfLines={1}
            >
              {message}
            </AppText>
            <AppText
              style={[
                styles.timeText,
                {
                  color: {
                    color: item?.read_at ? theme?.lightText : colors.lightText,
                  },
                },
              ]}
            >
              {time}
            </AppText>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
};
