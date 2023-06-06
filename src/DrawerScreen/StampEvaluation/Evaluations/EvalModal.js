import React, { useContext } from "react";
import { View, Modal, Alert, StyleSheet } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import colors from "../../../../constant/colors";
import { GradBtn } from "../../../../components";
import Fonts from "../../../../assets/fonts/Fonts";
import AppText from "../../../../components/AppText";

import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";

export const EvalModal = (props) => {
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
          <AppText style={styles.heading}>Congratulations</AppText>
          <AppText style={styles.text}>
            Your stamp has been submitted for Stamp Evaluation. You will be
            notified soon.
          </AppText>
          <GradBtn
            fontSize={12}
            width={wp(30)}
            height={hp(4.2)}
            onPress={onPress}
            label="Back to home"
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
  heading: {
    fontSize: 16,
    marginTop: hp(3),
    fontFamily: Fonts.IBM_Bold,
  },
  text: {
    fontSize: 14,
    maxWidth: wp(65),
    marginTop: hp(1.5),
    textAlign: "center",
    paddingHorizontal: wp(4),
  },
  modalBtn: {
    marginTop: hp(1.5),
    marginBottom: hp(1.5),
  },
});
