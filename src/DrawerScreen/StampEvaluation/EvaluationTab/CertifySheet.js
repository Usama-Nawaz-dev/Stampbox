import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import FastImage from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Octicons from "react-native-vector-icons/Octicons";

import Helper from "../../../Helper";
import Btn from "../../../../components/Btn";
import colors from "../../../../constant/colors";
import Fonts from "../../../../assets/fonts/Fonts";
import AppText from "../../../../components/AppText";
import ThemeContext from "../../../Context/ThemeContext";
import { images } from "../../../../assets/images/Images";

export const CertifySheet = (props) => {
  const { onCloseSheet } = props;

  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <AppText style={[styles.heading, { color: theme?.darkGrey }]}>
        Expert Certification
      </AppText>
      <AppText style={[styles.infoText, { color: theme?.lightText }]}>
        Sorry! You did not meet the requirements for Stamp Evaluation
        Certification.
      </AppText>
      <AppText style={styles.subHead}>Requirements</AppText>
      <InfoIcon info={"Requirement 01"} />
      <InfoIcon info={"Requirement 02"} />
      <InfoIcon info={"Requirement 03"} />
      <InfoIcon info={"Requirement 04"} />
      <Btn
        fontSize={14}
        height={hp(5)}
        width={wp(80)}
        label={`Close`}
        style={styles.btnStyle}
        onPress={onCloseSheet}
      />
    </View>
  );
};

const InfoIcon = ({ info }) => {
  return (
    <View style={styles.iconSection}>
      <Octicons name="dot-fill" color={colors.lightTheme} size={hp(2)} />
      <AppText style={styles.text}>{info}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "85%",
    alignSelf: "center",
  },
  heading: {
    fontSize: 18,
    marginTop: hp(2),
    alignSelf: "center",
    color: colors.btnText,
    fontFamily: Fonts.IBM_Bold,
  },
  infoText: {
    marginVertical: hp(1.5),
    alignSelf: "center",
    textAlign: "center",
  },
  subHead: {
    fontSize: 16,
    marginTop: hp(1),
    marginBottom: hp(1),
    fontFamily: Fonts.IBM_SemiBold,
  },
  iconSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(0.5),
  },
  text: {
    marginLeft: wp(3),
  },
  btnStyle: {
    marginTop: hp(3),
    alignSelf: "center",
  },
});
