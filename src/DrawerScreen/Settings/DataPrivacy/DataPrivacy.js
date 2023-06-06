import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { MainHeader } from "../../../../components";
import colors from "../../../../constant/colors";
import SettingTitleCard from "../../../../components/SettingTitleCard";
import Helper from "../../../Helper";
import ThemeContext from "../../../Context/ThemeContext";

export const DataPrivacy = (props) => {
  const { theme }= useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <MainHeader
        title={"Data Privacy"}
        onPressBack={() => props.navigation.goBack()}
      />
      <View>
        <SettingTitleCard
          title={"How StampBox use your data"}
          optionData={[
            { title: "Manage your data & activity", key: 1 },
            { title: "Search history", key: 2 },
            { title: "Stats", key: 3 },
          ]}
          onPressOption={(item) => {
            Helper.showToastMessage("Comming soon");
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
