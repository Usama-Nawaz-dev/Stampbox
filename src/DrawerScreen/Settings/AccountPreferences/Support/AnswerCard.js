import { Text, View } from "react-native";
import React, { useContext } from "react";
import { styles } from "./styles";
import ThemeContext from "../../../../Context/ThemeContext";
import { User } from "./User";
import { helpDescription } from "./utils";
import { Reply } from "./Reply";
import { Ask } from "./Ask";
import { PostReply } from "./PostReply";
import Btn from "../../../../../components/Btn";
import { Answer } from "./Answer";

export const AnswerCard = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <View
      style={[
        styles.shadow,
        {
          //   height: 200,
          width: "92%",
          borderRadius: 10,
          marginTop: 15,
          backgroundColor: "#fff",
          alignSelf: "center",
          //   padding: 10,
        },
      ]}
    >
      <Answer show />

      <View style={{ height: 10, backgroundColor: theme.cardColor }} />
      <Answer prev />
      <Answer prev last />
    </View>
  );
};

{
  /* <PostReply />
<Btn
  style={{ alignSelf: "center", height: 40, marginTop: 10 }}
  fontSize={14}
  label="Post Reply"
/>
<Text style={{ textAlign: "center", marginTop: 10, fontSize: 16 }}>
  Cancel
</Text> */
}
