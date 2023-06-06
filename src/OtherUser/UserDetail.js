import {
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ProfileHeader, UserInfo } from "../../components";
import { images } from "../../assets/images/Images";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import colors from "../../constant/colors";
import AppText from "../../components/AppText";
import { useIsFocused } from "@react-navigation/native";
import MindAxios from "../../api/MindAxios";
import Env from "../../api/Env";
import { useDispatch } from "react-redux";
import allActions from "../../redux/actions";
import AuthContext from "../Context/AuthContext";
import ThemeContext from "../Context/ThemeContext";
// import { dark as theme } from "../../constant/colorsConfig";

const UserDetail = (props) => {
  const { user } = props.route.params;
  console.log("props", user);
  const [userData, setUserData] = useState(null);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { myState: { language } } = useContext(AuthContext);
  const { theme }= useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      if (isFocused) {
        dispatch(allActions.DataAction.ActivityModal(true));
        const res = await MindAxios.get(Env.createUrl(`users/${user?.id}`));
        dispatch(allActions.DataAction.ActivityModal(false));
        console.log("res", res);
        if (res?.status == 200) {
          let data = res?.data?.result?.user;
          console.log("data", data);
          setUserData(data);
        }
      }
    })();
  }, [isFocused]);
  const subscription = userData?.subscriptions
    ? userData?.subscriptions[0]?.subscription_plan_id
    : null;

  let planPath, planName;
  if (subscription == 1) {
    planName = "Bronze";
    planPath = images.Gold;
  } else if (subscription == 3) {
    planName = "Silver";
    planPath = images.Gold;
  } else if (subscription == 4) {
    planName = "Gold";
    planPath = images.Gold;
  } else {
    planName = "Trial";
    planPath = images.Gold;
  }
  return (
    <View style={{ flex: 1, backgroundColor: theme?.white }}>
      <ProfileHeader
        title="User Detail"
        onPressBack={() => props.navigation.goBack()}
        edit={false}
      />
      <View
        style={{
          height: 130,
          width: 130,
          borderRadius: 75,
          backgroundColor: "lightgrey",
          alignSelf: "center",
          top: -50,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={user?.image_url ? { uri: user?.image_url } : images.noImg}
          style={{ height: 128, width: 128, borderRadius: 75 }}
        />
      </View>
      <View style={{ top: -45 }}>
        <AppText style={styles.userText}>{user?.full_name}</AppText>
        <View style={styles.userDetail}>
          <AppText style={styles.userInfo}>
            ID:{" "}
            <AppText style={styles.valueText}>
              {userData?.user_detail?.member_id}
            </AppText>
          </AppText>
          <AppText style={styles.userInfo}>
            Scores: <AppText style={styles.valueText}>{userData?.user_detail?.score}</AppText>
          </AppText>
          <AppText style={styles.userInfo}>
            SEL: <AppText style={styles.valueText}>{userData?.mrs_badge}</AppText>
          </AppText>
        </View>
        <View style={styles.followSection}>
          <Pressable
            style={styles.countSection}
          // onPress={() => props.navigation.navigate("MyNetwork", { initialRoute: "Follwers" })}
          >
            <AppText style={styles.countText}>
              {userData?.followers_count}
            </AppText>
            <AppText style={styles.followText}>Followers</AppText>
          </Pressable>
          <View style={styles.verticleLine}></View>
          <Pressable
            style={styles.countSection}
          // onPress={() => props.navigation.navigate("MyNetwork", { initialRoute: "Following" })}
          >
            <AppText style={styles.countText}>
              {userData?.following_count}
            </AppText>
            <AppText style={styles.followText}>{language?.following}</AppText>
          </Pressable>
          <View style={styles.verticleLine}></View>
          <View style={styles.countSection}>
            <AppText style={styles.countText}>
              {userData?.rating?.toFixed(1)}
            </AppText>
            <AppText style={styles.followText}>Rating</AppText>
          </View>
        </View>
      </View>
      <ScrollView>
        <Image style={styles.planImage} source={planPath} />
        <AppText style={styles.statusText}>You are standing with</AppText>
        <AppText style={styles.statusText}>
          {planName} Status in Community
        </AppText>
        <Pressable
          style={{
            height: 35,
            width: 120,
            backgroundColor: colors.bgLight,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            marginTop: 20,
          }}
        >
          <Text>{language?.follow}</Text>
        </Pressable>
        <View style={{ marginVertical: 30, paddingHorizontal: wp(3) }}>
          <UserInfo userData={userData} />
        </View>
      </ScrollView>
    </View>
  );
};

export default UserDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  editBtn: {
    width: 30,
    height: 30,
    backgroundColor: colors.lightTheme,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: hp(10),
    position: "absolute",
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  userSection: {
    alignSelf: "center",
    marginTop: -40,
  },
  userImage: {
    width: 110,
    height: 110,
    borderRadius: hp(10),
    resizeMode: "cover",
  },
  followSection: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-around",
    width: wp(85),
  },
  verticleLine: {
    height: "60%",
    width: 1,
    backgroundColor: colors.borderColor,
    alignSelf: "center",
  },
  countSection: {
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    fontSize: 18,
    fontFamily: Fonts.IBM_SemiBold,
    // color: colors.lightBlack,
  },
  followText: {
    fontSize: 14,
    marginTop: 5,
    // fontFamily: Fonts.Roboto_Regular,
    // color: colors.lightText,
  },
  planSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(3.5),
    marginTop: 20,
  },
  userDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: wp(10),
  },
  userText: {
    fontSize: 18,
    fontFamily: Fonts.IBM_Bold,
    // color: colors.lightBlack,
    textAlign: "center",
    paddingVertical: 5,
  },
  userInfo: {
    fontFamily: Fonts.Roboto_Regular,
    // color: colors.lightText,
  },
  valueText: {
    fontFamily: Fonts.Roboto_Medium,
    // color: colors.lightText,
  },
  subscriptionSection: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(8),
    marginBottom: 20,
  },
  planImage: {
    width: 180,
    height: 160,
    resizeMode: "contain",
    alignSelf: "center",
  },
  statusText: {
    fontSize: 14,
    // color: colors.lightText,
    textAlign: "center",
    letterSpacing: 0.5,
    lineHeight: 20,
  },
  gradBtnSection: {
    flexDirection: "row",
    // paddingHorizontal: wp(3),
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.IBM_Bold,
    // color: colors.lightBlack,
  },
  aboutDetail: {
    fontSize: 10,
    color: colors.lightText,
    marginTop: hp(1),
  },
  otherSection: {
    paddingBottom: 15,
    paddingHorizontal: wp(3),
  },
  tabSection: {
    marginTop: hp(1),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedTab: {
    backgroundColor: colors.lightTheme,
    paddingVertical: 10,
    paddingHorizontal: wp(7),
    borderRadius: 5,
  },
  defaultTab: {
    backgroundColor: colors.background,
    paddingVertical: 10,
    paddingHorizontal: wp(7),
    borderRadius: 5,
  },
  tabText: {
    fontSize: 12,
    color: colors.btnText,
  },
  shortcutTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
  },
  //Image Picker Modal
  centeredView: {
    width: wp(50),
    marginTop: hp(40),
    alignSelf: "center",
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 7,
  },
  modalView: {
    padding: wp(2),
  },
  headingText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: hp(1),
    alignSelf: "center",
  },
  modalText: {
    fontSize: 12,
    marginTop: hp(0.5),
    alignSelf: "center",
    color: "grey",
  },
  cancelButton: {
    fontSize: 11,
    color: "red",
    fontWeight: "500",
    alignSelf: "center",
    marginTop: hp(1),
    marginBottom: hp(1),
  },
});
