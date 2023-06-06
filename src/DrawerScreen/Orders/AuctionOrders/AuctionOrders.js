import React, { useContext } from 'react'
import { View } from 'react-native'

import { styles } from './styles'
import colors from '../../../../constant/colors'

import { SimpleHeader } from '../../../../components'
import { PlacedTab } from './PlacedTab'
import { RecievedTab } from './RecievedTab'

import { createMaterialTopTabNavigator } from '../../../../CustomPackages/material-top-tabs'
import AuthContext from '../../../Context/AuthContext'
import ThemeContext from '../../../Context/ThemeContext'
// import { dark as theme } from '../../../../constant/colorsConfig'


const Tab = createMaterialTopTabNavigator();

export const AuctionOrders = (props) => {
    const { myState: { language } } = useContext(AuthContext);
    const { theme }= useContext(ThemeContext);
    return (
        <View style={styles.container}>
            <SimpleHeader
                title="Auction Order"
                onPressBack={() => props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                })}
            />
            <Tab.Navigator
                initialRouteName="Placed"
                tabBarOptions={{
                    activeTintColor: theme.theme,
                    inactiveTintColor: theme.lightText,
                    labelStyle: styles.labelStyle,
                }}
                screenOptions={{ //use this config
                    tabBarIndicatorStyle: { backgroundColor: theme.theme },
                    tabBarStyle:{ backgroundColor: theme?.white}
                }}
            >
                <Tab.Screen
                    name="Placed"
                    component={PlacedTab}
                    options={{ tabBarLabel: 'Placed' }}
                />
                <Tab.Screen
                    name="Received"
                    component={RecievedTab}
                    options={{ tabBarLabel: language?.received }}
                />
            </Tab.Navigator>
        </View>
    )
}
