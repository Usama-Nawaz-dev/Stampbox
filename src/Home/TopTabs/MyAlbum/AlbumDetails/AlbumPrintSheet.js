import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../../../constant/colors";
import Fonts from "../../../../../assets/fonts/Fonts";
import ThemeContext from "../../../../Context/ThemeContext";

import { appUrl } from "../../../../../api/Env";

export const AlbumPrintSheet = (props) => {
  const { sheetRef, album } = props;

  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: theme?.darkGrey }]}>
        {`${album?.type} Print Options`}
      </Text>
      <View style={styles.contentSection}>
        <SelectorBtn
          onPress={() => {
            sheetRef?.current?.close();
            setTimeout(() => {
              Linking.openURL(appUrl + `print-album/${album?.id}`);
            }, 300);
          }}
          title={"Only pictures"}
        />
        <SelectorBtn
          onPress={() => {
            sheetRef?.current?.close();
            setTimeout(() => {
              Linking.openURL(
                appUrl + `print-album/${album?.id}?option=print_with_i_c_c`
              );
            }, 300);
          }}
          title={"Image, Country & Catalogue #"}
        />
        <SelectorBtn
          onPress={() => {
            sheetRef?.current?.close();
            setTimeout(() => {
              Linking.openURL(
                appUrl + `print-album/${album?.id}?option=print_with_i_n_y`
              );
            }, 300);
          }}
          title={"Image, Name & Year"}
        />
      </View>
    </View>
  );
};

export const SelectorBtn = ({ title, onPress }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <TouchableOpacity style={[styles.itemSection]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
  },
  heading: {
    fontSize: 14,
    marginLeft: wp(5),
    marginTop: hp(0.5),
    color: colors.btnText,
    fontFamily: Fonts.IBM_Medium,
  },
  contentSection: {
    flex: 1,
    marginTop: hp(2),
    alignItems: "center",
  },
  itemSection: {
    width: "90%",
    height: hp(5.5),
    borderRadius: 5,
    marginBottom: hp(1.5),
    paddingHorizontal: wp(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 12,
    maxWidth: wp(70),
    marginLeft: hp(0.5),
    color: colors.btnText,
    fontFamily: Fonts.IBM_Regular,
  },
});
