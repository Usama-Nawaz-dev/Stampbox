import React, { useContext } from "react";
import { View, Modal, Alert, StyleSheet } from "react-native";
import Image from "react-native-fast-image";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import AppText from "../AppText";
import { GradBtn } from "../GradBtn";
import colors from "../../constant/colors";
import Fonts from "../../assets/fonts/Fonts";
import { images } from "../../assets/images/Images";

import AuthContext from "../../src/Context/AuthContext";
import ThemeContext from "../../src/Context/ThemeContext";

export const SuccessModal = (props) => {
  const { showModal, onPress } = props;

  const { theme } = useContext(ThemeContext);

  const {
    myState: { language },
  } = useContext(AuthContext);

  return (
    <Modal
      transparent={true}
      visible={showModal}
      animationType="none"
      onRequestClose={() => {
        Alert.alert(language?.modal_has_been_closed);
      }}
    >
      <View style={styles.centeredView}>
        <View style={[styles.container, { backgroundColor: theme?.cardColor }]}>
          <Image
            style={styles.icon}
            resizeMode="contain"
            source={images.Success}
          />
          <AppText style={styles.heading}>Thank you for your Feedback!</AppText>
          <AppText style={styles.text}>
            5 Coins have been awarded to your wallet.
          </AppText>
          <GradBtn
            label="OK"
            fontSize={12}
            width={wp(20)}
            height={hp(4)}
            onPress={onPress}
            style={styles.modalBtn}
            fontFamily={Fonts.IBM_Medium}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  container: {
    borderRadius: 20,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  icon: {
    width: hp(9),
    height: hp(9),
    marginTop: hp(2.5),
  },
  heading: {
    fontWeight: "500",
    marginTop: hp(1.5),
  },
  text: {
    maxWidth: wp(70),
    marginTop: hp(0.5),
    textAlign: "center",
    paddingHorizontal: wp(4),
  },
  modalBtn: {
    marginTop: hp(1),
    marginBottom: hp(1),
  },
});
