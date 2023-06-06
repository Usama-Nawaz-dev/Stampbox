import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";

import { styles } from "./styles";
import AppText from "../../../../components/AppText";
import UserCard from "../../../../components/UserCard";
import { MainHeader, GradBtn, SuccessModal } from "../../../../components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { Rating } from "react-native-ratings";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import _ from "lodash";
import colors from "../../../../constant/colors";
import ErrorMessage from "../../../forms/ErrorMessage";
import { popTotop } from "../../../../constant/navigationMethods";

import Helper from "../../../Helper";
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";

import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";

export const Feedback = (props) => {
  const { type } = props.route.params;
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const order = useSelector((state) => state.DetailReducer.orderDetail);

  const orderSender = order?.store_orders
    ? order?.store_orders[0]?.products[0]?.productable?.user
    : null;

  const focused = useIsFocused();
  const dispatch = useDispatch();

  const [error, setError] = useState(false);
  const [feedback, setFeedBack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setISLoading] = useState(false);
  const [qList, setQList] = useState(null);
  const [allRatings] = useState({});
  const [showModal, setShowModal] = useState(false);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchQuestion();
  }, [focused]);

  const fetchQuestion = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl(`feedback-questions?type=${type}`)
    );
    // console.log(response?.data?.result?.questions)
    dispatch(allActions.DataAction.AppLoader(false));
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
    // if (!feedback) {
    //   setError("Feedback is required");
    //   return;
    // }
    const questions = formBody();
    const lessRating = questions.find((qr) => qr.rating < 2);

    if (lessRating !== undefined && !feedback) {
      setError("Feedback is required");
      return;
    }

    const body = {
      transaction_id: order?.transaction?.id,
      questions: questions,
      feedback: feedback ? feedback : "",
      user_id: orderSender
        ? orderSender?.id
        : order?.sender_id !== currentUser?.id
        ? order?.sender_id
        : order?.receiver_id,
    };
    // console.log("body", body);
    setLoading(true);
    const response = await MindAxios.post(Env.createUrl(`tfs`), body);
    setLoading(false);
    // console.log(response);
    const { status } = response;
    if (status == 200) {
      // props.navigation.goBack();
      // popTotop();
      // Helper.showToastMessage("Feedback submitted Successfully", colors.green);
      setShowModal(true);
    } else {
      Helper.showToastMessage(
        response?.e?.response?.data?.message,
        colors.danger
      );
    }
  };

  const formBody = () => {
    // console.log("methods", allRatings);
    let questions = [];
    Object.keys(allRatings).forEach((key, index) => {
      //   console.log("key", key);
      let obj = {};
      obj.fb_question_id = key;
      obj.rating = allRatings[key];
      questions.push(obj);
    });
    // console.log("questions", questions);
    return questions;
  };
  const sortRating = (q_id, rating) => {
    // console.log("allRatings", allRatings);
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
          // jumpValue={0.25}
          onFinishRating={(val) => {
            setError(null);
            sortRating(item?.id, val);
          }}
          style={styles.ratingStyle}
          tintColor={theme?.white === "#2B3135" ? theme?.white : null}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title="Feedback"
        onPressBack={() => {
          props.navigation.goBack();
        }}
      />
      <KeyboardAwareScrollView>
        <View style={styles.section}>
          <UserCard
            User={orderSender ? orderSender : order?.sender}
            imgSize={50}
            starSize={16}
            nameStyle={{ fontSize: 16, maxWidth: wp(60) }}
          />
          <FlatList
            data={qList}
            renderItem={renderQuestions}
            style={{ marginTop: hp(1) }}
          />
          <TextInput
            multiline
            placeholder="write your feedback..."
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
            height={40}
            width="100%"
            fontSize={14}
            label="Rate Now"
            loading={loading}
            fontWeight={"400"}
            onPress={checkValidation}
          />
        </View>
      </KeyboardAwareScrollView>

      <SuccessModal
        showModal={showModal}
        onPress={() => {
          setShowModal(false);
          popTotop();
        }}
      />
    </View>
  );
};
