import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { MainHeader, EventCard } from "../../components";
import Ionicons from "react-native-vector-icons/Ionicons";
import CalendarStrip from "react-native-calendar-strip";
import colors from "../../constant/colors";
import moment from "moment";
import { images } from "../../assets/images/Images";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Entypo from "react-native-vector-icons/Entypo";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import allActions from "../../redux/actions";
import MindAxios from "../../api/MindAxios";
import Env from "../../api/Env";
import AppText from "../../components/AppText";
import { FadeInFlatList } from "../../components/FadeInFlatList";
import ThemeContext from "../Context/ThemeContext";
import { Modal } from "react-native";
import { Button } from "react-native";
import { Pressable } from "react-native";
import CustomDropDown from "../../components/CustomDropDown";
import { TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native";
import { countries } from "../../constant/staticData";
import Helper from "../Helper";
import { ScrollView } from "react-native";
// import { dark as theme } from "../../constant/colorsConfig";
const r_s = (myString) => {
  myString = myString.toString();
  let myNewString = myString?.replace(/ /g, "+");
  return myNewString;
};
let monthBack = moment().subtract("months", 1).format("YYYY-MM-DD");
let monthAhead = moment().add("months", 1).format("YYYY-MM-DD");
let today = moment().format("YYYY-MM-DD");
const CalendarScreen = (props) => {
  const [eventList, setEventList] = useState(null);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState();
  const [attendance, setAttendance] = useState();
  const [meetingType, setMeetingType] = useState();
  const [status_type, setStatusType] = useState();
  const [durationType, setDurationType] = useState();
  const [queryUrl, setQueryUrl] = useState(
    `events?page_size=50&start_at_date=${monthBack}&end_at_date=${monthAhead}`
  );
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);
  const countries_list = Helper.deepCopy(countries);
  // countries_list.unshift({ value: "All" });
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const q_c = (word, rep, myQuery) => {
    let str = myQuery ? myQuery : queryUrl;
    if (str?.includes(`${word}`)) {
      let arr = str.split("&");
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].includes(`${word}`)) {
          let index = arr[i].indexOf("=") + 1;
          let val = arr[i].substring(index, arr[i].length);
          arr[i] = `${word}=${rep}`;
        }
      }
      str = arr.join("&");
      return str;
    } else {
      return null;
    }

    // console.log(str);
  };

  // console.log("today", today);
  const currentDate = useSelector((state) => state.DataReducer.currentEvents);
  useEffect(() => {
    if (focused) {
      fetchEvents();
    }
  }, [focused]);
  const apply = async () => {
    console.log("queryUrl", queryUrl);
    setLoading(true);
    await fetchEvents(queryUrl);
    setLoading(false);
    setModalVisible(false);
  };
  const fetchEvents = async (query) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl(
        query
          ? query
          : `events?page_size=50&start_at_date=${monthBack}&end_at_date=${monthAhead}`
      )
    );
    console.log("res", response);
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      // console.log("data", _data);
      setEventList(_data);
      let todayDate = currentDate ? currentDate : today;
      let filtered = filterWrtDate(_data, todayDate);
      setCurrent(filtered);
      // if (filtered?.length) {
      //   setCurrent(filtered);
      //   dispatch(allActions.DataAction.current_events(filtered));
      // }
    } else {
      // alert(language?.serverError);
    }
  };
  const filterWrtDate = (data, date) => {
    if (data?.length) {
      let currentSchedules = [];
      for (let d of data) {
        // var found = false;

        let event_schedules = d?.event_schedules;

        if (event_schedules?.length) {
          for (let obj of event_schedules) {
            // console.log("d", obj);
            if (obj?.start_at_date == date) {
              // console.log("d", obj);
              currentSchedules.push(d);
              // found = true;
              break;
            }
          }
        }
      }
      console.log("currentSchedules", currentSchedules);
      return currentSchedules;
    } else {
      return null;
    }
  };

  const clear = () => {
    setLocation(null);
    setAttendance(null);
    setStatusType(null);
    setDurationType(null);
    setMeetingType(null);
    setStatusType(null);
    setQueryUrl(
      `events?page_size=50&start_at_date=${monthBack}&end_at_date=${monthAhead}`
    );
    // setModalVisible(false);
  };
  const renderEvents = ({ item, index }) => {
    return (
      <EventCard
        ItemDetail={item}
        onPressDetail={() => {
          dispatch(allActions.DetailAction.EventDetail(item));
          props.navigation.navigate("EventDetail");
        }}
      />
    );
  };
  return (
    <>
      <View style={{ flex: 1, backgroundColor: theme?.white }}>
        <MainHeader
          rightIcon={
            <Ionicons
              onPress={handleOpenModal}
              name="filter-outline"
              color={colors.cWhite}
              size={25}
            />
          }
          title="Events Calendar"
          onPressBack={() => {
            dispatch(allActions.DataAction.current_events(null));
            props.navigation.goBack();
          }}
        />
        {/* <View
        style={{
          height: 150,
          backgroundColor: "lightgrey",
        }}
      > */}
        <CalendarStrip
          scrollable
          // scrollerPaging={true}
          minDate={new Date(monthBack)}
          maxDate={new Date(monthAhead)}
          calendarAnimation={{ type: "parallel", duration: 30 }}
          style={styles.main}
          calendarHeaderStyle={{
            color: colors.lightTheme,
            // marginBottom: 30,
            marginTop: 10,
          }}
          customDatesStyles={customDatesStyles}
          dateNumberStyle={styles.dateNumberStyle}
          dateNameStyle={styles.dateNameStyle}
          highlightDateNameStyle={styles.highlightDateNameStyle}
          highlightDateNumberStyle={styles.highlightDateNumberStyle}
          highlightDateContainerStyle={styles.highlightDateContainerStyle}
          selectedDate={new Date(currentDate ? currentDate : today)}
          onDateSelected={(day) => {
            let selectedDay = day?.format("YYYY-MM-DD");
            console.log(selectedDay);
            let filtered = filterWrtDate(eventList, selectedDay);
            dispatch(allActions.DataAction.current_events(selectedDay));
            setCurrent(filtered);
          }}
          useIsoWeekday={false}
        />
        {/* </View> */}
        <AppText
          style={{
            marginTop: 10,
            marginLeft: 15,
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          Events
        </AppText>
        {current?.length ? (
          <FadeInFlatList
            initialDelay={0}
            durationPerItem={500}
            parallelItems={1}
            itemsToFadeIn={10}
            data={current}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            renderItem={renderEvents}
            style={styles.listStyle}
          />
        ) : (
          <View style={styles.empty}>
            <AppText style={styles.itemText}>Found No Events</AppText>
          </View>
        )}
      </View>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.centeredView}>
          <View
            style={[styles.container, { backgroundColor: theme?.cardColor }]}
          >
            <Pressable onPress={handleCloseModal} style={styles.cross}>
              <Entypo name="cross" color="#000" size={30} />
            </Pressable>
            <View style={styles.filterTxt}>
              <Text style={styles.modalText}>Event Filters</Text>
            </View>

            <View style={styles.dropdowns}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <CustomDropDown
                  data={countries_list}
                  value={location}
                  label={location ? "Location" : "Select Location"}
                  height={hp(30)}
                  position={-4.8}
                  onChangeText={(val) => {
                    setLocation(val);
                    let qr = q_c("country[]", r_s(val));
                    if (qr) {
                      setQueryUrl(qr);
                    } else {
                      setQueryUrl(`${queryUrl}&country[]=${r_s(val)}`);
                    }
                  }}
                />
                <CustomDropDown
                  data={[{ value: "Open" }, { value: "Private" }]}
                  label={"Attendance Type"}
                  value={attendance}
                  position={-3}
                  onChangeText={(val) => {
                    console.log(val);
                    setAttendance(val);
                    // attendance_type[]
                    let qr = q_c("attendance_type[]", r_s(val));
                    if (qr) {
                      setQueryUrl(qr);
                    } else {
                      setQueryUrl(`${queryUrl}&attendance_type[]=${r_s(val)}`);
                    }
                  }}
                />
                <CustomDropDown
                  data={[
                    { value: "Standard" },
                    { value: "Recurring" },
                    { value: "MultiDay" },
                  ]}
                  label={"Duration Type"}
                  value={durationType}
                  position={-3.9}
                  onChangeText={(val) => {
                    console.log(val);
                    setDurationType(val);
                    // duration_type
                    let qr = q_c("duration_type", r_s(val));
                    if (qr) {
                      setQueryUrl(qr);
                    } else {
                      setQueryUrl(`${queryUrl}&duration_type=${r_s(val)}`);
                    }
                  }}
                />
                <CustomDropDown
                  data={[
                    { value: "In Person" },
                    { value: "Virtual" },
                    { value: "Both" },
                  ]}
                  label={"Meeting Type"}
                  value={meetingType}
                  position={-3.9}
                  onChangeText={(val) => {
                    console.log(val);
                    setMeetingType(val);
                    // meeting_type[]
                    let qr = q_c(
                      "meeting_type[]",
                      r_s(val == "Both" ? "In_Person_And_Virtual" : val)
                    );
                    if (qr) {
                      setQueryUrl(qr);
                    } else {
                      setQueryUrl(
                        `${queryUrl}&meeting_type[]=${r_s(
                          val == "Both" ? "In_Person_And_Virtual" : val
                        )}`
                      );
                    }
                  }}
                />
                <CustomDropDown
                  data={[
                    { value: "Active" },
                    { value: "Future" },
                    { value: "Closed" },
                  ]}
                  label={"Status Type"}
                  value={status_type}
                  position={-3.9}
                  onChangeText={(val) => {
                    console.log(val);
                    setStatusType(val);
                    let qr = q_c("status", r_s(val));
                    if (qr) {
                      setQueryUrl(qr);
                    } else {
                      setQueryUrl(`${queryUrl}&status=${r_s(val)}`);
                    }
                  }}
                />
              </ScrollView>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity onPress={clear} style={styles.shareBtn}>
                <Text style={styles.textStyle}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={apply} style={styles.shareBtn}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.textStyle}>Apply</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export { CalendarScreen };

const customDatesStyles = () => {
  return {
    dateContainerStyle: {
      height: 80,
      width: 50,
      borderRadius: 20,
      borderColor: colors.white,
      backgroundColor: colors.white,
      marginTop: 20,
      shadowColor: "grey",
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 0.84,
      elevation: 5,
    },
  };
};

const styles = StyleSheet.create({
  main: {
    height: 150,
    // paddingTop: 15,
    width: Dimensions.get("window").width + 100,
    alignSelf: "center",
    // paddingLeft: 20,
    // paddingBottom: 10,
    backgroundColor: "lightgrey",
  },
  dateNumberStyle: {
    color: colors.black,
    fontWeight: "normal",
    marginTop: 5,
    //fontFamily: "Lato-Regular",
  },
  dateNameStyle: {
    color: colors.black,
    fontSize: 12,
    //fontFamily: "Lato-Regular",
  },
  highlightDateNameStyle: {
    color: colors.white,
    fontSize: 14,
    //fontFamily: "Lato-Bold",
  },
  highlightDateNumberStyle: {
    color: colors.white,
    //fontFamily: "Lato-Bold",
    marginTop: 6,
  },
  highlightDateContainerStyle: {
    backgroundColor: colors.lightTheme,
    marginTop: 0,
    height: 80,
    width: 55,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 0.84,
    elevation: 5,
  },
  listStyle: {
    paddingHorizontal: wp(3),
    paddingTop: hp(1.5),
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.lightTheme,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: hp(10),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  dropdowns: {
    flex: 0.65,
    width: "90%",
    // backgroundColor: "grey",
    alignSelf: "center",
  },
  modalText: {
    fontSize: 22,
    fontWeight: "600",
    // margin: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  container: {
    height: 380,
    width: wp(90),
    backgroundColor: "#fff",
    borderRadius: hp(1),
    alignSelf: "center",
  },
  filterTxt: {
    flex: 0.15,
    width: "90%",
    justifyContent: "center",
    alignSelf: "center",
    // backgroundColor: "orange",
  },
  cross: {
    backgroundColor: "lightgrey",
    height: 35,
    width: 35,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -15,
    right: -5,
    zIndex: 100,
  },
  footer: {
    flex: 0.15,
    flexDirection: "row",
    // backgroundColor: "orange",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  textStyle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  shareBtn: {
    height: 30,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightTheme,
    borderRadius: 10,
    marginRight: 15,
  },
});
