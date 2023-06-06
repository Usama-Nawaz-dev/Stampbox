import React, { useState } from "react";
import {
  View,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import Helper from "../../../../Helper";
import colors from "../../../../../constant/colors";
import { MainHeader } from "../../../../../components";
import AppText from "../../../../../components/AppText";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import supportEnv from "../../../../../support_apis/supportEnv";
import SupportAxios from "../../../../../support_apis/SupportAxios";

export const QuestionReview = (props) => {
  const { question } = props?.route?.params;

  const q1 = "What was most helful?";
  const q2 = "What can we improve?";

  const [reviewQ, setReviewQ] = useState(q1);
  const [loading, setLoading] = useState(false);
  const [isHelpful, setIsHelpful] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [reviewText, setReviewText] = useState(null);

  const postReview = async () => {
    if (reviewText) {
      const body = {
        reviewable_id: question?.id,
        category: isHelpful ? "HelpFul" : "NotHelpFul",
        reviewable_type: "Topic",
        comment: reviewText,
      };
      setLoading(true);
      const response = await SupportAxios.post(
        supportEnv.createUrl(`reviews`),
        body
      );
      setLoading(false);
      if (response?.status === 200) {
        Helper.showToastMessage("Review sent Successfully", colors.green);
        setShowInput(false);
        setReviewText(null);
      }
    } else {
      Helper.showToastMessage("Review text can't be empty", colors.blueTheme);
    }
  };

  return (
    <View style={styles.container}>
      <MainHeader
        title="Stampbox Admin"
        onPressBack={() => props.navigation.goBack()}
      />
      <ScrollView>
        <AppText style={styles.hText}>{question?.question}</AppText>
        <AppText style={styles.dText}>{question?.article?.details}</AppText>
        <AppText style={styles.reviewQ}>Was this article helpful?</AppText>
        <View style={styles.emojiSection}>
          <Pressable
            style={styles.emoItem}
            onPress={() => {
              setReviewQ(q1);
              setShowInput(true);
              setIsHelpful(true);
            }}
          >
            <Entypo name="emoji-happy" size={hp(4)} />
          </Pressable>
          <Pressable
            style={styles.emoItem}
            onPress={() => {
              setReviewQ(q2);
              setShowInput(true);
              setIsHelpful(false);
            }}
          >
            <Entypo name="emoji-sad" size={hp(4)} />
          </Pressable>
        </View>
        {showInput && (
          <>
            <AppText style={styles.reviewQ}>{reviewQ}</AppText>
            <View style={styles.inputSection}>
              <TextInput
                value={reviewText}
                multiline={true}
                style={styles.input}
                placeholder={"Type here..."}
                onChangeText={(val) => setReviewText(val)}
              />

              {loading ? (
                <ActivityIndicator size="small" color={colors.lightTheme} />
              ) : (
                <TouchableOpacity onPress={postReview}>
                  <MaterialIcons
                    name="send"
                    size={hp(4)}
                    color={colors.lightTheme}
                  />
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
        <QuestionCard />
      </ScrollView>
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
  emojiSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(5),
  },
  emoItem: {
    paddingHorizontal: wp(3),
  },
  reviewQ: {
    paddingHorizontal: wp(3),
    marginVertical: hp(1),
  },
  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
  },
  input: {
    width: "85%",
    fontSize: 14,
    height: hp(5),
    padding: wp(3),
    borderRadius: 5,
    marginRight: wp(2),
    paddingTop: hp(1.5),
    backgroundColor: colors.background,
  },
});
