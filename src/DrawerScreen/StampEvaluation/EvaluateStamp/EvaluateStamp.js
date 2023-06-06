import React, { useContext, useState, useEffect } from "react";
import { Pressable, View, ScrollView } from "react-native";
import FastImage from "react-native-fast-image";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { styles } from "./styles";
import { MainHeader } from "../../../../components";
import AppText from "../../../../components/AppText";
import { evals } from "../../../../constant/staticData";

import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";

import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Helper from "../../../Helper";
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";

import Btn from "../../../../components/Btn";
import { EvaluationComp } from "./EvaluationComp";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import colors from "../../../../constant/colors";

export const EvaluateStamp = (props) => {
  const Item = props?.route?.params;
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const [fields, setFields] = useState(evals);
  const [evaluations, setEvaluations] = useState([
    {
      id: 1,
      other: false,
      suggested: null,
      input: null,
      otherSuggestion: null,
      sgstError: false,
      inputError: false,

      // data: evals,
    },
  ]);
  const last = evaluations.length - 1;
  const [other, setOther] = useState(false);

  const media_uri = Item?.evaluable?.medias[0]?.media_url;

  const { theme, mood } = useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const filterSuggested = (array, array1) => {
    // console.log(array, array1)
    let res = [];
    res = array.filter((el) => {
      return !array1.find((el1) => {
        return el1.suggested === el.value;
      });
    });
    setFields(res);
  };

  const onSubmit = async () => {
    if (checkValidation()) {
      const dataList = evaluations?.map((item) => {
        return {
          key: Helper.lowerFirstLetter(item?.suggested.replace(/ /g, "_")),
          suggestable_id: Item?.id,
          suggestable_type: "ItemEvaluation",
          value: item?.input ? item?.input : item?.otherSuggestion,
        };
      });
      console.log(dataList);
      dispatch(allActions.DataAction.AppLoader(true));
      const response = await MindAxios.post(
        Env.createUrl("suggestion"),
        dataList
      );
      dispatch(allActions.DataAction.AppLoader(false));
      if (response?.status === 200) {
        // console.log(response);
        Helper.showToastMessage("Suggestion sent Successfully", colors.green);
        props.navigation.goBack();
      }
    }
  };
  const checkValidation = () => {
    let vals = Helper.deepCopy(evaluations);
    for (let val of vals) {
      const index = vals.indexOf(val);
      if (!val?.suggested) {
        vals[index].sgstError = true;
        setEvaluations(vals);
        return false;
      }
      if (
        (val?.input === null || val?.input === "") &&
        (val?.otherSuggestion === null || val?.otherSuggestion === "")
      ) {
        vals[index].inputError = true;
        setEvaluations(vals);
        return false;
      }
    }
    return true;
  };

  const onPressDetail = async () => {
    const id = Item?.evaluable?.id;
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.paramUrl("stamp-items", id));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const data = response?.data?.result?.stamp_item;
      dispatch(allActions.DetailAction.StampDetail(data));
      props.navigation.navigate("StampDetail");
    } else {
      alert(language?.serverError);
    }
  };

  return (
    <View style={styles.container}>
      <MainHeader
        title={`Evaluate Stamp`}
        onPressBack={() => props.navigation.goBack()}
      />
      {/* <ScrollView style={{ marginBottom: hp(20) }}> */}
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={onPressDetail}
          style={[styles.card, { backgroundColor: theme?.cardColor }]}
        >
          <FastImage
            style={styles.stampImg}
            source={{
              uri: media_uri ? media_uri : "https://picsum.photos/600/600",
            }}
          />
          <View style={styles.infoSection}>
            <AppText style={styles.titleText} numberOfLines={1}>
              {Helper.capitalizeFirstLetter(Item?.evaluable?.name)}
            </AppText>
            <AppText style={styles.itemText} numberOfLines={1}>
              {language?.year}:{" "}
              {Item?.evaluable?.year_issued
                ? Item?.evaluable?.year_issued
                : "N/A"}
            </AppText>
            <AppText style={styles.itemText} numberOfLines={1}>
              {language?.condition}:{" "}
              {Item?.evaluable?.condition ? Item?.evaluable?.condition : "N/A"}
            </AppText>
            <AppText style={styles.itemText} numberOfLines={1}>
              {language?.country}:{" "}
              {Item?.evaluable?.country ? Item?.evaluable?.country : "N/A"}
            </AppText>
          </View>
        </Pressable>

        {evaluations.map((item, index) => {
          return (
            <EvaluationComp
              item={item}
              key={item.id}
              index={index}
              other={other}
              fields={fields}
              evaluations={evaluations}
              setEvaluations={setEvaluations}
              filterSuggested={(arr, arr1) => filterSuggested(arr, arr1)}
            />
          );
        })}
        {fields?.length ? (
          <Btn
            label="Next"
            height={25}
            width={80}
            fontSize={12}
            style={{ alignSelf: "flex-end", margin: 10, marginBottom: hp(15) }}
            onPress={() => {
              // console.log(evaluations)
              if (checkValidation()) {
                setEvaluations([
                  ...evaluations,
                  {
                    id: evaluations.length + 1,
                    other: false,
                    suggested: null,
                    input: null,
                    otherSuggestion: null,
                    sgstError: false,
                    inputError: false,
                  },
                ]);
              }
            }}
          />
        ) : null}
      </KeyboardAwareScrollView>
      {(evaluations[last]?.suggested !== null && evaluations[last]?.input) ||
      evaluations[last]?.otherSuggestion ? (
        <Btn
          label="Submit"
          height={40}
          width={200}
          fontSize={16}
          style={{
            alignSelf: "center",
            // margin: 10,
            marginBottom: hp(3),
          }}
          onPress={onSubmit}
        />
      ) : null}
    </View>
  );
};
