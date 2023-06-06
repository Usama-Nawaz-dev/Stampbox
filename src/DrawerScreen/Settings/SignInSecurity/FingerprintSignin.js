import { StyleSheet, Switch, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { MainHeader } from "../../../../components";
import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";
import BorderBtn from "../../../../components/BorderBtn";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Helper from "../../../Helper";
import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";

export const FingerprintSignin = (props) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      let data = await Helper.getData("fingerPrintVAlidation");
      if (data == "true") {
        setIsEnabled(true);
      } else {
        setIsEnabled(false);
      }
    })();
  }, []);
  useEffect(() => {
    Helper.storeData("fingerPrintVAlidation", `${isEnabled}`);
  }, [isEnabled]);

  return (
    <View style={{ backgroundColor: theme?.white, flex: 1 }}>
      <MainHeader
        title={"Fingerprint Settings"}
        onPressBack={() => props.navigation.goBack()}
      />
      <View style={styles.section}>
        <AppText>Finger Print Access</AppText>
        <Switch
          trackColor={{ false: "#767577", true: `${colors.theme}50` }}
          thumbColor={isEnabled ? colors.theme : "#f4f3f4"}
          ios_backgroundColor="lightgrey"
          onValueChange={async () => {
            setIsEnabled(!isEnabled);
            // console.log("data-->", data);
          }}
          value={isEnabled}
        />
      </View>
      <View style={styles.section}>
        <AppText>Invite people fro Stampbox</AppText>
        <BorderBtn
          label={language?.Invite}
          width={wp(15)}
          height={30}
          color={colors.borderColor}
          fontColor={colors.lightText}
          fontSize={14}
          borderWidth={1}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  section: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});
