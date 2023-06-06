import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Flagging } from "../../Flags";
import { AddItem } from "../../DashBoard/AddItem";
import AddStamps from "../../MyStampBox/AddStamps";
import { EditStamps } from "../../DashBoard/EditStamp";
import { CreateTrade } from "../../Home/TopTabs/Trade";
import { CreateAuction } from "../../Home/TopTabs/Auctions";
import { StampboxMedia } from "../../DashBoard/StampboxMedia";
import { StampDetail } from "../../DashBoard/StampDetail/StampDetail";
import { FlagConversation } from "../../Flags/FlagConversation/FlagConversation";
import {
  MyItems,
  SelectStamps,
  AddToAlbum,
  BundleStamp,
} from "../../Home/TopTabs/MyAlbum";
import { PostComment } from "../../DrawerScreen/PostComments";

const ItemStack = createNativeStackNavigator();
export const ItemStackNavigator = () => {
  return (
    <ItemStack.Navigator>
      <ItemStack.Screen
        name="MyItems"
        component={MyItems}
        options={{ headerShown: false }}
      />
      <ItemStack.Screen
        name="SelectStamps"
        component={SelectStamps}
        options={{ headerShown: false }}
      />
      <ItemStack.Screen
        name="AddStamps"
        component={AddStamps}
        options={{ headerShown: false }}
      />
      <ItemStack.Screen
        name="StampboxMedia"
        component={StampboxMedia}
        options={{ headerShown: false }}
      />
      <ItemStack.Screen
        name="AddItem"
        component={AddItem}
        options={{ headerShown: false }}
      />
      <ItemStack.Screen
        name="EditStamps"
        component={EditStamps}
        options={{ headerShown: false }}
      />
      <ItemStack.Screen
        name="StampDetail"
        component={StampDetail}
        options={{ headerShown: false }}
      />
      <ItemStack.Screen
        name="FlagConversation"
        component={FlagConversation}
        options={{ headerShown: false }}
      />
      <ItemStack.Screen
        name="Flagging"
        component={Flagging}
        options={{ headerShown: false }}
      />
      <ItemStack.Screen
        name="CreateAuction"
        component={CreateAuction}
        options={{ headerShown: false }}
      />
      <ItemStack.Screen
        name="CreateTrade"
        component={CreateTrade}
        options={{ headerShown: false }}
      />
      <ItemStack.Screen
        name="AddToAlbum"
        component={AddToAlbum}
        options={{ headerShown: false }}
      />
      <ItemStack.Screen
        name="PostComment"
        component={PostComment}
        options={{ headerShown: false }}
      />
      <ItemStack.Screen
        name="BundleStamp"
        component={BundleStamp}
        options={{ headerShown: false }}
      />
    </ItemStack.Navigator>
  );
};
