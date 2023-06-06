import React, { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import colors from "../constant/colors";
import Fonts from "../assets/fonts/Fonts";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AuthContext from "../src/Context/AuthContext";

export const DatePickerTime = (props) => {
  const { date, setDate, setTime, time, label } = props;
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const hideDatePicker = () => setIsDatePickerVisible(false);
  const hideTimePicker = () => setIsTimePickerVisible(false);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const handleDateConfirm = (selectedDate) => {
    let formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    setDate(formattedDate);
    hideDatePicker();
  };

  const handleTimeConfirm = (selectedTime) => {
    selectedTime.setHours(selectedTime.getHours());
    let formattedTime = moment(selectedTime).format("HH:mm:ss");
    setTime(formattedTime);
    hideTimePicker();
  };

  const dateToday = moment(new Date()).format("yyyy-MM-DD");

  return (
    <View style={styles.mainbox}>
      <View>
        <Text style={styles.text}>
          {label ? label : language?.expiry} Date*
        </Text>
        <Pressable
          style={styles.box}
          onPress={() => setIsDatePickerVisible(true)}
        >
          <Text
            style={{
              color: date ? colors.btnText : colors.placeholderText,
              fontFamily: Fonts.IBM_Regular,
            }}
          >
            {date ? date : "yyyy-dd-mm"}
          </Text>
        </Pressable>
      </View>
      <View>
        <Text style={styles.text}>
          {label ? label : language?.expiry} {language?.time}*
        </Text>
        <Pressable
          style={styles.box}
          onPress={() => setIsTimePickerVisible(true)}
        >
          <Text
            style={{
              color: date ? colors.btnText : colors.placeholderText,
              fontFamily: Fonts.IBM_Regular,
            }}
          >
            {time
              ? moment(`${date ? date : dateToday}T${time}`).format("h:mm A")
              : "hh-mm-ss"}
          </Text>
        </Pressable>
      </View>

      <DateTimePicker
        display="spinner"
        headerTextIOS="Pick a date"
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />
      <DateTimePicker
        display="spinner"
        headerTextIOS="Pick a time"
        isVisible={isTimePickerVisible}
        is24Hour={true}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
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
