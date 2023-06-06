import React, { useContext, useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { styles } from "./styles";
import { InfoText } from "./InfoText";
import { TopicBtn } from "./TopicBtn";
import colors from "../../../../../constant/colors";
import { helpDescription, helpingTopics } from "./utils";
import ThemeContext from "../../../../Context/ThemeContext";

import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import allActions from "../../../../../redux/actions";
import supportEnv from "../../../../../support_apis/supportEnv";
import SupportAxios from "../../../../../support_apis/SupportAxios";

export const Community = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const [topic_list, setTopics] = useState(null);

  useEffect(() => {
    if (focused) {
      getTopics();
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
      <TopicBtn
        item={item}
        onPress={() =>
          navigation.navigate("SupportArticle", {
            topic: item,
            community: true,
          })
        }
      />
    );
  };

  const Title = ({ title }) => {
    return (
      <Text
        style={[
          styles.heading,
          { color: theme.darkGrey, margin: wp(2), textAlign: "left" },
        ]}
      >
        {title}
      </Text>
    );
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <Title title={"Topics"} />
      <View>
        <FlatList
          numColumns={3}
          data={topic_list}
          renderItem={renderTopics}
          style={{ alignSelf: "center" }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      {/* <Title title={"Questions"} />
      <Pressable
        onPress={() => navigation.navigate("SupportScreen")}
        style={[
          styles.shadow,
          {
            width: "92%",
            borderRadius: 10,
            backgroundColor: theme.cardColor,
            alignSelf: "center",
            padding: wp(2),
          },
        ]}
      >
        <InfoText
          title={"How to list items in marketplace?"}
          body={helpDescription}
          extraInfo
        />
      </Pressable> */}
    </View>
  );
};
