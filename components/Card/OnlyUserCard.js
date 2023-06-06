import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";

import colors from "../../constant/colors";
import Fonts from "../../assets/fonts/Fonts";

import Helper from "../../src/Helper";
import { StarRatings } from "../StarRatings";
import Fontisto from "react-native-vector-icons/Fontisto";
// Request URL: https://devapi.stampbox.com/api/follows/177

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import CheckBox from "@react-native-community/checkbox";
import AuthContext from "../../src/Context/AuthContext";

export const OnlyUserCard = (props) => {
  const { User, onValueChange, index, otherIcon, onPress, isEnd } = props;
  const {
    myState: { language },
  } = useContext(AuthContext);

  return (
    <Pressable
      onPress={!otherIcon ? onPress : null}
      style={[styles.container, { marginBottom: isEnd ? hp(5) : null }]}
    >
      <View style={styles.userSection}>
        <View>
          <Image style={styles.userImg} source={{ uri: User.image_url }} />
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text numberOfLines={1} style={styles.nameText}>
            {Helper.capitalizeFirstLetter(User?.full_name)}
          </Text>
          <View style={styles.planSection}>
            <Image
              style={styles.userIcon}
              source={require("../../assets/icons/userIcon.png")}
            />
            <Text style={styles.planText}>
              {User?.subscriptions[0]?.subscription_plan?.name} {language?.plan}
            </Text>
          </View>
          <StarRatings
            rating={User?.rating > 0 ? User?.rating : "0"}
            ratingStyle={{ height: 14, width: 14 }}
          />
        </View>
      </View>
      {otherIcon ? (
        <Fontisto
          onPress={() => onValueChange(User?.isSelected, index)}
          name={User?.isSelected ? "checkbox-active" : "checkbox-passive"}
          size={25}
          color={User?.isSelected ? colors.lightTheme : colors.color4}
        />
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: "94%",
    padding: 10,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: 'red'
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  planSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    // backgroundColor: 'pink'
  },
  nameText: {
    maxWidth: wp(40),
    color: colors.heading,
    fontFamily: Fonts.IBM_Regular,
  },
  planText: {
    marginLeft: 5,
    fontSize: 12,
    color: colors.heading,
    fontFamily: Fonts.IBM_Regular,
  },
  userIcon: {
    width: 15,
    height: 15,
    tintColor: "orange",
    borderRadius: 30,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  followText: {
    fontSize: 12,
    marginRight: 5,
    fontWeight: "500",
    color: colors.blueTheme,
    fontFamily: Fonts.Inter_Regular,
  },
});
