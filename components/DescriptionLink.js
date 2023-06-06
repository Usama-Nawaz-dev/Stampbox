import { Linking, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import Helper from "../src/Helper";
import colors from "../constant/colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Hyperlink from "react-native-hyperlink";
import { LinkPreview } from "@flyerhq/react-native-link-preview";
import ThemeContext from "../src/Context/ThemeContext";

const DescriptionLink = ({ content, style, media, theme }) => {
  // console.log("content", content);
  // let content = item?.feedable?.content;
  //   console.log("media", media);
  const firstChr = content?.charAt(0);
  // const { theme } = useContext(ThemeContext);
  const des_string =
    firstChr == "<" ? Helper.extarctStringFromHtml(content) : content;
  if (content) {
    if (media) {
      return (
        <Hyperlink
          onPress={(url) => {
            Linking.openURL(url);
          }}
          linkStyle={{ color: colors.lightTheme }}
        >
          <Text
            style={[styles.descriptionText, style, { color: theme.lightText }]}
          >
            {des_string}
          </Text>
        </Hyperlink>
      );
    } else {
      return (
        <LinkPreview
          renderText={(text) => {
            //   console.log(text);
            return (
              <Hyperlink
                onPress={(url) => {
                  Linking.openURL(url);
                }}
                linkStyle={{ color: colors.lightTheme }}
              >
                <Text style={{ color: theme.lightText }}>{text}</Text>
              </Hyperlink>
            );
          }}
          text={des_string}
        />
      );
    }
  } else {
    return <View style={{ height: 10 }} />;
  }
};

export { DescriptionLink };

const styles = StyleSheet.create({
  descriptionText: {
    marginVertical: 10,
    fontSize: 12,
    paddingHorizontal: wp(3),
    fontFamily: Fonts.Inter_Regular,
    color: colors.lightText,
  },
});
