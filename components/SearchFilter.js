import React from "react";
import {
  Image,
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import colors from "../constant/colors";
import SelectedItems from "./SelectedItems";
import { images } from "../assets/images/Images";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const SearchFilter = (props) => {
  const {
    onFilter,
    removeItem,
    placeholder,
    onTermChange,
    onTermSubmit,
    selectedList,
    showFilter = true,
  } = props;

  return (
    <View style={styles.searchContainer}>
      <View
        style={[styles.searchSection, { width: showFilter ? wp(80) : wp(90) }]}
      >
        {selectedList?.length ? (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              height: 28,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {selectedList.map((item, index) => (
              <SelectedItems
                key={index}
                item={item}
                remove={removeItem}
                minWidth={wp(10)}
              />
            ))}
          </ScrollView>
        ) : (
          <>
            <Image source={images.Search} style={styles.searchIcon} />
            <TextInput
              onChangeText={onTermChange}
              placeholder={placeholder ? placeholder : "Search here…"}
              onEndEditing={(event) => onTermSubmit(event.nativeEvent.text)}
              style={styles.input}
              placeholderTextColor={colors.placeholderText}
            />
          </>
        )}
      </View>
      {showFilter ? (
        <TouchableOpacity style={styles.filterSection} onPress={onFilter}>
          <Image
            source={images.Filter1}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    width: wp(100),
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: wp(1),
    paddingBottom: hp(1.5),
    marginBottom: hp(1),
    borderBottomWidth: 1,
    borderColor: colors.borderColor,
  },
  searchSection: {
    height: 40,
    width: wp(80),
    backgroundColor: colors.cWhite,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 1.84,
  },
  searchIcon: {
    width: 12,
    height: 12,
    tintColor: colors.heading,
  },
  filterSection: {
    width: 40,
    height: 40,
    backgroundColor: colors.cWhite,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 1.84,
  },
  input: {
    fontSize: 12,
    marginTop: 3,
    fontFamily: "Roboto-Regular",
    marginLeft: 12,
    color: colors.heading,
    width: "100%",
  },
});
