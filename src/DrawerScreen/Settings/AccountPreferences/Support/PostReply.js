import { Text, View } from "react-native";
import React from "react";
import { User } from "./User";
import FastImage from "react-native-fast-image";
import { images } from "../../../../../assets/images/Images";
import { FloatingInput } from "../../../../../components";
import Btn from "../../../../../components/Btn";

export const PostReply = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "90%",
        left: 13,
        // height: 60,
        // backgroundColor: "lightgrey",
      }}
    >
      <FastImage
        source={images.Profile}
        style={{
          height: 35,
          width: 35,
          borderRadius: 20,
        }}
      />
      <View style={{ width: "85%", bottom: 10 }}>
        <FloatingInput
          label={"Write a reply"}
          //   value={address?.city?.toString()}
          marginTop={5}
          onChangeText={(text) => console.log("text", text)}
        />
      </View>
    </View>
  );
};
