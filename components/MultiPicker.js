import React, { useState, useContext } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

import { Dropdown } from "react-native-material-dropdown";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
  languages,
  countries,
  genderData,
  stampItemStatuses,
  stampCatalogNumberTypes,
} from "../constant/staticData";

import AppText from "./AppText";
import colors from "../constant/colors";
import Fonts from "../assets/fonts/Fonts";
import ThemeContext from "../src/Context/ThemeContext";

export const MultiPicker = (props) => {
  const {
    inp1, inp2, place1, place2,
    label, pickerLabel, onChangeText, icon,
    star, value, value2, setValue, onChangeValue, onPress, year
  } = props

  const { theme, mode } = useContext(ThemeContext);

  return (
    <View style={{ marginTop: 10 }}>
      <AppText style={[styles.label, { color: theme.dovGray }]}>{label}</AppText>
      <View style={[styles.mult, { borderColor: theme.lightGrey }]}>
        <View style={{ flex: 0.5, borderRightWidth: 1, borderColor: theme.lightGrey }}>
          <View style={{ height: 25, justifyContent: "center" }}>
            {inp1 ? (
              <TextInput
                placeholder={place1}
                value={value}
                placeholderTextColor={theme.lightGrey}
                keyboardType={"number-pad"}
                returnKeyType='done'
                onChangeText={(val) => setValue(val)}
                style={{ textAlign: "center", fontFamily: 'Roboto-Regular', color: theme.davyGrey }}
              />
            ) : (
              <View
                style={{
                  height: 30,
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <View style={{ flex: 1 }}>
                  {/* <Text style={{}}>{pickerLabel}</Text> */}
                  <Dropdown
                    inputContainerStyle={{
                      borderBottomColor: "transparent",
                    }}
                    onChangeText={(value) => onChangeText(value)}
                    value={value2}
                    pickerStyle={{
                      width: "40%",
                      height: 240,
                      left: wp(6),
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 3,
                      },
                      shadowOpacity: 0.27,
                      shadowRadius: 4.65,
                      elevation: 6,
                    }}
                    fontSize={14}
                    textColor={theme.davyGrey}
                    baseColor={theme.dovGray}
                    selectedItemColor={colors.lightBlack}
                    fontFamily={Fonts.Roboto_Regular}
                    dropdownPosition={-5}
                    dropdownOffset={{ top: 15 }}
                    label={pickerLabel}
                    data={stampCatalogNumberTypes}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
        <View style={{ flex: 0.5 }}>
          <View style={{ height: 35, justifyContent: "center" }}>
            {inp2 ? (
              <TextInput
                placeholder={place2}
                value={value}
                placeholderTextColor={theme.lightGrey}
                onChangeText={onChangeValue ? onChangeValue : (val) => setValue(val)}
                keyboardType={"number-pad"}
                returnKeyType='done'
                style={{ textAlign: "center", fontFamily: 'Roboto-Regular', color: theme.davyGrey }}
              />
            ) : (
              <TouchableOpacity
                onPress={onPress}
                style={{
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              >
                <AppText style={{ color: year ? theme.davyGrey : theme.lightGrey }}>
                  {year ? year : "Select Year"}
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mult: {
    width: "100%",
    height: 40,
    borderBottomWidth: 1,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontFamily: Fonts.Roboto_Regular
  }
});
