import React, { useContext } from "react";
import { Text, View, Image, Switch, FlatList, StyleSheet } from "react-native";

import colors from "../../constant/colors";
import Fonts from "../../assets/fonts/Fonts";

import CheckBox from "@react-native-community/checkbox";
import ThemeContext from "../Context/ThemeContext";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export const SelectionSheet = (props) => {
  const { onSelectAll, Data, onValueChange, showImage, isEnabled } = props;

  const { theme } = useContext(ThemeContext);

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          borderBottomWidth: 0.5,
          borderColor: colors.borderColor,
        }}
      >
        <View style={styles.itemSection}>
          <CheckBox
            boxType="square"
            value={item.isSelected}
            onTintColor={colors.lightTheme}
            onCheckColor={colors.lightTheme}
            onValueChange={() => {
              onValueChange(item.isSelected, index);
            }}
          />
          {showImage && (
            <Image
              style={styles.image}
              source={{ uri: item.image_url }}
              resizeMode="contain"
            />
          )}
          {item?.name ? (
            <Text style={styles.text}>{item.name}</Text>
          ) : (
            <Text style={[styles.text, { color: theme?.darkGrey }]}>
              {item.key}
            </Text>
          )}
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {onSelectAll ? (
        <View style={styles.checkSection}>
          <Switch
            trackColor={{ false: "#767577", true: `${colors.theme}50` }}
            thumbColor={isEnabled ? colors.theme : "#f4f3f4"}
            onValueChange={() => onSelectAll(!isEnabled)}
            ios_backgroundColor="lightgrey"
            value={isEnabled}
          />
          <Text style={styles.valText}>Select All</Text>
        </View>
      ) : null}
      <FlatList
        data={Data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "90%",
    alignSelf: "center",
  },
  itemSection: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 30,
    height: 30,
    marginLeft: 15,
    borderRadius: 5,
  },
  text: {
    fontSize: 14,
    color: colors.btnText,
    fontFamily: Fonts.Roboto_Medium,
    marginLeft: 15,
  },
  checkSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1),
  },
  valText: {
    fontWeight: "500",
    paddingLeft: wp(3),
    color: colors.lightBlack,
    fontFamily: Fonts.IBM_Regular,
  },
});
