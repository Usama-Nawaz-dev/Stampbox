import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Flagging } from '../../Flags';
import ChoosePlan from '../../Auth/ChoosePlan';
import { CreateTrade } from '../../Home/TopTabs/Trade';
import { AddToAlbum } from '../../Home/TopTabs/MyAlbum';
import { Catalogue } from '../../DrawerScreen/Catalogues';
import { CreateAuction } from '../../Home/TopTabs/Auctions';
import { PostComment } from '../../DrawerScreen/PostComments';
import { StampDetail } from '../../DashBoard/StampDetail/StampDetail';
import { FlagConversation } from '../../Flags/FlagConversation/FlagConversation';

const CatalogueStack = createNativeStackNavigator();

export const CatalogueStackNavigator = () => {
    return (
        <CatalogueStack.Navigator>
            <CatalogueStack.Screen
                name="Catalogue"
                component={Catalogue}
                options={{ headerShown: false }}
            />
            <CatalogueStack.Screen
                name="StampDetail"
                component={StampDetail}
                options={{ headerShown: false }}
            />
            <CatalogueStack.Screen
                name="FlagConversation"
                component={FlagConversation}
                options={{ headerShown: false }}
            />
            <CatalogueStack.Screen
                name="Flagging"
                component={Flagging}
                options={{ headerShown: false }}
            />
            <CatalogueStack.Screen
                name="CreateAuction"
                component={CreateAuction}
                options={{ headerShown: false }}
            />
            <CatalogueStack.Screen
                name="CreateTrade"
                component={CreateTrade}
                options={{ headerShown: false }}
            />
            <CatalogueStack.Screen
                name="AddToAlbum"
                component={AddToAlbum}
                options={{ headerShown: false }}
            />
            <CatalogueStack.Screen
                name="PostComment"
                component={PostComment}
                options={{ headerShown: false }}
            />
            <CatalogueStack.Screen
                name="Subscriptions"
                component={ChoosePlan}
                options={{ headerShown: false }}
            />
        </CatalogueStack.Navigator>
    );
};