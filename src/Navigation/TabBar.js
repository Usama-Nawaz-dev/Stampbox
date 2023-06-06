import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";

import colors from "../../constant/colors";
import { Svg, Path } from "react-native-svg";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Fonts from "../../assets/fonts/Fonts";

function TabBar(props) {
  console.log("props-->", props);
  const { state, descriptors, navigation, theme, mode, showTabs } = props;
  return (
    <>
      <View
        style={{
          height: hp(7),
          paddingBottom: hp(3),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          backgroundColor: theme.white,
          // backgroundColor: "red",
        }}
      >
        <View
          style={{
            left: 0,
            right: 0,
            bottom: 10,
            width: wp(100),
            height: hp(8.5),
            position: "absolute",
          }}
        >
          <Svg>
            <Path
              // strokeWidth={2.5}
              strokeWidth={0}
              stroke={colors.red}
              d="M800,0V90H0V0H.54c0,2,2.24,3.54,5,3.54h0c2.78,0,5-1.54,5-3.54H12c0,2,2.22,3.54,5,3.54h0C19.78,3.54,22,2,22,0h1.36c0,2,2.26,3.54,5,3.54h0C31.22,3.54,33.46,2,33.46,0h1.38c0,2,2.24,3.54,5,3.54s5-1.54,5-3.54h1.38c0,2,2.24,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.38c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54H92c0,2,2.26,3.54,5,3.54S102,2,102,0h1.36c0,2,2.26,3.54,5,3.54S113.48,2,113.5,0h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.38c0,2,2.24,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54h0c2.78,0,5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54h0c2.8,0,5-1.54,5.06-3.54h1.36c0,2,2.24,3.54,5,3.54h0c2.8,0,5-1.54,5-3.54H172c0,2,2.24,3.54,5,3.54h0c2.82,0,5-1.54,5-3.54h1.38c0,2,2.24,3.54,5,3.54S193.52,2,193.52,0h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.38c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54H252c0,2,2.24,3.54,5,3.54S262.12,2,262.12,0h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54S285,2,285,0h1.36c0,2,2.24,3.54,5,3.54h0c2.78,0,5-1.59,5-3.54h1.38c0,2,2.24,3.54,5,3.54h0c2.78,0,5-1.59,5-3.54h1.36c0,2,2.26,3.54,5,3.54h0c2.78,0,5-1.59,5-3.54h1.36c0,2,2.24,3.54,5,3.54h0c2.78,0,5-1.59,5-3.54h1.4c0,2,2.24,3.54,5,3.54S342.14,2,342.14,0h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54S365,2,365,0h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.38c0,2,2.24,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.38c0,2,2.24,3.54,5,3.54s5-1.54,5-3.54H435c0,2,2.26,3.54,5,3.54h0c2.78,0,5-1.59,5-3.54h1.36c0,2,2.24,3.54,5,3.54h0c2.78,0,5-1.59,5-3.54h1.36c0,2,2.24,3.54,5,3.54h0C465.66,3.54,468,2,468,0h1.4c0,2,2.22,3.54,5,3.54S479.34,2,479.34,0h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.38c0,2,2.24,3.54,5,3.54s5-1.54,5-3.54H515c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54S548,2,548,0h1.38c0,2,2.24,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.24,3.54,5,3.54h0c2.8,0,5-1.54,5.06-3.54h1.36c0,2,2.24,3.54,5,3.54h0c2.76,0,5-1.59,5-3.54H595c0,2,2.24,3.54,5,3.54h0c2.78,0,5-1.59,5-3.54h1.36c0,2,2.26,3.54,5,3.54h0c2.78,0,5-1.59,5-3.54H618c0,2,2.24,3.54,5,3.54S628,2,628,0h1.38c0,2,2.24,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.38c0,2,2.24,3.54,5,3.54s5-1.54,5-3.54h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54H698c0,2,2.26,3.54,5,3.54S708,2,708,0h1.36c0,2,2.26,3.54,5,3.54s5-1.54,5-3.54h1.38c0,2,2.24,3.54,5,3.54h0c2.78,0,5-1.59,5-3.54h1.36c0,2,2.26,3.54,5,3.54h0c2.72,0,5-1.54,5-3.54h1.36c0,2,2.24,3.54,5,3.54h0c2.78,0,5-1.59,5-3.54h1.38c0,2,2.24,3.54,5,3.54h0c2.78,0,5-1.59,5-3.54h1.38c0,2,2.24,3.54,5,3.54S776.6,2,776.6,0H778c0,2,2.26,3.54,5,3.54S788,2,788,0h1.36c0,2,2.26,3.54,5,3.54S799.46,2,799.46,0Z"
              fill={theme.white}
              // fill="#dbd6ca"
            />
          </Svg>
        </View>

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const { light, dark, action, img } = options;

          const isFocused = state.index === index;

          const onPress = () => {
            action();
            if (route.name !== "Notify") {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={{ alignItems: "center" }}
            >
              <FastImage
                source={img}
                style={{
                  width: hp(3),
                  height: hp(3),
                  resizeMode: "contain",
                  marginBottom: hp(0.5),
                }}
                tintColor={isFocused ? theme.black : theme.dovGray}
              />
              <Text
                style={{
                  fontSize: hp(1.6),
                  fontFamily: Fonts.IBM_Regular,
                  fontWeight: isFocused ? "500" : "400",
                  color: isFocused ? theme.black : theme.dovGray,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

export { TabBar };
