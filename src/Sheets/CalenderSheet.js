import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../constant/colors";
import Fonts from "../../assets/fonts/Fonts";
import AppText from "../../components/AppText";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import moment from "moment";
import { images } from "../../assets/images/Images";
import { Calendar, CalendarList } from "react-native-calendars";
import _ from "lodash";

export const CalenderSheet = (props) => {
  const { dateType, onCancel, onSelectDate } = props;
  const [calendarDate, setcalendarDate] = useState([]);
  const [selectedDateList, setSelectedDateList] = useState([]);
  const [selectedDates, setSelectedDates] = useState(null);
  //   console.log("dateType", dateType)

  const onSelect = () => {
    if (dateType === "Recurring") {
      if (selectedDateList?.length) {
        const dateList = selectedDateList?.map(item => item.date);
        onSelectDate(dateList);
      } else { alert("Please Select one or more dates.") }
    } else if (!selectedDates) {
      alert("Please select date range.")
    } else if (Object.keys(selectedDates?.start).length <= 1) {
      alert("Please select end date.")
    } else {
      const endDate = Object.keys(selectedDates?.start)[
        Object.keys(selectedDates?.start).length - 1
      ]
      onSelectDate(`${selectedDates?.date} to ${endDate}`)
    }
  }

  const addDay = (date) => {
    const _selectedDay = moment(date.dateString).format("YYYY-MM-DD");
    const _month = moment(date.dateString).format("MMM'YY");
    const _day = moment(date.dateString).format("DD");
    let selected = true;
    if (calendarDate[_selectedDay]) {
      selected = !calendarDate[_selectedDay].selected;
    }
    const updatedMarkedDates = {
      ...calendarDate,
      ...{
        [_selectedDay]: { selected, selectedColor: colors.lightTheme },
      },
    };
    const newList = selectedDateList?.filter(
      (item) => item?.date != _selectedDay
    );
    const dateList = [
      ...newList,
      { day: _day, month: _month, date: _selectedDay, selected: selected },
    ];
    const temp = dateList?.filter((item) => item.selected);
    const sortedDates = temp.sort(sortByDate);
    setSelectedDateList(sortedDates);
    setcalendarDate(updatedMarkedDates);
  };
  function sortByDate(a, b) {
    if (a.date > b.date) {
      return 1;
    }
    if (a.date < b.date) {
      return -1;
    }
    return 0;
  }
  const renderDateList = ({ item, index }) => {
    return (
      <View style={styles.singleDate}>
        <AppText style={styles.dayText}>{item?.day}</AppText>
        <AppText style={styles.monthText}>{item?.month}</AppText>
      </View>
    );
  };
  const getDaysArray = function (start, end) {
    for (
      var arr = {}, dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      let newDt = moment(dt).format("YYYY-MM-DD");
      //   console.log('newDt', newDt == selectedDates.date)
      arr[newDt] = {
        color: colors.greenish,
        textColor: "white",
      };
    }
    return arr;
  };
  const dateChecker = (currentDate, newDate) => {
    // console.log(currentDate, newDate)
    let dt = new Date(currentDate);
    let dt2 = new Date(newDate);
    if (dt2.getTime() > dt.getTime()) {
      return "greater";
    } else if (dt2.getTime() == dt.getTime()) {
      return "equal";
    } else {
      return "less";
    }
  };

  const dateSeter = (date) => {
    if (!selectedDates) {
      let start = {};
      start[date.dateString] = {
        startingDay: true,
        color: colors.greenish,
        textColor: "white",
      };
      //   console.log("start", date);
      setSelectedDates({ date: date.dateString, start: start });
    } else {
      //  let first = Object.keys(selectedDates.start)[0];
      //   console.log("selectedDates.start", first)
      let check = dateChecker(selectedDates.date, date.dateString);
      if (check !== "greater") {
        let start = {};
        start[date.dateString] = {
          startingDay: true,
          color: colors.greenish,
          textColor: "white",
        };
        //   console.log("start", date);
        setSelectedDates({ date: date.dateString, start: start });
      } else {
        let daylist = getDaysArray(selectedDates.date, date.dateString);
        let last = _.size(daylist) - 1;
        //   console.log('dayList.length', _.size(daylist))
        Object.keys(daylist).map((key, index) => {
          if (index == 0) {
            daylist[key] = {
              startingDay: true,
              color: colors.greenish,
              textColor: "white",
            };
          } else if (index == last) {
            daylist[key] = {
              endingDay: true,
              color: colors.greenish,
              textColor: "white",
            };
          }
          // desired.push(myObj[key]);
        });
        // console.log("dayList", daylist);
        setSelectedDates({ ...selectedDates, start: daylist });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.btnSection}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={[styles.selectBtn, { color: colors.red }]}>CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: wp(7) }} onPress={onSelect}>
          <Text style={styles.selectBtn}>SELECT</Text>
        </TouchableOpacity>
      </View>

      {dateType === "Recurring" ? (
        <View style={styles.mutiDates}>
          {selectedDateList?.length ? (
            <FlatList
              data={selectedDateList}
              horizontal
              renderItem={renderDateList}
            />
          ) : (
            <AppText style={styles.noDate}>No Date is Selected!</AppText>
          )}
        </View>
      ) : (
        <View
          style={[
            styles.mutiDates,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              backgroundColor: "#B2543A",
            },
          ]}
        >
          <View style={styles.multiSelect}>
            <AppText style={{ color: "#fff", fontSize: 10 }}>From</AppText>
            <AppText style={{ color: "#fff", fontWeight: "bold" }}>
              {selectedDates?.date ? selectedDates?.date : ""}
            </AppText>
          </View>
          <View
            style={[
              styles.multiSelect,
              // { backgroundColor: "rgba(256,256,256,0.6)" },
            ]}
          >
            <AppText style={{ color: "#fff", fontSize: 10 }}>To</AppText>
            <AppText style={{ color: "#fff", fontWeight: "bold" }}>
              {selectedDates?.start
                ? Object.keys(selectedDates?.start).length > 1
                  ? Object.keys(selectedDates?.start)[
                  Object.keys(selectedDates?.start).length - 1
                  ]
                  : ""
                : ""}
            </AppText>
          </View>
        </View>
      )}

      {dateType === "Recurring" ? (
        <CalendarList
          // markingType={"period"}
          pastScrollRange={0}
          minDate={new Date()}
          futureScrollRange={50}
          scrollEnabled={true}
          showScrollIndicator={true}
          theme={{
            todayTextColor: colors.lightTheme,
          }}
          markedDates={calendarDate}
          onDayPress={(date) => addDay(date)}
          style={styles.calendarList}
        />
      ) : (
        <CalendarList
          markingType={"period"}
          pastScrollRange={0}
          minDate={new Date()}
          futureScrollRange={50}
          scrollEnabled={true}
          showScrollIndicator={true}
          theme={{
            todayTextColor: colors.lightTheme,
          }}
          markedDates={selectedDates ? selectedDates?.start : null}
          onDayPress={(date) => dateSeter(date)}
          style={styles.calendarList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderRadius: 20,
    backgroundColor: colors.cWhite,
  },
  btnSection: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: wp(5),
    marginTop: hp(2),
  },
  selectBtn: {
    fontSize: 16,
    color: colors.green,
    fontFamily: Fonts.IBM_Medium,
  },
  mutiDates: {
    height: 50,
    marginVertical: hp(2),
    marginHorizontal: wp(3),
    borderRadius: 5,
    backgroundColor: "#B2543A",
  },
  singleDate: {
    height: 45,
    width: 45,
    borderRadius: 5,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: wp(1),
    backgroundColor: colors.lightTheme,
  },
  dayText: {
    fontSize: 18,
    color: colors.cWhite,
    fontFamily: Fonts.IBM_Bold,
  },
  monthText: {
    fontSize: 10,
    color: colors.cWhite,
    fontFamily: Fonts.IBM_SemiBold,
  },
  calendarList: {
    height: 350,
  },
  noDate: {
    marginTop: 18,
    textAlign: "center",
    color: colors.cWhite,
    fontFamily: Fonts.IBM_Medium,
  },
  multiSelect: {
    height: 45,
    width: "48%",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-around",
  },
});
