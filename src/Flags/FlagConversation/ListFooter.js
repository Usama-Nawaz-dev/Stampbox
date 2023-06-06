import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { images } from "../../../assets/images/Images";
import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";
import AuthContext from "../../Context/AuthContext";

const ListFooter = ({ voting, addVote }) => {
  const {myState:{language}}=useContext(AuthContext);
  return (
    <View
      style={{
        height: 250,
        width: "95%",
        borderRadius: 10,
        backgroundColor: "lightgrey",
        alignSelf: "center",
        // padding: 10,
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontFamily: Fonts.Roboto_Medium,
          alignSelf: "flex-start",
          left: 10,
        }}
      >
        Community Expert Clarification (CEC) Voting
      </Text>

      <View style={{ flexDirection: "row" }}>
        <View style={styles.communityBox}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.txt}>Flagger</Text>
            <View
              style={
                addVote.for_flagger
                  ? styles.votedCounter
                  : styles.unvotedCounter
              }
            >
              <Text style={{ color: addVote.for_flagger ? "#fff" : "#000" }}>
                {addVote?.flagger_votes}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => voting(true)}>
            <Image
              source={
                addVote.for_flagger ? images.flag_unlike : images.flag_like
              }
              style={{ height: 80, width: 80 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text style={styles.communityTxt}>Community percentage of vote</Text>
        </View>

        <View style={styles.communityBox}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.txt}>{language?.owner}</Text>
            <View
              style={
                addVote.for_owner ? styles.votedCounter : styles.unvotedCounter
              }
            >
              <Text style={{ color: addVote.for_owner ? "#fff" : "#000" }}>
                {addVote?.owner_votes}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => voting(false)}>
            <Image
              source={addVote.for_owner ? images.flag_unlike : images.flag_like}
              style={{ height: 80, width: 80 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.communityTxt}>Community percentage of vote</Text>
        </View>
      </View>
    </View>
  );
};

export { ListFooter };

const styles = StyleSheet.create({
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
  votedCounter: {
    height: 25,
    width: 25,
    backgroundColor: colors.lightTheme,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    // position: "absolute",
    // bottom: 2,
    left: 5,
  },
  unvotedCounter: {
    height: 25,
    width: 25,
    // backgroundColor: colors.lightTheme,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    // position: "absolute",
    // bottom: 2,
    left: 5,
    borderColor: colors.lightTheme,
    borderWidth: 2,
  },
});
