import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";

import { styles } from "./styles";
import { FaqList } from "./FaqList";
import { helpDescription } from "./utils";

import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import { ThemeDescription } from "./ThemeDescription";
import ThemeContext from "../../../../Context/ThemeContext";

import allActions from "../../../../../redux/actions";
import supportEnv from "../../../../../support_apis/supportEnv";
import SupportAxios from "../../../../../support_apis/SupportAxios";

export const Faq = (props) => {
  const { theme } = useContext(ThemeContext);
  const focused = useIsFocused();
  const dispatch = useDispatch();

  const [faqList, setFaqList] = useState(null);

  useEffect(() => {
    if (focused) {
      fetchFaqList();
    }
  }, [focused]);

  const fetchFaqList = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await SupportAxios.get(
      supportEnv.createUrl("questions?topic_name=₡oins and Rewards")
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      setFaqList(_data);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <ThemeDescription
        title={"Frequently Asked Questions"}
        body={helpDescription}
      />
      <FaqList faqList={faqList} navigation={props.navigation} />
    </View>
  );
};
