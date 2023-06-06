import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import colors from "../../../../constant/colors";
import { MainHeader } from "../../../../components";
import SettingTitleCard from "../../../../components/SettingTitleCard";
import ThemeContext from "../../../Context/ThemeContext";

export const Visibility = (props) => {
  const { theme }= useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <MainHeader
        title={"Visibility"}
        onPressBack={() => props.navigation.goBack()}
      />
      <View>
        <SettingTitleCard
          title={"Visibility of your profile"}
          optionData={[
            { title: "Profile viewing option", key: 1 },
            { title: "Edit your public profile", key: 2 },
          ]}
          onPressOption={(item) => {
            if (item.key == 1) {
              props.navigation.navigate("ProfileOption");
            } else {
              props.navigation.navigate("EditProfile");
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
    backgroundColor: colors.white,
  },
});
