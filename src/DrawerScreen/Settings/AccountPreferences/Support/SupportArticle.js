import React, { useEffect, useState } from "react";
import {
  View,
  Keyboard,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import colors from "../../../../../constant/colors";
import { MainHeader } from "../../../../../components";
import AppText from "../../../../../components/AppText";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Helper from "../../../../Helper";
import allActions from "../../../../../redux/actions";
import supportEnv from "../../../../../support_apis/supportEnv";
import SupportAxios from "../../../../../support_apis/SupportAxios";

export const SupportArticle = (props) => {
  const { topic, community } = props?.route?.params;
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const [topicQ, setTopicQ] = useState(null);
  const [reviewText, setReviewText] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (focused) {
      fetchSingleTopic();
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

  const fetchSingleTopic = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await SupportAxios.get(
      supportEnv.createUrl(`topics/${topic?.id}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result?.item?.questions;
      setTopicQ(_data);
    }
  };

  const renderTopicQ = ({ item, index }) => {
    return (
      <QuestionCard
        item={item}
        onPress={() => {
          if (community) {
            props?.navigation.navigate("QuestionReply", {
              question: item,
            });
          } else {
            props?.navigation.navigate("QuestionReview", {
              question: item,
            });
          }
        }}
      />
    );
  };

  const postQuestion = async () => {
    if (reviewText) {
      const body = {
        question: reviewText,
        topic_id: topic?.id,
      };
      // console.log(body);
      setLoading(true);
      const response = await SupportAxios.post(
        supportEnv.createUrl(`questions`),
        body
      );
      setLoading(false);
      if (response?.status === 200) {
        Helper.showToastMessage("Reply sent Successfully", colors.green);
        setReviewText(null);
        fetchSingleTopic();
      }
    } else {
      Helper.showToastMessage("Reply text can't be empty", colors.blueTheme);
    }
  };

  return (
    <View style={styles.container}>
      <MainHeader
        title={Helper.capitalizeFirstLetter(topic?.name)}
        onPressBack={() => props.navigation.goBack()}
      />
      <KeyboardAwareScrollView>
        {topicQ?.length ? (
          <FlatList
            data={topicQ}
            renderItem={renderTopicQ}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View style={styles.emptyList}>
            <AppText style={styles.emptyText}>Record not Found.</AppText>
          </View>
        )}
      </KeyboardAwareScrollView>
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
      <AppText style={styles.qText}>{item?.question}</AppText>
      <View style={styles.qInfoSection}>
        <View style={styles.borderView}>
          <AppText style={styles.viewText}>540 views</AppText>
        </View>
        <View style={styles.borderView}>
          <AppText style={styles.viewText}>05 comments</AppText>
        </View>
        <View style={styles.borderView}>
          <AppText style={styles.viewText}>3 helpful</AppText>
        </View>
      </View>
      <AppText style={styles.ansText}>{item?.article?.details}</AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  qCard: {
    padding: wp(3),
    borderBottomWidth: 1,
    borderColor: colors.borderColor,
  },
  qInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: hp(0.5),
    paddingHorizontal: wp(3),
  },
  viewText: {
    fontSize: 10,
  },
  borderView: {
    marginRight: wp(1),
    paddingRight: wp(1),
    borderRightWidth: 1,
    borderColor: colors.borderColor,
  },
  qText: {
    fontWeight: "500",
    paddingBottom: hp(0.5),
  },
  ansText: {
    paddingBottom: hp(1.5),
  },
  emptyList: {
    alignItems: "center",
    marginTop: hp(38),
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
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
