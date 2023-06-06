import { StyleSheet, Text, View } from "react-native";
import React from "react";
import FlipCard from "./FlipCard";

import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const Flip = (props) => {
  const { flip, Front, Back } = props;
  return (
    <View style={{ height: hp(12.5), width: "100%" }}>
      <FlipCard flip={flip} clickable={false}>
        {/* Front Side */}
        {Front}
        {/* Back Side */}
        {Back}
      </FlipCard>
    </View>
  );
};

export default Flip;
