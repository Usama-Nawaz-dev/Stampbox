import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React from "react";

import { Svg, Path } from "react-native-svg";
import colors from "../constant/colors";
import { coin } from "../constant/Paths";

import IconContainer from "./IconContainer";
import SearchBar from "./SearchBar";

import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MenuSheet } from "./MenuSheet";
import { images } from "../assets/images/Images";

const CustomHeader = (props) => {
  const {
    title,
    onPressBack,
    search,
    onPressAdd,
    addStamp,
    addMedia,
    options,
    action1,
    action2,
    simpleIcon,
    onPress,
    hide
  } = props;
  const myIcon = (
    <Entypo
      name="dots-three-vertical"
      color="#fff"
      size={21}
      style={{ right: 10 }}
    />
  );
  return (
    <ImageBackground
      source={images.Header}
      style={{
        height: search ? 120 : 60,
        width: "100%",
        // backgroundColor: "#dbd6ca",
        justifyContent: "space-around",
        // marginHorizontal: 10
      }}
    >
      <View
        style={{
          flexDirection: "row",
          // backgroundColor: "grey",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={onPressBack}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          {/* <Feather name="arrow-left" size={20} color="#000" /> */}
          <Image
            source={images.ArrowLeft}
            resizeMode="contain"
            style={{ height: 18, width: 8 }}
          />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              fontFamily: "Roboto-Regular",
              marginLeft: hp(2.5),
              color: "#fff",
            }}
          >
            {title}
          </Text>
        </Pressable>
        {!hide ? (
          <>
            {simpleIcon ? (
              <TouchableOpacity onPress={onPress}>{myIcon}</TouchableOpacity>
            ) : (
              <MenuSheet
                customButton={myIcon}
                // destructiveIndex={1}
                options={options}
                actions={[addStamp, addMedia]}
              />
            )}
          </>
        ) : null}
      </View>
    </ImageBackground>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({});
