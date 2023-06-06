import React from "react";
import { StyleSheet, View } from "react-native";

import UserCard from "../UserCard";
import colors from "../../constant/colors";
import { CustomButton } from "../Buttons/CustomButton";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const RequestCard = (props) => {
  const { User, onPressBtn, btnTitle, showOther } = props;
  // console.log(User)
  return (
    <View style={styles.container}>
      <View>
        <UserCard
          User={User}
          imgSize={hp(6)}
          starSize={hp(1.6)}
          nameStyle={styles.nameStyle}
        />
      </View>
      {showOther ? (
        <CustomButton
          fontSize={12}
          width={wp(22)}
          label={btnTitle}
          height={hp(3.5)}
          fontWeight="500"
          onPress={onPressBtn}
          bg={colors.background}
          textColor={colors.lightTheme}
        />
      ) : (
        <CustomButton
          fontSize={12}
          width={wp(30)}
          fontWeight="500"
          height={hp(3.5)}
          label={btnTitle}
          onPress={onPressBtn}
          bg={colors.background}
          textColor={colors.lightTheme}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "94%",
    padding: 10,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameStyle: {
    fontSize: 13,
    maxWidth: wp(48),
    fontWeight: "600",
    marginBottom: hp(0.2),
  },
  btnSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  followText: {
    fontSize: 12,
    color: "#1E90FF",
    marginRight: 10,
    fontWeight: "500",
  },
});
