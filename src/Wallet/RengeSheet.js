import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../constant/colors";
import Fonts from "../../assets/fonts/Fonts";
import AppText from "../../components/AppText";

import moment from "moment";
import { CalendarList } from "react-native-calendars";
import _ from "lodash";

export const RangeSheet = (props) => {
  const {
    onCancel,
    setSelectedRange,
    setFilterValue,
    filterValues,
    onSelectDate,
  } = props;
  const [selectedDates, setSelectedDates] = useState(null);

  const onSelect = () => {
    if (!selectedDates) {
      alert("Please select date range.");
    } else if (Object.keys(selectedDates?.start).length <= 1) {
      alert("Please select end date.");
    } else {
      const endDate = Object.keys(selectedDates?.start)[
        Object.keys(selectedDates?.start).length - 1
      ];
      const dateRange = `${selectedDates?.date} to ${endDate}`;
      setSelectedRange(dateRange);
      setFilterValue({
        ...filterValues,
        start_date: selectedDates?.date,
        end_date: endDate,
      });
      onSelectDate();
    }
  };

  const getDaysArray = function (start, end) {
    for (
      var arr = {}, dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      let newDt = moment(dt).format("YYYY-MM-DD");
      arr[newDt] = {
        color: colors.greenish,
        textColor: "white",
      };
    }
    return arr;
  };
  const dateChecker = (currentDate, newDate) => {
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
      setSelectedDates({ date: date.dateString, start: start });
    } else {
      let check = dateChecker(selectedDates.date, date.dateString);
      if (check !== "greater") {
        let start = {};
        start[date.dateString] = {
          startingDay: true,
          color: colors.greenish,
          textColor: "white",
        };
        setSelectedDates({ date: date.dateString, start: start });
      } else {
        let daylist = getDaysArray(selectedDates.date, date.dateString);
        let last = _.size(daylist) - 1;
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
        });
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

      <View
        style={[
          styles.mutiDates,
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            backgroundColor: colors.lightTheme,
          },
        ]}
      >
        <View style={styles.multiSelect}>
          <AppText style={{ color: "#fff", fontSize: 10 }}>From</AppText>
          <AppText style={{ color: "#fff", fontWeight: "bold" }}>
            {selectedDates?.date ? selectedDates?.date : ""}
          </AppText>
        </View>
        <View style={styles.multiSelect}>
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

      <CalendarList
        markingType={"period"}
        pastScrollRange={5}
        maxDate={new Date()}
        futureScrollRange={0}
        scrollEnabled={true}
        showScrollIndicator={true}
        theme={{
          todayTextColor: colors.lightTheme,
        }}
        markedDates={selectedDates ? selectedDates?.start : null}
        onDayPress={(date) => dateSeter(date)}
        style={styles.calendarList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    height: hp(5.5),
    marginVertical: hp(2),
    marginHorizontal: wp(3),
    borderRadius: 5,
    backgroundColor: "#B2543A",
  },
  dayText: {
    fontSize: 18,
    color: colors.cWhite,
    fontFamily: Fonts.IBM_Bold,
  },
  calendarList: {
    height: hp(40),
  },
  multiSelect: {
    height: hp(5),
    width: "48%",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-around",
  },
});
