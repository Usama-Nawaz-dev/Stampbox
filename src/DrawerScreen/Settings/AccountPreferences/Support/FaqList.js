import React, { useState, useRef, useContext } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { FAQ_LIST_ITEMS } from "./utils";
import { Transition, Transitioning } from "react-native-reanimated";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AppText from "../../../../../components/AppText";
import colors from "../../../../../constant/colors";
import ThemeContext from "../../../../Context/ThemeContext";

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={200} />
    <Transition.Change />
    <Transition.Out type="fade" durationMs={200} />
  </Transition.Together>
);

export function FaqList({ faqList, navigation }) {
  const { theme } = useContext(ThemeContext);
  const [currentIndex, setCurrentIndex] = useState(null);
  const ref = useRef();
  return (
    <Transitioning.View
      ref={ref}
      transition={transition}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {faqList?.map((item, index) => (
          <TouchableOpacity
            activeOpacity={0.9}
            key={item?.id}
            onPress={() => {
              ref.current.animateNextTransition();
              setCurrentIndex(currentIndex === index ? null : index);
            }}
            style={styles.cardContainer}
          >
            <View style={styles.card}>
              <View style={styles.questionContainer}>
                <AppText style={[styles.id, { color: theme.lightGrey }]}>
                  {index + 1}
                </AppText>
                <AppText
                  style={[styles.question, { color: theme.highTxtColor }]}
                >
                  {item?.question}
                </AppText>
                <View style={{ position: "absolute", right: 2 }}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={30}
                    color={theme.highTxtColor}
                  />
                </View>
              </View>
              {currentIndex === index && (
                <TouchableOpacity
                  style={styles.answerContainer}
                  onPress={() =>
                    navigation.navigate("QuestionReview", {
                      question: item,
                    })
                  }
                >
                  <AppText style={styles.answer}>
                    {item?.article?.details}
                  </AppText>
                </TouchableOpacity>
              )}
            </View>
            <View
              style={[styles.separator, { backgroundColor: theme.chalice }]}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Transitioning.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: "2%" },
  body: { paddingHorizontal: hp(1), height: hp(90) },
  cardContainer: {
    // flexGrow: 1,
    paddingBottom: hp(2),
    marginTop: 10,
  },
  card: { flexGrow: 1 },
  questionContainer: { flexDirection: "row", alignItems: "center" },
  id: {
    marginHorizontal: hp(0.8),
    fontSize: hp(2.4),
    color: "#ccc",
    fontWeight: "bold",
  },
  question: {
    paddingHorizontal: hp(2),
    fontSize: 16,
    width: "88%",
  },
  answerContainer: {
    padding: hp(2),
    zIndex: 999,
  },
  answer: { fontSize: wp(4.4) },
  separator: {
    marginTop: hp(1),
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
  },
  header: {
    padding: hp(4),
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: wp(5.6),
    color: colors.black,
  },
});
