import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import colors from "../../../../constant/colors";
import { MainHeader, GradBtn } from "../../../../components";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Btn from "../../../../components/Btn";
import AppText from "../../../../components/AppText";
import { useDispatch } from "react-redux";
import allActions from "../../../../redux/actions";
import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";
import ThemeContext from "../../../Context/ThemeContext";
import Helper from "../../../Helper";
// import { dark as theme } from "../../../../constant/colorsConfig";

export const ProfileViewOptionScreen = (props) => {
  const [option, setOption] = useState("");
  const [followerOption, setFollowerOption] = useState("");
  const [nameOption, setNameOption] = useState("");

  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);

  const profileData = [
    { title: "Public", value: "Public" },
    { title: "Connections", value: "Connections" },
    { title: "Only me", value: "Only me" },
  ];
  const followersData = [
    { title: "Public", value: "Public" },
    { title: "Connections", value: "Connections" },
    { title: "Only me", value: "Only me" },
  ];
  const nameData = [
    {
      title: "Use First Name with Last Name",
      value: "FIRSTNAME_WITH_LASTNAME",
    },
    {
      title: "Use First Name and initial of Last Name",
      value: "FIRSTNAME_WITH_INITIAL_LASTNAME",
    },
    { title: "Use User Name", value: "USER_NAME" },
    { title: "Use User ID", value: "MEMBER_ID" },
  ];

  useEffect(() => {
    getDisplay();
  }, []);

  const postDisplay = async () => {
    let body = {
      "user.connection-view": followerOption,
      "user.profile-view": option,
      "user.profile-name-view": nameOption,
      "user.profile-view": "Connections",
    };
    // console.log(body);
    dispatch(allActions.DataAction.AppLoader(true));
    const post_Response = await MindAxios.post(Env.createUrl(`settings`), body);
    dispatch(allActions.DataAction.AppLoader(false));

    // console.log("postresponse......", post_Response);
    if (post_Response?.status === 200) {
      Helper.showToastMessage("Options Updated Succcessfully.", colors.green);
    } else {
      Helper.showToastMessage(
        "There's some issue while updating Options.",
        colors.danger
      );
    }
  };

  const getDisplay = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const data_Response = await MindAxios.get(
      Env.createUrl(`settings/?group=user`)
    );
    dispatch(allActions.DataAction.AppLoader(false));

    if (data_Response.status === 200) {
      let displayData = data_Response?.data?.result?.paginated_items;
      // console.log("items........?", displayData);
      displayData.filter((item) => {
        if (item?.name == "connection-view") {
          setFollowerOption(item?.value);
        } else if (item?.name == "profile-view") {
          setOption(item?.value);
        } else if (item?.name == "profile-name-view") {
          setNameOption(item?.value);
        }
      });
    }
  };

  const OptionsData = (item) => {
    return (
      <View style={styles.optionStyle}>
        <TouchableOpacity
          style={[
            styles.radio,
            {
              borderColor:
                item?.value == option ? colors.theme : theme?.lightText,
            },
          ]}
          onPress={() => setOption(item.value)}
        >
          {option == item?.value ? <View style={styles.innerRedio} /> : null}
        </TouchableOpacity>
        <AppText style={[styles.textStyle, { marginLeft: 20 }]}>
          {item?.title}
        </AppText>
      </View>
    );
  };

  const NameDisplayData = (item) => {
    return (
      <View style={styles.optionStyle}>
        <TouchableOpacity
          style={[
            styles.radio,
            {
              borderColor: item?.value == nameOption ? colors.theme : "#707070",
            },
          ]}
          onPress={() => setNameOption(item.value)}
        >
          {nameOption == item?.value ? (
            <View style={styles.innerRedio} />
          ) : null}
        </TouchableOpacity>
        <AppText style={[styles.textStyle, { marginLeft: 20 }]}>
          {item?.title}
        </AppText>
      </View>
    );
  };

  const FollowersOptionData = (item) => {
    return (
      <View style={styles.optionStyle}>
        <TouchableOpacity
          style={[
            styles.radio,
            {
              borderColor:
                item?.value == followerOption ? colors.theme : theme?.lightText,
            },
          ]}
          onPress={() => setFollowerOption(item.value)}
        >
          {item?.value == followerOption ? (
            <View style={styles.innerRedio} />
          ) : null}
        </TouchableOpacity>
        <AppText style={[styles.textStyle, { marginLeft: 20 }]}>
          {item?.title}
        </AppText>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title="Profile viewing option"
        onPressBack={() => props.navigation.goBack()}
      />
      <View style={styles.content}>
        <AppText style={styles.textStyle}>
          Choose who can see your profile.
        </AppText>
        <View>{profileData.map((item) => OptionsData(item))}</View>
        <AppText style={[styles.textStyle, { marginTop: 10 }]}>
          How to display your name on the public profile?
        </AppText>
        <View>{nameData.map((item) => NameDisplayData(item))}</View>
        <AppText style={[styles.titleText, { marginTop: 30 }]}>
          Followers
        </AppText>
        <AppText style={[styles.textStyle, { marginTop: 10 }]}>
          Who can see your followers?
        </AppText>
        <View>{followersData.map((item) => FollowersOptionData(item))}</View>
        <GradBtn
          label="Save"
          height={40}
          width={80}
          style={{
            alignSelf: "center",
            marginTop: 25,
          }}
          onPress={postDisplay}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  content: {
    padding: 12,
  },
  textStyle: {
    fontSize: 16,
    // color: colors.lightBlack,
    marginTop: 10,
    marginBottom: 10,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 15,
    borderWidth: 1.5,
    // marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  innerRedio: {
    height: 12,
    width: 12,
    borderRadius: 10,
    backgroundColor: colors.theme,
  },
  optionStyle: {
    width: wp(85),
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
