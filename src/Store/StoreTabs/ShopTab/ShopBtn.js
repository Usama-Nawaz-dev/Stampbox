import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { styles } from "./styles";
import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";
import ThemeContext from "../../../Context/ThemeContext";
// import { dark as theme } from "../../../../constant/colorsConfig";

const ShopBtn = ({ isSelected, setIsSelected }) => {
  const { theme }= useContext(ThemeContext);
  return (
    <View style={styles.switchSection}>
      <TouchableOpacity
        style={!isSelected ? styles.selectedTab : styles.defaultTab}
        onPress={() => setIsSelected(false)}
      >
        <AppText
          style={[styles.tabText, isSelected && { color: theme.lightText }]}
        >
          All Stamps
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity
        style={isSelected ? styles.selectedTab : styles.defaultTab}
        onPress={() => setIsSelected(true)}
      >
        <AppText
          style={[styles.tabText, !isSelected && { color: theme?.lightText }]}
        >
          All Supplies
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

export { ShopBtn };
