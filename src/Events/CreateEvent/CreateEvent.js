import React, { useState, useRef, useContext, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Switch,
  TextInput,
  Pressable,
  Image,
  ScrollView,
} from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import moment from "moment";
import { styles } from "./styles";
import AppText from "../../../components/AppText";
import ThemeContext from "../../Context/ThemeContext";
import GooglePlaces from "../../../components/GooglePlaces";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import {
  MainHeader,
  FloatingInput,
  GradBtn,
  BottomSheet,
  TimePickers,
} from "../../../components";

import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import Octicons from "react-native-vector-icons/Octicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import ErrorMessage from "../../forms/ErrorMessage";
import PickModal from "../../../components/PickModal";
import InputButton from "../../../components/InputButton";
import SelectedItems from "../../../components/SelectedItems";
import CustomDropDown from "../../../components/CustomDropDown";
import { SelectionSheet, CalenderSheet, MediaSheet } from "../../Sheets";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

const meetingData = [
  { value: "Virtual" },
  { value: "In Person" },
  { value: "In Person And Virtual" },
];

const durationData = [
  { value: "Standard" },
  { value: "Recurring" },
  { value: "MultiDay" },
];
import { countries, newTopics } from "../../../constant/staticData";
import AuthContext from "../../Context/AuthContext";

export const CreateEvent = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const reduxType = useSelector((state) => state.SheetReducer.eventType);
  const { theme, mode } = useContext(ThemeContext);

  const mediaSheetRef = useRef();
  const yearsSheetRef = useRef();
  const topicSheetRef = useRef();
  const calendarSheetRef = useRef();
  const countrySheetRef = useRef();
  const categorySheetRef = useRef();
  const selectedImages = useSelector(
    (state) => state.DataReducer.selected_images
  );

  const year = new Date().getFullYear();
  const years = Array.from(new Array(300), (val, index) => {
    let item = { key: year - index, isSelected: false };
    return item;
  });

  const staticTopics = Helper.deepCopy(newTopics)?.map(
    ({ value: key, ...rest }) => ({
      key,
      ...rest,
    })
  );

  let countryId = 1;
  const staticCountries = Helper.deepCopy(countries)?.map(
    ({ value: key, ...rest }) => ({
      key,
      ...rest,
      isSelected: false,
      id: countryId++,
    })
  );

  const [eventType, setEventType] = useState(reduxType);
  const [meetingType, setMeetingType] = useState(null);
  const [eventDuration, setEventDuration] = useState(null);
  const [attendenceOption, setAttendenceOption] = useState(null);
  const [topicList, setTopicList] = useState(staticTopics);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [instruction, setInstruction] = useState(null);
  const [ticketPrice, setTicketPrice] = useState(null);
  const [link, setLink] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [yearList, setYearList] = useState(years);
  const [listChanged, setListChanged] = useState(true);
  const [isParking, setIsParking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [address, setAddress] = useState({
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });

  const [errMsgs, setErrMsgs] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [countriesData, setCountriesData] = useState(staticCountries);
  const [recurringList, setRecurringList] = useState(null);
  const [eventCategories, setEventCategories] = useState([]);
  const [exhibCatgories, setExhibCategories] = useState([]);
  const [expPickerVisible, setExpPickerVisible] = useState(false);
  const [expDate, setExpDate] = useState(null);

  const {
    myState: { language },
  } = useContext(AuthContext);

  const filterYears = yearList.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });
  const filterTopics = topicList?.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });
  const filterCountries = countriesData?.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });
  let filterCategories;
  if (eventType === "Event") {
    filterCategories = eventCategories?.filter((item) => {
      if (item.isSelected == true) {
        return item;
      }
    });
  } else {
    filterCategories = exhibCatgories?.filter((item) => {
      if (item.isSelected == true) {
        return item;
      }
    });
  }

  const placeHolderChecker = (item, placeHolder) => {
    if (item?.length == 1) {
      // return item[0]?.key;
      return placeHolder;
    } else if (item?.length > 1) {
      // return `${item[0]?.key} & more`;
      return placeHolder;
    } else {
      return placeHolder;
    }
  };

  useEffect(() => {
    if (focused) {
      fetchCategories();
    }
  }, [focused]);

  const fetchCategories = async () => {
    const response = await MindAxios.get(
      Env.createUrl("categories/?type=events")
    );
    if (response?.status == 200) {
      let data = response?.data?.result?.categories;
      let newData = data.map(({ name: key, ...rest }) => ({
        key,
        ...rest,
        isSelected: false,
      }));
      const exhibCateg = newData?.filter((item) => item?.key === "Exhibition");
      setEventCategories(newData);
      setExhibCategories(exhibCateg);
    }
  };

  const handleError = (error, input) => {
    setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
  };

  const checkValidation = () => {
    let isValid = true;
    if (!selectedImages?.length) {
      handleError("Media is Required.", "mediaErrMessage");
      isValid = false;
    } else {
      handleError(null, "mediaErrMessage");
    }

    if (!title) {
      handleError("Title is Required.", "titleErrMessage");
      isValid = false;
    }

    if (!meetingType) {
      handleError("Meeting type is Required.", "typeErrMessage");
      isValid = false;
    }

    if (!eventDuration) {
      handleError("Duration type required.", "durationErrMessage");
      isValid = false;
    }

    if (!selectedDate) {
      handleError("Date is required.", "dateErrMessage");
      isValid = false;
    } else {
      handleError(null, "dateErrMessage");
    }

    if (!startTime) {
      handleError("Start & End time is required.", "timeErrMessage");
      isValid = false;
    } else if (!endTime) {
      handleError("Start & End time is required.", "timeErrMessage");
      isValid = false;
    } else {
      handleError(null, "timeErrMessage");
    }

    if (!filterCategories?.length) {
      handleError("Categories is required", "categErrMessage");
      isValid = false;
    }

    if (eventType === "Virtual Exhibition") {
      if (!ticketPrice && meetingType !== "Virtual") {
        handleError("Ticket price is required", "priceErrMessage");
        isValid = false;
      }
      if (!instruction) {
        handleError(
          "Participant instructions are required",
          "instructionErrMessage"
        );
        isValid = false;
      }
      if (!expDate) {
        handleError("Expiry date is required.", "expErrMessage");
        isValid = false;
      }
    }
    if (meetingType !== "Virtual") {
      if (!address?.address) {
        handleError("Location is required", "locationErrMessage");
        isValid = false;
      } else if (!address.city) {
        handleError("City is required", "cityErrMessage");
        isValid = false;
      } else if (!address.state) {
        handleError("State is required", "stateErrMessage");
        isValid = false;
      } else if (!address.country) {
        handleError("Country is required", "countryErrMessage");
        isValid = false;
      }
    }

    if (!description) {
      handleError("Description is required", "descriptionErrMessage");
      isValid = false;
    }

    if (isValid) {
      handleConfirm();
    } else {
      alert("Please fill all the required fileds.");
    }
  };

  const handleConfirm = async () => {
    dispatch(allActions.DataAction.AppLoader(false));
    let scheduleList;
    if (eventDuration === "Recurring") {
      scheduleList = recurringList?.map((item) => {
        const myStartTime = Helper.changeDateTimeToUTCZero(
          `${item}T${startTime}`
        );
        const myEndTime = Helper.changeDateTimeToUTCZero(`${item}T${endTime}`);
        const splitStart = myStartTime.split(" ");
        const splitEnd = myEndTime.split(" ");
        return {
          start_at_time: splitStart[1],
          end_at_time: splitEnd[1],
          start_at_date: splitStart[0],
          end_at_date: splitStart[0],
        };
      });
    } else {
      const eventDate = selectedDate.split("to");
      const myStartTime = Helper.changeDateTimeToUTCZero(
        `${eventDate.length ? eventDate[0].trim() : selectedDate}T${startTime}`
      );
      const myEndTime = Helper.changeDateTimeToUTCZero(
        `${eventDate[1] ? eventDate[1].trim() : selectedDate}T${endTime}`
      );
      const splitStart = myStartTime.split(" ");
      const splitEnd = myEndTime.split(" ");
      scheduleList = [
        {
          start_at_time: splitStart[1],
          end_at_time: splitEnd[1],
          start_at_date:
            eventDuration === "Standard" ? splitStart[0] : eventDate[0],
          end_at_date:
            eventDuration === "Standard" ? splitStart[0] : splitEnd[0],
        },
      ];
    }
    const newType = meetingType.replace(/ /g, "_");
    const body = {
      media_ids: selectedImages.map((item) => item.id),
      title: title,
      type: eventType == "Virtual Exhibition" ? "Exhibition" : eventType,
      meeting_type: newType,
      attendance_type: attendenceOption,
      duration_type: eventDuration,
      event_schedules: scheduleList,
      topic_ids: filterTopics?.map((item) => item.id),
      category_ids: filterCategories?.map((item) => item.id),
      // participant_desc: instruction,
      // ticket_price: ticketPrice,
      external_link: link,
      event_desc: description,
      address: {
        address: address?.address?.address,
        city: address?.city,
        country: address?.country,
        zipcode: address?.zipcode,
        state: address?.state,
      },
      is_parking_exist: isParking,
    };
    if (eventType === "Virtual Exhibition") {
      body.expiry_time = expDate;
      body.ticket_price = ticketPrice;
      body.participant_desc = instruction;
      body.country_ids = filterCountries?.map((item) => item.id.toString());
      body.years = filterYears.map((item) => item.key.toString());
    }
    console.log("body-->", body);
    const response = await MindAxios.post(Env.createUrl("events"), body);
    console.log(response);
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      dispatch(allActions.DataAction.SelectedImg([]));
      props.navigation.replace("InviteMember", {
        EventDetail: response?.data?.result?.item,
      });
    } else {
      alert(language?.serverError);
    }
  };

  const toggleItem = (selected, i, data, setState) => {
    if (selected) {
      var res = data.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            isSelected: false,
          };
        } else {
          return item;
        }
      });
      setState(res);
    } else {
      var res = data.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            isSelected: true,
          };
        } else {
          return item;
        }
      });
      setState(res);
    }
  };

  const renderSelectedYears = ({ item, index }) => {
    // console.log('item-->', item)
    return (
      <SelectedItems
        item={item?.key}
        remove={() => {
          item.isSelected = false;
          setListChanged(!listChanged);
        }}
      />
    );
  };

  const renderSelectedImages = ({ item, index }) => {
    return (
      <View
        style={[
          styles.editStampCard,
          {
            marginRight: index == selectedImages?.length - 1 ? hp(10) : null,
            borderColor: theme.theme,
            backgroundColor: theme.white,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            let tempArray = [...selectedImages];
            tempArray.splice(index, 1),
              dispatch(allActions.DataAction.SelectedImg([...tempArray]));
          }}
        >
          <EvilIcons
            name="close"
            size={18}
            style={[styles.crossIcon, { color: theme.davyGrey }]}
          />
        </TouchableOpacity>
        <Image
          style={styles.stampImg}
          source={{ uri: item?.uri ? item?.uri : item?.media_url }}
        />
      </View>
    );
  };

  return (
    <View style={[styles.mainConatiner, { backgroundColor: theme?.white }]}>
      <MainHeader
        title={`Create ${reduxType}`}
        onPressBack={() => {
          dispatch(allActions.DataAction.SelectedImg([]));
          props.navigation.goBack();
        }}
      />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <View style={styles.mediaSection}>
          <AppText style={[styles.mediaText, { color: theme.darkGrey }]}>
            {language?.uploadPhoto}
          </AppText>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={[
                styles.addStampCard,
                {
                  backgroundColor: theme.white,
                  shadowColor: theme.black,
                },
              ]}
              onPress={() => mediaSheetRef?.current?.open()}
            >
              <Octicons name="plus" size={44} color={theme.theme} />
            </TouchableOpacity>
            <View style={{ marginLeft: 5 }}>
              <FlatList
                data={selectedImages}
                showsHorizontalScrollIndicator={false}
                horizontal
                renderItem={renderSelectedImages}
              />
            </View>
          </View>
        </View>
        <ErrorMessage
          visible={errMsgs.mediaErrMessage ? true : false}
          error={errMsgs.mediaErrMessage}
        />
        <FloatingInput
          label={language?.title + "*"}
          value={title}
          onChangeText={(text) => {
            handleError(null, "titleErrMessage");
            setTitle(text);
          }}
          error={errMsgs.titleErrMessage ? errMsgs.titleErrMessage : false}
        />
        <CustomDropDown
          position={-3}
          value={eventType == "Exhibition" ? "Virtual Exhibition" : eventType}
          data={[{ value: "Event" }, { value: "Virtual Exhibition" }]}
          label={eventType ? language?.type : `${language?.selectType}*`}
          onChangeText={(val) => setEventType(val)}
        />
        <CustomDropDown
          position={-4}
          data={meetingData}
          label={
            meetingType
              ? language?.meetingType
              : `${language?.selectMeetingType}*`
          }
          onChangeText={(val) => {
            handleError(null, "typeErrMessage");
            setMeetingType(val);
          }}
        />
        <ErrorMessage
          visible={errMsgs.typeErrMessage ? true : false}
          error={errMsgs.typeErrMessage}
        />
        <CustomDropDown
          position={-3}
          data={[{ value: "Open" }, { value: "Private" }]}
          label={
            attendenceOption
              ? language?.attendenceOption
              : language?.selectAttendenceOption
          }
          onChangeText={(val) => setAttendenceOption(val)}
        />
        <CustomDropDown
          position={-4}
          data={durationData}
          label={
            eventDuration
              ? language?.eventDurationType
              : language?.selectDurationType + "*"
          }
          onChangeText={(val) => {
            handleError(null, "durationErrMessage");
            setSelectedDate(null);
            setEventDuration(val);
          }}
        />
        <ErrorMessage
          visible={errMsgs.durationErrMessage ? true : false}
          error={errMsgs.durationErrMessage}
        />
        {eventDuration !== null && (
          <>
            <Pressable
              style={[styles.datePicker, { borderColor: theme.lightGrey }]}
              onPress={() => {
                if (eventDuration === "Standard") {
                  setDatePickerVisibility(true);
                } else {
                  calendarSheetRef?.current?.open();
                }
              }}
            >
              {eventDuration === "Recurring" ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {recurringList?.map((item) => (
                    <TextInput
                      value={`${item}, `}
                      editable={false}
                      style={{ color: theme.davyGrey }}
                      placeholderTextColor={theme.dovGray}
                      placeholder={language?.selectEventDate + "*"}
                    />
                  ))}
                </ScrollView>
              ) : (
                <TextInput
                  value={selectedDate}
                  editable={false}
                  style={{ color: theme.davyGrey }}
                  placeholderTextColor={theme.dovGray}
                  placeholder={language?.selectEventDate + "*"}
                />
              )}
              <Ionicons
                name="ios-calendar-outline"
                color={theme.dovGray}
                size={24}
                style={{ marginBottom: -5, marginLeft: -5 }}
              />
            </Pressable>
            <ErrorMessage
              visible={errMsgs.dateErrMessage ? true : false}
              error={errMsgs.dateErrMessage}
            />
            <TimePickers
              date={moment(new Date()).format("yyyy-MM-DD")}
              label={language?.eventStartTime + "*"}
              time={startTime}
              setTime={setStartTime}
              label1={language?.eventEndTime + "*"}
              time1={endTime}
              setTime1={setEndTime}
            />
            <ErrorMessage
              visible={errMsgs.timeErrMessage ? true : false}
              error={errMsgs.timeErrMessage}
            />
          </>
        )}
        {filterCategories?.length ? (
          <View style={{ marginTop: hp(1.5) }}>
            <FlatList
              extraData={listChanged}
              horizontal={true}
              showsHorizontalScrollIndicator={true}
              data={filterCategories}
              renderItem={renderSelectedYears}
            />
          </View>
        ) : null}
        <InputButton
          style={{ marginTop: filterCategories?.length ? -10 : 0 }}
          onPress={() => {
            handleError(null, "categErrMessage");
            categorySheetRef?.current?.open();
          }}
          placeHolder={placeHolderChecker(
            filterCategories,
            language?.selectCategories + "*"
          )}
        />
        <ErrorMessage
          visible={errMsgs.categErrMessage ? true : false}
          error={errMsgs.categErrMessage}
        />
        {filterTopics?.length ? (
          <View style={{ marginTop: hp(1.5) }}>
            <FlatList
              extraData={listChanged}
              horizontal={true}
              showsHorizontalScrollIndicator={true}
              data={filterTopics}
              renderItem={renderSelectedYears}
            />
          </View>
        ) : null}
        <InputButton
          style={{ marginTop: filterTopics?.length ? -10 : 0 }}
          onPress={() => topicSheetRef?.current?.open()}
          placeHolder={placeHolderChecker(filterTopics, language?.selectTopics)}
        />
        {eventType === "Virtual Exhibition" ||
          (eventType === "Exhibition" && (
            <>
              <Pressable
                style={[styles.datePicker, { borderColor: theme.lightGrey }]}
                onPress={() => setExpPickerVisible(true)}
              >
                <TextInput
                  value={expDate}
                  editable={false}
                  style={{ color: theme.davyGrey }}
                  placeholderTextColor={theme.dovGray}
                  placeholder={`${language?.selectExpiryDate}*`}
                />
                <Ionicons
                  name="ios-calendar-outline"
                  color={theme.dovGray}
                  size={24}
                  style={{ marginBottom: -5, marginLeft: -5 }}
                />
              </Pressable>
              <ErrorMessage
                visible={errMsgs.expErrMessage ? true : false}
                error={errMsgs.expErrMessage}
              />
              <FloatingInput
                multiline
                label={language?.participantsInstruction + "*"}
                value={instruction}
                onChangeText={(text) => {
                  handleError(null, "instructionErrMessage");
                  setInstruction(text);
                }}
                error={
                  errMsgs.instructionErrMessage
                    ? errMsgs.instructionErrMessage
                    : false
                }
              />
              {meetingType != "Virtual" && (
                <FloatingInput
                  label={language?.ticketPrice + "*"}
                  value={ticketPrice}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    handleError(null, "priceErrMessage");
                    setTicketPrice(text);
                  }}
                  error={
                    errMsgs.priceErrMessage ? errMsgs.priceErrMessage : false
                  }
                />
              )}
            </>
          ))}
        <FloatingInput
          label={language?.addLink}
          value={link}
          autoCapitalize={"none"}
          onChangeText={(text) => setLink(text)}
        />
        {meetingType !== "Virtual" ? (
          <>
            <GooglePlaces
              label={language?.location + "*"}
              address={address?.address}
              setAddress={(address) => {
                handleError(null, "locationErrMessage");
                setAddress({ ...address, address });
              }}
            />
            <ErrorMessage
              visible={errMsgs.locationErrMessage ? true : false}
              error={errMsgs.locationErrMessage}
            />

            <View style={styles.inputContainer}>
              <FloatingInput
                label={language?.Town_City + "*"}
                width={wp(40)}
                value={address?.city?.toString()}
                onChangeText={(text) => {
                  handleError(null, "cityErrMessage");
                  setAddress({ ...address, city: text });
                }}
                error={errMsgs.cityErrMessage ? errMsgs.cityErrMessage : false}
              />

              <FloatingInput
                label={language?.State_Province + "*"}
                width={wp(40)}
                value={address?.state?.toString()}
                onChangeText={(text) => {
                  handleError(null, "stateErrMessage");
                  setAddress({ ...address, state: text });
                }}
                error={
                  errMsgs.stateErrMessage ? errMsgs.stateErrMessage : false
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <FloatingInput
                label={language?.zipCode}
                width={wp(40)}
                value={address?.zipcode?.toString()}
                onChangeText={(text) => {
                  setAddress({ ...address, zipcode: text });
                }}
              />
              <FloatingInput
                label={language?.country}
                width={wp(40)}
                value={address?.country?.toString()}
                onChangeText={(text) => {
                  handleError(null, "countryErrMessage");
                  setAddress({ ...address, country: text });
                }}
                error={
                  errMsgs.countryErrMessage ? errMsgs.countryErrMessage : false
                }
              />
            </View>
          </>
        ) : null}
        {eventType === "Virtual Exhibition" && (
          <>
            <AppText
              style={[
                styles.mediaText,
                { color: theme.darkGrey, marginTop: hp(1) },
              ]}
            >
              {language?.itemDetail}
            </AppText>
            <AppText style={[styles.infoText, { color: theme.davyGrey }]}>
              {language?.which_country_stamp_can_be_submitted}*
            </AppText>
            {filterCountries?.length ? (
              <View style={{ marginTop: hp(1) }}>
                <FlatList
                  extraData={listChanged}
                  horizontal={true}
                  showsHorizontalScrollIndicator={true}
                  data={filterCountries}
                  renderItem={renderSelectedYears}
                />
              </View>
            ) : null}
            <InputButton
              style={{ marginTop: -10 }}
              onPress={() => {
                // handleError(null, "countryErrMessage");
                // setModalVisible(true);
                countrySheetRef?.current?.open();
              }}
              label={language?.country}
              placeHolder={placeHolderChecker(
                filterCountries,
                language?.selectCountry
              )}
              selected={selectedCountry}
            />
            <AppText
              style={[
                styles.infoText,
                { color: theme.davyGrey, marginTop: hp(1) },
              ]}
            >
              {language?.which_year_stamp_can_be_submitted}
            </AppText>
            {filterYears?.length ? (
              <View style={{ marginTop: hp(1) }}>
                <FlatList
                  extraData={listChanged}
                  horizontal={true}
                  showsHorizontalScrollIndicator={true}
                  data={filterYears}
                  renderItem={renderSelectedYears}
                />
              </View>
            ) : null}
            <InputButton
              style={{ marginTop: -10 }}
              onPress={() => yearsSheetRef?.current?.open()}
              placeHolder={placeHolderChecker(filterYears, language?.pickYears)}
            />
          </>
        )}
        <FloatingInput
          multiline
          label={language?.description}
          value={description}
          onChangeText={(text) => {
            handleError(null, "descriptionErrMessage");
            setDescription(text);
          }}
          error={
            errMsgs.descriptionErrMessage
              ? errMsgs.descriptionErrMessage
              : false
          }
        />
        {meetingType !== "Virtual" && (
          <View style={styles.checkSection}>
            <AppText style={styles.parkingText}>
              {language?.parkingAvailable}
            </AppText>
            <Switch
              trackColor={{ false: "#767577", true: `${theme.theme}50` }}
              thumbColor={isParking ? theme.theme : "#f4f3f4"}
              ios_backgroundColor="lightgrey"
              onValueChange={() => setIsParking(!isParking)}
              value={isParking}
            />
          </View>
        )}
        <GradBtn label={language?.next} height={50} onPress={checkValidation} />
      </KeyboardAwareScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <PickModal
          setModalVisible={() => setModalVisible(false)}
          modalData={countries}
          placeholder={language?.searchCountries}
          onPress={(item) => {
            setSelectedCountry(item?.value);
            setModalVisible(false);
          }}
        />
      </Modal>
      {/* Media Sheet */}
      <BottomSheet
        ref={mediaSheetRef}
        sheetHeight={hp(35)}
        ChildComponent={
          <MediaSheet
            onSelectPhone={() => {
              mediaSheetRef?.current?.close();
              setTimeout(() => {
                props.navigation.navigate("AddItem", { isStamp: 1 });
              }, 300);
            }}
            onSelectStampbox={() => {
              mediaSheetRef?.current?.close();
              setTimeout(() => {
                props.navigation.navigate("StampboxMedia", { isStamp: 1 });
              }, 300);
            }}
            onPressCancel={() => {
              setTimeout(() => {
                mediaSheetRef?.current?.close();
              }, 300);
            }}
          />
        }
      />
      {/* Topics Sheet */}
      <BottomSheet
        ref={topicSheetRef}
        title={language?.selectTopics}
        onPressClose={() => topicSheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={hp(60)}
        ChildComponent={
          <SelectionSheet
            Data={topicList}
            onValueChange={(selected, index) =>
              toggleItem(selected, index, topicList, setTopicList)
            }
          />
        }
      />
      {/* Topic Sheet */}
      <BottomSheet
        ref={yearsSheetRef}
        title={language?.pickYears}
        onPressClose={() => yearsSheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={hp(60)}
        ChildComponent={
          <SelectionSheet
            Data={yearList}
            onValueChange={(selected, index) =>
              toggleItem(selected, index, yearList, setYearList)
            }
          />
        }
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        value={selectedDate}
        minimumDate={new Date()}
        display={eventDuration !== "Standard" ? "inline" : "spinner"}
        onCancel={() => setDatePickerVisibility(false)}
        onConfirm={(date) => {
          const _date = moment(date).format("yyyy-MM-DD");
          setSelectedDate(_date);
          setDatePickerVisibility(false);
        }}
      />
      <BottomSheet
        ref={calendarSheetRef}
        dropDown={false}
        borderRadius={10}
        sheetHeight={hp(55)}
        ChildComponent={
          <CalenderSheet
            dateType={eventDuration}
            onCancel={() => calendarSheetRef?.current?.close()}
            onSelectDate={(date) => {
              setSelectedDate(date);
              eventDuration === "Recurring" && setRecurringList(date);
              calendarSheetRef?.current?.close();
            }}
          />
        }
      />
      {/* Countries Sheet */}
      <BottomSheet
        ref={countrySheetRef}
        title={language?.selectCountries}
        onPressClose={() => countrySheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={hp(55)}
        ChildComponent={
          <SelectionSheet
            Data={countriesData}
            onValueChange={(selected, index) =>
              toggleItem(selected, index, countriesData, setCountriesData)
            }
          />
        }
      />
      {/* Categories Sheet */}
      <BottomSheet
        ref={categorySheetRef}
        title={language?.selectCategories}
        onPressClose={() => categorySheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={eventType === "Event" ? hp(52) : hp(18)}
        ChildComponent={
          <SelectionSheet
            Data={eventType === "Event" ? eventCategories : exhibCatgories}
            onValueChange={(selected, index) => {
              if (eventType === "Virtual Exhibition") {
                toggleItem(selected, index, exhibCatgories, setExhibCategories);
              } else {
                toggleItem(
                  selected,
                  index,
                  eventCategories,
                  setEventCategories
                );
              }
            }}
          />
        }
      />
      {/* Expiry Date Picker */}
      <DateTimePickerModal
        isVisible={expPickerVisible}
        mode="datetime"
        value={expDate}
        minimumDate={new Date()}
        display={"spinner"}
        onCancel={() => setExpPickerVisible(false)}
        onConfirm={(date) => {
          const _date = moment(date).format("yyyy-MM-DD H:mm:ss");
          setExpDate(_date);
          setExpPickerVisible(false);
          handleError(null, "expErrMessage");
        }}
      />
    </View>
  );
};
