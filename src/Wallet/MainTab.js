import React, { useState, useCallback } from "react";
import { View, Image, StyleSheet, Dimensions, ScrollView } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import Empty from "../../components/Empty";
import colors from "../../constant/colors";
import AppText from "../../components/AppText";
import { HistoryCard } from "../../components";
import { images } from "../../assets/images/Images";

import moment from "moment";
import { useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import Helper from "../Helper";
import Env from "../../api/Env";
import allActions from "../../redux/actions";
import MindAxios from "../../api/MindAxios";

const { width } = Dimensions.get("window");

const MainTab = (props) => {
  const { tab } = props;
  const dispatch = useDispatch();
  const [history, setHistory] = useState(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const userId = await Helper.getData("userId");
        let paramUrl =
          tab == "Coin"
            ? `coins?user_id=${userId}`
            : `payment/wallet-payment-logs?user_id=${userId}`;
        // dispatch(allActions.DataAction.ActivityModal(true));
        const response = await MindAxios.get(Env.createUrl(paramUrl));
        // console.log('response', response)
        if (response?.status == 200) {
          let _data = response?.data?.result?.paginated_items?.data;
          //   console.log("response", _data);
          setHistory(_data);
          //   dispatch(allActions.DataAction.ActivityModal(false));
        }
      })();
      return () => {
        // alert('Screen was unfocused');
      };
    }, [])
  );

  return (
    <View
      style={{
        width: width,
        // backgroundColor:
      }}
    >
      {history?.length ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {history?.map((item, index) => {
            let isEnd = index == history.length - 1 ? hp(5) : null;
            let createdAt = moment(item?.created_at).format(
              "YYYY-MM-DD [at] h:mmA"
            );
            return (
              <>
                {tab == "Coin" ? (
                  <HistoryCard
                    labels={{
                      title: item?.status,
                      lower: item?.description,
                      val: item?.coins,
                      sign: item?.status == "credit" ? "+" : "^",
                      time: createdAt,
                    }}
                    icon={
                      <Image
                        source={images.Trade}
                        style={{
                          height: hp(2.5),
                          width: hp(2.5),
                          tintColor: colors.cWhite,
                        }}
                      />
                    }
                    style={{ marginBottom: isEnd }}
                  />
                ) : (
                  <HistoryCard
                    labels={{
                      title: item?.type,
                      lower: item?.description,
                      val: item?.amount,
                      sign: item?.type == "credit" ? "+" : "^",
                      time: createdAt,
                    }}
                    icon={
                      <Image
                        source={images.Trade}
                        style={{
                          height: hp(2.5),
                          width: hp(2.5),
                          tintColor: colors.cWhite,
                        }}
                      />
                    }
                    style={{ marginBottom: isEnd }}
                  />
                )}
              </>
            );
          })}
        </ScrollView>
      ) : (
        <Empty />
      )}
    </View>
  );
};

export { MainTab };

const styles = StyleSheet.create({});
