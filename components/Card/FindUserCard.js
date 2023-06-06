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
import { CustomButton } from "../Buttons/CustomButton";
// Request URL: https://devapi.stampbox.com/api/follows/177

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import AuthContext from "../../src/Context/AuthContext";
import ThemeContext from "../../src/Context/ThemeContext";
// import { dark as theme } from "../../constant/colorsConfig";

const stars = [1, 2, 3, 4, 5];
export const FindUserCard = (props) => {
  const { User, onPressBtn, onCancel, onFollow, onFollowing, onViewUser } =
    props;
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      <Pressable style={styles.userSection} onPress={onViewUser}>
        <View>
          <Image style={styles.userImg} source={{ uri: User.image_url }} />
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text
            numberOfLines={1}
            style={[styles.nameText, { color: theme?.darkGrey }]}
          >
            {Helper.capitalizeFirstLetter(User?.full_name)}
          </Text>
          <View style={styles.planSection}>
            <Image
              style={styles.userIcon}
              source={require("../../assets/icons/userIcon.png")}
            />
            <Text style={[styles.planText, { color: theme?.darkGrey }]}>
              {User?.subscriptions[0]?.subscription_plan?.name} {language?.plan}
            </Text>
          </View>
          <StarRatings
            rating={User?.rating > 0 ? User?.rating : "0"}
            ratingStyle={{ height: 14, width: 14 }}
          />
        </View>
      </Pressable>
      {User?.is_follower_request_received ? (
        <View style={styles.rightSection}>
          {!User?.is_current_user_following &&
            !User?.is_following_request_send && (
              <TouchableOpacity onPress={onFollow}>
                <Text style={styles.followText}>{language?.follow}</Text>
              </TouchableOpacity>
            )}
          <CustomButton
            bg={colors.background}
            label={language?.followRequest}
            textColor={colors.lightTheme}
            fontWeight="500"
            width={wp(26)}
            height={30}
            fontSize={10}
            onPress={onPressBtn}
          />
        </View>
      ) : User?.is_following_request_send ? (
        <CustomButton
          bg={colors.background}
          label={language?.cancelRequest}
          textColor={colors.lightTheme}
          fontWeight="500"
          width={wp(26)}
          height={30}
          fontSize={10}
          onPress={onCancel}
        />
      ) : User?.is_current_user_following ? (
        <CustomButton
          bg={colors.background}
          label={language?.following}
          textColor={colors.lightTheme}
          fontWeight="500"
          width={wp(22)}
          height={30}
          fontSize={12}
          onPress={onFollowing}
        />
      ) : (
        <CustomButton
          bg={colors.background}
          label={language?.follow}
          textColor={colors.lightTheme}
          fontWeight="500"
          width={wp(22)}
          height={30}
          fontSize={12}
          onPress={onFollow}
        />
      )}
    </View>
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
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: colors.background,
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
