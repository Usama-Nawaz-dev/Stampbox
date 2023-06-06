import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import * as Animatable from "react-native-animatable";
import InputButton from "./InputButton";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { heightPercentageToDP as hp} from "react-native-responsive-screen";

const NewDropDown = (props) => {
  const {
    height,
    width,
    Data,
    state,
    setState,
    visible,
    setVisible,
    placeHolder,
    style,
  } = props;
  const animate = () => {
    setVisible(false);
    setTimeout(() => {
      setVisible(true);
    }, 250);
  };
  return (
    <>
      <InputButton
        onPress={() => animate()}
        style={style}
        placeHolder={placeHolder}
        selected={state}
      />
      {visible && (
        <Animatable.View
          style={[
            styles.view,
            {
              position: "absolute",
              top: hp(25),
              zIndex: 1000,
              height: height,
              width: width,
            },
          ]}
        // {...prop}
        >
          {Data.map((item) => {
            return (
              <TouchableOpacity
              // ref={viewref}
                onPress={() => {
                  setState(item?.value ? item?.value : item);
                  setVisible(false);
                }}
              >
                <Text style={[styles.type, { margin: 10 }]}>
                  {item?.value ? item?.value : item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animatable.View>
      )}
    </>
  );
};

export default NewDropDown;

const styles = StyleSheet.create({
  view: {
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  type: {
    color: "#000",
    fontSize: 17,
  },
});
