import { StyleSheet, Text, View, Modal, Linking } from "react-native";
import React from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Btn from "./Btn";
import colors from "../constant/colors";
import Icon from "react-native-vector-icons/Feather";
import Foundation from "react-native-vector-icons/Foundation";
import LottieView from "lottie-react-native";
const NoInternet = ({ modalVisible }) => {
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        //   Alert.alert("Modal has been closed.");
        // setModalVisible(!modalVisible);
        //   dispatch(allActions.DataAction.ActivityModal(!modalVisible));
      }}
    >
      <View style={styles.centeredView}>
        <View
          style={{
            height: hp(40),
            width: wp(80),
            backgroundColor: "#fff",
            borderRadius: hp(1),
            alignSelf: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 0.4,
                // backgroundColor: "skyblue",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <LottieView
                source={require("../assets/jsons/no-wifi.json")}
                autoPlay
                loop
              />
            </View>
            <View
              style={{
                flex: 0.6,
                // backgroundColor: "orange",
                alignItems: "center",
                justifyContent: "space-around",
                width: "90%",
                alignSelf: "center",
              }}
            >
              <Text style={styles.text}>NO INTERNET</Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "normal",
                  textAlign: "center",
                }}
              >
                Check your Internet connection and try again
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "400" }}>
                PLEASE TURN ON
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Btn
                  label="WIFI"
                  style={{
                    backgroundColor: colors.green,
                    borderRadius: 20,
                    height: 35,
                    width: 120,
                    marginHorizontal: 10,
                  }}
                  iconLeft={<Icon name="wifi" size={18} color="#fff" />}
                  onPress={() => Linking.openSettings()}
                />
                {/* <Btn
                  label="MOBILE DATA"
                  style={{
                    backgroundColor: colors.green,
                    borderRadius: 20,
                    height: 35,
                    width: 180,
                    marginHorizontal: 10,
                  }}
                  iconLeft={
                    <Foundation name="mobile-signal" size={18} color="#fff" />
                  }
                /> */}
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NoInternet;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  text: { fontSize: 21, fontFamily: "Roboto-Light", fontWeight: "400" },
});
