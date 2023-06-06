import React, { useContext } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from "../AppText";
import { HtmlTag } from "../HtmlTag";
import Helper from "../../src/Helper";
import ThemeContext from "../../src/Context/ThemeContext";

export const BlogCard = (props) => {
  const { name, description, status, date, by, image_url, onPress } = props;

  const source = {
    html: `${description}`,
  };
  function fn(text, count) {
    return text.slice(0, count) + (text.length > count ? "..." : "");
  }

  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme?.cardColor }]}
      onPress={onPress}
    >
      <View style={styles.imgSection}>
        <Image
          style={styles.stampImg}
          source={{
            uri: image_url ? image_url : "https://picsum.photos/600/600",
          }}
        />
        <View style={{ padding: wp(2), flexGrow: 1 }}>
          <AppText style={styles.heading} numberOfLines={1}>
            {Helper.capitalizeFirstLetter(name)}
          </AppText>
          <AppText style={{ color: theme?.lightText, fontSize: 12 }}>
            Status: {status}
          </AppText>

          <HtmlTag
            style={{ color: theme?.lightText, marginTop: hp(1), fontSize: 12 }}
            description={fn(description, 42)}
          />

          <View style={styles.bottomSection}>
            <AppText style={[styles.text, { color: theme?.lightText }]}>
              {date}
            </AppText>
            <AppText
              style={[
                styles.text,
                { color: theme?.lightText, maxWidth: wp(30) },
              ]}
              numberOfLines={1}
            >
              By: {by}
            </AppText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    width: wp(94),
    borderRadius: 7,
    marginTop: hp(1),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    alignSelf: "center",
  },
  imgSection: {
    flexDirection: "row",
  },
  stampImg: {
    width: wp(25),
    height: "100%",
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: hp(0.2)
  },
  text: {
    fontSize: 12,
    marginTop: hp(1),
    maxWidth: wp(35),
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(0.5),
  },
});
