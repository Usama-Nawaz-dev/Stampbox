import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";

import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";
import { HunterCard } from "../../../../components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import allActions from "../../../../redux/actions";
import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";
import Helper from "../../../Helper";

import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";
import Feather from "react-native-vector-icons/Feather";

export const HunterReqTab = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const [dataList, setDataList] = useState(null);

  useEffect(() => {
    if (focused) {
      fetchHunterReq();
    }
  }, [focused]);

  const fetchHunterReq = async () => {
    const userId = await Helper.getData("userId");
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl("bounty-offers", `?user_id=${userId}&status=Hunting_request`)
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
    let myItem = item;
    item.description = "You have sent hunting request to above user Bounty.";
    item.user = item?.bounty.user;
    return (
      <View style={{ marginBottom: isEnd ? hp(2.5) : hp(1) }}>
        <HunterCard
          ItemDetail={myItem}
          showBtn={true}
          onChat={() => {
            let newItem = {};
            const name = myItem?.user?.full_name
              ? myItem?.user?.full_name
              : myItem?.user?.first_name;
            newItem.from = name;
            newItem.type = myItem?.user?.id;
            newItem.message = myItem?.user?.image_url;
            dispatch(allActions.SheetAction.user_chat(newItem));
            props.navigation.navigate("ChatScreen", { newItem });
          }}
          onPress={() => {
            dispatch(allActions.DetailAction.BountyDetail(item?.bounty));
            props.navigation.navigate("BountyDetail");
          }}
          showAccept={false}
          btnText={"Cancel Request"}
          onDecline={() => onRejectReq(item?.id)}
        />
      </View>
    );
  };

  const onRejectReq = async (id) => {
    const response = await MindAxios.delete(Env.paramUrl(`bounty-offers`, id));
    if (response?.status === 200) {
      Helper.showToastMessage("Hunting request canceled.", colors.green);
      const filterList = dataList?.filter((item) => item.id !== id);
      setDataList(filterList);
    } else {
      Helper.showToastMessage(
        "There's some issue on cancel Request.",
        colors.danger
      );
    }
  };

  return (
    <View style={styles.container}>
      {dataList?.length ? (
        <FlatList
          data={dataList}
          renderItem={renderItem}
          style={styles.listStyle}
        />
      ) : (
        <View style={styles.mainItem}>
          <AppText style={styles.emptyList}>
            {"You don't have any active hunting Request."}
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
