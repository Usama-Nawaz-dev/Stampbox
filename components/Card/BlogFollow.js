import React, { useContext } from "react";
import { Text, View, Image, Pressable, StyleSheet } from "react-native";

import Helper from "../../src/Helper";
import colors from "../../constant/colors";
import Fonts from "../../assets/fonts/Fonts";
// Request URL: https://devapi.stampbox.com/api/follows/177

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import AuthContext from "../../src/Context/AuthContext";
import ThemeContext from "../../src/Context/ThemeContext";
// import { dark as theme } from '../../constant/colorsConfig';

const stars = [1, 2, 3, 4, 5];
export const BlogFollow = (props) => {
  const { Item, onViewBlog } = props;
//   console.log(Item);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const medias = Item?.followable?.medias?.length
    ? Item?.followable?.medias[0]?.media_url
    : null;

  return (
    <View style={styles.container}>
      <Pressable style={styles.userSection} onPress={onViewBlog}>
        <View>
          <Image style={styles.userImg} source={{ uri: medias }} />
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text
            numberOfLines={1}
            style={[styles.nameText, { color: theme?.darkGrey }]}
          >
            {Helper.capitalizeFirstLetter(Item?.followable?.title)}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: "94%",
    padding: 10,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: colors.background,
  },
  nameText: {
    maxWidth: wp(40),
    color: colors.heading,
    fontFamily: Fonts.IBM_Regular,
  },
});
