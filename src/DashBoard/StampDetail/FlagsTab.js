import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { sort_by } from "../../utils/constant";
import OnlyDropDown from "../../../components/OnlyDropDown";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import colors from "../../../constant/colors";
import AppText from "../../../components/AppText";
import { FlaggingDetailCard } from "../../../components/FlaggingDetailCard";

import allActions from "../../../redux/actions";
import MindAxios from "../../../api/MindAxios";
import Env from "../../../api/Env";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";
// import { dark as theme } from "../../../constant/colorsConfig";

export const FlagsTab = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const stampDetail = useSelector((state) => state.DetailReducer.stampDetail);
  const typeOfFlag = useSelector((state) => state.SheetReducer.flagType);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const [sort_value, setSortValue] = useState("All");
  const [flagData, setFlagData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme }= useContext(ThemeContext);

  useEffect(() => {
    if (focused) {
      fetchFlags();
      setSortValue("All");
      setFlagData(currentData);
    }
  }, [focused]);

  const fetchFlags = async () => {
    setLoading(true);
    const res = await MindAxios.get(
      // Env.createUrl(`stamp-items/${stampDetail?.id}/get-flags`)
      Env.createUrl(`stamp-items/${stampDetail?.id}/get-flags`)
    );
    // const res = await MindAxios.get(
    //   Env.createUrl(
    //     `flag-tickets/?user_id=${currentUser?.id}&type=${typeOfFlag}&flaggable_type=StampItem`
    //   )
    // );
    console.log("res", res);
    setLoading(false);
    if (res?.status === 200) {
      // const _data = res?.data?.result?.paginated_items?.data;
      const _data = res?.data?.result?.data;
      const nextPageUrl = res?.data?.result?.next_page_url;
      setNextApiUrl(nextPageUrl);
      if (typeOfFlag == "sent") {
        // let myFlags = _data?.length
        //   ? _data?.filter((obj) => obj?.flagger_id == currentUser?.id)
        //   : [];
        // setFlagData(myFlags);
        // setCurrentData(myFlags);
        setFlagData(_data);
        setCurrentData(_data);
      } else {
        setFlagData(_data);
        setCurrentData(_data);
      }
    } else {
      alert(language?.serverError);
    }
  };
  const getNextFlags = async () => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl // + `?${stampDetail?.id}/get-flags`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = res?.data?.result?.data;
        const nextPageUrl = res?.data?.result?.next_page_url;
        setNextApiUrl(nextPageUrl);
        if (typeOfFlag == "sent") {
          // let myFlags = _data?.length
          //   ? _data?.filter((obj) => obj?.flagger_id == currentUser?.id)
          //   : [];
          // setFlagData(myFlags);
          // setCurrentData(myFlags);
          setFlagData([...flagData, ..._data]);
          setCurrentData([...currentData, ..._data]);
        } else {
          setFlagData([...flagData, ..._data]);
          setCurrentData([...currentData, ..._data]);
        }
      } else {
        setIsLoading(false);
        setNextApiUrl(null);
        alert(language?.serverError);
      }
    }
  };

  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator
          size={"large"}
          color={theme?.theme}
          style={{ marginBottom: 20 }}
        />
      </View>
    ) : null;
  };

  const filterFlagsList = (type) => {
    if (type === "Flags") {
      setSortValue("All");
      setFlagData(currentData);
    } else if (type === "Opened Flags") {
      const filterData = currentData?.filter(
        (item) => item.current_activity === "opened"
      );
      setFlagData(filterData);
      setSortValue(type);
    } else if (type === "Accepted Flags") {
      const filterData = currentData?.filter(
        (item) => item.current_activity === "accepted"
      );
      setFlagData(filterData);
      setSortValue(type);
    } else if (type === "Rejected Flags") {
      const filterData = currentData?.filter(
        (item) => item.current_activity === "accepted"
      );
      setFlagData(filterData);
      setSortValue(type);
    } else if (type === "Declined Flags") {
      const filterData = currentData?.filter(
        (item) => item.current_activity === "declined"
      );
      setFlagData(filterData);
      setSortValue(type);
    } else if (type === "Community Involved") {
      const filterData = currentData?.filter(
        (item) => item.current_activity === "clarification-requested"
      );
      setFlagData(filterData);
      setSortValue(type);
    } else if (type === "Resolved Flags") {
      const filterData = currentData?.filter(
        (item) => item.current_activity === "resolved"
      );
      setFlagData(filterData);
      setSortValue(type);
    }
  };

  const renderFlags = ({ item, index }) => {
    // console.log("item-->", item);
    let last = index == flagData?.length - 1;
    return (
      <View
        style={{
          marginTop: hp(1),
          alignSelf: "center",
          marginLeft: wp(2),
          marginBottom: last ? hp(5) : null,
        }}
      >
        <FlaggingDetailCard
          width={wp(92)}
          item={item}
          onPress={() => {
            dispatch(allActions.SheetAction.FlagInfo(item));
            props.navigation.navigate("FlagConversation", { id: item?.id });
          }}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <View style={styles.topSection}>
        <AppText style={styles.heading}>Flagging Detail</AppText>
        <View style={styles.rightSection}>
          <AppText style={styles.heading}>
            Filter:
            <AppText style={{ fontWeight: "400" }}> {sort_value}</AppText>
          </AppText>
          <OnlyDropDown
            data={sort_by}
            value={sort_value}
            onChangeText={(value) => {
              filterFlagsList(value);
            }}
            dropdownOffset={hp(-1.5)}
            position={-5.5}
            width="40%"
            left={wp(15)}
            icon={() => (
              <Ionicons
                name="options-outline"
                size={22}
                color={theme?.davyGrey}
              />
            )}
          />
        </View>
      </View>
      {flagData?.length ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={flagData}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.5}
          onEndReached={getNextFlags}
          renderItem={renderFlags}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.emptyList}>
          {loading ? (
            <ActivityIndicator size="large" color={theme?.theme} />
          ) : (
            <AppText style={[styles.itemText, { color: theme?.theme}]}>
              Stamp don't have any Flags.
            </AppText>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(1),
    paddingHorizontal: wp(3),
    backgroundColor: colors.cWhite,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  heading: {
    fontWeight: "500",
    // color: colors.cBlack,
  },
  infoText: {
    fontWeight: "500",
    paddingTop: hp(1),
    color: colors.lightText,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightTheme,
  },
});
