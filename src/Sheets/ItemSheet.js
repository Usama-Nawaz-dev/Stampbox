import React, { useContext } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import colors from "../../constant/colors";
import Fonts from "../../assets/fonts/Fonts";
import ThemeContext from "../Context/ThemeContext";
export const ItemSheet = ({ Data, onPress, setItem }) => {
  const { theme } = useContext(ThemeContext);

  const renderItem = ({ item, index }) => {
    // console.log("statusData----->", check)
    return (
      <TouchableOpacity
        style={styles.section}
        onPress={() => onPress(item, index)}
      >
        <Text style={[styles.text, { color: theme?.darkGrey }]}>
          {item?.name ? item?.name : item}{" "}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={Data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
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
  section: {
    borderBottomWidth: 0.5,
    borderColor: colors.borderColor,
  },
  text: {
    fontSize: 14,
    marginVertical: 10,
    color: colors.btnText,
    fontFamily: Fonts.Roboto_Regular,
  },
});
