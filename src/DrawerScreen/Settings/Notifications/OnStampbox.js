import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, FlatList } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../../constant/colors";
import { MainHeader, GradBtn } from "../../../../components";
import SettingSwitchCard from "../../../../components/SettingSwitchCard";

import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import ThemeContext from "../../../Context/ThemeContext";

import Helper from "../../../Helper";
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";

export const OnStampbox = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const { theme } = useContext(ThemeContext);
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [notifyList, setNotifiyList] = useState(null);
  const [listChanged, setListChanged] = useState(true);

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
      Helper.showToastMessage("Notification Fetched.", colors.green);
      const _data = response?.data?.result?.paginated_items;
      const filterData = _data?.filter((item) => item?.name !== "is_enable");
      setNotifiyList(filterData);
    } else {
      Helper.showToastMessage(
        "There's  some issue while fetching notfications.",
        colors.danger
      );
    }
  };

  const onValueChange = (item, val) => {
    if (val) {
      item.value = val;
    } else {
      if (item.value === "1") {
        item.value = "0";
      } else if (item?.value === "0") {
        item.value = "1";
      }
    }
    setListChanged(!listChanged);
  };

  const updateNotifications = async () => {
    const body = {};
    for (let val of notifyList) {
      body[`${val.group}.${val.name}`] = val.value;
    }
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.post(Env.createUrl("settings"), body);
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      Helper.showToastMessage(
        "Notifications updated successfully.",
        colors.green
      );
      props.navigation.goBack();
    } else {
      Helper.showToastMessage("There some issue updating list.", colors.danger);
    }
  };

  const renderOptions = ({ item, index }) => {
    const showOption = item?.value === "daily" || item?.value === "weekly";
    return (
      <SettingSwitchCard
        key={index}
        option={item.name}
        showOption={showOption}
        optionValue={item?.value}
        borderwidth={index === 0 ? 0 : 1}
        isEnabled={item.value === "1" ? true : false}
        onValueChange={(val) => onValueChange(item, val)}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title={"On StampBox"}
        onPressBack={() => props.navigation.goBack()}
      />
      <ScrollView>
        <View style={[styles.cardView, { backgroundColor: theme?.cardColor }]}>
          <FlatList
            data={notifyList}
            extraData={listChanged}
            renderItem={renderOptions}
            keyExtractor={(item) => item?.id}
          />

          <GradBtn
            fontSize={12}
            label={"Save"}
            height={hp(4)}
            fontWeight={"500"}
            style={styles.button}
            onPress={updateNotifications}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: colors.white,
  },
  button: {
    width: wp(28),
    marginTop: 0,
  },
  cardView: {
    width: wp(95),
    marginTop: 10,
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: colors.cWhite,
    padding: wp(3),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.22,
    shadowRadius: 1.84,
    alignSelf: "center",
    marginTop: hp(2),
  },
});
