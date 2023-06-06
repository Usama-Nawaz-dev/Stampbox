import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { MainHeader } from "../../../../components";
import colors from "../../../../constant/colors";
import SettingTitleCard from "../../../../components/SettingTitleCard";
import ThemeContext from "../../../Context/ThemeContext";

export const Notifications = (props) => {
  const { theme }= useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <MainHeader
        title={"Notifications"}
        onPressBack={() => props.navigation.goBack()}
      />
      <View>
        <SettingTitleCard
          title={"Manage Notifications"}
          optionData={[
            { title: "On StampBox", key: 1 },
            { title: "Notifications Source", key: 2 },
          ]}
          onPressOption={(item) => {
            if (item.key == 1) {
              props.navigation.navigate("OnStampbox");
            } else if (item.key == 2) {
              props.navigation.navigate("NotifiSource");
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: colors.white,
  },
});
