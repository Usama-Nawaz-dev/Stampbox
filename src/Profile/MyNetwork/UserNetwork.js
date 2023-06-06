import React, { useContext } from 'react'
import { View } from 'react-native'

import { styles } from './styles';
import { SimpleHeader } from '../../../components';
import colors from '../../../constant/colors';

import { createMaterialTopTabNavigator } from '../../../CustomPackages/material-top-tabs';
const Tab = createMaterialTopTabNavigator();

import { FollowerTab } from './FollowerTab';
import { FollowingTab } from './FollowingTab';
import AuthContext from '../../Context/AuthContext';
import ThemeContext from '../../Context/ThemeContext';

export const UserNetwork = (props) => {
    const { initialRoute } = props.route.params;
    const{ myState:{ language }}= useContext(AuthContext);
    const { theme }= useContext(ThemeContext);
    return (
        <View style={styles.container}>
            <SimpleHeader
                rightIcon={false}
                title="User Networks"
                onPressAdd={() => props.navigation.navigate("FindUser")}
                onPressBack={() => props.navigation.goBack()} />
            <Tab.Navigator
                initialRouteName={initialRoute ? initialRoute : "Follwers"}
                tabBarOptions={{
                    activeTintColor: theme.theme,
                    inactiveTintColor: theme.lightText,
                    labelStyle: styles.labelStyle,
                }}
                screenOptions={{ //use this config
                    tabBarIndicatorStyle: { backgroundColor: theme.theme },
                    tabBarStyle: { backgroundColor: theme?.white}
                }}
            >
                <Tab.Screen
                    name="Follwers"
                    component={FollowerTab}
                    options={{ tabBarLabel: 'Followers' }}
                />
                <Tab.Screen
                    name="Following"
                    component={FollowingTab}
                    options={{ tabBarLabel: language?.following }}
                />
            </Tab.Navigator>
        </View>
    )
}
