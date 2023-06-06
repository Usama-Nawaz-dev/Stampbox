import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Modal,
  Alert,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import _ from "lodash";
import { Rating } from "react-native-ratings";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import AppText from "./AppText";
import { GradBtn } from "./GradBtn";
import colors from "../constant/colors";
import Fonts from "../assets/fonts/Fonts";
import ErrorMessage from "../src/forms/ErrorMessage";

import Env from "../api/Env";
import Helper from "../src/Helper";
import MindAxios from "../api/MindAxios";

import AuthContext from "../src/Context/AuthContext";
import ThemeContext from "../src/Context/ThemeContext";

export const FeedBackModal = (props) => {
  const { detail, userId, modalVisible, setModalVisible } = props;

  const [qList, setQList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allRatings, setAllRating] = useState({});

  const [error, setError] = useState(false);
  const [feedback, setFeedBack] = useState(null);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    const response = await MindAxios.get(
      Env.createUrl(`feedback-questions?type=Exhibition`)
    );
    if (response.status == 200) {
      setQList(response?.data?.result?.questions);
    } else {
      alert(language?.serverError);
    }
  };

  const checkValidation = async () => {
    if (_.size(qList) !== _.size(allRatings)) {
      alert("Please rate all question");
      return;
    }
    if (!feedback) {
      setError("Feedback is required");
      return;
    }
    setLoading(true);
    let questions = formBody();
    const body = {
      user_id: userId,
      feedback: feedback,
      questions: questions,
      feedbackable_type: "Event",
      feedbackable_id: detail?.id,
    };
    // console.log("body", body);
    const response = await MindAxios.post(Env.createUrl(`rating`), body);
    setLoading(false);
    // console.log(response);
    const { status } = response;
    if (status == 200) {
      setError(false);
      setAllRating({});
      setFeedBack(null);
      setModalVisible(false);
      Helper.showToastMessage("Feedback submitted Successfully", colors.green);
    } else {
      Helper.showToastMessage(
        response?.e?.response?.data?.message,
        colors.danger
      );
    }
  };

  const formBody = () => {
    let questions = [];
    Object.keys(allRatings).forEach((key, index) => {
      let obj = {};
      obj.fb_question_id = key;
      obj.rating = allRatings[key];
      questions.push(obj);
    });
    return questions;
  };

  const sortRating = (q_id, rating) => {
    if (_.isEmpty(allRatings)) {
      allRatings[q_id] = rating;
    } else {
      if (allRatings[q_id] == rating) {
        delete allRatings[q_id];
      } else {
        allRatings[q_id] = rating;
      }
    }
  };

  const renderQuestions = ({ item, index }) => {
    return (
      <View>
        <AppText style={styles.infoText}>{item?.question}</AppText>
        <Rating
          fractions={2}
          imageSize={28}
          ratingCount={5}
          startingValue={0}
          onFinishRating={(val) => {
            sortRating(item?.id, val);
          }}
          style={styles.ratingStyle}
          tintColor={theme?.white === "#2B3135" ? theme?.white : null}
        />
      </View>
    );
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert(language?.modal_has_been_closed);
      }}
    >
      <View style={styles.centeredView}>
        <View style={[styles.container, { backgroundColor: theme?.cardColor }]}>
          <View style={styles.upperSection}>
            <AppText style={styles.title}>Feedback</AppText>
            <TouchableOpacity
              onPress={() => {
                setError(false);
                setAllRating({});
                setFeedBack(null);
                setModalVisible(false);
              }}
              style={styles.cross}
            >
              <EvilIcons name="close" color="#000" size={hp(3.5)} />
            </TouchableOpacity>
          </View>
          <View style={[styles.container, { backgroundColor: theme?.white }]}>
            <View style={styles.section}>
              <FlatList
                data={qList}
                renderItem={renderQuestions}
                style={{ marginTop: hp(1) }}
              />
              <TextInput
                multiline
                placeholder="Write your feedback..."
                placeholderTextColor={colors.placeholderText}
                onChangeText={(text) => {
                  setError(false);
                  setFeedBack(text);
                }}
                value={feedback}
                style={styles.input}
              />
              <ErrorMessage visible={error ? true : false} error={error} />
              <GradBtn
                label="Rate Now"
                fontSize={14}
                fontWeight={"400"}
                height={35}
                width="50%"
                style={{ margin: 10 }}
                onPress={checkValidation}
                loading={loading}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  container: {
    width: wp(90),
    borderRadius: 5,
    alignSelf: "center",
    backgroundColor: "#fff",
  },
  upperSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: colors.borderColor,
    marginHorizontal: wp(5),
    borderBottomWidth: 1,
    paddingBottom: hp(1),
    marginTop: hp(1.5),
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  loader: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  cross: {
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    paddingHorizontal: wp(3.5),
  },
  infoText: {
    fontSize: 13,
    marginTop: hp(2),
    marginBottom: hp(1),
    fontFamily: Fonts.IBM_Medium,
  },
  ratingStyle: {
    paddingVertical: 0,
    alignSelf: "flex-start",
    marginLeft: wp(5),
  },
  input: {
    height: hp(13),
    borderRadius: 5,
    marginTop: hp(2),
    padding: hp(1.2),
    paddingTop: hp(1.4),
    color: colors.heading,
    fontFamily: Fonts.Inter_Regular,
    backgroundColor: colors.background,
  },
});
