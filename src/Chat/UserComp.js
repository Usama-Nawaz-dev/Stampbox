import { Image, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { styles } from "./styles";
import Helper from "../Helper";
import colors from "../../constant/colors";
import FastImage from "react-native-fast-image";
import ThemeContext from "../Context/ThemeContext";
import TimeAgo from "../../components/TimeAgo";
// import { dark as theme } from "../../constant/colorsConfig";

const UserComp = ({ item, label, label2, online, fontColor, add, active }) => {
  const { theme } = useContext(ThemeContext);
  // console.log("active", active);
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {online ? (
        <View
          style={{
            height: 13,
            width: 13,
            borderRadius: 13,
            backgroundColor: active == "online" ? colors.green : colors.color5,
            position: "absolute",
            left: 45,
            bottom: 10,
            zIndex: 100,
          }}
        />
      ) : null}
      {add ? (
        <View
          style={{
            height: 20,
            width: 20,
            borderRadius: 13,
            // backgroundColor: colors.green,
            position: "absolute",
            left: 40,
            bottom: 1,
            zIndex: 100,
          }}
        >
          {add}
        </View>
      ) : null}
      <View>
        <FastImage
          style={styles.userImg}
          source={{
            uri: item?.message
              ? item?.message
              : item?.image_url
              ? item?.image_url
              : item?.image,
          }}
        />
      </View>
      <View style={{ marginLeft: 10 }}>
        <Text
          numberOfLines={1}
          style={[
            styles.nameText,
            {
              fontSize: 15,
              color: fontColor ? fontColor : theme?.darkGrey,
              width: 170,
            },
          ]}
        >
          {label}
        </Text>

        <View style={styles.planSection}>
          {!online || active == "online" ? (
            <Text
              style={[
                styles.nameText,
                { color: fontColor ? fontColor : theme?.darkGrey },
              ]}
            >
              {label2}
            </Text>
          ) : (
            <Text
              style={[
                styles.nameText,
                { color: fontColor ? fontColor : colors.lightText },
              ]}
            >
              last seen{" "}
              <TimeAgo
                hideAgo
                color={fontColor}
                time={active ? Number(active) : Date.now()}
              />
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default UserComp;
