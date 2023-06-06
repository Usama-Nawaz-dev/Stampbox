import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Image,
  Alert,
  Modal,
  Linking,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { styles } from "./styles";
import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";
import AppText from "../../../components/AppText";
import { ShareModal } from "../../Home/ShareModal";
import ErrorMessage from "../../forms/ErrorMessage";
import { images } from "../../../assets/images/Images";

import {
  GradBtn,
  AwardModal,
  EventHeader,
  BottomSheet,
  InterestItem,
  CustomButton,
  ImageZoomViewer,
  ImageListSlider,
  FeedBackModal,
} from "../../../components";
import AuthContext from "../../Context/AuthContext";

import moment from "moment";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import Feather from "react-native-vector-icons/Feather";
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import {
  EventMembers,
  EventRequests,
  EventInviteSheet,
} from "../EventSheetTab";

import Env from "../../../api/Env";
import Helper from "../../Helper";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";
import ThemeContext from "../../Context/ThemeContext";

export const EventDetail = (props) => {
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const eventDetail = useSelector((state) => state.DetailReducer.eventDetail);
  const selectedStamp = useSelector((state) => state.DetailReducer.stampsList);
  const eventType = eventDetail?.type;
  // const eventType = useSelector((state) => state.SheetReducer.eventType);

  const dispatch = useDispatch();
  const focused = useIsFocused();

  const sliderComp = useRef();
  const inviteUserSheet = useRef();
  const requestsSheetRef = useRef();
  const participantSheetRef = useRef();

  const owner = currentUser?.id === eventDetail?.user_id;
  const [detail, setDetail] = useState(null);
  const [imageViewer, setImageViewer] = useState(false);
  const [imageViewerData, setImageViewerData] = useState([]);
  const [imageViewerInitialIndex, setImageViewerInitialIndex] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [joinMsg, setJoinMsg] = useState(null);
  const [errMsg, setErrMsg] = useState(false);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isVisitor, setIsVisitor] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isReqAction, setIsReqAction] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [awardModalVisible, setAwardModalVisible] = useState(false);
  const [feedbackModalVisible, setfeedbackModalVisible] = useState(false);

  const medias = detail?.medias;
  const eventDays = detail?.event_schedules?.length - 1;
  const schedules = detail?.event_schedules[eventDays]
    ? detail?.event_schedules[eventDays]
    : null;

  const endEvent =
    eventDays >= 1
      ? detail?.event_schedules[eventDays]
      : detail?.event_schedules[0];

  const schedule = detail?.event_schedules[0];
  const localSTime = Helper.utcToLocalTime(
    `${schedule?.start_at_date} ${schedule?.start_at_time}`
  ).split(" ");
  const localETime = Helper.utcToLocalTime(
    `${schedule?.end_at_date} ${schedule?.end_at_time}`
  ).split(" ");

  const endDate = moment(endEvent?.end_at_date).format("DD MMM YY");
  const startDate = moment(detail?.event_schedules[0]?.start_at_date).format(
    "DD MMM YY"
  );
  const endTime = moment(localETime[1], ["h:mm A"]).format("hh:mm A");
  const startTime = moment(localSTime[1], ["h:mm A"]).format("hh:mm A");
  const userInfo = detail?.current_user_participant_info?.length
    ? detail?.current_user_participant_info[0]
    : false;

  let buyTicket;
  if (schedules?.is_expired) {
    buyTicket = false;
  } else if (!owner) {
    if (detail?.is_current_user_joined === 1 && detail?.ticket_price) {
      buyTicket = true;
    }
  } else {
    buyTicket = false;
  }

  const renderParticipants = ({ item, index }) => {
    return (
      <Image
        style={[
          styles.participantImg,
          {
            marginLeft: index !== 0 ? -8 : 0,
          },
        ]}
        source={{ uri: item?.user?.image_url }}
      />
    );
  };

  const latitude = "40.7127753";
  const longitude = "-74.0059728";
  const label = detail?.address?.address;

  const locUrl = Platform.select({
    ios: "maps:" + latitude + "," + longitude + "?q=" + label,
    android: "geo:" + latitude + "," + longitude + "?q=" + label,
  });

  useEffect(() => {
    if (focused) {
      fetchEventDetail();
      if (showModal) {
        setJoinModalVisible(true);
        setShowModal(false);
      }
    }
  }, [focused]);

  const fetchEventDetail = async (item) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(`events`, eventDetail?.id)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result?.item;
      let tempArray = [];
      _data?.medias?.map((x, index) => {
        tempArray.push({ url: x.media_url });
      });
      sliderComp?.current?.refresh(_data?.medias);
      setImageViewerData([...tempArray]);
      setDetail(_data);
    } else {
      alert(language?.serverError);
    }
  };

  const removeEventAlert = () =>
    Alert.alert(
      `Delete ${eventType} ?`,
      `Are you sure you want to delete this ${
        eventType === "Event" ? "event" : "exhibition"
      } ?`,
      [{ text: "Cancel" }, { text: "OK", onPress: () => deleteEvent() }]
    );

  const deleteEvent = async () => {
    const response = await MindAxios.delete(
      Env.paramUrl(`events`, eventDetail?.id)
    );
    if (response?.status == 200) {
      props.navigation.goBack();
    } else {
      alert(language?.serverError);
    }
  };

  const cancelRequest = async () => {
    const response = await MindAxios.delete(
      Env.paramUrl(`participants`, userInfo?.id)
    );
    if (response?.status === 200) {
      Helper.showToastMessage("Request Removed", colors.green);
      dispatch(allActions.DataAction.AppLoader(true));
      await fetchEventDetail();
      dispatch(allActions.DataAction.AppLoader(false));
    } else {
      Helper.showToastMessage(
        "There's some issue while removing request.",
        colors.danger
      );
    }
  };

  const onAcceptInvite = async () => {
    if (eventType === "Event") {
      let body = {
        message: joinMsg ? joinMsg : "",
        status: "Accepted",
      };
      onAcceptApi(body);
    } else {
      if (joinMsg) {
        const body = {
          message: joinMsg,
          status: "Accepted",
        };
        if (eventType === "Exhibition") {
          let exhibitables = [];
          if (isVisitor) {
            body.participated_as = "Visitor";
            onAcceptApi(body);
          } else {
            if (selectedStamp?.length) {
              selectedStamp.map((item) => {
                exhibitables.push({
                  exhibitable_type: "StampItem",
                  exhibitable_id: item?.id,
                });
              });
              body.exhibitables = exhibitables;
              body.participated_as = "Participant";
              onAcceptApi(body);
            } else {
              Helper.showToastMessage(
                "Please select at leat one stamp.",
                colors.blueTheme
              );
            }
          }
        }
      } else {
        setErrMsg("Join description can't be empty.");
      }
    }
  };

  const onAcceptApi = async (body) => {
    setLoading(true);
    const response = await MindAxios.post(
      Env.paramUrl(`participants`, userInfo?.id),
      body
    );
    setLoading(false);
    if (response?.status === 200) {
      setJoinMsg("");
      setShowInput(false);
      setJoinModalVisible(false);
      dispatch(allActions.DetailAction.StampsList(null));
      Helper.showToastMessage("Invitation Accepted.", colors.green);
      await fetchEventDetail();
    } else {
      Helper.showToastMessage(
        "There's some issue while accepting request.",
        colors.danger
      );
    }
  };

  const onJoinRequest = async () => {
    if (eventType === "Event") {
      let body = {
        message: joinMsg ? joinMsg : "",
        event_id: eventDetail?.id,
        user_id: currentUser?.id,
      };
      joinEventApi(body);
    } else {
      if (joinMsg) {
        const body = {
          message: joinMsg,
          event_id: eventDetail?.id,
          user_id: currentUser?.id,
        };
        if (eventType === "Exhibition") {
          let exhibitables = [];
          if (isVisitor) {
            body.participated_as = "Visitor";
            joinEventApi(body);
          } else {
            if (selectedStamp?.length) {
              selectedStamp.map((item) => {
                exhibitables.push({
                  exhibitable_type: "StampItem",
                  exhibitable_id: item?.id,
                });
              });
              body.exhibitables = exhibitables;
              body.participated_as = "Participant";
              joinEventApi(body);
            } else {
              Helper.showToastMessage(
                "Please select at leat one stamp.",
                colors.blueTheme
              );
            }
          }
        }
      } else {
        setErrMsg("Join description can't be empty.");
      }
    }
  };

  const joinEventApi = async (body) => {
    setLoading(true);
    const response = await MindAxios.post(Env.createUrl(`participants`), body);
    setLoading(false);
    if (response?.status === 200) {
      setJoinMsg("");
      setShowInput(false);
      setJoinModalVisible(false);
      Helper.showToastMessage("Join request sent.", colors.green);
      dispatch(allActions.DetailAction.StampsList(null));
      await fetchEventDetail();
    } else {
      setJoinMsg("");
      setShowInput(false);
      Helper.showToastMessage(
        "There's some issue while joining.",
        colors.danger
      );
    }
  };

  const checkUser = (user) => {
    if (currentUser?.id === user?.id) {
      props.navigation.navigate("MyProfile");
    } else {
      Helper.fbEvent("open_user_profile_from_events");
      dispatch(allActions.DetailAction.OtherUser(user));
      props.navigation.navigate("UserProfile");
    }
  };

  const renderSelectedImages = ({ item, index }) => {
    return (
      <View style={styles.editStampCard}>
        <TouchableOpacity
          onPress={() => {
            let tempArray = [...selectedStamp];
            tempArray.splice(index, 1);
            dispatch(allActions.DetailAction.StampsList([...tempArray]));
          }}
        >
          <EvilIcons name="close" size={18} style={styles.crossIcon} />
        </TouchableOpacity>
        <Image
          style={styles.selectedMedia}
          source={{
            uri: item?.medias?.length ? item?.medias[0]?.media_url : null,
          }}
        />
      </View>
    );
  };

  const attendOption = async (val) => {
    const body = {
      is_reachable: val,
      status: userInfo?.status,
    };
    // console.log(body, userInfo?.id);
    const response = await MindAxios.post(
      Env.paramUrl(`participants`, userInfo?.id),
      body
    );
    if (response.status === 200) {
      Helper.showToastMessage("Participant updated successfully", colors.green);
      fetchEventDetail();
    } else {
      Helper.showToastMessage(
        "Error occured while updating participant",
        colors.danger
      );
    }
  };

  const isExpired =
    detail?.event_schedules[detail?.event_schedules?.length - 1]?.is_expired;

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <EventHeader
        title={`${eventType} Detail`}
        rightIcon={owner}
        onEdit={() => {
          dispatch(allActions.DataAction.SelectedImg(medias));
          props.navigation.navigate("EditEvent", { detail: detail });
        }}
        onPressBack={() => {
          dispatch(allActions.DetailAction.EventDetail(null));
          dispatch(allActions.DetailAction.StampsList(null));
          props.navigation.goBack();
        }}
        onDelete={removeEventAlert}
      />
      <ScrollView>
        <View style={{ backgroundColor: colors.background }}>
          <ImageListSlider
            ref={sliderComp}
            data={detail?.medias}
            timer={2000}
            imageKey={"media_url"}
            width={wp(100)}
            height={hp(26)}
            local={false}
            separator={0}
            loop={false}
            autoscroll={false}
            indicator
            animation
            onPress={(i, data) => {
              setImageViewerInitialIndex(i);
              setImageViewer(true);
            }}
          />
        </View>
        <View style={styles.infoSection}>
          <View style={[styles.locSection, { marginTop: 0 }]}>
            <AppText style={styles.title}>{detail?.title}</AppText>

            <GradBtn
              height={hp(3.2)}
              fontSize={12}
              fontWeight={"500"}
              borderRadius={hp(10)}
              label={"Share in Clubs"}
              style={[styles.button, { width: wp(30) }]}
              onPress={() => {
                setShareModalVisible(true);
              }}
            />

            {/* Buy Exhibiton Ticket */}
            {/* {buyTicket &&
                            <GradBtn
                                height={30}
                                fontSize={14}
                                label={"Buy Ticket"}
                                fontWeight={'500'}
                                style={[styles.button, { width: wp(26) }]}
                                onPress={() => props?.navigation?.navigate(
                                    "BuyTicket", { EventDetail: detail })}
                            />
                        } */}
          </View>
          <View style={styles.dateSection}>
            <View style={styles.rowSection}>
              <Ionicons
                name="ios-calendar-outline"
                size={hp(2)}
                color={theme?.lightText}
              />
              <AppText style={styles.dateText}>
                {startDate} - {endDate}
              </AppText>
            </View>
            <View style={styles.rowSection}>
              <Fontisto name="clock" size={hp(2)} color={theme?.lightText} />
              <AppText style={styles.dateText}>
                {startTime} - {endTime}
              </AppText>
            </View>
          </View>

          {/* Address Section */}

          {detail?.address?.address ? (
            <View style={styles.locSection}>
              <View style={styles.rowSection}>
                <Ionicons
                  name="ios-map-outline"
                  size={hp(2)}
                  color={theme?.lightText}
                />
                <AppText style={styles.dateText}>
                  {detail?.address?.address
                    ? detail?.address?.address
                    : detail?.address?.city}
                </AppText>
              </View>
              <TouchableOpacity onPress={() => Linking.openURL(locUrl)}>
                <AppText style={[styles.mapText, { color: theme?.theme }]}>
                  {language?.seeMap}
                </AppText>
              </TouchableOpacity>
            </View>
          ) : null}
          <AppText style={styles.timeText}>
            {language?.startingAt}:
            <AppText style={{ color: theme?.theme }}>
              {" "}
              {isExpired
                ? `${eventType} Ended`
                : `${localSTime[0]} ${localSTime[1]}`}
            </AppText>
          </AppText>

          {/* Button Section */}

          {owner
            ? !isExpired && (
                <View style={styles.btnSection}>
                  <CustomButton
                    label={language?.Invite}
                    height={hp(3)}
                    width={wp(25)}
                    fontSize={12}
                    fontWeight="500"
                    bg={colors.background}
                    textColor={colors.btnText}
                    onPress={() => inviteUserSheet?.current?.open()}
                  />
                </View>
              )
            : !isExpired && (
                <View style={styles.btnSection}>
                  {userInfo ? (
                    <View style={styles.requestSection}>
                      {userInfo?.status === "Invited" && (
                        <GradBtn
                          height={hp(3)}
                          fontSize={12}
                          label={language?.acceptInvitation}
                          fontWeight={"500"}
                          style={styles.button}
                          onPress={() => {
                            setIsReqAction(true);
                            setJoinModalVisible(true);
                          }}
                        />
                      )}
                      {(userInfo?.status === "Pending" ||
                        userInfo?.status === "Invited") && (
                        <CustomButton
                          label={language?.cancelRequest}
                          height={hp(3)}
                          width={wp(30)}
                          fontSize={12}
                          fontWeight="500"
                          bg={colors.background}
                          textColor={colors.lightText}
                          onPress={cancelRequest}
                        />
                      )}
                    </View>
                  ) : (
                    <GradBtn
                      fontSize={12}
                      height={hp(3)}
                      fontWeight={"500"}
                      style={styles.button}
                      label={showInput ? language?.cancel : "Attend"}
                      onPress={() => setJoinModalVisible(true)}
                    />
                  )}
                </View>
              )}

          {/* Participant Section */}

          <View style={styles.locSection}>
            {detail?.participants_count ? (
              <View>
                <AppText style={styles.joinText}>
                  {language?.participants}
                </AppText>
                <FlatList
                  horizontal
                  style={{ marginTop: hp(0.5) }}
                  data={detail?.participants}
                  renderItem={renderParticipants}
                />
              </View>
            ) : null}
            <AppText style={styles.joinText}>
              {detail?.participants_count} {language?.joined}
            </AppText>
          </View>

          {/* Reward Section */}

          {owner ? null : (
            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-end",
              }}
            >
              <TouchableOpacity
                style={styles.awardSection}
                onPress={() => setAwardModalVisible(true)}
              >
                <Image
                  style={styles.coinIcon}
                  resizeMode="contain"
                  source={images.coin_stack}
                  tintColor={colors.red}
                />
                <AppText style={styles.awardText}>Give award</AppText>
              </TouchableOpacity>
              {detail?.is_current_user_joined ? (
                <TouchableOpacity
                  style={[styles.awardSection, { marginLeft: wp(3) }]}
                  onPress={() => setfeedbackModalVisible(true)}
                >
                  <Image
                    style={{ height: hp(2), width: hp(2) }}
                    resizeMode="contain"
                    source={images.Chat}
                    tintColor={"#fff"}
                  />
                  <AppText style={[styles.awardText]}>Feedback</AppText>
                </TouchableOpacity>
              ) : null}
            </View>
          )}

          {/* Attending Btn Sectionƒ */}

          {(detail?.is_current_user_invited ||
            detail?.is_current_user_joined) &&
          !isExpired ? (
            <View style={styles.participantSection}>
              <CustomButton
                fontSize={12}
                height={hp(4.2)}
                width={wp(40)}
                fontWeight="500"
                label={"Attending"}
                onPress={() => {
                  if (!userInfo?.is_reachable) {
                    attendOption(true);
                  }
                }}
                bg={
                  userInfo?.is_reachable ? colors.lightTheme : colors.background
                }
                textColor={
                  userInfo?.is_reachable ? colors.cWhite : colors.btnText
                }
              />
              <CustomButton
                fontSize={12}
                width={wp(40)}
                height={hp(4.2)}
                label={"May be"}
                fontWeight="500"
                onPress={() => {
                  if (userInfo?.is_reachable) {
                    attendOption(false);
                  }
                }}
                bg={
                  userInfo?.is_reachable ? colors.background : colors.lightTheme
                }
                textColor={
                  userInfo?.is_reachable ? colors.btnText : colors.cWhite
                }
              />
            </View>
          ) : null}

          {/* More Info Section */}

          {detail?.ticket_price && (
            <AppText style={styles.headingText}>
              {language?.ticketPrice}:
              <AppText style={{ color: theme?.theme }}>
                {" "}
                ${detail?.ticket_price}
              </AppText>
            </AppText>
          )}
          {detail?.participant_desc && (
            <>
              <AppText style={styles.headingText}>
                {language?.instructionsForParticipants}:
              </AppText>
              <AppText
                style={[styles.instructionText, { color: theme?.lightText }]}
              >
                {detail?.participant_desc}
              </AppText>
            </>
          )}
          <AppText style={styles.headingText}>{language?.description}:</AppText>
          <AppText
            style={[styles.instructionText, { color: theme?.lightText }]}
          >
            {detail?.event_desc}
          </AppText>

          {/* Topics, Categories, Countires and Years Listing  */}

          {detail?.categories?.length ? (
            <View style={styles.detailSection}>
              <AppText style={styles.joinText}>{language?.categories}</AppText>
              <ScrollView
                contentContainerStyle={styles.list}
                showsHorizontalScrollIndicator={false}
              >
                {detail?.categories?.map((item, index) => {
                  return (
                    <View style={{ marginTop: hp(1), marginRight: wp(2) }}>
                      <InterestItem item={item?.name} maxWidth={wp(45)} />
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}
          {detail?.topics?.length ? (
            <View style={styles.detailSection}>
              <AppText style={styles.joinText}>{language?.topics}</AppText>
              <ScrollView
                contentContainerStyle={styles.list}
                showsHorizontalScrollIndicator={false}
              >
                {detail?.topics?.map((item, index) => {
                  return (
                    <View style={{ marginTop: hp(1), marginRight: wp(2) }}>
                      <InterestItem item={item?.name} maxWidth={wp(45)} />
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}
          {detail?.countries?.length ? (
            <View style={styles.detailSection}>
              <AppText style={styles.joinText}>
                {language?.stampCountries}
              </AppText>
              <ScrollView
                contentContainerStyle={styles.list}
                showsHorizontalScrollIndicator={false}
              >
                {detail?.countries?.map((item, index) => {
                  return (
                    <View style={{ marginTop: hp(1), marginRight: wp(3) }}>
                      <InterestItem item={item?.name} maxWidth={wp(45)} />
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}
          {detail?.years?.length ? (
            <View style={styles.detailSection}>
              <AppText style={styles.joinText}>{language?.stampYears}</AppText>
              <ScrollView
                contentContainerStyle={styles.list}
                showsHorizontalScrollIndicator={false}
              >
                {detail?.years?.map((item, index) => {
                  return (
                    <View style={{ marginTop: hp(1), marginRight: wp(3) }}>
                      <InterestItem item={item} />
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}

          {/* Sheet and Organizer Info Section */}

          <View style={{ marginBottom: hp(3) }}>
            <TouchableOpacity
              style={[styles.userCard, { backgroundColor: theme?.cardColor }]}
              onPress={() => checkUser(detail?.user)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome name="user" size={hp(2.2)} color={theme?.black} />
                <AppText style={styles.heading}>
                  {language?.eventOrganiser}
                </AppText>
              </View>
              <View style={styles.rowSection}>
                <AppText style={styles.heading}>{language?.profile}</AppText>
                <Feather
                  name={"chevron-right"}
                  size={hp(2.4)}
                  style={[styles.arrow, { color: theme?.lightGrey }]}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.userCard, { backgroundColor: theme?.cardColor }]}
              onPress={() => participantSheetRef?.current?.open()}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome name="users" size={hp(2.2)} color={theme?.black} />
                <AppText style={styles.heading}>{language?.Members}</AppText>
              </View>
              <View style={styles.rowSection}>
                <AppText style={[styles.heading1, { color: theme?.theme }]}>
                  {detail?.participants_count} Person
                </AppText>
                <Feather
                  name={"chevron-right"}
                  size={hp(2.4)}
                  style={[styles.arrow, { color: theme?.lightGrey }]}
                />
              </View>
            </TouchableOpacity>
            {owner && (
              <TouchableOpacity
                style={[styles.userCard, { backgroundColor: theme?.cardColor }]}
                onPress={() => requestsSheetRef?.current?.open()}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome
                    name="user-plus"
                    size={hp(2.2)}
                    color={theme?.black}
                  />
                  <AppText style={styles.heading}>Requestes</AppText>
                </View>
                <View style={styles.rowSection}>
                  <AppText style={[styles.heading1, { color: theme?.theme }]}>
                    {detail?.participants_count} New
                  </AppText>
                  <Feather
                    name={"chevron-right"}
                    size={hp(2.4)}
                    style={[styles.arrow, { color: theme?.lightGrey }]}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Image Zoom Modal */}
      <ImageZoomViewer
        onPressClose={() => {
          setImageViewer(false);
        }}
        visible={imageViewer}
        images={imageViewerData}
        index={imageViewerInitialIndex}
      />

      {/* Invite Users Sheet */}
      <BottomSheet
        ref={inviteUserSheet}
        title={"Invite Members"}
        onPressClose={() => inviteUserSheet?.current?.close()}
        dropDown={false}
        sheetHeight={hp(80)}
        ChildComponent={<EventInviteSheet />}
      />

      {/* Member Sheets */}
      <BottomSheet
        ref={participantSheetRef}
        title={`${eventType} ${language?.Members}`}
        onPressClose={() => participantSheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={hp(80)}
        ChildComponent={
          <EventMembers
            onPressUser={(user) => {
              participantSheetRef?.current?.close();
              setTimeout(() => {
                checkUser(user);
              }, 300);
            }}
          />
        }
      />

      {/* Member Sheets */}
      <BottomSheet
        ref={requestsSheetRef}
        title={`${eventType} ${language?.joiningRequest}`}
        onPressClose={() => requestsSheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={hp(80)}
        ChildComponent={
          <EventRequests
            onPressUser={(user) => {
              requestsSheetRef?.current?.close();
              setTimeout(() => {
                checkUser(user);
              }, 300);
            }}
          />
        }
      />

      {/* Join Event Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={joinModalVisible}
        onRequestClose={() => {
          Alert.alert(language?.modal_has_been_closed);
          setJoinModalVisible(!joinModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.headerSection}>
              <AppText style={styles.joinModalText}>Join {eventType}</AppText>
              <TouchableOpacity
                onPress={() => {
                  setJoinModalVisible(!joinModalVisible);
                  setErrMsg(false);
                  setJoinMsg(null);
                }}
              >
                <EvilIcons name="close" size={hp(3.3)} color={colors.cWhite} />
              </TouchableOpacity>
            </View>
            {eventType === "Exhibition" && (
              <View style={styles.exhibJoinSection}>
                <AppText>Join As</AppText>
                <View style={styles.modalBtnSection}>
                  <TouchableOpacity
                    style={[
                      styles.visitorBtn,
                      {
                        backgroundColor: isVisitor
                          ? colors.lightTheme
                          : colors.cWhite,
                      },
                    ]}
                    onPress={() => setIsVisitor(true)}
                  >
                    <AppText
                      style={{
                        color: isVisitor ? colors.cWhite : colors.lightTheme,
                      }}
                    >
                      Visitor
                    </AppText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.visitorBtn,
                      {
                        backgroundColor: isVisitor
                          ? colors.cWhite
                          : colors.lightTheme,
                      },
                    ]}
                    onPress={() => setIsVisitor(false)}
                  >
                    <AppText
                      style={{
                        color: isVisitor ? colors.lightTheme : colors.cWhite,
                      }}
                    >
                      Participant
                    </AppText>
                  </TouchableOpacity>
                </View>
                {!isVisitor && (
                  <View style={styles.mediaSection}>
                    <AppText>Select Media</AppText>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={styles.addStampCard}
                        onPress={() => {
                          setShowModal(true);
                          setJoinModalVisible(false);
                          props.navigation.navigate("ExhibitionStamps");
                        }}
                      >
                        <Octicons
                          name="plus"
                          size={hp(5)}
                          color={colors.lightTheme}
                        />
                      </TouchableOpacity>
                      <View style={{ marginLeft: 5, width: wp(60) }}>
                        <FlatList
                          horizontal
                          data={selectedStamp}
                          renderItem={renderSelectedImages}
                          showsHorizontalScrollIndicator={false}
                        />
                      </View>
                    </View>
                  </View>
                )}
              </View>
            )}
            <View style={styles.infoSection}>
              <AppText style={styles.msgText}>Write Message*</AppText>
              <TextInput
                value={joinMsg}
                style={styles.input}
                placeholder="Write Description..."
                label={language?.enterDescription}
                onChangeText={(text) => {
                  setErrMsg(false);
                  setJoinMsg(text);
                }}
              />
              <ErrorMessage visible={errMsg} error={errMsg} />
              <GradBtn
                width="30%"
                label="Join"
                fontSize={14}
                height={hp(4)}
                loading={loading}
                style={styles.modalBtn}
                fontFamily={Fonts.IBM_Medium}
                onPress={isReqAction ? onAcceptInvite : onJoinRequest}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Share Events Modal in  Clubs */}
      <ShareModal
        from={"Event"}
        selected={selected}
        selectedItem={detail}
        userId={currentUser?.id}
        setSelected={setSelected}
        modalVisible={shareModalVisible}
        setShareModalVisible={setShareModalVisible}
      />

      {/* Coins Award Modal */}
      <AwardModal
        userId={eventDetail?.user_id}
        modalVisible={awardModalVisible}
        setModalVisible={setAwardModalVisible}
        type={eventType === "Exhibition" ? "Virtual Exhibition" : eventType}
      />

      {/* FeedBack Modal */}
      <FeedBackModal
        detail={eventDetail}
        userId={currentUser?.id}
        modalVisible={feedbackModalVisible}
        setModalVisible={setfeedbackModalVisible}
      />
    </View>
  );
};
