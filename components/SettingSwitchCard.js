import React, { useContext } from "react";
import { StyleSheet, Switch, View } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from "./AppText";
import colors from "../constant/colors";
import CustomDropDown from "./CustomDropDown";
import ThemeContext from "../src/Context/ThemeContext";

export default function SettingSwitchCard(props) {
  const {
    option,
    isEnabled,
    showOption,
    optionValue,
    onValueChange,
    borderwidth: paddingTop,
  } = props;

  const { theme } = useContext(ThemeContext);

  const titleChecker = (title) => {
    if (title === "interested-categories") {
      return "Interested in categories";
    } else if (title === "interested-topics") {
      return "Interested in topics";
    } else if (title === "interested-countries") {
      return "Interested in countries";
    } else if (title === "wishlist-item") {
      return "Wishlist items notifications";
    } else if (title === "lock-screen") {
      return "Lock screen messages";
    } else if (title === "user-connections") {
      return "User connections notifications";
    } else if (title === "flag-items-updates") {
      return "Flag items updates";
    } else if (title === "club-journal-updates") {
      return "Club journal updates";
    } else if (title === "following-post-updates") {
      return "Following post updates";
    } else if (title === "followed-topic-updates") {
      return "Followed topic updates";
    } else {
      const val = title.replace(/-/g, " ");
      return Helper.capitalizeFirstLetter(val);
    }
  };

  return (
    <View
      style={[
        styles.optionCardView,
        {
          paddingBottom: 5,
          borderTopWidth: paddingTop,
          paddingTop: paddingTop ? 7 : 0,
          borderColor: colors.borderColor,
        },
      ]}
    >
      <AppText style={styles.optionText}>{titleChecker(option)}</AppText>
      {!showOption ? (
        <>
          <Switch
            trackColor={{ false: "#767577", true: `${colors.theme}50` }}
            thumbColor={isEnabled ? colors.theme : "#f4f3f4"}
            onValueChange={() => onValueChange(false)}
            ios_backgroundColor="lightgrey"
            value={isEnabled}
          />
        </>
      ) : (
        <CustomDropDown
          left={wp(18)}
          position={-3}
          width={wp(20)}
          value={optionValue}
          onChangeText={(val) => onValueChange(val)}
          data={[{ value: "daily" }, { value: "weekly" }]}
          style={{ width: wp(20), borderBottomWidth: 0, top: -hp(0.8) }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  optionCardView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: {
    marginTop: hp(1.3),
    marginBottom: hp(1.3),
    fontSize: 14,
  },
});
