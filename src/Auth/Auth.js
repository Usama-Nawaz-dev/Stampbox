import React, { useEffect } from 'react'
// import { createStackNavigator } from '@react-navigation/native-stack'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from './Login';
import Register from './Register';
import Forgot from './Forgot';
import Confirm from './Confirm';
import ChoosePlan from './ChoosePlan';
import Interest from './Interest';
import BillingDetails from './BillingDetails';
import Categories from './Categories';
import Follow from './Follow';
import Topics from './Topics';
import { PrivacyPolicy } from './PrivacyPolicy';
import { getFcmToken } from '../utils/notificationService';
import { useIsFocused } from '@react-navigation/native';
// const Stack = createStackNavigator();
const Stack = createNativeStackNavigator();

export default function AuthStack() {
  const focused = useIsFocused();
  useEffect(() => {
    if (focused) {
      getFcmToken();
    }
  }, [focused])
  return (
    <Stack.Navigator>
      <Stack.Screen name="login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="register" component={Register} options={{ headerShown: false }} />
      <Stack.Screen name="forgot" component={Forgot} options={{ headerShown: false }} />
      <Stack.Screen name="confirm" component={Confirm} options={{ headerShown: false }} />
      <Stack.Screen name="choosePlan" component={ChoosePlan} options={{ headerShown: false }} />
      <Stack.Screen name="category" component={Categories} options={{ headerShown: false }} />
      <Stack.Screen name="billing" component={BillingDetails} options={{ headerShown: false }} />
      <Stack.Screen name="interest" component={Interest} options={{ headerShown: false }} />
      <Stack.Screen name="topic" component={Topics} options={{ headerShown: false }} />
      <Stack.Screen name="follow" component={Follow} options={{ headerShown: false }} />
      <Stack.Screen name="privacy" component={PrivacyPolicy} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

