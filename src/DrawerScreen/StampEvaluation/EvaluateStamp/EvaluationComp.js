import React, { useState } from "react";
import { Pressable, View } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { styles } from "./styles";
import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";
import { FloatingInput } from "../../../../components";
import {
  categories,
  countries,
  format_types,
  newTopics,
  quality_Data,
  stampColors,
  stampFormatTypes,
  stampGrades,
  stampItemStatuses,
  stamp_Status,
  stampShapes,
  evals,
} from "../../../../constant/staticData";
import CustomDropDown from "../../../../components/CustomDropDown";

import Helper from "../../../Helper";
import ErrorMessage from "../../../forms/ErrorMessage";

import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";

export const EvaluationComp = (props) => {
  const {
    top,
    item,
    index,
    other,
    fields,
    evaluations,
    setEvaluations,
    filterSuggested,
  } = props;

  const suggestVal = evaluations[index].suggested;
  const pickerData = () => {
    let val = suggestVal;
    if (val == "Country") {
      return countries;
    }
    if (val == "Color") {
      return stampColors;
    }
    if (val == "Condition") {
      return [{ value: "Mint" }, { value: "Used" }, { value: "N/A" }];
    }
    if (val == "Grade") {
      return stampGrades;
    }
    if (val == "Format") {
      return format_types;
    }
    if (val == "Quality") {
      return quality_Data;
    }
    if (val == "Shape") {
      return stampShapes;
    }
  };
  return (
    <View
      style={[
        styles.main,
        {
          paddingBottom: other ? hp(1.5) : hp(1),
          marginTop: top ? top : hp(2),
        },
      ]}
    >
      {item.id !== 1 ? (
        <Pressable
          onPress={() => {
            let newVals = Helper.deepCopy(evaluations);
            let filtered = newVals.filter(
              (obj) => obj.suggested !== item.suggested
            );
            console.log(filtered);
            setEvaluations(filtered);
            filterSuggested(evals, filtered);
          }}
          style={styles.cross}
        >
          <EvilIcons name="close" color="#000" size={25} />
        </Pressable>
      ) : null}

      <View style={styles.biView}>
        <View>
          <CustomDropDown
            height={hp(25)}
            data={fields}
            value={suggestVal}
            label={"Select field to suggest"}
            style={{ width: wp(43), top: 6 }}
            left={5}
            width={wp(40)}
            onChangeText={(txt) => {
              let val = Helper.deepCopy(evaluations);
              val[index].sgstError = false;
              val[index].inputError = false;
              val[index].suggested = txt;
              val[index].input = null;
              val[index].other = false
              setEvaluations(val);
              filterSuggested(evals, val);
            }}
          />
          <View style={{ marginTop: hp(1) }} />
          <ErrorMessage
            visible={evaluations[index].sgstError}
            error={"Field is Required"}
          />
        </View>
        {suggestVal && !evaluations[index].other ? (
          <>
            {suggestVal == "Perforation" ||
            suggestVal == "Denomination" ||
            suggestVal == "Name" ||
            suggestVal == "Coins value" ||
            suggestVal == "Description" ||
            suggestVal == "Related set stamps count" ||
            suggestVal == "Year issued" ? (
              <FloatingInput
                width={wp(43)}
                value={evaluations[index].input}
                label={suggestVal}
                keyboardType={
                  suggestVal == "Name" || suggestVal == "Description"
                    ? "default"
                    : "numeric"
                }
                onChangeText={(text) => {
                  let val = Helper.deepCopy(evaluations);
                  val[index].inputError = false;
                  val[index].input = text;
                  setEvaluations(val);
                }}
                error={
                  evaluations[index].inputError ? "Field is Requied" : false
                }
              />
            ) : (
              <View>
                <CustomDropDown
                  height={hp(25)}
                  data={pickerData()}
                  value={evaluations[index].input}
                  left={55}
                  width={wp(40)}
                  label={
                    evaluations[index].input
                      ? suggestVal
                      : `Select ${suggestVal}`
                  }
                  style={{ width: wp(43), top: 6 }}
                  onChangeText={(text) => {
                    console.log("val", text);
                    let val = Helper.deepCopy(evaluations);
                    val[index].inputError = false;
                    val[index].input = text;
                    setEvaluations(val);
                  }}
                />
                <View style={{ marginTop: hp(1) }} />
                <ErrorMessage
                  visible={evaluations[index].inputError}
                  error={"Field is Required"}
                />
              </View>
            )}
          </>
        ) : null}
      </View>
      {suggestVal ? (
        <>
          {suggestVal !== "Perforation" &&
          suggestVal !== "Denomination" &&
          suggestVal !== "Name" &&
          suggestVal !== "Coins value" &&
          suggestVal !== "Description" &&
          suggestVal !== "Related set stamps count" &&
          suggestVal !== "Year issued" ? (
            <>
              <Pressable
                onPress={() => {
                  let val = Helper.deepCopy(evaluations);
                  val[index].other = !val[index].other;
                  val[index].inputError = false;
                  val[index].input = null;
                  val[index].otherSuggestion = null;
                  setEvaluations(val);
                }}
                style={styles.radioItems}
              >
                {evaluations[index].other ? (
                  <Ionicons
                    name="checkbox"
                    color={colors.lightTheme}
                    size={hp(3)}
                  />
                ) : (
                  <View
                    style={[styles.uncheck, { borderColor: "lightgrey" }]}
                  />
                )}
                <AppText style={{ marginLeft: wp(3) }}>
                  I want to suggest other value
                </AppText>
              </Pressable>
              {evaluations[index].other ? (
                <FloatingInput
                  width={"96%"}
                  label={"Please provide value"}
                  value={evaluations[index].otherSuggestion}
                  style={{ marginTop: -1 }}
                  onChangeText={(text) => {
                    let val = Helper.deepCopy(evaluations);
                    val[index].inputError = false;
                    val[index].otherSuggestion = text;
                    setEvaluations(val);
                  }}
                  error={
                    evaluations[index].inputError ? "Field is Requied" : false
                  }
                />
              ) : null}
            </>
          ) : null}
        </>
      ) : null}
    </View>
  );
};
