import React, { useState, useRef, useContext } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import AppText from "../../components/AppText";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Transition, Transitioning } from "react-native-reanimated";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import PlanCard from "../../components/PlanCard";
import { freePlanDes } from "../../constant/staticData";
import AuthContext from "../Context/AuthContext";

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={200} />
    <Transition.Change />
    <Transition.Out type="fade" durationMs={200} />
  </Transition.Together>
);
const FAQ_LIST_ITEMS = [
  {
    id: "01",
    question: "Why do i have to sign up with my email and full name?",
    answer:
      "A question we would also ask! The reason we request email address and full name is simple. Because we cannot use your cell phone number to forward messages, we need a way to let the receiving person know who the message is coming from. Our Popup number is (843)-868-5597. This is the number that will text your friends & family. We include your name in the message so that when the receiving party reads it, they know it is not from a random person. Also, by confirming your email address, we can ensure that real people are using the app.",
  },
  {
    id: "02",
    question: "Why am i seeing ads in the app?",
    answer:
      "Ads help us keep a free version of Popup. We pay monthly to maintain our service, ownership of our Popup number and each message that is delivered.",
  },
  {
    id: "03",
    question: "Is there a version of PopUp without ads?",
    answer: "Yes! There will be very soon, stay tuned!",
  },
  {
    id: "04",
    question:
      "If I deny contact permissions, How can i add multiple recipients to my message?",
    answer:
      "Easy! When you’re typing phone numbers in the message box, simply add comma (,) between your friends’ phone numbers! For example 1234567890, 0987654321",
  },
  {
    id: "05",
    question: "What is PopUp used for?",
    answer:
      "Popup can be used for many different reasons. The idea behind Popup came from how military members communicate with family back home. At times, communication can be difficult for them. By providing a free way to say ‘Happy birthday’ or ‘Happy Anniversary’, military families can still have the sense of their brave loved ones being close to them. In addition to that, users can remind themselves and others of meetings, never miss out on important events, be reminded of upcoming bills, not forget an important grocery from the supermarket and more! Our goal is for you to use the app as much as you wish and share with others how it has helped you control your schedule and keep on top of everyday life.",
  },
];

function FAQ({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(null);
  const ref = useRef();
  const {myState:{language}}=useContext(AuthContext);
  return (
    <Transitioning.View
      ref={ref}
      transition={transition}
      style={styles.container}
    >
      <ScrollView>
        {FAQ_LIST_ITEMS.map(({ id, question, answer }, index) => (
          <TouchableOpacity
            activeOpacity={0.9}
            key={id}
            onPress={() => {
              ref.current.animateNextTransition();
              setCurrentIndex(currentIndex === index ? null : index);
            }}
            style={styles.cardContainer}
          >
            <View style={styles.card}>
              <View style={styles.questionContainer}>
                <AppText style={styles.id}>{id}</AppText>
                <AppText style={styles.question}>{question}</AppText>
                <View style={{ position: "absolute", right: 2 }}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={30}
                    color="black"
                  />
                </View>
              </View>
              {currentIndex === index && (
                // <View style={styles.answerContainer}>
                //   <AppText style={styles.answer}>{answer}</AppText>
                // </View>
                // <PlanCard/>
                <PlanCard
                  plan="Free Membership Plan"
                  gradColor={["#8098B0", "#A0BAD5"]}
                  planDetails={{
                    day: "30",
                    interval: "Day Trial",
                    coins: "100",
                  }}
                  // onPurchase={()=> navigation.navigate('billing', {planId: 1})}
                  des={freePlanDes}
                  btnLabel2={language?.freeTrial}
                  marginTop={20}
                />
              )}
            </View>
            <View style={styles.separator} />
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
    color: "#000",
  },
});

export default FAQ;
