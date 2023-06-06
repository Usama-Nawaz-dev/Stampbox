import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Animated,
  Pressable,
  Button,
} from "react-native";
import colors from "../../constant/colors";

const TestScreen = () => {
  const [value, setValue] = useState("");
  const [focus, setFocus] = useState(false);
  const moveText = useRef(new Animated.Value(0)).current;
  const textInputReference = useRef(null);

  // useEffect(() => {
  //   if (value !== "") {
  //       moveTextTop();
  //   } else if (value === "") {
  //       moveTextBottom();
  //   }
  // }, [value])

  const onChangeText = (text: string) => {
    setValue(text);
  };

  const onFocusHandler = () => {
    // if (value !== "") {
    //   moveTextTop();
    // }
    // setFocus(true);
    moveTextTop();
  };

  const onBlurHandler = () => {
    // setFocus(false);
    if (value === "") {
      moveTextBottom();
    }
  };

  const moveTextTop = () => {
    Animated.timing(moveText, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const moveTextBottom = () => {
    Animated.timing(moveText, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const yVal = moveText.interpolate({
    inputRange: [0, 1],
    outputRange: [4, -20],
  });

  const animStyle = {
    transform: [
      {
        translateY: yVal,
      },
      {
        translateX: yVal,
      },
    ],
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.inputContainer}>
        <Animated.View style={[styles.animatedStyle, animStyle]}>
          <Text
            style={[styles.label, { color: focus ? colors.theme : "grey" }]}
          >
            Enter Your Name
          </Text>
        </Animated.View>
        <TextInput
          autoCapitalize={"none"}
          style={[
            styles.input,
            { borderBottomColor: focus ? colors.theme : "gray" },
          ]}
          value={value}
          ref={textInputReference}
          onChangeText={(text: string) => onChangeText(text)}
          editable={true}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          blurOnSubmit
        />
      </View>
      {/* <Button title="onBlur" onPress={onBlurHandler} /> */}
    </View>
  );
};
export default TestScreen;

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
    marginTop: 20,
    // backgroundColor: "#fff",
    paddingTop: 5,
    paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: "#bdbdbd",
    // borderRadius: 2,
    width: "90%",
    alignSelf: "center",
  },
  icon: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    fontSize: 13,
    height: 35,
    color: "#000",
    borderBottomWidth: 1,
  },
  label: {
    // color: "grey",
    fontSize: 10,
  },
  animatedStyle: {
    top: 5,
    left: 15,
    position: "absolute",
    borderRadius: 90,
    zIndex: 10000,
  },
});