import React, { useContext, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Keyboard } from "react-native";
import { Image, View } from "react-native";
import {
  EventHeader,
  InterestItem,
  MenuSheet,
  PostInput,
} from "../../../components";
import AppText from "../../../components/AppText";
import { images } from "../../../assets/images/Images";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import colors from "../../../constant/colors";
import HeaderTabs from "../../../components/HeaderTabs";
// import { MainTab } from "../MainTab";
import { ConversationCard } from "./ConversationCard";
import { TimelineCard } from "./TimelineCard";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import MindAxios from "../../../api/MindAxios";
import Env from "../../../api/Env";
import allActions from "../../../redux/actions";
import CountDown from "react-native-countdown-component";
import Helper from "../../Helper";
import HeaderWithIcons from "../../../components/HeaderWithIcons";
import CustomHeader from "../../../components/CustomHeader";
import _ from "lodash";
import moment from "moment";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

const headers = ["Conversation", "Timeline"];

const FlagConversation = (props) => {
  // console.log("props", props);
  // const {params}
  const childRef = useRef();
  const countDownElement = useRef();
  const [show, setShow] = useState(0);
  const [flagData, setFlagData] = useState(null);
  const [ticketDetail, setTicketDetail] = useState(null);
  const [message, setMessage] = useState(null);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const typeOfFlag = useSelector((state) => state.SheetReducer.flagType);
  const flag_info = useSelector((state) => state.SheetReducer.flagInfo);
  const stampDetail = useSelector((state) => state.DetailReducer.stampDetail);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  if (currentUser) {
    var { id } = currentUser;
  }
  if (!_.isEmpty(flag_info)) {
    var { id: ticketId, flagger_id } = flag_info;
  }
  let checkUser = typeOfFlag == "sent" ? flagger_id == id : true;

  let seconds;
  useEffect(() => {
    if (isFocused) {
      (async () => {
        // let ticketId = props?.route?.params?.id;
        if (ticketId) {
          await getConversations(ticketId);
          await fetchFlagTicketDetail(ticketId);
        }
      })();
    }
  }, [isFocused]);
  useEffect(() => {
    func();
    if (!_.isEmpty(flag_info) && !_.isEmpty(ticketDetail)) {
      let newCheck = flagger_id == id;
      let itemOwner = ticketDetail?.flaggable?.user_id;
      let checkOwnerOfTicket = itemOwner == id;
      // console.log("newCheck", newCheck);
      // console.log("checkOwnerOfTicket", checkOwnerOfTicket);
      if (newCheck) {
        dispatch(allActions.SheetAction.FlagType("sent"));
      } else if (checkOwnerOfTicket) {
        dispatch(allActions.SheetAction.FlagType("received"));
      }
    }
  }, [ticketDetail]);
  const getConversations = async (id) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl(`flag-conversations/?flag_ticket_id=${id}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    // console.log("res", response);
    if (response?.status == 200) {
      let paginated = response?.data?.result?.paginated_items?.data;
      if (paginated?.length) {
        // console.log("res", paginated);
        setFlagData(paginated);
      }
    } else {
      alert(language?.serverError);
    }
  };
  const fetchFlagTicketDetail = async (id) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.createUrl(`flag-tickets/${id}`));
    dispatch(allActions.DataAction.AppLoader(false));
    // console.log("fetchFlagTicketDetail", response);
    if (response?.status == 200) {
      let result = response?.data?.result;
      if (!_.isEmpty(result)) {
        // console.log("TicketDetail", result);
        setTicketDetail(result);
      }
    } else {
      alert(language?.serverError);
    }
  };
  let len = flagData?.length;
  if (len) {
    let checkCl = (obj) => obj?.activity == "clarification-requested";
    let checkRes = (obj) => obj?.activity == "resolved";

    var existsRes = flagData?.some(checkRes);
    var existsCl = flagData?.some(checkCl);
  }
  // console.log("existsCl && !checkUser",  flagger_id, id )

  const post_api = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    Keyboard.dismiss();
    let ticketId = props?.route?.params?.id;
    if (ticketId) {
      let body = { flag_ticket_id: ticketId, message: message };
      const response = await MindAxios.post(
        Env.createUrl("flag-conversations"),
        body
      );
      dispatch(allActions.DataAction.AppLoader(false));
      // console.log("res", response);
      if (response?.status == 200) {
        getConversations(ticketId);
        // let paginated = response?.data?.result?.paginated_items?.data;
        // console.log("res", paginated);
        // setFlagData(paginated);
      } else {
        alert(language?.serverError);
      }
    }
  };
  const func = () => {
    let time = ticketDetail ? ticketDetail?.time_counts : 0;
    if (time) {
      let mytime = Date.parse(time);
      let newTime = new Date(mytime);
      var today = new Date();
      let timeDiff = newTime - today;
      seconds = timeDiff / 1000 + 18000;
      countDownElement?.current?.restart(seconds);
    }
  };

  // console.log("time", seconds);
  return (
    <View style={{ flex: 1, backgroundColor: theme?.white }}>
      {/* <HeaderWithIcons
        single={true}
        title="Flag Conversation"
        backIcon={true}
      /> */}
      <CustomHeader
        onPressBack={() => props.navigation.goBack()}
        hide={true}
        title="Flag Conversation"
        // options={options}
        // simpleIcon={true}
        // onPress={()=> childRef?.current?.funcRef()}
      />

      {/* <ScrollView style={{ backgroundColor: colors.white }}> */}
      <View style={styles.detailsSection}>
        {ticketDetail ? (
          <View style={styles.infoSection}>
            <View style={styles.infoContainer}>
              <AppText style={styles.text}>{language?.itemName}:</AppText>
              <AppText style={styles.text}>Flag Reason:</AppText>
              <AppText style={styles.text}>Flagged By:</AppText>
              <AppText style={styles.text}>{language?.created_at}:</AppText>
              <AppText style={styles.text}>{language?.updated_at}:</AppText>
            </View>
            <View>
              <AppText
                numberOfLines={1}
                style={[
                  styles.infoText,
                  { width: 200, color: theme?.lightText },
                ]}
              >
                {ticketDetail?.flaggable?.name}
              </AppText>
              <AppText style={[styles.infoText, { color: theme?.lightText }]}>
                {ticketDetail?.reason}
              </AppText>
              <AppText style={[styles.infoText, { color: theme?.lightText }]}>
                {ticketDetail?.flagger?.first_name}
              </AppText>
              <AppText style={[styles.infoText, { color: theme?.lightText }]}>
                {moment(ticketDetail?.created_at).format(
                  "DD-MM-YYYY [at] h:mmA"
                )}
              </AppText>
              <AppText style={[styles.infoText, { color: theme?.lightText }]}>
                {moment(ticketDetail?.updated_at).format(
                  "DD-MM-YYYY [at] h:mmA"
                )}
              </AppText>
            </View>
          </View>
        ) : null}

        {!existsRes ? (
          <View style={styles.contentFooter}>
            <View
              style={{
                width: "50%",
                // backgroundColor: "grey"
              }}
            >
              <AppText style={{ fontWeight: "500" }}>
                {existsCl
                  ? "Community result will declare in"
                  : "You have to respond in the given time."}
              </AppText>
            </View>

            <View
              style={{
                width: "50%",
                height: 35,
                backgroundColor: colors.lightTheme,
                borderRadius: 10,
              }}
            >
              <CountDown
                ref={countDownElement}
                showSeparator
                until={seconds}
                // onFinish={() => localNotification()}
                digitStyle={
                  {
                    // backgroundColor: colors.danger,
                    // width: width ? width : undefined,
                  }
                }
                separatorStyle={styles.separator}
                digitTxtStyle={styles.digitTxtStyle}
                timeToShow={["D", "H", "M", "S"]}
                timeLabels={{ m: null, s: null }}
              />
            </View>
          </View>
        ) : null}
      </View>
      <View style={{ flex: 1, width: "100%" }}>
        <HeaderTabs
          headers={headers}
          setShow={existsCl || existsRes || !checkUser ? false : setShow}
          renderList={({ item, index }) => {
            switch (index) {
              case 0:
                return (
                  <ConversationCard
                    // ref={childRef}
                    tab="Conversation"
                    navigation={props.navigation}
                    data={flagData}
                    id={props?.route?.params?.id}
                    refresh={getConversations}
                    ticketDetail={ticketDetail}
                    setShow={setShow}
                    update={fetchFlagTicketDetail}
                  />
                );
              case 1:
                return (
                  <TimelineCard
                    tab="Timeline"
                    navigation={props.navigation}
                    data={flagData}
                  />
                );
            }
          }}
        />
      </View>
      {/* </ScrollView> */}
      {show == 0 && flagData ? (
        <PostInput post={{ message, setMessage, post_api }} />
      ) : null}
    </View>
  );
};

export { FlagConversation };

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  detailsSection: {
    marginTop: hp(1),
    paddingHorizontal: wp(2),
  },
  uidText: {
    textAlign: "center",
    marginBottom: hp(1),
    color: colors.theme,
    fontWeight: "500",
  },
  description: {
    fontSize: 16,
    color: colors.lightBlack,
    fontWeight: "600",
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.5),
  },
  infoContainer: {
    // width: wp(22),
    marginRight: 15,
  },
  text: {
    fontSize: 14,
    // color: colors.lightBlack,
    marginBottom: 5,
    fontWeight: "500",
  },
  infoText: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 5,
  },
  contentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    // height: 40,
    // paddingBottom: 10,
    // backgroundColor: 'orange'
  },
  separator: { color: "#fff", fontSize: 14, fontWeight: "400" },
  digitTxtStyle: {
    color: "#fff",
    // fontFamily: Fonts.Inter_Regular
  },
});
