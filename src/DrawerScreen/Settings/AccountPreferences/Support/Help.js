import React, { useContext, useEffect, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";

import { styles } from "./styles";
import { helpingTopics } from "./utils";
import Btn from "../../../../../components/Btn";
import AppText from "../../../../../components/AppText";
import ThemeContext from "../../../../Context/ThemeContext";

import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { TopicCard } from "./TopicCard";
import Helper from "../../../../Helper";
import allActions from "../../../../../redux/actions";
import supportEnv from "../../../../../support_apis/supportEnv";
import SupportAxios from "../../../../../support_apis/SupportAxios";

export const Help = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const [help_topics, setTopics] = useState(null);
  const supportToken = useSelector((state) => state.ApiReducer.support_token);
  const currentUser = useSelector((state) => state.ApiReducer.user);

  useEffect(() => {
    if (focused) {
      (async () => {
        await getTopics();
        // const spToken = await Helper.getData("supportToken");
        // if (!spToken && currentUser) {
        //   await dispatch(allActions.ApiAction.setSupportToken(currentUser));
        // } else {
        //   await getTopics();
        // }
      })();
    }
  }, [focused]);

  const getTopics = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await SupportAxios.get(
      supportEnv.createUrl("topics?type=Features&is_publish=1")
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      setTopics(_data);
    }
  };

  const renderTopics = ({ item, index }) => {
    return (
      <Btn
        width={wp(45)}
        height={hp(4)}
        bg={"#f2f2f2"}
        label={Helper.capitalizeFirstLetter(item?.name)}
        textColor={"#585755"}
        fontWeight="normal"
        fontSize={14}
        style={{
          marginRight: wp(3),
          marginBottom: wp(3),
        }}
        onPress={() => navigation.navigate("SupportArticle", { topic: item })}
      />
    );
  };

  const renderNewTopics = ({ item, index }) => {
    return <TopicCard item={item} />;
  };
  const Title = ({ title }) => {
    return (
      <AppText
        style={[
          styles.heading,
          { color: theme.darkGrey, margin: wp(3), textAlign: "left" },
        ]}
      >
        {title}
      </AppText>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Title title={"Helping Topics"} />
        {help_topics ? (
          <FlatList
            numColumns={2}
            data={help_topics}
            renderItem={renderTopics}
            style={{ paddingHorizontal: wp(3) }}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : null}

        <Title title={"Whats new in StampBox"} />
        <FlatList
          inverted
          numColumns={2}
          data={help_topics}
          renderItem={renderNewTopics}
          style={{ alignSelf: "center" }}
          keyExtractor={(item, index) => index.toString()}
        />

        <View style={{ marginBottom: hp(2) }} />
      </ScrollView>
    </View>
  );
};
