import { StyleSheet, Text, View } from "react-native";
import React, { forwardRef } from "react";
import CustomDropDown from "../../../components/CustomDropDown";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const BiPicker = (props) => {
  let {
    value,
    value2,
    data,
    data2,
    label,
    label2,
    onChange,
    onChange2,
    height,
    height2,
    width,
    width2,
    position,
    position2,
  } = props;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%",
        alignSelf: "center",
      }}
    >
      <CustomDropDown
        data={data}
        value={value}
        label={label}
        fontSize={13}
        left={5}
        width={width ? width : wp(40)}
        style={{ width: "45%" }}
        position={position ? position : -5}
        height={height ? height : hp(25)}
        onChangeText={(value) => {
          onChange(value);
        }}
      />
      {data2 ? (
        <CustomDropDown
          data={data2}
          width={width2 ? width2 : wp(40)}
          left={55}
          style={{ width: "45%" }}
          fontSize={13}
          value={value2}
          label={label2}
          height={height2 ? height2 : hp(25)}
          position={position2 ? position2 : -5}
          onChangeText={(value) => {
            onChange2(value)
            // setCondition(value);
          }}
        />
      ) : null}
    </View>
  );
};

export default BiPicker;
