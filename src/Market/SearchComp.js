import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";

import colors from "../../constant/colors";
import SearchBar from "../../components/SearchBar";
import { images } from "../../assets/images/Images";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import ThemeContext from "../Context/ThemeContext";
// import { dark as theme } from "../../constant/colorsConfig";

export const SearchComp = (props) => {
  const { onTermChange, onTermSubmit, onFilter } = props;
  const { theme }= useContext(ThemeContext);
  return (
    <View style={styles.searchSection}>
      <SearchBar
        border={1}
        borderRadius={5}
        placeholder="Search"
        onTermChange={onTermChange}
        onTermSubmit={onTermSubmit}
      />
      <TouchableOpacity onPress={onFilter}>
        <Image source={images.Option} style={[styles.filterIcon, { tintColor: theme?.darkGrey}]}   />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(3),
    marginBottom: hp(1),
    marginTop: hp(1),
  },
  filterIcon: {
    width: hp(3),
    height: hp(3),
    tintColor: colors.btnText,
  },
});
