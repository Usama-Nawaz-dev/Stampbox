import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  EvalStamps,
  Evaluation,
  EvaluateStamp,
} from "../../DrawerScreen/StampEvaluation";

import { Flagging } from "../../Flags";
import AddStamps from "../../MyStampBox/AddStamps";
import { CreateTrade } from "../../Home/TopTabs/Trade";
import { AddToAlbum } from "../../Home/TopTabs/MyAlbum";
import { CreateAuction } from "../../Home/TopTabs/Auctions";
import { StampboxMedia } from "../../DashBoard/StampboxMedia";
import { PostComment } from "../../DrawerScreen/PostComments";
import { StampDetail } from "../../DashBoard/StampDetail/StampDetail";
import { FlagConversation } from "../../Flags/FlagConversation/FlagConversation";

const ExpertStack = createNativeStackNavigator();

export const ExpertStackNavigator = () => {
  return (
    <ExpertStack.Navigator>
      <ExpertStack.Screen
        name="Evaluation"
        component={Evaluation}
        options={{ headerShown: false }}
      />
      <ExpertStack.Screen
        name="EvalStamps"
        component={EvalStamps}
        options={{ headerShown: false }}
      />
      <ExpertStack.Screen
        name="EvaluateStamp"
        component={EvaluateStamp}
        options={{ headerShown: false }}
      />
      <ExpertStack.Screen
        name="AddStamps"
        component={AddStamps}
        options={{ headerShown: false }}
      />
      <ExpertStack.Screen
        name="StampboxMedia"
        component={StampboxMedia}
        options={{ headerShown: false }}
      />
      <ExpertStack.Screen
        name="StampDetail"
        component={StampDetail}
        options={{ headerShown: false }}
      />
      <ExpertStack.Screen
        name="FlagConversation"
        component={FlagConversation}
        options={{ headerShown: false }}
      />
      <ExpertStack.Screen
        name="Flagging"
        component={Flagging}
        options={{ headerShown: false }}
      />
      <ExpertStack.Screen
        name="CreateAuction"
        component={CreateAuction}
        options={{ headerShown: false }}
      />
      <ExpertStack.Screen
        name="CreateTrade"
        component={CreateTrade}
        options={{ headerShown: false }}
      />
      <ExpertStack.Screen
        name="AddToAlbum"
        component={AddToAlbum}
        options={{ headerShown: false }}
      />
      <ExpertStack.Screen
        name="PostComment"
        component={PostComment}
        options={{ headerShown: false }}
      />
    </ExpertStack.Navigator>
  );
};
