import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  Button,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, {
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
  useContext,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Empty from "../../../components/Empty";
import AppText from "../../../components/AppText";
import UserProfileIImage from "../../../components/UserProfileIImage";
import colors from "../../../constant/colors";
import { BottomSheet, FloatingInput, PostInput } from "../../../components";
import Btn from "../../../components/Btn";
import UserCard from "../../../components/UserProfileIImage";
import { useEffect } from "react";
import MindAxios from "../../../api/MindAxios";
import Env from "../../../api/Env";
import Helper from "../../Helper";
import allActions from "../../../redux/actions";
import _ from "lodash";
import { images } from "../../../assets/images/Images";
import { placeHolder } from "../../../constant/Paths";
import FastImage from "react-native-fast-image";
import { FlagAction } from "./FlagAction";
import { BtnView } from "./BtnView";
import Fonts from "../../../assets/fonts/Fonts";
import { ListFooter } from "./ListFooter";
import ThemeContext from "../../Context/ThemeContext";

const { width } = Dimensions.get("window");

const ConversationCard = (props) => {
  const { tab, data, refresh, setShow, ticketDetail, update } = props;
  // console.log("ticketDetail in card", ticketDetail);
  const listRef = useRef();
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const [reason, setReason] = useState(null);
  const [addVote, setAddVote] = useState({
    for_flagger: 0,
    flagger_votes: 0,
    owner_votes: 0,
    for_owner: 0,
  });
  const [currentFlag, setCurrentFlag] = useState(null);
  const [error, setError] = useState(null);
  const typeOfFlag = useSelector((state) => state.SheetReducer.flagType);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const flag_info = useSelector((state) => state.SheetReducer.flagInfo);
  let { id: ticket_id, flagger_id } = flag_info;
  // if (!_.isEmpty(flag_info)) {
  //   var { id: ticket_id, flagger_id } = flag_info;
  // }
  // console.log("flagInfo", flag_info);
  if (currentUser) {
    var { id } = currentUser;
  }
  let checkUser = typeOfFlag == "sent" ? flagger_id == id : true;
  let itemOwner = ticketDetail?.flaggable?.user_id;
  let votableId = ticket_id;
  let checkOwnerOfTicket = itemOwner == id;

  console.log("checkOwnerOfTicket", checkOwnerOfTicket);
  const INTERVAL = 1000;
  const voting = useCallback(
    _.debounce(
      (votForFlagger) => {
        console.log("hit voting", votForFlagger);
        votingFunc(votForFlagger);
      },
      INTERVAL,
      { leading: true, trailing: false, maxWait: INTERVAL }
    ),
    []
  );
  const votingFunc = async (votForFlagger) => {
    console.log("votForFlagger ? flagger_id : itemOwner", ticketDetail);
    let body = {
      target_user_id: votForFlagger ? flagger_id : itemOwner,
      votable_id: votableId,
      votable_type: "FlagTicket",
    };
    // console.log("body", body);
    dispatch(allActions.DataAction.AppLoader(true));
    const res = await MindAxios.post(Env.createUrl("votes"), body);
    dispatch(allActions.DataAction.AppLoader(false));
    // console.log("voting", res);
    if (res?.status == 200) {
      await update(ticket_id);
    } else {
      Helper.showToastMessage("Something went wrong!", "red");
    }
  };

  const resSheetRef = useRef();
  // useImperativeHandle(ref, () => ({
  //   funcRef: () => checkerFunction(),
  // }));
  let len = data?.length;
  let checkCl = (obj) => obj?.activity == "clarification-requested";
  let checkRes = (obj) => obj?.activity == "resolved";
  let existsCl = len ? data?.some(checkCl) : null;
  let existsRes = len ? data?.some(checkRes) : null;

  useEffect(() => {
    if (existsCl || !checkUser || existsRes) {
      setShow(1);
    } else {
      setShow(0);
    }
  }, [len]);

  useEffect(() => {
    if (!_.isEmpty(ticketDetail)) {
      setAddVote({
        for_flagger: ticketDetail?.is_votable_for_flagger,
        for_owner: ticketDetail?.is_votable_for_itemowner,
        flagger_votes: ticketDetail?.vote_for_flagger,
        owner_votes: ticketDetail?.vote_for_item_owner,
      });
    }
  }, [ticketDetail]);
  const flag_action = (action, activity) => {
    // console.log(action, activity);
    let newItem = {};
    newItem.action = action;
    newItem.activity_action = activity;
    setCurrentFlag(newItem);
    resSheetRef?.current?.open();
  };
  const renderItem = ({ index, item }) => {
    let createdAt = moment(item?.created_at).format("DD-MM-YYYY [at] h:mmA");
    let last = index == data?.length - 1;
    let owner = item?.sender_id == id;
    let img = item?.sender?.image_url;
    let first = item?.sender?.first_name;
    let lastname = item?.sender?.last_name;

    // console.log("item", item);
    return (
      <View
        style={[
          styles.innerContainer,
          !index == 0 && styles.shadow,
          {
            borderColor: index == 0 ? colors.theme : 0,
            backgroundColor: index == 0 ? colors.body : theme?.cardColor,
            marginBottom: !existsCl ? (last ? hp(10) : 0) : 10,
          },
        ]}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              flexDirection: "row",
              // backgroundColor: "orange",
              alignItems: "center",
              paddingTop: 5,
              paddingBottom: 5,
            }}
          >
            <FastImage
              source={img ? { uri: img } : placeHolder}
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                marginHorizontal: 10,
              }}
            />
            <Text
              numberOfLines={1}
              style={{
                fontWeight: "600",
                fontSize: 14,
                width: 120,
                color: index == 0 ? "#000" : theme?.black,
              }}
            >
              {`${first} ${lastname}`}
            </Text>
          </View>
          <Text
            style={{
              margin: 10,
              color: item?.activity == "resolved" ? colors.green : colors.theme,
            }}
          >
            {item?.activity}
          </Text>
        </View>
        <View>
          <Text
            style={{
              marginHorizontal: 15,
              color: index == 0 ? "#000" : theme?.black,
            }}
          >
            {item?.message}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            // backgroundColor: 'red',
            height: 40,
          }}
        >
          <AppText
            style={{
              fontWeight: "500",
              left: 10,
              top: 5,
              color: index == 0 ? "#000" : theme?.darkGrey,
            }}
          >
            {createdAt}
          </AppText>
          {/* {btnChecks(item, item?.activity, index, owner, last)} */}
        </View>
      </View>
    );
  };

  const flag_activity = async (enum_val) => {
    // console.log("ticket_id", ticket_id);
    if (reason) {
      if (ticket_id) {
        resSheetRef?.current?.close();
        dispatch(allActions.DataAction.AppLoader(true));
        let res = await MindAxios.post(
          Env.createUrl(`flag-tickets/${ticket_id}`),
          {
            current_activity: enum_val,
            current_activity_message: reason,
          }
        );
        dispatch(allActions.DataAction.AppLoader(false));
        // console.log("res====--==>", res);
        if (res?.status == 200) {
          Helper.showToastMessage(`flag ${enum_val}`, "green");
          refresh(ticket_id);
        } else {
          Helper.showToastMessage("Something went wrong", "red");
        }
      } else {
        Helper.showToastMessage("ticket id not found", "red");
      }
    } else {
      setError("reason is required");
    }
  };
  return (
    <View
      style={{
        width: width,
      }}
    >
      {/* <Button title="sheet" onPress={() => resSheetRef?.current?.open()} /> */}
      {checkUser && !existsRes ? (
        <BtnView
          data={data}
          flag_action={flag_action}
          typeOfFlag={typeOfFlag}
          ownerCheck={checkOwnerOfTicket}
        />
      ) : null}

      {data ? (
        <FlatList
          // style={{ position: 'absolute', alignSelf: 'center' }}
          ref={listRef}
          showsVerticalScrollIndicator={false}
          data={data}
          // inverted={data?.length > 1}
          // onLayout={() => listRef.current.scrollToEnd({ animated: true })}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListFooterComponent={() => {
            return (
              <>
                {existsCl && !checkOwnerOfTicket ? (
                  <ListFooter voting={votingFunc} addVote={addVote} />
                ) : null}
              </>
            );
          }}
        />
      ) : (
        <Empty />
      )}

      <BottomSheet
        onPressClose={() => {
          resSheetRef?.current?.close();
          // props.closeOpenedSheets();
        }}
        onClose={() => {
          console.log("on close");
          if (reason) {
            setReason(null);
          }
        }}
        ref={resSheetRef}
        sheetHeight={hp(25)}
        ChildComponent={
          <View style={{ padding: 15, top: -20 }}>
            <FloatingInput
              value={reason}
              label={`Write reason here..`}
              onChangeText={(text) => {
                setError(false);
                setReason(text);
              }}
              error={error}
            />
            <Btn
              label={currentFlag?.action}
              height={40}
              width="45%"
              fontWeight="400"
              style={{
                marginBottom: 10,
                marginTop: 30,
                alignSelf: "center",
              }}
              bg={colors.lightTheme}
              onPress={() => flag_activity(currentFlag?.activity_action)}
            />
          </View>
        }
      />
    </View>
  );
};

export { ConversationCard };

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    marginTop: 10,
    width: wp(90),
    // flex: 1,
    // backgroundColor: index == data?.length - 1 ? colors.white,
  },
  innerContainer: {
    width: "95%",
    backgroundColor: "lightgrey",
    alignSelf: "center",
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  typeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  txt: {
    fontSize: 16,
    color: colors.darkTheme,
    fontWeight: "600",
  },
  communityBox: {
    height: 200,
    width: "50%",
    // backgroundColor: "orange",
    // margin: 2,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  communityTxt: { fontSize: 13, fontWeight: "500", textAlign: "center" },
});
