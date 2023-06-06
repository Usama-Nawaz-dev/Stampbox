import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import colors from "../../../../constant/colors";
import { MainHeader } from "../../../../components";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Btn from "../../../../components/Btn";
import AppText from "../../../../components/AppText";
import ThemeContext from "../../../Context/ThemeContext";
import Helper from "../../../Helper";
import { useDispatch } from "react-redux";
import allActions from "../../../../redux/actions";
// import { dark as theme } from "../../../../constant/colorsConfig";
const data = [
  { title: "Device mode", id: 0, value: "device" },
  { title: "Dark mode", id: 1, value: "dark" },
  { title: "Light mode", id: 2, value: "light" },
];
export const DisplayScreen = (props) => {
  const [option, setOption] = useState(0);
  const { theme, changeTheme } = useContext(ThemeContext);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getTheme() {
      let saved_theme = await Helper.getData("theme");
      if (saved_theme) {
        console.log("saved_theme", saved_theme);
        setOption(saved_theme);
      } else {
        setOption("device");
      }
    }
    getTheme();
  }, []);

  const OptionsData = (item) => {
    return (
      <View style={styles.optionStyle}>
        <AppText style={styles.textStyle}>{item?.title}</AppText>
        <TouchableOpacity
          style={[
            styles.radio,
            {
              borderColor:
                item?.value == option ? colors.theme : theme?.lightText,
            },
          ]}
          onPress={() => setOption(item.value)}
        >
          {item?.value == option ? <View style={styles.innerRedio} /> : null}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title="Display"
        onPressBack={() => props.navigation.goBack()}
      />
      <View style={styles.content}>
        <AppText style={styles.textStyle}>
          Chose how your StampBox experience looks for this device.
        </AppText>
        <View>{data.map((item) => OptionsData(item))}</View>
        <AppText style={[styles.textStyle, { marginTop: 30 }]}>
          If yo choose Device settings, this app will use the mode that's
          allready in the device's settings.
        </AppText>
        <Btn
          onPress={async () => {
            console.log("mode", option);
            dispatch(allActions.DataAction.AppLoader(true));
            await Helper.storeData("theme", option);
            changeTheme(option);
            setTimeout(() => {
              dispatch(allActions.DataAction.AppLoader(false));
            }, 500);
          }}
          label="Apply Theme"
          style={{ alignSelf: "center", marginTop: 25 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  content: {
    padding: 12,
  },
  textStyle: {
    fontSize: 16,
    // color: colors.lightBlack,
    marginTop: 10,
    marginBottom: 10,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 15,
    borderWidth: 1.5,
    // marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  innerRedio: {
    height: 12,
    width: 12,
    borderRadius: 10,
    backgroundColor: colors.theme,
  },
  optionStyle: {
    width: wp(85),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
