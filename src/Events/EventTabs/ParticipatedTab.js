import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";
import AppText from "../../../components/AppText";
import { EventCard, MenuSheet } from "../../../components";
import Feather from "react-native-vector-icons/Feather";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";
// import { dark as theme } from "../../../constant/colorsConfig";

export const ParticipatedTab = (props) => {
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const eventType = useSelector((state) => state.SheetReducer.eventType);
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("All Items");
  const [eventList, setEventList] = useState(null);

  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpLoading, setIsUpLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    if (focused) {
      fetchEvents("");
    } else {
      setTitle("All Items");
    }
  }, [focused]);

  const fetchEvents = async (status) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl(
        `participants?type=${eventType}&user_id=${currentUser?.id}&status=${status}`
      )
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      setEventList(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert(language?.serverError);
    }
  };
  const getNextApiData = async (status) => {
    // console.log(nextApiUrl);
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl +
          `&type=${eventType}&user_id=${currentUser?.id}&status=${status}`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setEventList([...eventList, ..._data]);
        setNextApiUrl(nextPageUrl);
      } else {
        setNextApiUrl(null);
        setIsLoading(false);
        alert(language?.serverError);
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

  const onRefresh = async () => {
    setIsUpLoading(true);
    await fetchEvents("");
    setTimeout(() => {
      setIsUpLoading(false);
    }, 1000);
  };
  // const filterEvents = async (status) => {
  //     dispatch(allActions.DataAction.AppLoader(true));
  //     const response = await MindAxios.get(
  //         Env.createUrl(`participants?type=${eventType}&user_id=${currentUser?.id}&status=${status}`)
  //     );
  //     dispatch(allActions.DataAction.AppLoader(false));
  //     if (response?.status == 200) {
  //         const _data = response?.data?.result?.paginated_items?.data;
  //         setEventList(_data);
  //     } else { alert(language?.serverError) }
  // };

  const fetchEventDetail = async (item) => {
    dispatch(allActions.DetailAction.EventDetail(item?.event));
    props.navigation.navigate("EventDetail");
  };

  const renderEvents = ({ item, index }) => {
    // console.log(item?.status);
    return (
      <EventCard
        ItemDetail={item?.event}
        isAttending={item?.is_reachable ? "Attending" : "May be"}
        onPressDetail={() => fetchEventDetail(item)}
      />
    );
  };

  const onAll = () => {
    setTitle("All Items");
    fetchEvents("");
  };
  const onApprove = () => {
    setTitle("Approved");
    fetchEvents("Accepted");
  };
  const onPending = () => {
    setTitle("Pending");
    fetchEvents("Pending");
  };
  const onReject = () => {
    setTitle("Declined");
    fetchEvents("Rejected");
  };

  const myIcon = (
    <Feather
      name="filter"
      color={theme?.lightText}
      size={24}
      style={{ transform: [{ rotateY: "180deg" }] }}
    />
  );
  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <View style={styles.topSection}>
        <AppText style={styles.text}>{title}</AppText>
        <MenuSheet
          customButton={myIcon}
          options={[
            language?.all,
            language?.approved,
            language?.PENDING,
            language?.declined,
            language?.cancel,
          ]}
          actions={[onAll, onApprove, onPending, onReject]}
        />
      </View>
      {eventList?.length ? (
        <FlatList
          data={eventList}
          numColumns={2}
          renderItem={renderEvents}
          style={styles.listStyle}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.5}
          onEndReached={() => getNextApiData(title == "All Items" ? "" : title)}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={isUpLoading}
              tintColor={colors.lightTheme}
            />
          }
        />
      ) : (
        <View style={styles.mainItem}>
          <AppText style={[styles.itemText, { color: theme?.theme }]}>
            {language?.noEventFound}
          </AppText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(1),
    paddingHorizontal: wp(3),
    justifyContent: "space-between",
  },
  text: {
    fontSize: 16,
    // color: colors.heading,
    fontFamily: Fonts.IBM_SemiBold,
  },
  listStyle: {
    paddingHorizontal: wp(3),
    paddingTop: hp(1.5),
  },
  mainItem: {
    flex: 0.9,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 16,
    color: colors.color8,
  },
});
