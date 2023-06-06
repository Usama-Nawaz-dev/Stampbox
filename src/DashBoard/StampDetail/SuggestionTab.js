import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  FlatList,
  Keyboard,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";
import AppText from "../../../components/AppText";
import OnlyDropDown from "../../../components/OnlyDropDown";
import { SuggestionCard, BottomSheet } from "../../../components";

import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

export const SuggestionTab = (props) => {
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const actionSheetRef = useRef();

  //Redux Data
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const stampDetail = useSelector((state) => state.DetailReducer.stampDetail);
  const owner = currentUser?.id === stampDetail?.user_id;

  const [key, setKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputVal, setInputVal] = useState(null);
  const [fieldList, setFieldList] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [suggestionList, setSuggestionList] = useState(null);

  // Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { theme } = useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      onKeyboardDidShow
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      onKeyboardDidHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onKeyboardDidShow = (e) => {
    setKeyboardHeight(e.endCoordinates.height);
  };

  const onKeyboardDidHide = () => {
    setKeyboardHeight(0);
  };

  useEffect(() => {
    if (focused) {
      fetchSuggestions();
      fetchFields();
    }
  }, [focused]);

  const fetchSuggestions = async () => {
    setLoading(true);
    const response = await MindAxios.get(
      Env.paramUrl(
        "suggestion",
        `?suggestable_type=StampItem&suggestable_id=${stampDetail?.id}`
      )
    );
    setLoading(false);
    if (response.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      // console.log(nextApiUrl);
      setSuggestionList(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      Helper.showToastMessage(
        "There's some issue while fetching Suggestions",
        colors.danger
      );
    }
  };

  const getNextSuggestions = async () => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl +
          `&suggestable_type=StampItem&suggestable_id=${stampDetail?.id}`
      );
      setIsLoading(false);
      if (response.status === 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setSuggestionList([...suggestionList, ..._data]);
        setNextApiUrl(nextPageUrl);
      } else {
        setNextApiUrl(null);
        Helper.showToastMessage(
          "There's some issue while fetching Suggestions",
          colors.danger
        );
      }
    }
  };

  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator
          // animation={loder}
          size={"large"}
          color={theme?.theme}
          style={{ marginBottom: 20 }}
        />
      </View>
    ) : null;
  };

  const onSubmit = async () => {
    if (key && inputVal) {
      const body = [
        {
          key: key,
          value: inputVal,
          suggestable_type: "StampItem",
          suggestable_id: stampDetail?.id,
        },
      ];
      dispatch(allActions.DataAction.AppLoader(true));
      const response = await MindAxios.post(Env.createUrl("suggestion"), body);
      dispatch(allActions.DataAction.AppLoader(false));
      if (response?.status === 200) {
        setKey(null);
        setInputVal(null);
        Helper.showToastMessage("Suggestion sent Successfully", colors.green);
        fetchSuggestions();
      }
    } else {
      Helper.showToastMessage(
        "Suggestion key and value is required",
        colors.blueTheme
      );
    }
  };

  const fetchFields = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(
        "suggestion/fields",
        `?suggestable_type=StampItem&suggestable_id=${stampDetail?.id}`
      )
    );

    if (response.status === 200) {
      const _data = response?.data?.result;
      const newData = _data.map((item) => {
        return {
          value: item.replace(/_/g, " "),
        };
      });
      setFieldList(newData);
    } else {
      Helper.showToastMessage(
        "There's some issue while fetching Suggestions",
        colors.danger
      );
    }
  };

  const suggestionAction = async (val) => {
    actionSheetRef?.current?.close();
    const body = { status: val };
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.post(
      Env.paramUrl("suggestion", `${selectedItem?.id}`),
      body
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      fetchSuggestions();
      Helper.showToastMessage("Suggestion updated successfully", colors.green);
    } else {
      Helper.showToastMessage(
        "There's some issue on Suggestion Action",
        colors.danger
      );
    }
  };

  const renderSuggestions = ({ item, index }) => {
    return (
      <SuggestionCard
        item={item}
        showBtn={owner}
        onAction={() => {
          setSelectedItem(item);
          actionSheetRef?.current?.open();
        }}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      {suggestionList?.length ? (
        <FlatList
          data={suggestionList}
          renderItem={renderSuggestions}
          onEndReached={getNextSuggestions}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.mainItem}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.theme} />
          ) : (
            <AppText style={styles.itemText}>
              {language?.you_have_no_Item_listed}
            </AppText>
          )}
        </View>
      )}
      {!owner && (
        <View
          style={[
            styles.inputSection,
            { paddingBottom: keyboardHeight ? keyboardHeight + 2 : hp(2) },
          ]}
        >
          <OnlyDropDown
            width="40%"
            left={0.001}
            data={fieldList}
            onChangeText={(value) => setKey(value.replace(/ /g, "_"))}
            position={fieldList?.length <= 3 ? 3.2 : 5.5}
            height={fieldList?.length <= 3 ? hp(15) : hp(27)}
            icon={() => <Feather name="chevron-down" size={22} />}
          />
          <TextInput
            multiline
            value={inputVal}
            style={styles.input}
            placeholder="Enter Suggestion..."
            onChangeText={(val) => setInputVal(val)}
          />
          <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
            <AppText style={styles.submitText}>{language?.submit}</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* Action Sheet */}
      <BottomSheet
        ref={actionSheetRef}
        sheetHeight={hp(25)}
        borderRadius={1}
        ChildComponent={
          <View style={styles.sheetConatiner}>
            <TouchableOpacity onPress={() => suggestionAction("Accepted")}>
              <View style={styles.btnStyle}>
                <MaterialCommunityIcons name="playlist-check" size={30} />
                <AppText style={styles.btnText}>Accept Suggestion</AppText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => suggestionAction("Rejected")}>
              <View style={styles.btnStyle}>
                <MaterialCommunityIcons name="playlist-remove" size={30} />
                <AppText style={styles.btnText}>Reject Suggestion</AppText>
              </View>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(3),
    backgroundColor: colors.background,
  },
  input: {
    height: 40,
    width: "73%",
    marginTop: 1,
    fontSize: 12,
    borderRadius: 5,
    paddingTop: hp(1.5),
    color: colors.lightText,
    paddingHorizontal: wp(1),
    backgroundColor: colors.white,
    fontFamily: Fonts.Inter_Regular,
  },
  submitBtn: {
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    backgroundColor: colors.theme,
  },
  submitText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.cWhite,
    paddingHorizontal: wp(2.5),
  },

  //Empty List
  mainItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cWhite,
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightTheme,
  },

  //Sheet Styles
  sheetConatiner: {
    padding: 20,
    justifyContent: "center",
    marginLeft: 10,
  },
  btnText: {
    fontSize: 20,
    marginLeft: 20,
    color: colors.lightBlack,
  },
  btnStyle: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
});
