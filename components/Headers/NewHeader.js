import React, { useContext } from "react";
import {
  View,
  Pressable,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";

import colors from "../../constant/colors";
import { images } from "../../assets/images/Images";

import AppText from "../AppText";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ThemeContext from "../../src/Context/ThemeContext";
// import { dark as theme } from "../../constant/colorsConfig";

export const NewHeader = (props) => {
  const { title, onPressBack, edit, onChangePass, onEdit, expanded } = props;
  const { theme }= useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <ImageBackground
        style={[styles.bgImage, { height: !expanded ? 120 : 60 }]}
        source={images.Header1}
      >
        <View style={styles.topSection}>
          <Pressable onPress={onPressBack} style={styles.titleSection}>
            <Image
              source={images.ArrowLeft}
              resizeMode="contain"
              style={{ height: 18, width: 8, marginRight: wp(3) }}
            />
            <AppText style={styles.titleText}>{title}</AppText>
          </Pressable>
          {edit ? (
            <TouchableOpacity
              style={[
                styles.rightSection,
                {
                  width: 110,
                  // backgroundColor: "red"
                },
              ]}
              onPress={onEdit}
            >
              {/* <Text style={{ color: "#fff",  }}>Store Info.</Text> */}
              <AppText
                style={[styles.titleText, { marginRight: 10, fontSize: 16 }]}
              >
                Store Info.
              </AppText>
              <MaterialIcons
                name="expand-more"
                color={colors.cWhite}
                size={25}
                style={{ position: "absolute", right: 0 }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    backgroundColor: colors.cWhite,
    // position: "absolute",
    // zIndex: 100,
  },
  bgImage: {
    // height: 60,
    width: wp(100),
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    // backgroundColor: 'red'
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp(3),
  },
  titleText: {
    fontSize: 20,
    fontWeight: "500",
    fontFamily: "IBMPlexSans-Regular",
    color: colors.cWhite,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: wp(3),
    // backgroundColor: "red",
  },
  counterSection: {
    height: 15,
    width: 15,
    borderRadius: 10,
    backgroundColor: colors.cWhite,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -7,
    right: -7,
    zIndex: 999,
  },
  counterText: {
    color: "#181818",
    fontSize: 9,
  },
});

{
  /* <View style={styles.rightSection}>
                            <TouchableOpacity>
                                <Image source={images.SearchHeader} resizeMode="contain" style={{ height: 20, width: 20 }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 15 }}>
                                <View style={styles.counterSection}>
                                    <AppText style={styles.counterText}>10</AppText>
                                </View>
                                <Image source={images.Coin} resizeMode="contain" style={{ height: 24, width: 24 }} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.counterSection}>
                                    <AppText style={styles.counterText}>10</AppText>
                                </View>
                                <Image source={images.Cart} resizeMode="contain" style={{ height: 20, width: 20 }} />
                            </TouchableOpacity>
                        </View> */
}
