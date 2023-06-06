import React, { useContext } from 'react'
import { View } from 'react-native'

import { styles } from './styles';
import colors from '../../../constant/colors';

import { createMaterialTopTabNavigator } from '../../../CustomPackages/material-top-tabs';
const Tab = createMaterialTopTabNavigator();

import { FollowerTab } from './FollowerTab';
import { FollowingTab } from './FollowingTab';
import { RecievedTab } from './ReceivedTab';
import { SendTab } from './SendTab';
import AuthContext from '../../Context/AuthContext';
import ThemeContext from '../../Context/ThemeContext';
// import { dark as theme } from '../../../constant/colorsConfig';


export const RequestTab = (props) => {
    const{myState:{language}}=useContext(AuthContext); 
    const { theme }= useContext(ThemeContext);
    return (
        <View style={styles.container}>
            <Tab.Navigator
                initialRouteName="Follwers"
                tabBarOptions={{
                    activeTintColor: theme?.theme,
                    inactiveTintColor: theme?.lightText,
                    labelStyle: styles.labelStyle,
                }}
                screenOptions={{ //use this config
                    tabBarIndicatorStyle: { backgroundColor: theme?.theme },
                    tabBarStyle: {
                        backgroundColor: theme?.white
                    }
                }}
            >
                <Tab.Screen
                    name="Follwers"
                    component={SendTab}
                    options={{ tabBarLabel: language?.sent }}
                />
                <Tab.Screen
                    name="Following"
                    component={RecievedTab}
                    options={{ tabBarLabel: language?.received }}
                />
            </Tab.Navigator>
        </View>
    )
}
