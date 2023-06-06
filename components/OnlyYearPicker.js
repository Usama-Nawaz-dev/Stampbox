import { StyleSheet, Text, View } from "react-native";
import React, { forwardRef } from "react";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";

const currentYear = new Date().getFullYear();
const years = Array.from(
  new Array(currentYear - 1980),
  (val, index) => index + 1980
);
const OnlyYearPicker = forwardRef((props, ref) => {
  let { selectedYear, setSelectedYear, show, showPicker, onClose } = props;
  return (
    <>
      {show ? (
        <View style={styles.picker}>
          <View style={styles.pickerHeader}>
            <Text style={{ marginLeft: 10 }}>Pick a year</Text>
            <Ionicons
              onPress={() => {
                // onClose(selectedYear)
                showPicker(false);
              }}
              style={{ marginRight: 10 }}
              name="close"
              size={22}
            />
          </View>
          <Picker
            selectedValue={selectedYear ? selectedYear : currentYear}
            onValueChange={(val) => {
              console.log("year", val);
              setSelectedYear(val);
            }}
          >
            {years.map((year) => (
              <Picker.Item key={year} label={`${year}`} value={year} />
            ))}
          </Picker>
        </View>
      ) : null}
    </>
  );
});
export default OnlyYearPicker;

const styles = StyleSheet.create({
  picker: {
    height: 200,
    width: "100%",
    position: "absolute",
    bottom: 20,
    // zIndex: 1000,
    //   right: 0,
    backgroundColor: "#fff",
  },
  pickerHeader: {
    height: 30,
    width: "100%",
    backgroundColor: "lightgrey",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
  },
});
