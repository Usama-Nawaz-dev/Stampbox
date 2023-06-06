import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Text,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export const ExpandableView = ({ expanded = false, child }) => {
  const [height] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(height, {
      toValue: !expanded ? 130 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded, height]);

  // console.log('rerendered');

  return (
    <Animated.View style={{ height, width: wp(100), backgroundColor: "#fff" }}>
      {child}
    </Animated.View>
  );
};
