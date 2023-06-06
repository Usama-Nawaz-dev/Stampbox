import { FlatList, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";

import { styles } from "./styles";
import { TicketCard } from "./TicketCard";
import ThemeContext from "../../../../Context/ThemeContext";
import supportEnv from "../../../../../support_apis/supportEnv";
import SupportAxios from "../../../../../support_apis/SupportAxios";

import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import allActions from "../../../../../redux/actions";

export const CheckTicket = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const [allTickets, setTickets] = useState([]);
  const currentUser = useSelector((state) => state.ApiReducer.user);

  useEffect(() => {
    (async () => {
      await getTickets();
    })();
  }, [focused]);

  const getTickets = async () => {
    const response = await SupportAxios.get(
      supportEnv.createUrl(`tickets?user_id=${currentUser?.id}`)
    );
    console.log("res", response);
    if (response?.status == 200) {
      const {
        data: {
          result: {
            paginated_items: { data },
          },
        },
      } = response;
      setTickets(data);
    } else {
      // console.log("call");
      const {
        e: {
          response: { status },
        },
      } = response;
      console.log("status", status);
      if (status == 401) {
        await dispatch(allActions.ApiAction.setSupportToken(currentUser));
      }
    }
  };

  const renderTickets = ({ item, index }) => {
    return (
      <TicketCard item={item} index={index % 2 == 0} navigation={navigation} />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      {allTickets?.length ? (
        <FlatList
          style={{ alignSelf: "center", width: "100%" }}
          data={allTickets}
          renderItem={renderTickets}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : null}
    </View>
  );
};
