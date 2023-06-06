import React, { useContext, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { styles } from "./styles";

import colors from "../../../../../constant/colors";

import { images } from "../../../../../assets/images/Images";
import AppText from "../../../../../components/AppText";

import { SimpleHeader, FloatingInput } from "../../../../../components";
import AntDesign from "react-native-vector-icons/AntDesign";
import AuthContext from "../../../../Context/AuthContext";

export const TradeProposal = (props) => {
  const [comment, setComment] = useState(null);
  const {
    myState: { language },
  } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <SimpleHeader
        title={language?.tradeProposal}
        onPressBack={() => props?.navigation.goBack()}
      />
      <View style={styles.topSection}>
        <AppText style={styles.nameText}>Proposal Info</AppText>
        <FloatingInput
          label={language?.comment}
          value={comment}
          onChangeText={(text) => {
            // handleError(null, "nameErrMessage");
            setComment(text);
          }}
          // error={errMsgs.nameErrMessage ? errMsgs.nameErrMessage : false}
        />
      </View>
      <AppText style={styles.itemText}>My Trade Item</AppText>
      <View style={styles.cardSection}>
        <View style={styles.card}>
          <Image source={images.Stamp2} style={styles.stampIcon} />
        </View>
        <AntDesign name="swap" size={30} color={colors.theme} />
        <View style={styles.card}>
          <Image source={images.Coin} style={styles.coinIcon} />
        </View>
      </View>
    </View>
  );
};
