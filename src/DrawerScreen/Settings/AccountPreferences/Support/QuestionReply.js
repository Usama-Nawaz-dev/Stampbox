import React, { useState, useEffect } from "react";
import {
  View,
  Keyboard,
  FlatList,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import FastImage from "react-native-fast-image";

import Helper from "../../../../Helper";
import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";
import { MainHeader, GradBtn } from "../../../../../components";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import moment from "moment";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import allActions from "../../../../../redux/actions";
import supportEnv from "../../../../../support_apis/supportEnv";
import SupportAxios from "../../../../../support_apis/SupportAxios";

export const QuestionReply = (props) => {
  const { question } = props?.route?.params;
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const [loading, setLoading] = useState(false);
  const [reviewText, setReviewText] = useState(null);
  const [questionList, setQuestionList] = useState(null);

  useEffect(() => {
    if (focused) {
      fetchQuestion();
    }
  }, [focused]);

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      onKeyboardDidShow
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      onKeyboardDidHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onKeyboardDidShow = (e) => {
    setKeyboardHeight(e.endCoordinates.height);
  };

  const onKeyboardDidHide = () => {
    setKeyboardHeight(0);
  };

  const fetchQuestion = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await SupportAxios.get(
      supportEnv.createUrl(`questions/${question?.id}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result?.item?.comments;
      setQuestionList(_data);
    }
  };

  const postQuestion = async () => {
    if (reviewText) {
      const body = {
        commentable_id: question?.id,
        commentable_type: "Question",
        message: reviewText,
      };
      setLoading(true);
      const response = await SupportAxios.post(
        supportEnv.createUrl(`comments`),
        body
      );
      setLoading(false);
      if (response?.status === 200) {
        Helper.showToastMessage("Question sent Successfully", colors.green);
        setReviewText(null);
        fetchQuestion();
      }
    } else {
      Helper.showToastMessage("Question text can't be empty", colors.blueTheme);
    }
  };

  const renderComment = ({ item, index }) => {
    return <CommentCard item={item} />;
  };

  return (
    <View style={styles.container}>
      <MainHeader
        title="Question"
        onPressBack={() => props.navigation.goBack()}
      />
      <ScrollView>
        <AppText style={styles.hText}>{question?.question}</AppText>
        <AppText style={styles.dText}>{question?.article?.details}</AppText>
        <GradBtn
          height={hp(3.5)}
          fontSize={12}
          label={"Reply"}
          fontWeight={"500"}
          style={styles.button}
          width={wp(20)}
        />
        <QuestionCard />
        <AppText style={styles.replyText}>Replies</AppText>
        <FlatList
          style={{ flex: 1 }}
          data={questionList}
          key={(key) => key.id}
          renderItem={renderComment}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
      <View
        style={[
          styles.inputSection,
          { paddingBottom: keyboardHeight ? keyboardHeight + hp(1) : hp(2) },
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
          <TouchableOpacity onPress={postQuestion}>
            <MaterialIcons name="send" size={hp(4)} color={colors.lightTheme} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const QuestionCard = ({ item, onPress }) => {
  return (
    <Pressable style={styles.qCard} onPress={onPress}>
      <AppText style={styles.qText}>Community Stats</AppText>
      <View style={styles.qInfoSection}>
        <View style={styles.borderView}>
          <AppText style={styles.viewText}>534</AppText>
          <AppText>Last Month Views</AppText>
        </View>
        <View style={styles.borderView}>
          <AppText style={styles.viewText}>10</AppText>
          <AppText>Conversation</AppText>
        </View>
      </View>
    </Pressable>
  );
};

const CommentCard = ({ item }) => {
  // console.log(item);
  return (
    <View style={styles.CCard}>
      <FastImage
        source={{ uri: item?.user?.image_url }}
        style={styles.CCImage}
      />
      <View style={styles.infoSection}>
        <AppText style={styles.commentUser}>{item?.user?.name}</AppText>
        <AppText style={[styles.commentText, { fontSize: 9 }]}>
          {moment(item?.created_at).format("YYYY-MM-DD [at] h:mm A")}
        </AppText>
        <AppText style={styles.commentText}>{item?.message}</AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  qCard: {
    width: wp(94),
    marginHorizontal: wp(3),
    backgroundColor: "#fff",
    borderRadius: 7,
    marginTop: hp(1),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    padding: wp(2),
  },
  qInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: hp(0.5),
  },
  viewText: {
    fontSize: 14,
    fontWeight: "500",
  },
  borderView: {
    marginRight: wp(1),
    paddingRight: wp(1),
    borderLeftWidth: 1,
    borderColor: colors.lightTheme,
    paddingLeft: wp(2),
    width: wp(45),
  },
  qText: {
    fontWeight: "600",
    paddingBottom: hp(0.5),
  },
  hText: {
    fontSize: 14,
    marginTop: hp(1),
    fontWeight: "500",
    paddingHorizontal: wp(3),
  },
  dText: {
    marginTop: hp(2),
    marginBottom: hp(1),
    paddingHorizontal: wp(3),
  },
  button: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: wp(3),
    alignSelf: "flex-start",
  },
  replyText: {
    fontWeight: "600",
    marginVertical: hp(1),
    paddingHorizontal: wp(3),
  },

  //Comment Card
  CCard: {
    width: wp(100),
    flexDirection: "row",
    marginBottom: hp(1),
    paddingBottom: hp(1),
    borderBottomWidth: 1,
    paddingHorizontal: wp(2),
    borderColor: colors.borderColor,
  },
  CCImage: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(100),
    backgroundColor: "#fff",
  },
  commentUser: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.heading,
  },
  commentText: {
    fontSize: 12,
    maxWidth: wp(80),
    marginTop: hp(0.3),
    color: colors.lightText,
  },
  infoSection: {
    marginLeft: wp(3),
  },

  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingTop: hp(1),
  },
  input: {
    width: "90%",
    fontSize: 13,
    height: hp(5.2),
    padding: wp(3),
    borderRadius: 5,
    marginRight: wp(2),
    paddingTop: hp(1.5),
    backgroundColor: colors.background,
  },
});
