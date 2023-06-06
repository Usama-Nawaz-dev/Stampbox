import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AddItem } from "../../DashBoard/AddItem/AddItem";
import { PostComment } from "../../DrawerScreen/PostComments";
import { StampboxMedia } from "../../DashBoard/StampboxMedia";

import { AllForums, CreateForum, ForumDetail } from "../../DrawerScreen/Forums";

const ForumStack = createNativeStackNavigator();

export const ForumStackNavigator = () => {
  return (
    <ForumStack.Navigator>
      <ForumStack.Screen
        name="AllForums"
        component={AllForums}
        options={{ headerShown: false }}
      />
      <ForumStack.Screen
        name="CreateForum"
        component={CreateForum}
        options={{ headerShown: false }}
      />
      <ForumStack.Screen
        name="ForumDetail"
        component={ForumDetail}
        options={{ headerShown: false }}
      />
      <ForumStack.Screen
        name="PostComment"
        component={PostComment}
        options={{ headerShown: false }}
      />
      <ForumStack.Screen
        name="AddItem"
        component={AddItem}
        options={{ headerShown: false }}
      />
      <ForumStack.Screen
        name="StampboxMedia"
        component={StampboxMedia}
        options={{ headerShown: false }}
      />
    </ForumStack.Navigator>
  );
};
