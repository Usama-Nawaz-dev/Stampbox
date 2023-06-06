import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { Rating } from "react-native-ratings";
import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";
import ThemeContext from "../../Context/ThemeContext";
import CustomDropDown from "../../../components/CustomDropDown";
import { CustomButton, FloatingInput } from "../../../components";

const interestData = [
  { value: "All" },
  { value: "Topics" },
  { value: "Country" },
  { value: "Category" },
];

export const UserSearchSheet = (props) => {
  const { onReset, filterValues, onApplyFilter, setFilterValue } = props;

  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: theme?.darkGrey }]}>
        Filter Item For
      </Text>
      <View style={{ paddingHorizontal: wp(5) }}>
        <CustomDropDown
          position={-5}
          data={interestData}
          label={"Filter By Similar Interest"}
          value={filterValues?.similar_interest}
          onChangeText={(value) =>
            setFilterValue({ ...filterValues, similar_interest: value })
          }
        />
      </View>
      <View style={styles.input}>
        <FloatingInput
          label="Filter by country"
          autoCapitalize={"none"}
          value={filterValues?.country}
          onChangeText={(text) =>
            setFilterValue({ ...filterValues, country: text })
          }
        />
      </View>
      <Text style={styles.rating}>Filter by rating</Text>
      <View style={{ paddingVertical: hp(1) }}>
        <Rating
          fractions={2}
          // jumpValue={0.25}
          imageSize={28}
          ratingCount={5}
          startingValue={filterValues?.rating ? filterValues?.rating : 0}
          onFinishRating={(val) => {
            setFilterValue({ ...filterValues, rating: val })
          }}
          style={styles.ratingStyle}
        />
      </View>
      <View style={styles.btnSection}>
        <CustomButton
          label="Reset"
          fontSize={12}
          width={wp(43)}
          height={hp(5)}
          onPress={onReset}
          bg={colors.background}
          textColor={colors.placeholderText}
        />
        <CustomButton
          label="Filter"
          fontSize={12}
          width={wp(43)}
          height={hp(5)}
          bg={colors.color8}
          onPress={onApplyFilter}
          textColor={colors.cWhite}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 14,
    marginLeft: wp(5),
    marginTop: hp(0.5),
    color: colors.btnText,
    fontFamily: Fonts.IBM_Medium,
  },
  text: {
    fontSize: 12,
    maxWidth: wp(70),
    marginLeft: hp(0.5),
    color: colors.btnText,
    fontFamily: Fonts.IBM_Regular,
  },
  btnSection: {
    width: "100%",
    bottom: hp(2.5),
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(5),
  },
  input: {
    paddingHorizontal: wp(5),
  },
  rating: {
    color: colors.lightText,
    paddingHorizontal: wp(5),
    marginTop: hp(1.5),
    fontFamily: Fonts.IBM_Regular,
  },
  ratingStyle: {
    paddingVertical: 0,
    alignSelf: "flex-start",
    marginLeft: wp(5),
  },
});
