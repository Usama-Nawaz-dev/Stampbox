import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Modal,
  Alert,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Image from "react-native-fast-image";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import AppText from "./AppText";
import { GradBtn } from "./GradBtn";
import colors from "../constant/colors";
import Fonts from "../assets/fonts/Fonts";
import { images } from "../assets/images/Images";
import ErrorMessage from "../src/forms/ErrorMessage";

import Env from "../api/Env";
import Helper from "../src/Helper";
import MindAxios from "../api/MindAxios";

import AuthContext from "../src/Context/AuthContext";
import ThemeContext from "../src/Context/ThemeContext";

const coinData = [25, 50, 75, 100, 200, 500, 700, 1000, 1500, 2000, 2500, 3000];

export const AwardModal = (props) => {
  const { type, userId, modalVisible, setModalVisible } = props;

  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  const [selected, setSelected] = useState(null);
  const [joinMsg, setJoinMsg] = useState(null);
  const [errMsg, setErrMsg] = useState(false);

  const {
    myState: { language },
  } = useContext(AuthContext);

  const renderItem = ({ item, index }) => {
    const showBorder = item === selected;
    return (
      <TouchableOpacity
        style={[styles.coinCard, { borderWidth: showBorder ? 2 : 0 }]}
        onPress={() => setSelected(item)}
      >
        <Image
          style={styles.coinImg}
          source={images.Coin}
          resizeMode="contain"
        />
        <AppText style={styles.valText}>{item}</AppText>
      </TouchableOpacity>
    );
  };
  const onGiveReward = async () => {
    if (joinMsg) {
      setLoading(true);
      let body = {
        type: type,
        user_id: userId,
        coins: selected,
        description: joinMsg,
      };
      const res = await MindAxios.post(Env.createUrl("coins"), body);
      setLoading(false);
      if (res?.status == 200) {
        Helper.showToastMessage("Coins reward send.", "green");
        setModalVisible(false);
        setSelected(null);
        setErrMsg(null);
        setJoinMsg(null);
      } else {
        Helper.showToastMessage(
          "There's some issue while sending reward.",
          "red"
        );
      }
    } else {
      setErrMsg("Description is required.");
    }
  };
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert(language?.modal_has_been_closed);
      }}
    >
      <View style={styles.centeredView}>
        <View style={[styles.container, { backgroundColor: theme?.cardColor }]}>
          <View style={styles.upperSection}>
            <AppText style={styles.title}>Give Award</AppText>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setSelected(null);
                setErrMsg(null);
                setJoinMsg(null);
              }}
              style={styles.cross}
            >
              <EvilIcons name="close" color="#000" size={hp(3.5)} />
            </TouchableOpacity>
          </View>

          <FlatList
            numColumns={4}
            data={coinData}
            renderItem={renderItem}
            style={{ alignSelf: "center" }}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />

          {selected !== null ? (
            <View style={styles.infoSection}>
              <AppText style={styles.msgText}>Desscription*</AppText>
              <TextInput
                value={joinMsg}
                style={styles.input}
                placeholder="Enter Comment..."
                label={language?.enterDescription}
                onChangeText={(text) => {
                  setErrMsg(false);
                  setJoinMsg(text);
                }}
              />
              <ErrorMessage visible={errMsg} error={errMsg} />
              <GradBtn
                width="35%"
                fontSize={12}
                height={hp(4.3)}
                loading={loading}
                label="Give Award"
                disabled={loading}
                style={styles.modalBtn}
                fontFamily={Fonts.IBM_Medium}
                onPress={onGiveReward}
              />
            </View>
          ) : null}
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
    width: wp(90),
    borderRadius: 5,
    alignSelf: "center",
    backgroundColor: "#fff",
  },
  upperSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: colors.borderColor,
    marginHorizontal: wp(5),
    borderBottomWidth: 1,
    paddingBottom: hp(1),
    marginTop: hp(1.5),
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  loader: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  cardBox: {
    flex: 0.8,
    flexDirection: "row",
    alignItems: "center",
  },
  textStyle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  coinImg: {
    width: hp(5.5),
    height: hp(5.5),
    borderRadius: hp(100),
  },
  valText: {
    fontSize: 12,
    marginTop: hp(0.3),
    fontWeight: "600",
  },
  body: {
    flex: 0.85,
  },
  coinCard: {
    width: wp(18),
    margin: wp(1),
    padding: wp(1),
    borderRadius: 5,
    alignItems: "center",
    borderColor: colors.lightTheme,
  },
  modalBtn: {
    marginTop: hp(1),
  },

  footer: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: hp(0.5),
  },
  cross: {
    alignItems: "center",
    justifyContent: "center",
  },
  shareBtn: {
    height: hp(4),
    width: wp(20),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightTheme,
    borderRadius: 5,
    marginRight: wp(3),
  },

  infoSection: {
    width: "90%",
    alignSelf: "center",
    paddingVertical: hp(1),
  },
  msgText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightText,
  },
  input: {
    height: hp(5),
    borderWidth: 1,
    padding: wp(2),
    borderRadius: 7,
    marginTop: hp(1),
    color: colors.lightBlack,
    fontFamily: Fonts.IBM_Regular,
    borderColor: colors.borderColor,
    backgroundColor: colors.background,
  },
});
