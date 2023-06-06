import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  AccountPreferences,
  ActivityLogScreen,
  ChangePrimaryEmail,
  DataPrivacy,
  DisplayScreen,
  EmailAdresses,
  FingerprintSignin,
  LanguageScreen,
  Notifications,
  NotificationsSource,
  OnStampbox,
  PrivacyPolicy,
  ProfileViewOptionScreen,
  Settings,
  SignInSecurity,
  TermsConditionScreen,
  UnfollowedUsers,
  Visibility,
  CustomerSupport,
  PurchaseHistory,
  HibernateAccount,
} from "../../DrawerScreen/Settings";
import {
  BuyPlan,
  ChangePassword,
  EditProfile,
  PlanDetailScreen,
} from "../../Profile";
import ChoosePlan from "../../Auth/ChoosePlan";
import { CreditCards } from "../../Profile/CreditCards";
import SupportStack from "../../DrawerScreen/Settings/AccountPreferences/SupportStack";

const SettingStack = createNativeStackNavigator();

export const SettingStackNavigator = () => {
  return (
    <SettingStack.Navigator>
      <SettingStack.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="AccPref"
        component={AccountPreferences}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="language"
        component={LanguageScreen}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="Display"
        component={DisplayScreen}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="ProfileOption"
        component={ProfileViewOptionScreen}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="Unfollowed"
        component={UnfollowedUsers}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="CreditCards"
        component={CreditCards}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="BuyPlan"
        component={BuyPlan}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="ActivityLogs"
        component={ActivityLogScreen}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="ChoosePlan"
        component={ChoosePlan}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="PlanDetail"
        component={PlanDetailScreen}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="Terms"
        component={TermsConditionScreen}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="SignInSecurity"
        component={SignInSecurity}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="EmailAdress"
        component={EmailAdresses}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="Fingerprint"
        component={FingerprintSignin}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="Visibility"
        component={Visibility}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="Notifications"
        component={Notifications}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="NotifiSource"
        component={NotificationsSource}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="OnStampbox"
        component={OnStampbox}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="DataPrivacy"
        component={DataPrivacy}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="ChangeEmail"
        component={ChangePrimaryEmail}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="CustomerSupport"
        component={SupportStack}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="PurchaseHistory"
        component={PurchaseHistory}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="HibernateAccount"
        component={HibernateAccount}
        options={{ headerShown: false }}
      />
    </SettingStack.Navigator>
  );
};
