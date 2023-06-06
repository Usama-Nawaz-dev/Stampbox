import { StyleSheet, Text, View, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React, { useContext } from "react";
import colors from "../constant/colors";
import ThemeContext from "../src/Context/ThemeContext";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const SearchBar = ({
  placeholder,
  onTermChange,
  onTermSubmit,
  border,
  borderRadius,
  top,
  height,
  otherIcon,
  filter,
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <View
      style={{
        height: height ? height : hp(5),
        marginTop: top !== undefined ? top : null,
        width: "90%",
        alignSelf: "center",
        backgroundColor: border !== undefined ? null : "#fff",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: border !== undefined ? border : null,
        borderRadius: borderRadius !== undefined ? borderRadius : 20,
        borderColor: border !== undefined ? colors.borderColor : null,
      }}
    >
      <Icon
        name="search"
        size={hp(2.5)}
        color={colors.theme}
        style={{ marginHorizontal: wp(2) }}
      />
      <TextInput
        onChangeText={onTermChange}
        onEndEditing={(event) => onTermSubmit(event.nativeEvent.text)}
        placeholder={placeholder}
        placeholderTextColor={theme?.darkGrey}
        color={theme?.black}
        style={{ height: "100%", width: "90%" }}
      />
      {otherIcon &&
        (!filter ? (
          <MaterialCommunityIcons
            name="camera-plus-outline"
            size={24}
            style={{ position: "absolute", right: 15 }}
          />
        ) : (
          <AntDesign
            name="filter"
            size={21}
            color="lightgrey"
            style={{
              position: "absolute",
              right: 10,
              transform: [{ rotateY: "180deg" }],
            }}
          />
        ))}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({});
