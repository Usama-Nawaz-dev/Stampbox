import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import colors from '../../../../../constant/colors';
import Fonts from '../../../../../assets/fonts/Fonts';

import { useSelector } from 'react-redux';
import { MemberTab, PendingTab, RejectedTab, BlockTab } from '../MemberTabs';
import { createMaterialTopTabNavigator } from '../../../../../CustomPackages/material-top-tabs';
import AuthContext from '../../../../Context/AuthContext';
import ThemeContext from '../../../../Context/ThemeContext';

const Tab = createMaterialTopTabNavigator();
export const ClubMemberSheet = () => {
    const currentUser = useSelector((state) => state.ApiReducer.user);
    const clubDetail = useSelector((state) =>
        state.DetailReducer.clubDetail);
    const owner = currentUser?.id === clubDetail?.user_id;
    const { myState: {language}}= useContext(AuthContext);
    const { theme }= useContext(ThemeContext);
    // console.log(clubDetail)
    return (
        <View style={{ flex: 1, }}>
            {clubDetail?.is_current_user_admin ? <Tab.Navigator
                initialRouteName={"Members"}
                tabBarOptions={{
                    activeTintColor: colors.theme,
                    inactiveTintColor: colors.lightText,
                    labelStyle: styles.labelStyle,
                }}
                screenOptions={{ //use this config
                    tabBarIndicatorStyle: { backgroundColor: colors.theme },
                }}
            >
                <Tab.Screen
                    name="Members"
                    component={MemberTab}
                    options={{ tabBarLabel: language?.Members }}
                />
                <Tab.Screen
                    name="Pending"
                    component={PendingTab}
                    options={{ tabBarLabel: language?.PENDING }}
                />
                {/* <Tab.Screen
                    name="Rejected"
                    component={RejectedTab}
                    options={{ tabBarLabel: language?.Rejected }}
                /> */}
                <Tab.Screen
                    name="Blocked"
                    component={BlockTab}
                    options={{ tabBarLabel: language?.Blocked }}
                />
            </Tab.Navigator> :
                <MemberTab />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        backgroundColor: colors.cWhite
    },
    labelStyle: {
        fontSize: 14,
        textAlign: "center",
        paddingHorizontal: 5,
        textTransform: "none",
        fontFamily: 'Roboto-Regular',
    },
})