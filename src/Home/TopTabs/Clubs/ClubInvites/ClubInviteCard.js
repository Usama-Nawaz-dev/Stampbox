import React, { useContext } from "react";
import { StyleSheet, View, Image, Pressable } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Helper from "../../../../Helper";
import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";
import { CustomButton, GradBtn } from "../../../../../components";
import AuthContext from "../../../../Context/AuthContext";

export const ClubInviteCard = (props) => {
  const { onAccept, onDecline, Item, onPress } = props;
  const {
    myState: { language },
  } = useContext(AuthContext);

  return (
    <View style={styles.card}>
      <Pressable style={styles.imgSection} onPress={onPress}>
        <Image
          style={styles.stampImg}
          source={{
            uri: Item?.image_url
              ? Item?.image_url
              : "https://picsum.photos/600/600",
          }}
        />
        <View style={{ marginLeft: wp(3) }}>
          <AppText style={styles.heading} numberOfLines={1}>
            {Item ? Helper.capitalizeFirstLetter(Item?.name) : "Default Name"}
          </AppText>
          <View style={styles.groupSection}>
            <AppText style={styles.text}>
              {Item?.privacy_type == "Public"
                ? language?.publicGroup
                :language?.privateGroup}
            </AppText>
          </View>
          <AppText style={styles.text} numberOfLines={2}>
            {Item?.description ? Item?.description : "N/A"}
          </AppText>
        </View>
      </Pressable>
      <View style={styles.btnSection}>
        <GradBtn
          height={32}
          fontSize={12}
          fontWeight={"500"}
          onPress={onAccept}
          style={styles.button}
          label={language?.acceptRequest}
        />
        <CustomButton
          bg={colors.background}
          label={language?.declineRequest}
          textColor={colors.btnText}
          width={wp(35)}
          height={32}
          fontSize={12}
          onPress={onDecline}
          fontWeight={"500"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: wp(92),
    padding: wp(3),
    borderRadius: 7,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    shadowOffset: { width: 0, height: 0 },
    backgroundColor: colors.cWhite,
    marginTop: hp(1),
  },
  imgSection: {
    flexDirection: "row",
  },
  stampImg: {
    width: 65,
    height: 65,
    borderRadius: 5,
  },
  heading: {
    fontSize: 16,
    maxWidth: wp(65),
    fontWeight: "500",
    color: colors.heading,
  },
  text: {
    maxWidth: wp(65),
    color: colors.lightText,
  },
  btnSection: {
    marginTop: hp(1),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  groupSection: {
    width: wp(60),
    marginBottom: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: colors.borderColor,
  },
  button: {
    width: wp(35),
    marginTop: 0,
  },
});
