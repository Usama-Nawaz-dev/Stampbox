import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  Keyboard,
  FlatList,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { styles } from "./styles";
import Helper from "../../../../Helper";
import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";
import { DescriptionLink } from "../../../../../components";
import ThemeContext from "../../../../Context/ThemeContext";
import { images } from "../../../../../assets/images/Images";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import { SimpleBtn } from "./SimpleBtn";
import { SummaryCard } from "./SummaryCard";
import { MainHeader, PostInput } from "../../../../../components";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import supportEnv from "../../../../../support_apis/supportEnv";
import SupportAxios from "../../../../../support_apis/SupportAxios";
import allActions from "../../../../../redux/actions";

export const TicketDetail = (props) => {
  const { ticket } = props?.route?.params;
  const { theme } = useContext(ThemeContext);
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const dispatch = useDispatch();
  const focused = useIsFocused();

  const [ticketDetail, setTicketDetail] = useState(null);
  const [reviewText, setReviewText] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (focused) {
      fetchTicket();
    }
  }, [focused]);

  // const [keyboardHeight, setKeyboardHeight] = useState(0);

  // useEffect(() => {
  //   const showSubscription = Keyboard.addListener(
  //     "keyboardDidShow",
  //     onKeyboardDidShow
  //   );
  //   const hideSubscription = Keyboard.addListener(
  //     "keyboardDidHide",
  //     onKeyboardDidHide
  //   );

  //   return () => {
  //     showSubscription.remove();
  //     hideSubscription.remove();
  //   };
  // }, []);

  // const onKeyboardDidShow = (e) => {
  //   setKeyboardHeight(e.endCoordinates.height);
  // };

  // const onKeyboardDidHide = () => {
  //   setKeyboardHeight(0);
  // };

  const fetchTicket = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await SupportAxios.get(
      supportEnv.createUrl(`tickets/${ticket?.id}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.item;
      setTicketDetail(_data);
    }
  };

  const Title = ({ title }) => {
    return (
      <Text
        style={[
          styles.heading,
          { color: theme.darkGrey, margin: 10, textAlign: "left" },
        ]}
      >
        {title}
      </Text>
    );
  };

  const renderComment = ({ item, index }) => {
    const isEnd = index === ticketDetail?.comments?.length - 1;
    return <CommentCard item={item} isEnd={isEnd} theme={theme} />;
  };

  const postComment = async () => {
    if (reviewText) {
      const body = {
        commentable_id: ticket?.id,
        commentable_type: "Ticket",
        message: reviewText,
        sender_id: currentUser?.id,
      };
      // console.log(body);
      setLoading(true);
      const response = await SupportAxios.post(
        supportEnv.createUrl(`comments`),
        body
      );
      setLoading(false);
      if (response?.status === 200) {
        Helper.showToastMessage("Reply sent Successfully", colors.green);
        setReviewText(null);
        fetchTicket();
      }
    } else {
      Helper.showToastMessage("Reply text can't be empty", colors.blueTheme);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.white }]}>
      <MainHeader
        title={"Ticket Details"}
        onPressBack={() => props.navigation.goBack()}
      />
      <KeyboardAwareScrollView>
        <View showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Title title={`Ticket #${ticket?.uid}`} />
            {ticket?.status === "resolved" ? (
              <SimpleBtn
                title="Resolved"
                bg={colors.lightTheme}
                fontColor={"#fff"}
                style={{ height: 24 }}
              />
            ) : null}
          </View>
          <Title title="Summary" />
          <SummaryCard detail={ticketDetail} />
          <View style={{ marginBottom: hp(2) }} />
        </View>

        <FlatList
          style={{ flex: 1 }}
          key={(key) => key.id}
          renderItem={renderComment}
          data={ticketDetail?.comments}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAwareScrollView>
      <PostInput
        post={{
          message: reviewText,
          setMessage: setReviewText,
          post_api: postComment,
        }}
        loading={loading}
      />
      {/* <View
        style={[
          styles.inputSection,
          { paddingBottom: keyboardHeight ? keyboardHeight - hp(3) : 0 },
        ]}
      >
        <TextInput
          multiline={true}
          value={reviewText}
          style={styles.input}
          placeholder={"Type here..."}
          onChangeText={(val) => setReviewText(val)}
        />

        {loading ? (
          <ActivityIndicator size="small" color={colors.lightTheme} />
        ) : (
          <TouchableOpacity onPress={postComment}>
            <MaterialIcons name="send" size={hp(4)} color={colors.lightTheme} />
          </TouchableOpacity>
        )}
      </View> */}
    </SafeAreaView>
  );
};

const CommentCard = ({ item, isEnd, theme }) => {
  // console.log(item);
  return (
    <View style={[styles.CCard, { marginBottom: isEnd ? hp(5) : hp(1) }]}>
      <Image source={{ uri: item?.user?.image_url }} style={styles.CCImage} />
      <View style={styles.infoSection}>
        <AppText style={styles.commentUser}>{item?.user?.name}</AppText>
        <AppText style={[styles.commentText, { fontSize: 9 }]}>
          {moment(item?.created_at).format("YYYY-MM-DD [at] h:mm A")}
        </AppText>
        {/* <AppText style={styles.commentText}>{item?.message}</AppText> */}
        <DescriptionLink theme={theme} content={item?.message} />
      </View>
    </View>
  );
};
