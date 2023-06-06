import React, { useContext } from 'react'
import { View } from 'react-native'

import { styles } from './styles'
import colors from '../../../../constant/colors'

import { SimpleHeader } from '../../../../components'
import { OutgoingTab } from './OutgoingTab'
import { IncomingTab } from './IncomingTab'

import { createMaterialTopTabNavigator } from '../../../../CustomPackages/material-top-tabs'
import ThemeContext from '../../../Context/ThemeContext'
const Tab = createMaterialTopTabNavigator();

export const TradeOrders = (props) => {

    const { theme }= useContext(ThemeContext);

    return (
        <View style={styles.container}>
            <SimpleHeader
                title="Trade Order"
                onPressBack={() => props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                })}
            />
            <Tab.Navigator
                initialRouteName="inComing"
                tabBarOptions={{
                    activeTintColor: theme?.theme,
                    inactiveTintColor: theme?.lightText,
                    labelStyle: styles.labelStyle,
                }}
                screenOptions={{ //use this config
                    tabBarIndicatorStyle: { backgroundColor: theme?.theme },
                    tabBarStyle:{ backgroundColor: theme?.white}
                }}
            >
                <Tab.Screen
                    name="outGoing"
                    component={OutgoingTab}
                    options={{ tabBarLabel: 'Outgoing Orders' }}
                />
                <Tab.Screen
                    name="inComing"
                    component={IncomingTab}
                    options={{ tabBarLabel: 'Incoming Orders' }}
                />
            </Tab.Navigator>
        </View>
    )
}
