import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CustomerSupport } from "./CustomerSupport";
import { TicketDetail } from "./Support/TicketDetail";
import { TopicDetail } from "./Support/TopicDetail";
import { SupportScreen } from "./Support/SupportScreen";
import { SupportArticle } from "./Support/SupportArticle";
import { QuestionReview } from "./Support/QuestionReview";
import { QuestionReply } from "./Support/QuestionReply";

const Stack = createNativeStackNavigator();

const SupportStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Support"
        component={CustomerSupport}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TicketDetail"
        component={TicketDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TopicDetail"
        component={TopicDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupportScreen"
        component={SupportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupportArticle"
        component={SupportArticle}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuestionReview"
        component={QuestionReview}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuestionReply"
        component={QuestionReply}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
export default SupportStack;
