import React from "react";
import {
  View,
  Pressable,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from "react-native";

import colors from "../../../constant/colors";
import { coin } from "../../../constant/Paths";

import SearchBar from "../../SearchBar";
import { styles } from "./styles";
import { images } from "../../../assets/images/Images";

import AppText from "../../AppText";
import Ionicons from "react-native-vector-icons/Ionicons";

export const MarketHeader = (props) => {
  const {
    title,
    onPressMenu,
    coins,
    onChangeValue,
    onPressCart,
    onPressCoin,
    cartLength,
  } = props;

  const convert_coins = () => {
    if (coins >= 1000) {
      let val = coins / 1000;
      // console.log('val', val.toFixed(1))
      return `${val.toFixed(1)}k`;
    } else {
      return coins;
    }
  };
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.bgImage} source={images.Header}>
        <View style={styles.topSection}>
          <View style={styles.titleSection}>
            <TouchableOpacity onPress={onPressMenu}>
              <Ionicons name="menu-outline" color={colors.cWhite} size={26} />
            </TouchableOpacity>
            <AppText style={styles.titleText}>{title}</AppText>
          </View>
          <View style={styles.rightSection}>
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
            <TouchableOpacity style={{ marginRight: 15 }} onPress={onPressCoin}>
              <View style={styles.counterSection}>
                <AppText
                  style={[styles.counterText, { fontSize: coins ? 8 : 9 }]}
                >
                  {convert_coins()}
                </AppText>
              </View>
              <Image
                source={images.N_Coins}
                resizeMode="contain"
                style={{ height: 26, width: 26, tintColor: colors.cWhite }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressCart}>
              <View style={styles.counterSection}>
                <AppText style={styles.counterText}>{cartLength}</AppText>
              </View>
              <Image
                source={images.N_Cart}
                resizeMode="contain"
                style={{ height: 26, width: 26, tintColor: colors.cWhite }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={styles.searchContainer}>
          <View style={styles.searchSection}>
            <Image source={images.Search} style={{ width: 17, height: 17 }} />
            <TextInput
              onChangeText={onChangeValue}
              placeholder="Search here…"
              // onEndEditing={(event) => onTermSubmit(event.nativeEvent.text)}
              style={styles.input}
              placeholderTextColor={colors.placeholderText}
            />
          </View>
          <TouchableOpacity style={styles.filterSection}>
            <Image source={images.Filter} style={{ width: 18, height: 18 }} />
          </TouchableOpacity>
        </View> */}
      </ImageBackground>
    </View>
  );
};
