import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";

import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";
import { HunterCard } from "../../../../components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import allActions from "../../../../redux/actions";
import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";
import Helper from "../../../Helper";

import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";
import Feather from "react-native-vector-icons/Feather";

export const SelectHunterTab = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const [dataList, setDataList] = useState(null);
  const [listChanged, setListChanged] = useState(true);
  const bountyDetail = useSelector((state) => state.DetailReducer.bountyDetail);

  useEffect(() => {
    if (focused) {
      fetchBountyReq();
    }
  }, [focused]);

  const fetchBountyReq = async () => {
    const userId = await Helper.getData("userId");
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl(
        `bounty-offers?bounty_id=${bountyDetail?.id}&status=Selected_Hunters`
      )
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      setDataList(_data);
    } else {
      Helper.showToastMessage("Server Error", colors.danger);
    }
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === dataList.length - 1;
    return (
      <View style={{ marginBottom: isEnd ? hp(2.5) : hp(1) }}>
        <HunterCard
          ItemDetail={item}
          onChat={() => {
            let newItem = {};
            const name = item?.user?.full_name
              ? item?.user?.full_name
              : item?.user?.first_name;
            newItem.from = name;
            newItem.type = item?.user?.id;
            newItem.message = item?.user?.image_url;
            dispatch(allActions.SheetAction.user_chat(newItem));
            props.navigation.navigate("ChatScreen", { newItem });
          }}
        />
      </View>
    );
  };

  const onAcceptReq = async (id) => {
    const body = { status: "Pending" };
    const response = await MindAxios.post(
      Env.paramUrl(`bounty-offers`, currentItem?.id),
      body
    );
    if (response?.status === 200) {
      Helper.showToastMessage("Request Accepted.", colors.green);
      const filterList = dataList?.filter((item) => item.id !== id);
      setDataList(filterList);
    } else {
      Helper.showToastMessage(
        "There's some issue while accepting Request.",
        colors.danger
      );
    }
  };

  const onRejectReq = async (id) => {
    const response = await MindAxios.delete(Env.paramUrl(`bounty-offers`, id));
    if (response?.status === 200) {
      Helper.showToastMessage("Request Rejected.", colors.green);
      const filterList = dataList?.filter((item) => item.id !== id);
      setDataList(filterList);
    } else {
      Helper.showToastMessage(
        "There's some issue while rejecting Request.",
        colors.danger
      );
    }
  };

  return (
    <View style={styles.container}>
      {dataList?.length ? (
        <FlatList
          data={dataList}
          extraData={listChanged}
          renderItem={renderItem}
          style={styles.listStyle}
        />
      ) : (
        <View style={styles.mainItem}>
          <AppText style={styles.emptyList}>
            {"You don't have any active Invitation."}
          </AppText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  listStyle: {
    paddingHorizontal: wp(3),
    paddingTop: hp(1),
  },
  emptyList: {
    fontSize: 12,
    fontWeight: "500",
    alignSelf: "center",
    color: colors.lightTheme,
  },
  mainItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
