import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Pressable,
  StyleSheet,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from "../../components/AppText";

import { FloatingInput, GradBtn } from "../../components";

import Entypo from "react-native-vector-icons/Entypo";
import Fontisto from "react-native-vector-icons/Fontisto";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import colors from "../../constant/colors";
import Fonts from "../../assets/fonts/Fonts";

import AuthContext from "../Context/AuthContext";
import ThemeContext from "../Context/ThemeContext";

export const WithdrawModal = (props) => {
  const {
    err,
    balance,
    loading,
    modalVisible,
    setError,
    setBalance,
    setModalVisible,
    submit,
  } = props.prop;
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const currentUser = useSelector((state) => state.ApiReducer.user);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert(language?.modal_has_been_closed);
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View
          style={{
            height: 330,
            width: wp(93),
            backgroundColor: "#fff",
            justifyContent: "center",
            borderRadius: 2,
          }}
        >
          <Pressable
            onPress={() => {
              setModalVisible(!modalVisible);
              if (err) {
                setError(null);
              }
            }}
            style={{
              backgroundColor: theme.porcelain,
              height: 35,
              width: 35,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: -15,
              right: -5,
            }}
          >
            <Entypo name="cross" color="#000" size={30} />
          </Pressable>
          <View
            style={{
              //   height: 80,
              width: "90%",
              //   backgroundColor: "red",
              alignItems: "flex-start",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <MaterialIcons
              name="attach-money"
              color={colors.lightTheme}
              size={100}
            />
            {/* <Fontisto name="money-symbol" color={colors.lightTheme} size={90} /> */}
          </View>

          <View style={{ width: "90%", alignSelf: "center" }}>
            <AppText style={{ fontWeight: "600", fontSize: 16 }}>
              Withdraw Balance
            </AppText>

            <FloatingInput
              label="Amount"
              marginTop={4}
              value={balance}
              keyboardType="numeric"
              // width="90%"
              onChangeText={(text) => {
                // console.log("text", text);
                setBalance(text);
                if (err) {
                  setError(null);
                }
              }}
              error={err ? err : null}
            />
            <AppText style={{ color: theme.chalice, marginTop: 10 }}>
              Withdraw balance from StampBox
            </AppText>
            <GradBtn
              height={45}
              width="90%"
              label="Submit"
              loading={loading}
              onPress={() => submit()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  detailsSection: {
    marginTop: hp(1),
  },
  uidText: {
    textAlign: "center",
    marginBottom: hp(1),
    color: colors.lightTheme,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.5),
    paddingHorizontal: wp(3),
  },
  infoContainer: {
    width: wp(30),
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
  infoText: {
    marginTop: hp(0.5),
    fontSize: 12,
    // color: colors.lightText,
  },
  expiryText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: hp(1),
  },
  timeText: {
    fontSize: 14,
    color: colors.lightTheme,
    fontWeight: "400",
  },
  userSection: {
    marginTop: hp(1.5),
    paddingBottom: hp(0.5),
    paddingHorizontal: wp(3),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(3),
  },
  itemHeading: {
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    marginBottom: hp(1),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  textStyle: {
    color: colors.theme,
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
  },
  commentBlock: {
    marginLeft: 5,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp(81),
  },
  bottomSheetView: {
    padding: 20,
    justifyContent: "center",
    marginLeft: 10,
  },
  bottomSheetText: {
    fontSize: 20,
    marginLeft: 20,
  },
  bottomSheetOptionView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  labelStyle: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    textTransform: "none",
    fontFamily: Fonts.IBM_Regular,
  },
  buySection: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    width: wp(80),
    alignSelf: "center",
  },
  button: {
    width: wp(35),
    marginTop: 0,
  },
  optionBtn: {
    width: hp(4),
    height: hp(4),
    backgroundColor: "#fff",
    borderRadius: hp(0.5),
    justifyContent: "center",
    alignItems: "center",
    right: wp(3),
  },
  guideIcon: {
    position: "absolute",
    top: hp(6),
    right: wp(3),
  },
  collectionSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
  },
  cText: {
    marginRight: wp(10),
  },
});
