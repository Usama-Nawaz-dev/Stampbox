import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import colors from "../constant/colors";
import Helper from "../src/Helper";
import ThemeContext from "../src/Context/ThemeContext";

const PickModal = ({ setModalVisible, modalData, onPress, placeholder }) => {
  const [searchedData, setSearchedData] = useState(modalData);
  const [focused, setFocused] = useState(false);
  const { theme }= useContext(ThemeContext);

  const search = (x) => {
    let check = Helper.charIsLetter(x);
    // console.log(check);
    if (check) {
      let text = x.toLowerCase();

      let filtered = modalData.filter((item) => {
        return item.value.toLowerCase().match(text);
      });
      //   console.log("searchLang--->>", filteredLang);
      setSearchedData(filtered);
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          height: hp(60),
          width: wp(90),
          backgroundColor: theme?.cardColor,
          borderRadius: 2,
          //   marginBottom: 5
        }}
      >
        <View
          style={{
            height: 60,
            width: "90%",
            alignItems: "center",
            alignSelf: "center",
            flexDirection: "row",
            borderBottomColor: "grey",
            borderBottomWidth: 1,
          }}
        >
          <Ionicons
            name={focused ? "search" : "ios-search-outline"}
            size={24}
            color={focused ? theme?.black : colors.medium}
          />
          <TextInput
            style={styles.textinput}
            onFocus={() => setFocused(true)}
            placeholder= {placeholder ? placeholder : "Search Language"}
            placeholderTextColor={ focused ? theme?.lightText :colors.medium }
            autoCapitalize="none"
            color={theme?.black}
            onChangeText={search}
            onEndEditing={(event) => search(event.nativeEvent.text)}
          />
        </View>
        <KeyboardAwareScrollView>
          {searchedData.map((item, index) => {
            // console.log('item', item);
            // let key = Object.keys(item)[0];
            // console.log(key);
            return (
              <TouchableOpacity
                onPress={() => onPress(item)}
                key={index}
                style={{
                  height: 50,
                  width: "90%",
                  backgroundColor:
                    index % 2 == 1 ? "rgba(101, 98, 90, 0.1)" : null,
                  // alignItems: 'flex-start',
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <Text style={{ fontSize: 18, color: theme?.darkGrey }}>{item.value}</Text>
              </TouchableOpacity>
            );
          })}
        </KeyboardAwareScrollView>
        <View
          style={{
            height: 40,
            width: "100%",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <Pressable onPress={setModalVisible}>
            <Text style={{ fontSize: 18, color: "grey", marginHorizontal: 20 }}>
              Close
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default PickModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    // alignItems: 'center',
  },
  text: { fontSize: 18, fontWeight: "500" },
  centeredView: {
    height: hp(30),
    width: wp(90),
    backgroundColor: "red",
  },
  textinput: {
    fontSize: 18,
    alignself: "self",
    color: "black",
    marginHorizontal: 10,
    // marginBottom: 30,
  },
});
