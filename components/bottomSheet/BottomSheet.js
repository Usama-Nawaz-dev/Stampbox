import React, { forwardRef, useContext } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";

import { styles } from "./styles";
import RBSheet from "react-native-raw-bottom-sheet";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import colors from "../../constant/colors";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ActivityModal from "../ActivityModal";
import ThemeContext from "../../src/Context/ThemeContext";

export const BottomSheet = forwardRef((props, ref) => {
  let {
    ChildComponent,
    title,
    onPressClose,
    dropDown = true,
    sheetHeight,
    borderRadius,
    onClose,
  } = props;
  const { theme }= useContext(ThemeContext);
  return (
    <RBSheet
      ref={ref}
      height={sheetHeight ? sheetHeight : hp(92)}
      openDuration={250}
      closeOnDragDown={dropDown}
      onClose={onClose}
      // closeOnPressMask={true}
      customStyles={{
        container: {
          // flex: 1,
          marginTop: 30,
          backgroundColor: theme?.cardColor,
          borderTopStartRadius: borderRadius ? borderRadius : 20,
          borderTopEndRadius: borderRadius ? borderRadius : 20,
        },
        draggableIcon: {
          // backgroundColor: "#000"
          width: "15%",
          height: 3,
          backgroundColor: colors.borderColor,
        },
      }}
    >
      {title && (
        <View style={styles.HeaderContainer}>
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity onPress={onPressClose}>
              <EvilIcons name="close" size={hp(3.2)} color={theme?.black} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme?.darkGrey}]}>{title}</Text>
          </View>
        </View>
      )}
      {ChildComponent}
      <ActivityModal />
    </RBSheet>
  );
});
