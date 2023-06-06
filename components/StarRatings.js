import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export const StarRatings = ({ size, rating, ratingStyle }) => {
  const stars = [...Array(5).keys()];
  return (
    <View style={{ flexDirection: "row" }}>
      {stars.map((item, index) => (
        <Image
          source={require("../assets/icons/star.png")}
          style={[
            {
              width: size ? size : 15,
              height: size ? size : 15,
              marginLeft: index == 0 ? null : wp(1),
              marginTop: 2,
              borderRadius: 30,
              tintColor: rating
                ? index >= rating
                  ? "grey"
                  : "orange"
                : "orange",
            },
            ratingStyle,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({});
