import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { useDispatch } from "react-redux";
import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import AppText from "../../../../../components/AppText";
import allActions from "../../../../../redux/actions";
import PlacementCard from "./PlacementCard";
import {
  DetailCard,
  MainHeader,
  FeedbackCard,
} from "../../../../../components";
import ThemeContext from "../../../../Context/ThemeContext";

export function OrderDetail(props) {
  const {
    navigation,
    route: {
      params: {
        item: { trade_id },
      },
    },
  } = props;

  const dispatch = useDispatch();
  const [details, setDetails] = useState(null);
  const { theme }= useContext(ThemeContext);
  // console.log("params", trade_id)

  useEffect(() => {
    (async () => {
      dispatch(allActions.DataAction.AppLoader(true));
      const response = await MindAxios.get(
        Env.createUrl(`trades/${trade_id}/order`)
      );
      dispatch(allActions.DataAction.AppLoader(false));
      // console.log(response);
      const { status, data } = response;
      if (status == 200) {
        let _data = data?.result?.item;
        setDetails(_data);
        // console.log("req", _data);
      } else {
        alert("SomeThing went wrong!");
      }
    })();
  }, [trade_id]);

  const orderDevlivered = details?.trade_orders[0]?.status === "Delivered";
  const feedbackSent = details?.trade_orders[0]?.transaction?.is_rated === 0;
  const candSendFeedback = orderDevlivered === feedbackSent;

  return (
    <View style={{ flex: 1, backgroundColor: theme?.white }}>
      <MainHeader
        title="Order Detail"
        onPressBack={() => {
          navigation.goBack();
          // resetValues();
        }}
      />
      {details && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <FeedbackCard
            title="Trade"
            id={details?.id}
            showBtn={candSendFeedback}
            time={details?.created_at}
            onPress={() => {
              console.log(details)
              dispatch(
                allActions.DetailAction.OrderDetail(
                  details?.trade_orders?.length > 1
                    ? details?.trade_orders[1]
                    : details?.trade_orders[0]
                )
              );
              props.navigation.navigate("Feedback", { type: "trade" });
            }}
          />
          <DetailCard details={details} />
          <View
            style={{
              width: "100%",
            }}
          >
            <AppText
              style={{
                fontSize: 20,
                color: theme?.black,
                fontWeight: "bold",
                marginLeft: 20,
                marginTop: 10,
              }}
            >
              Trade Orders
            </AppText>
          </View>
          {details?.trade_orders.map((item, index) => {
            let atEnd = index === details?.trade_orders.length - 1;
            // console.log(atEnd);
            return (
              <PlacementCard
                key={index.toString()}
                details={item}
                atEnd={atEnd}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
