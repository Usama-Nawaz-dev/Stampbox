import React, { useContext } from "react";
import { StyleSheet, View, Pressable } from "react-native";

import AppText from "../AppText";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { GradBtn } from "../GradBtn";
import Helper from "../../src/Helper";
import colors from "../../constant/colors";
import Fonts from "../../assets/fonts/Fonts";
import { ImageBackground } from "react-native";
import AuthContext from "../../src/Context/AuthContext";

export const InviteCard = (props) => {
  const { onAccept, Item, onPress } = props;
  const {
    myState: { language },
  } = useContext(AuthContext);

  return (
    <ImageBackground
      style={styles.bgImage}
      imageStyle={{ borderRadius: 10 }}
      source={{ uri: Item?.image_url }}
    >
      <Pressable style={styles.blurBackgorund} onPress={onPress}>
        <AppText style={styles.heading} numberOfLines={1}>
          {Item ? Helper.capitalizeFirstLetter(Item?.name) : "Fletcher Mercado"}
        </AppText>
        <View style={styles.groupSection}>
          <AppText style={styles.text}>
            {Item?.privacy_type == "Public" ? language?.publicGroup :language?.privateGroup}
          </AppText>
        </View>
        <AppText style={styles.text} numberOfLines={4}>
          {Item?.description}{" "}
        </AppText>
      </Pressable>
      <GradBtn
        height={28}
        fontSize={12}
        fontWeight={"500"}
        onPress={onAccept}
        style={styles.button}
        label={language?.acceptRequest}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    height: 170,
    width: wp(80),
    borderRadius: 10,
    marginRight: wp(2),
  },
  heading: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.cWhite,
  },
  groupSection: {
    width: "85%",
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: colors.cWhite,
  },
  text: {
    marginTop: 3,
    color: colors.cWhite,
  },
  blurBackgorund: {
    height: 170,
    width: wp(80),
    padding: wp(2),
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0, 0.3)",
  },
  button: {
    width: wp(30),
    bottom: wp(2),
    left: wp(2),
    position: "absolute",
    alignSelf: "flex-start",
  },
});
