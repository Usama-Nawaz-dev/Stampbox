import React, { useContext } from "react";
import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Pressable,
} from "react-native";
import FastImage from "react-native-fast-image";

import colors from "../../../constant/colors";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { styles } from "./styles";
import { images } from "../../../assets/images/Images";

import AppText from "../../AppText";
import ThemeContext from "../../../src/Context/ThemeContext";

export const AppHeader = (props) => {
  const {
    title,
    onPressMenu,
    placeholder,
    onChangeValue,
    onPressCart,
    cartLength,
    onPressWallet,
    coins,
    search,
  } = props;

  const { theme, mood } = useContext(ThemeContext);
  const convert_coins = () => {
    if (coins >= 1000) {
      let val = coins / 1000;
      // console.log('val', val.toFixed(1))
      return `${val?.toFixed(1)}k`;
    } else {
      return coins?.toFixed(0);
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.iridium }]}>
      <ImageBackground style={styles.bgImage} source={images.Header}>
        <View style={styles.topSection}>
          <View style={styles.titleSection}>
            <TouchableOpacity onPress={onPressMenu}>
              <FastImage
                resizeMode="contain"
                source={images.Menu}
                style={styles.iconStyle}
                tintColor={colors.cWhite}
              />
            </TouchableOpacity>
            <AppText style={styles.titleText}>{title}</AppText>
          </View>
          <View style={styles.rightSection}>
            {search ? (
              <EvilIcons
                onPress={search}
                style={{ marginRight: 20 }}
                name="search"
                color="rgba(252,256,256,0.7)"
                size={33}
              />
            ) : null}
            {/* <Pressable style={styles.locationSection}>
              <Ionicons
                name="location-sharp"
                color={colors.disable}
                size={12}
              />
              <AppText style={styles.locationText}>London</AppText>
              <Ionicons
                name="caret-down-outline"
                color={colors.disable}
                size={12}
              />
            </Pressable> */}
            <TouchableOpacity
              onPress={onPressWallet}
              style={{ marginRight: wp(7) }}
            >
              <View style={styles.counterSection}>
                <AppText
                  style={[styles.counterText, { fontSize: coins ? 7 : 9 }]}
                >
                  {convert_coins()}
                </AppText>
              </View>
              <FastImage
                resizeMode="contain"
                source={images.Coins}
                style={styles.iconStyle}
                tintColor={colors.cWhite}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressCart}>
              <View style={styles.counterSection}>
                <AppText style={styles.counterText}>{cartLength}</AppText>
              </View>
              <FastImage
                resizeMode="contain"
                source={images.Cart}
                style={styles.iconStyle}
                tintColor={colors.cWhite}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      {/* <View style={styles.searchContainer}>
                <View style={styles.searchSection}>
                    <FastImage source={images.Search} style={{ width: 17, height: 17 }} />
                    <TextInput
                        onChangeText={onChangeValue}
                        placeholder="Search here…"
                        // onEndEditing={(event) => onTermSubmit(event.nativeEvent.text)}
                        style={styles.input}
                        placeholderTextColor={colors.placeholderText}
                    />
                </View>
                <TouchableOpacity style={styles.filterSection}>
                    <FastImage source={images.Filter} style={{ width: 18, height: 18 }} />
                </TouchableOpacity>
            </View> */}
    </View>
  );
};
