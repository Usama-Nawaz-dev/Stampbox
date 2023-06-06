import React, { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";
import { useSelector } from "react-redux";
import database from "@react-native-firebase/database";

export const OnlineState = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const handleAppStateChange = useCallback(
    async (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        console.log("App has come to the foreground!");
        if (currentUser?.id) {
          let id = currentUser?.id;
          await database()
            .ref(`/Userstatus/${id}`)
            .set({ onlineStatus: "online" });
        }
      } else if (
        appState === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        console.log("App has gone to the background!");
        if (currentUser?.id) {
          let id = currentUser?.id;
          let now = Date.now();
          await database().ref(`/Userstatus/${id}`).set({ onlineStatus: now });
        }
      }
      setAppState(nextAppState);
    },
    [appState]
  );
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, [appState]);

  return null;
};
