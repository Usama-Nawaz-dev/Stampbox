import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { heightPercentageToDP } from "react-native-responsive-screen";

const DateAndTime = (props) => {
  const {
    date,
    setDate,
    setTime,
    time,
    isDatePickerVisible,
    setIsDatePickerVisible,
  } = props;
  //   const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  //   const [date] = useState([]);
  //   const [time] = useState([]);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [schedule, setSchedule] = useState(false);
  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };
  const hideTimePicker = () => {
    setSchedule(false);
    setIsTimePickerVisible(false);
  };
  // console.log('props', props)
  const handleDateConfirm = (selectedDate) => {
    let formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    console.log(formattedDate);
    setDate(formattedDate);
    hideDatePicker();
    setSchedule(true);
  };
  const handleTimeConfirm = (selectedTime) => {
    let formattedTime = moment(selectedTime).format('HH:mm');
    // console.log(formattedTime);
    setTime(formattedTime);
    setSchedule(false);
    hideTimePicker();
  };
  // useEffect(() => {
  //   console.log("schedule-->", schedule);
  //   console.log("isTimePickerVisible-->", isTimePickerVisible);
  //   if (schedule && !isTimePickerVisible) {
     
  //     setTimeout(() => {
  //       setIsTimePickerVisible(true);
  //     }, 500);
  //   }
  // });

  return (
    <View>
      {/* <DateTimePicker
        display="spinner"
        headerTextIOS="Pick a date"
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      /> */}
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

export default DateAndTime;

const styles = StyleSheet.create({
  box: {
    height: 40,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
    borderColor: "green",
    borderWidth: 1,
  },
  mainbox: {
    // height:60,
    // backgroundColor: 'red',
    width: "90%",
    alignSelf: "center",
  },
  text: {
    // textAlign: 'left',
    color: "#000",
    fontWeight: "500",
    fontSize: heightPercentageToDP("1.60%"),
    textTransform: "uppercase",
    // marginBottom: 10
  },
});
