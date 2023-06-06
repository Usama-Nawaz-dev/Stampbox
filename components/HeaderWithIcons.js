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

import Icon from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";

import { Svg, Path } from "react-native-svg";
import colors from "../constant/colors";
import { coin } from "../constant/Paths";

import IconContainer from "./IconContainer";
import SearchBar from "./SearchBar";
import { images } from "../assets/images/Images";

const HeaderWithIcons = (props) => {
  const {
    title,
    label,
    onPressMenu,
    search,
    single,
    onPressCart,
    backIcon,
    rightIconPress,
    filter,
    placeholder,
    rightIcon,
  } = props;
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
          justifyContent: "space-between",
        }}
      >
        <Pressable
          onPress={onPressMenu}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          {backIcon ? (
            <Icon
              name="arrow-back-sharp"
              size={30}
              style={{ marginHorizontal: 10 }}
            />
          ) : (
            <Icon
              name="menu"
              size={28}
              color="#fff"
              style={{ marginHorizontal: 10 }}
            />
          )}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "500",
              fontFamily: "Roboto-Regular",
              color: "#fff",
            }}
          >
            {title}
          </Text>
        </Pressable>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 10,
            width: single ? "15%" : "35%",
            // backgroundColor: "grey",
            justifyContent: single ? "center" : "space-around",
          }}
        >
          {!single ? (
            <>
              {!search && (
                <Icon name="search-outline" size={24} color={colors.theme} />
              )}
              <IconContainer
                icon={
                  <Image
                    source={coin}
                    style={{ height: 26, width: 26 }}
                    resizeMode="contain"
                  />
                }
                counter={2}
              />
              <IconContainer
                onPress={onPressCart}
                icon={<Icon name="cart-outline" size={24} />}
                counter={0}
              />
            </>
          ) : backIcon ? (
            <Pressable onPress={rightIconPress}>
              <Entypo name="dots-three-vertical" size={22} />
            </Pressable>
          ) : (
            <>{rightIcon()}</>
          )}
        </View>
      </View>
      {search && (
        <View style={{ height: 50, width: "100%", justifyContent: "center" }}>
          <SearchBar
            onTermChange={(text) => {
              // console.log("text->", text);
              //   searchData(text);
            }}
            onTermSubmit={(text) => {
              // console.log("text->", text);
              //   searchData(text);
            }}
            placeholder={placeholder ? placeholder : "Search"}
            borderRadius={10}
            otherIcon={!backIcon}
            filter={filter}
          />
        </View>
      )}
    </ImageBackground>
  );
};

export default HeaderWithIcons;

const styles = StyleSheet.create({});
