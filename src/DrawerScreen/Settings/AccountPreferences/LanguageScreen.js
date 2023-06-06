import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { styles } from "./styles";
import { MainHeader } from "../../../../components";
import AppText from "../../../../components/AppText";
import CustomDropDown from "../../../../components/CustomDropDown";
import colors from "../../../../constant/colors";
import AuthContext from "../../../Context/AuthContext";
import Helper from "../../../Helper";
import { popTotop } from "../../../../constant/navigationMethods";
import { useDispatch } from "react-redux";
import allActions from "../../../../redux/actions";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import ThemeContext from "../../../Context/ThemeContext";
// import { dark as theme } from "../../../../constant/colorsConfig";

const langs = [
  { value: "English" },
  { value: "Spanish" },
  { value: "French" },
  { value: "Russian" },
  { value: "Chinese" },
  { value: "Hindi" },
];

const LanguageScreen = (props) => {
  const [language, setLang] = useState(null);
  const { changeLanguage, myState } = useContext(AuthContext);
  const { theme }= useContext(ThemeContext);
  console.log("state", myState);
  const dispatch = useDispatch();
  useEffect(() => {
    async function getLanguage() {
      let lang = await Helper.getData("language");
      if (lang) {
        console.log("lang", lang);
        setLang(lang);
      }
    }
    getLanguage();
  }, []);
  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <MainHeader
        title="Language"
        onPressBack={() => props.navigation.goBack()}
      />
      <AppText style={{ textAlign: "center", marginTop: 20, marginBottom: 10 }}>
        If you’ve accidentally changed the language to one you don’t understand,
        update the language from list mentioned below.
      </AppText>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "90%",
          alignSelf: "center",
        }}
      >
        <CustomDropDown
          width="60%"
          height={hp(25)}
          left={10}
          data={langs}
          label={language ? "Language" : "Select Language"}
          value={language}
          onChangeText={(value) => {
            console.log("value", value);
            setLang(value);
          }}
          style={{ width: "80%" }}
        />
        <TouchableOpacity
          onPress={async () => {
            // Helper.showToastMessage("Coming Soon", "#000");
            if (language) {
              dispatch(allActions.DataAction.AppLoader(true));
              await Helper.storeData("language", language);
              changeLanguage(language);
              dispatch(allActions.DataAction.AppLoader(false));
              props.navigation.reset({
                index: 1,
                routes: [{ name: "Home" }],
              });
            }
          }}
        >
          <AppText style={{ color: theme?.theme, fontWeight: "500", top: 4 }}>
            Change
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export { LanguageScreen };
