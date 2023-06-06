import React, { useState, useEffect } from "react";
import { LogBox } from "react-native";
import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import { Provider as StoreProvider } from "react-redux";
import { StripeProvider } from "@stripe/stripe-react-native";
import store from "./redux/store";
import OnBoarding from "./src/OnBoarding";
import RootStack from "./src/Navigation/RootNavigation";
import { RootSiblingParent } from "react-native-root-siblings";
import MyStatusBar from "./components/MyStatusBar";
import Helper from "./src/Helper";
import { NotificationComp } from "./src/utils/NotificationComp";
import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";

LogBox.ignoreAllLogs(true);
const stripeTestingKey =
  "pk_test_51K1iKMKaXNqc493ZvccBIqKsFD5aeyD32C68FQhm5hhX3DBOcWzAjauDk2t13bLUjQ1cahyJgeC2G9OILJKlECs200IU9NDQC2";
const navigationRef = createNavigationContainerRef();
const App = () => {
  const [showBoarding, setShowBoarding] = useState(false);
  const [title, setTitle] = useState(null);
  const [body, setBody] = useState(null);
  const [show, setShow] = useState(false);

  const checkFirstStart = async () => {
    let boardingCheck = await Helper.getData("skipBoarding");
    // console.log("Boarding Checks", boardingCheck);
    if (!boardingCheck) {
      setShowBoarding(true);
    }
  };

  useEffect(() => {
    // SplashScreen.hide();
    checkFirstStart();
    (async () => {
      // await requestUserPermission();
      // notificationListener();
      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        console.log("Recieved in foreground:", remoteMessage);
        PushNotification.localNotification({
          message: remoteMessage?.notification?.body,
          title: remoteMessage?.notification?.title,
        });
      });
      return unsubscribe;
    })();
  }, []);

  const onDone = async (index) => {
    // console.log("On Done index is here");
    setShowBoarding(!showBoarding);
    await Helper.storeData("skipBoarding", "false");
  };
  return (
    <RootSiblingParent>
      <NotificationComp
        title={title}
        body={body}
        show={show}
        onPress={() => setShow(false)}
      />
      <StoreProvider store={store}>
        <StripeProvider
          publishableKey={stripeTestingKey}
          merchantIdentifier="Your_merchant_id_goes_here"
        >
          {showBoarding ? (
            <OnBoarding done={onDone} />
          ) : (
            <NavigationContainer ref={navigationRef}>
              <MyStatusBar backgroundColor="#2B3135" barStyle="light-content" />
              <RootStack />
            </NavigationContainer>
          )}
        </StripeProvider>
      </StoreProvider>
    </RootSiblingParent>
  );
};

export { App, navigationRef };
