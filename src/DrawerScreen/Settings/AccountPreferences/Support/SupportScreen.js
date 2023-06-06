import { Pressable, ScrollView, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { InfoText } from "./InfoText";
import { helpDescription } from "./utils";
import { styles } from "./styles";
import ThemeContext from "../../../../Context/ThemeContext";
import { User } from "./User";
import colors from "../../../../../constant/colors";
import { Stat } from "./Stat";
import { StatCard } from "./StatCard";
import { Ask } from "./Ask";
import { Reply } from "./Reply";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { AnswerCard } from "./AnswerCard";
import { SimpleHeader } from "../../../../../components";

export const SupportScreen = (props) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <SimpleHeader
        title={"Support"}
        onPressBack={() => props.navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <User top={10} left={13} />
        <InfoText
          title={"How to list items in marketplace?"}
          body={helpDescription}
          fontSize={14}
          txtPadding={15}
        />
        <StatCard />
        <AnswerCard />
        <View style={{ marginBottom: hp(5) }} />
      </ScrollView>
    </View>
  );
};
