import {
  StyleSheet,
  Text,
  View,
  Padding,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { DonutChart } from "../../CustomPackages/react-native-circular-chart-main";
import colors from "../../constant/colors";


export const CircularPaths = ({data}) => {
  const { width, height } = useWindowDimensions();
  const PADDING = 0;

  // console.log("array", getDummyArray(4))
  return (
    // <View style={styles.sectionWrapper}>
    <DonutChart
      data={data}
      strokeWidth={3}
      radius={30}
      containerWidth={70}
      containerHeight={80}
      type="butt"
      startAngle={0}
      endAngle={360}
      animationType="slide"
    />
    // </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "lightgray",
    backgroundColor: "#ffffff",
    marginVertical: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
