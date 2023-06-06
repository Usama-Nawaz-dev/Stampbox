import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from "../../../assets/fonts/Fonts";
import AntDesign from "react-native-vector-icons/AntDesign";
import colors from "../../../constant/colors";

import Helper from "../../Helper";

import { Pressable } from "react-native";
import _ from "lodash";

const itemKeys = [
  "name",
  "format",
  "year_issued",
  "denomination",
  "perforation",
  "color",
  "condition",
  "grade",
  "total_stamps_issued",
  "related_set_stamps_count",
  "shape",
  "issue_type",
];
export const BlockItem = ({ myItem, unChanged, mock, change }) => {
  // let mock = mySimilars
  let obj = Object?.keys(mock);
  const exChange = (key) => {
    // console.log("unchanged[key]", unChanged[key]);
    // console.log("myItem[key]", myItem[key]);
    if (myItem[key] !== unChanged[key]) {
      let newItem = Helper.deepCopy(myItem);
      newItem[key] = unChanged[key];
      console.log(newItem);
      change(newItem);
    } else {
      let newItem = Helper.deepCopy(myItem);
      newItem[key] = mock[key];
      console.log(newItem);
      change(newItem);
    }
  };
  return (
    <>
      {obj.map((key, index) => {
        if (itemKeys.includes(key)) {
          //   console.log("key", key);
          let last = key == "issue_type";
          //   console.log(key, mock[key]);
          return (
            <>
              {key !== "name" && <Separator />}
              <View style={styles.mainBlock}>
                <View
                  style={[
                    styles.block,
                    { backgroundColor: colors.borderColor },
                  ]}
                >
                  <Text style={[styles.txt, { fontWeight: "500" }]}>
                    {keyChecker(key)}
                  </Text>
                </View>
                <View style={[styles.block, { flex: 0.35 }]}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.txt,
                      { width: key !== "name" ? 83 : undefined },
                    ]}
                  >
                    {mock[key] == null ? "N/A" : mock[key]}
                  </Text>
                  {mock[key] !== null &&
                  mock[key] !== "N/A" &&
                  key !== "name" &&
                  myItem[key] !== mock[key] ? (
                    <Pressable
                      style={{
                        position: "absolute",
                        right: 5,
                        bottom: 2,
                        // backgroundColor: "red",
                        alignItems: "center",
                      }}
                      onPress={() => exChange(key)}
                    >
                      <Text
                        style={{
                          top: 30,
                          fontSize: 10,
                          color: colors.lightTheme,
                        }}
                      >
                        change
                      </Text>
                      <AntDesign
                        name={
                          myItem[key] !== unChanged[key]
                            ? "swapleft"
                            : "swapright"
                        }
                        size={30}
                        color={colors.lightTheme}
                      />
                    </Pressable>
                  ) : (
                    <>
                      {myItem[key] !== unChanged[key] &&
                      mock[key] !== null &&
                      mock[key] !== "N/A" ? (
                        <Pressable
                          style={{
                            position: "absolute",
                            right: 5,
                            bottom: 2,
                            // backgroundColor: "red",
                            alignItems: "center",
                          }}
                          onPress={() => exChange(key)}
                        >
                          <Text
                            style={{
                              top: 30,
                              fontSize: 10,
                              color: colors.lightTheme,
                            }}
                          >
                            {myItem[key] !== unChanged[key]
                              ? "reset"
                              : "change"}
                          </Text>
                          <AntDesign
                            name={
                              myItem[key] !== unChanged[key]
                                ? "swapleft"
                                : "swapright"
                            }
                            size={30}
                            color={colors.lightTheme}
                          />
                        </Pressable>
                      ) : null}
                    </>
                  )}
                </View>
                <View
                  style={[
                    styles.block,
                    { flex: 0.35, backgroundColor: colors.borderColor },
                  ]}
                >
                  {myItem ? (
                    <Text style={styles.txt}>
                      {myItem[key] == null ? "N/A" : myItem[key]}
                    </Text>
                  ) : (
                    <Text style={styles.txt}>loading...</Text>
                  )}
                </View>
              </View>
              {last ? <Separator /> : null}
            </>
          );
        } else {
          return null;
        }
      })}
    </>
  );
};

const keyChecker = (key) => {
  if (key == "related_set_stamps_count") {
    return "Related Set";
  } else if (key == "year_issued") {
    return "Year Issued";
  } else if (key == "total_stamps_issued") {
    return "Total Stamps";
  } else if (key == "issue_type") {
    return "Issue Type";
  } else {
    return Helper.capitalizeFirstLetter(key);
  }
};
const Separator = ({ vertical }) => {
  return (
    <View
      style={[styles.separator, { marginVertical: vertical ? vertical : 0 }]}
    />
  );
};

const styles = StyleSheet.create({
  main: { flex: 1 },
  block: {
    flex: 0.3,
    // backgroundColor: "orange",
    justifyContent: "center",
  },
  txt: { fontSize: 12, marginHorizontal: 5 },
  separator: {
    height: 0.7,
    backgroundColor: colors.color4,
    width: "100%",
  },
  mainBlock: {
    height: 33,
    // backgroundColor: "grey",
    flexDirection: "row",
  },
});
