import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import Btn from './Btn'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from "react-native-responsive-screen";

const VerifyModal = ({onPress, loading}) => {
  return (
    <View style={styles.container}>
    <View
      style={{
        height: 400,
        width: wp(85),
        backgroundColor: "#FFF",
        borderRadius: hp(1),
        alignItems: "center",
        justifyContent: "space-evenly",
        //   marginBottom: 5
      }}
    >
      <Image
        resizeMode="contain"
        source={require("../assets/images/success.png")}
        style={{ width: 121, height: 121, marginBottom: 20 }}
      />
      <View>
        <Text
          style={{
            fontSize: 21,
            fontWeight: "800",
            textAlign: "center",
            letterSpacing: 1.5,
            lineHeight: 35,
            //   marginBottom: 40,
          }}
        >
          VERIFIED
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            textAlign: "center",
            letterSpacing: 1.5,
            lineHeight: 35,
            marginBottom: 40,
          }}
        >
          You have Successfully {"\n"}
          Verified the Account!
        </Text>
      </View>
      <Btn onPress={onPress} loading={loading} label="Go To" width="50%" />
    </View>
  </View>
  )
}

export default VerifyModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        // alignItems: 'center',
      },
})