import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import AppText from "./AppText";
import AntDesign from "react-native-vector-icons/AntDesign";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { indexOf } from "lodash";
import colors from "../constant/colors";
import ThemeContext from "../src/Context/ThemeContext";
// import { dark as theme } from "../constant/colorsConfig";

export default function SettingTitleCard({
  title,
  optionData,
  onPressOption,
  icon,
}) {
  const { theme } = useContext(ThemeContext);

  const OptionsCard = ({ onPress, option, borderwidth: paddingTop, icon }) => {
    return (
      // <TouchableOpacity onPress={onPress}>
      // <View >
      <TouchableOpacity
        onPress={onPress}
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
        <AppText style={styles.optionText}>{option}</AppText>
        {icon ? icon : <AntDesign name="right" size={20} color={ theme?.black} />}
      </TouchableOpacity>
      // </View>
    );
  };

  return (
    <View style={[styles.cardView, { backgroundColor: theme?.cardColor}]}>
      <AppText style={styles.titleText}>{title}</AppText>
      <View>
        {optionData
          ? optionData.map((item, index) => (
              <OptionsCard
                key={index}
                borderwidth={index === 0 ? 0 : 1}
                option={item.title}
                icon={icon}
                onPress={() => (onPressOption ? onPressOption(item) : null)}
              />
            ))
          : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardView: {
    width: wp(95),
    marginTop: 10,
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: colors.cWhite,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.22,
    shadowRadius: 1.84,
    alignSelf: "center",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  optionCardView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 15,
  },
});
