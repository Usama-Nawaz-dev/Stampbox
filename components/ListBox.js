import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { RadioBtn } from "./RadioButton/RadioBtn";
import AppText from "./AppText";
import colors from "../constant/colors";

const ListBox = ({ labels, headerColor, onPress, selected, style }) => {
  return (
    <View
      style={[
        {
          height: headerColor ? 40 : 60,
          width: "95%",
          backgroundColor: headerColor ? headerColor : colors.header,
          alignSelf: "center",
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: "row",
        },
        style,
      ]}
    >
      <View
        style={{
          height: 50,
          // backgroundColor: "grey",
          width: "20%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {labels.label1 ? (
          <AppText style={{ color: headerColor ? "#fff" : "#000" }}>
            {labels.label1}
          </AppText>
        ) : (
          <RadioBtn size={25} onPress={onPress} selected={selected} />
        )}
      </View>
      <View
        style={{
          height: 50,
          // backgroundColor: "grey",
          width: "39%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AppText style={{ color: headerColor ? "#fff" : "#000" }}>
          {labels.label2}
        </AppText>
      </View>
      <View
        style={{
          height: 50,
          // backgroundColor: "grey",
          width: "39%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AppText style={{ color: headerColor ? "#fff" : "#000" }}>
          {labels.label3}
        </AppText>
      </View>
    </View>
  );
};

export { ListBox };

const styles = StyleSheet.create({});
