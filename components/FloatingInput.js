import React, { Component, useContext } from "react";
import {
  View,
  TextInput,
  Animated,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import Fonts from "../assets/fonts/Fonts";

import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import colors from "../constant/colors";
import ThemeContext from "../src/Context/ThemeContext";

export class FloatingInput extends Component {
  state = {
    isFocused: false,
  };
  static contextType = ThemeContext;

  componentWillMount() {
    // console.log(`current val---->${this.props.label}`, this.props.value)
    this._animatedIsFocused = new Animated.Value(
      this.props.value === "" ||
      this.props.value === undefined ||
      this.props.value === null
        ? 0
        : 1
    );
  }

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue:
        this.state.isFocused ||
        (this.props.value !== "" &&
          this.props.value !== undefined &&
          this.props.value !== null)
          ? 1
          : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  render() {
    const {
      label,
      marginTop,
      error,
      togglePass,
      width,
      pass,
      showPass,
      style,
      ...props
    } = this.props;
    const { theme } = this.context;
    const labelStyle = {
      position: "absolute",
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 12],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [
          theme.dovGray,
          this.state.isFocused ? theme.theme : theme.dovGray,
        ],
      }),
    };
    return (
      <View>
        <View
          style={[
            {
              paddingTop: 16,
              width: width ? width : "100%",
              alignSelf: "center",
              marginTop: marginTop ? marginTop : 15,
            },
            style,
          ]}
        >
          <Animated.Text style={labelStyle}>{label}</Animated.Text>
          <TextInput
            {...props}
            returnKeyType={
              props?.keyboardType == "numeric" ? "done" : undefined
            }
            style={[
              styles.input,
              {
                borderBottomColor: this.state.isFocused
                  ? theme.theme
                  : theme.lightGrey,
                color: theme.davyGrey,
              },
            ]}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            blurOnSubmit
          />
          {pass && (
            <TouchableOpacity style={styles.eye} onPress={togglePass}>
              <Feather
                name={showPass ? "eye-off" : "eye"}
                size={18}
                color={theme.davyGrey}
              />
            </TouchableOpacity>
          )}
        </View>
        {error && (
          <View style={styles.error}>
            <AntDesign name="infocirlce" color={theme.red} size={12} />
            <Text style={[styles.errorText, { color: theme.red }]}>
              {error}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 30,
    fontSize: 14,
    fontFamily: Fonts.IBM_Regular,
    borderBottomWidth: 1,
  },
  error: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  errorText: {
    fontSize: 12,
    marginLeft: 5,
    fontFamily: Fonts.IBM_Regular,
  },
  eye: {
    position: "absolute",
    alignSelf: "flex-end",
    bottom: 10,
    right: 10,
  },
});
