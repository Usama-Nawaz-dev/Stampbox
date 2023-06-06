import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import React from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import LinearGradient from "react-native-linear-gradient";
import AppText from "../AppText";
import colors from "../../constant/colors";
import { images } from "../../assets/images/Images";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";

const window = Dimensions.get("window");
let val = 3;
const GeneralHeader = (props) => {
  const { title, onPressBack, edit, onChangePass, onEdit } = props;
  return (
    <LinearGradient
      colors={["#17171C", "#2B3135", "#3D3738"]}
      useAngle={true}
      angle={45}
      angleCenter={{ x: 0.3, y: 0.3 }}
      style={[styles.curvedViewStyle, { zIndex: 1000 }]}
    >
      <View
        style={[
          styles.topSection,
          {
            width: edit ? "53%" : "33%",
            justifyContent: edit ? "space-around" : "flex-start",
          },
        ]}
      >
        <Pressable onPress={onPressBack} style={styles.titleSection}>
          <Image
            source={images.ArrowLeft}
            resizeMode="contain"
            style={{ height: 18, width: 8, marginRight: wp(3) }}
          />
          <AppText style={styles.titleText}>{title}</AppText>
        </Pressable>
        {edit ? (
          <View style={styles.rightSection}>
            <TouchableOpacity onPress={onEdit}>
              <Feather name="edit" color={colors.cWhite} size={22} />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 15 }} onPress={onChangePass}>
              <MaterialIcons name="lock" color={colors.cWhite} size={24} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </LinearGradient>
  );
};

export default GeneralHeader;

const styles = StyleSheet.create({
  curvedViewStyle: {
    borderRadius: window.width * val,
    width: window.width * val,
    height: window.width * val,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "absolute",
    bottom: hp(80),
    overflow: "hidden",
    zIndex: 1000,
  },
  container: {
    flex: 1,
    width: wp(100),
    backgroundColor: colors.cWhite,
  },
  bgImage: {
    height: 135,
    width: wp(100),
  },
  topSection: {
    height: 40,
    bottom: hp(8),
    flexDirection: "row",
    alignItems: "center",
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
