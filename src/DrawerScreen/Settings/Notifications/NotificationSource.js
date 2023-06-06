import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";
import ThemeContext from "../../../Context/ThemeContext";
import { MainHeader, GradBtn } from "../../../../components";

import Helper from "../../../Helper";
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";

import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

export const NotificationsSource = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const [option, setOption] = useState("");
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (focused) {
      fetchNotifyListing();
    }
  }, [focused]);

  const fetchNotifyListing = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl("settings?group=notifications")
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      Helper.showToastMessage("Notification sourced fetched.", colors.green);
      const _data = response?.data?.result?.paginated_items;
      const filterData = _data?.filter((item) => {
        if (item?.name === "is_enable") {
          setOption(item?.value);
        }
      });
    } else {
      Helper.showToastMessage(
        "There's  some issue while fetching notfications.",
        colors.danger
      );
    }
  };

  const profileData = [
    { title: "All", value: "all" },
    { title: "Email", value: "email" },
    { title: "Push", value: "push" },
    { title: "None", value: "none" },
  ];

  const OptionsData = (item) => {
    return (
      <View style={styles.optionStyle}>
        <TouchableOpacity
          style={[
            styles.radio,
            {
              borderColor:
                item?.value == option ? colors.lightTheme : "#707070",
            },
          ]}
          onPress={() => setOption(item.value)}
        >
          {option == item?.value ? <View style={styles.innerRedio} /> : null}
        </TouchableOpacity>
        <AppText style={[styles.textStyle1, { marginLeft: wp(4) }]}>
          {item?.title}
        </AppText>
      </View>
    );
  };

  const updateNotifications = async () => {
    const body = { "notifications.is_enable": option };
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.post(Env.createUrl("settings"), body);
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      Helper.showToastMessage("Notifications source updated.", colors.green);
      props.navigation.goBack();
    } else {
      Helper.showToastMessage(
        "There some issue updating notification source.",
        colors.danger
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title={"Notifications Source"}
        onPressBack={() => props.navigation.goBack()}
      />
      <View style={styles.content}>
        <AppText style={styles.textStyle}>
          How you get your notifications
        </AppText>
        <View>{profileData.map((item) => OptionsData(item))}</View>
        <GradBtn
          fontSize={14}
          label={"Save"}
          height={hp(4.5)}
          fontWeight={"600"}
          style={styles.button}
          onPress={updateNotifications}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: colors.white,
  },
  content: {
    marginTop: hp(1.5),
    paddingHorizontal: wp(5),
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "500",
    marginVertical: hp(1),
  },
  textStyle1: {
    fontSize: 14,
    marginVertical: hp(1),
  },
  radio: {
    width: hp(2.8),
    height: hp(2.8),
    borderWidth: 1.5,
    borderRadius: hp(10),
    alignItems: "center",
    justifyContent: "center",
  },
  innerRedio: {
    height: hp(1.7),
    width: hp(1.7),
    borderRadius: 10,
    backgroundColor: colors.lightTheme,
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
  button: {
    width: wp(30),
    marginTop: hp(3),
  },
});
