import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import colors from "../constant/colors";
import Fonts from "../assets/fonts/Fonts";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const TimePickers = (props) => {
  const { time, setTime, setTime1, time1, label, label1, date } = props;
  // console.log(date);

  const [isOpenTime, setIsOpenTime] = useState(false);
  const [isCloseTime, setIsCloseTime] = useState(false);

  const hideTimePicker = () => setIsOpenTime(false);
  const hideTimePicker1 = () => setIsCloseTime(false);
  // console.log('props', props)

  const handleTimeConfirm = (selectedTime) => {
    let formattedTime = moment(selectedTime).format("HH:mm:ss");
    setTime(formattedTime);
    hideTimePicker();
  };

  const handleTimeConfirm1 = (selectedTime) => {
    let formattedTime = moment(selectedTime).format("HH:mm:ss");
    setTime1(formattedTime);
    hideTimePicker1();
  };

  return (
    <View style={styles.mainbox}>
      <View>
        <Text style={styles.text}>{label ? label : "Opening Time"}</Text>
        <Pressable style={styles.box} onPress={() => setIsOpenTime(true)}>
          <Text
            style={{
              color: time ? colors.btnText : colors.placeholderText,
              fontFamily: Fonts.IBM_Regular,
            }}
          >
            {time ? moment(`${date}T${time}`).format("h:mm A") : "hh-mm-ss"}
          </Text>
        </Pressable>
      </View>
      <View>
        <Text style={styles.text}>{label1 ? label1 : "Closing Time"}</Text>
        <Pressable style={styles.box} onPress={() => setIsCloseTime(true)}>
          <Text
            style={{
              color: time1 ? colors.btnText : colors.placeholderText,
              fontFamily: Fonts.IBM_Regular,
            }}
          >
            {time1 ? moment(`${date}T${time1}`).format("h:mm A") : "hh-mm-ss"}
          </Text>
        </Pressable>
      </View>

      <DateTimePicker
        display="spinner"
        headerTextIOS="Pick a time"
        isVisible={isOpenTime}
        is24Hour={true}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />

      <DateTimePicker
        display="spinner"
        headerTextIOS="Pick a time"
        isVisible={isCloseTime}
        is24Hour={true}
        mode="time"
        onConfirm={handleTimeConfirm1}
        onCancel={hideTimePicker1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainbox: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: 'red',
    marginTop: 12,
  },
  box: {
    height: 40,
    width: wp(44),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  text: {
    fontSize: 12,
    color: colors.btnText,
    fontFamily: Fonts.Roboto_Regular,
    marginBottom: 5,
  },
});
