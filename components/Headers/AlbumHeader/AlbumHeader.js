import React from "react";
import {
  View,
  Pressable,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Image from "react-native-fast-image";

import colors from "../../../constant/colors";
import { coin } from "../../../constant/Paths";

import { styles } from "./styles";
import { images } from "../../../assets/images/Images";

import AppText from "../../AppText";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const AlbumHeader = (props) => {
  const {
    title,
    onPressBack,
    onPressAdd,
    onChangeValue,
    onPressCart,
    multiple = true,
    showSearch = true,
  } = props;
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.bgImage} source={images.Header}>
        <View style={styles.topSection}>
          <View style={styles.titleSection}>
            <TouchableOpacity onPress={onPressBack}>
              <Image
                source={images.ArrowLeft}
                resizeMode="contain"
                style={{ height: 18, width: 8, marginRight: wp(3) }}
              />
            </TouchableOpacity>
            <AppText style={styles.titleText}>{title}</AppText>
          </View>
          {multiple ? (
            <View style={styles.rightSection}>
              <Pressable style={styles.locationSection}>
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
              </Pressable>
              <TouchableOpacity style={{ marginRight: 15 }}>
                <View style={styles.counterSection}>
                  <AppText style={styles.counterText}>10</AppText>
                </View>
                <Image
                  source={coin}
                  resizeMode="contain"
                  style={{ height: 24, width: 24 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onPressCart}>
                <View style={styles.counterSection}>
                  <AppText style={styles.counterText}>10</AppText>
                </View>
                <Image
                  source={images.Cart}
                  resizeMode="contain"
                  style={{ height: 20, width: 20 }}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.rightSection}>
              <TouchableOpacity>
                <Entypo
                  name="dots-three-vertical"
                  size={22}
                  color={colors.cWhite}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>
      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchSection}>
            <Image
              source={images.Search}
              style={{ width: 14, height: 14, tintColor: "#707070" }}
            />
            <TextInput
              onChangeText={onChangeValue}
              placeholder="Search here…"
              style={styles.input}
              placeholderTextColor={colors.placeholderText}
            />
          </View>
          <TouchableOpacity style={styles.filterSection}>
            <Image source={images.Option} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addSection} onPress={onPressAdd}>
            <Image
              source={images.Add}
              style={{ width: 20, height: 20,resizeMode: 'contain' }}
              tintColor={colors.cWhite}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
