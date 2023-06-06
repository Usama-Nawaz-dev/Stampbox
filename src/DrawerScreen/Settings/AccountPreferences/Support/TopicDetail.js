import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import React, { useContext } from "react";
import { styles } from "./styles";
import colors from "../../../../../constant/colors";
import { guide, helpDescription, helpingTopics } from "./utils";
import Fonts from "../../../../../assets/fonts/Fonts";
import ThemeContext from "../../../../Context/ThemeContext";
import Btn from "../../../../../components/Btn";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { InfoText } from "./InfoText";
import { ThemeDescription } from "./ThemeDescription";
import { images } from "../../../../../assets/images/Images";
import FastImage from "react-native-fast-image";
import { TopicBtn } from "./TopicBtn";
import { TopicCard } from "./TopicCard";
import { SimpleHeader } from "../../../../../components";
import { SimpleBtn } from "./SimpleBtn";
import { SummaryCard } from "./SummaryCard";

export const TopicDetail = (props) => {
  const { theme } = useContext(ThemeContext);

  const Title = ({ title }) => {
    return (
      <Text
        style={[
          styles.heading,
          { color: theme.darkGrey, margin: 10, textAlign: "left" },
        ]}
      >
        {title}
      </Text>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <SimpleHeader
        title={"Helping Topic Details"}
        onPressBack={() => props.navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ width: "97%", alignSelf: "center" }}
      >
        <InfoText
          fontSize={16}
          title={"Place topic title here..."}
          body={helpDescription}
        />
        <View style={{ marginBottom: hp(10) }} />
      </ScrollView>
    </View>
  );
};
