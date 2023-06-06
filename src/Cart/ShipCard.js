import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import AppText from "../../components/AppText";
import { light as theme } from "../../constant/colorsConfig";
import CheckBox from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../../constant/colors";
import ThemeContext from "../Context/ThemeContext";

const ShipCard = ({ item, methodSelector, isSelected }) => {
  const { carrier, service, currency, retail_rate, rate } = item;
  const { theme } = useContext(ThemeContext);
  // console.log("rate-->", item);

  return (
    <View
      style={[
        styles.card,
        {
          height: 60,
          width: "95%",
          alignSelf: "center",
          borderRadius: 5,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: theme?.white,
        },
      ]}
    >
      <View
        style={{
          width: "13%",
          alignItems: "center",
        }}
      >
        <CheckBox
          onPress={() => {
            methodSelector();
          }}
          // onPress={() => {
          //   if (current == index) {
          //     setCurrent(null);
          //     setMethod(null);
          //   } else {
          //     console.log("item", item);
          //     setCurrent(index);
          //     setMethod(item);
          //   }
          // }}
          size={25}
          color={isSelected ? theme.theme : theme.dovGray}
          name={isSelected ? "checkbox-marked" : "checkbox-blank-outline"}
        />
      </View>
      <View
        style={{
          width: "40%",
          alignItems: "flex-start",
          // backgroundColor: 'orange'
        }}
      >
        <AppText style={styles.price}>
          {carrier}: <Text style={{ color: theme.theme }}>{service}</Text>
        </AppText>
      </View>
      <View
        style={{
          width: "44%",
          alignItems: "flex-end",
          // backgroundColor: 'orange'
        }}
      >
        <AppText style={[styles.price, { color: theme.theme, right: 10 }]}>
          {`${retail_rate ? retail_rate : rate} ${currency}`}
        </AppText>
      </View>
    </View>
  );
};

export default ShipCard;

const styles = StyleSheet.create({
  card: {
    height: hp(20),
    // width: "90%",
    // alignSelf: "center",
    // justifyContent: "center",
    backgroundColor: "#fff",
    marginTop: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  innerCard: {
    backgroundColor: colors.background,
    height: 140,
    width: 120,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    // alignSelf: "flex-start",
  },
  separator: {
    width: "93%",
    height: 1,
    backgroundColor: "lightgrey",
    marginTop: 20,
    alignSelf: "center",
  },
  price: { fontSize: 14, fontWeight: "500" },
});
