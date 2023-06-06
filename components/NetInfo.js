import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import colors from "../constant/colors";
import { heightPercentageToDP } from "react-native-responsive-screen";

function Netinfo(props) {
  const netInfo = useNetInfo();
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    if (netInfo.type !== "unknown" && netInfo.isInternetReachable === false) {
      setIsConnected(true);
    }
  }, [netInfo.isInternetReachable]);

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable);
    //   setOfflineStatus(offline);
      setIsConnected(offline);
    });

    return () => removeNetInfoSubscription();
  }, []);

  if (isConnected)
    return (
      <View
        style={[styles.container, { backgroundColor: "rgba(252,92,101,1)" }]}
      >
        <Text style={styles.text}>No Internet!</Text>
      </View>
    );

  return (
    // <View style={[styles.container,{backgroundColor:  colors.green}]}>
    //     <Text style={styles.text}>Internet Connected!</Text>
    // </View>
    null
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: 50,
    marginTop: heightPercentageToDP(5),
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    zIndex: 1,
  },
  text: {
    color: colors.white,
    fontFamily: "Inter-Regular",
    fontWeight: "500",
    letterSpacing: 3,
  },
});

export default Netinfo;
