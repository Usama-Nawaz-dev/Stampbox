import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import colors from "../constant/colors";
import { ActivityIndicator } from "react-native";

const PostInput = (props) => {
  const {
    post: { message, setMessage, post_api },
    placeholder,
    loading,
  } = props;
  // const { post, placeholder } = props;
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef();
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      onKeyboardDidShow
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      onKeyboardDidHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onKeyboardDidShow = (e) => {
    // console.log('e.endCoordinates.height', e.endCoordinates.height)
    setKeyboardHeight(e.endCoordinates.height + 2);
  };

  const onKeyboardDidHide = () => {
    setKeyboardHeight(0);
  };
  return (
    <View
      style={{
        alignSelf: "center",
        flexDirection: "row",
        position: "absolute",
        alignItems: "flex-end",
        bottom: 0,
        left: wp(4),
        borderRadius: 5,
        backgroundColor: colors.white,
        marginBottom: keyboardHeight ? keyboardHeight : undefined,
      }}
    >
      <View
        style={{
          width: wp(85),
          borderRadius: 5,
          minHeight: hp(5),
          backgroundColor: colors.color2,
          marginBottom: keyboardHeight ? hp(1) : hp(2),
        }}
      >
        <TextInput
          // value={message}
          ref={inputRef}
          multiline={true}
          maxLength={700}
          style={styles.input}
          placeholder={placeholder ? placeholder : "Write here..."}
          onChangeText={(val) => {
            // console.log("val", val);
            setMessage(val);
          }}
        />
      </View>
      {loading ? (
        <View style={[styles.inputIcon, { bottom: keyboardHeight ? 5 : 15 }]}>
          <ActivityIndicator size="small" color={colors.lightTheme} />
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.inputIcon, { bottom: keyboardHeight ? 5 : 15 }]}
          onPress={() => {
            inputRef?.current?.clear();
            post_api();
          }}
        >
          <FontAwesome name="send" size={hp(3)} color={colors.theme} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export { PostInput };

const styles = StyleSheet.create({
  input: {
    padding: 8,
    top: 8,
    // width: "88%",
    fontSize: 12,
  },
  inputIcon: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "transparent"
    // bottom: 5,
    // backgroundColor: colors.theme,
    // borderRadius: 30,
  },
});
