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
import { UserInviteCard } from "../../../components";

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

export const InvitesTab = (props) => {
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const eventType = useSelector((state) => state.SheetReducer.eventType);
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const [eventList, setEventList] = useState(null);
  const [listChanged, setListChanged] = useState(true);
  const { theme } = useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpLoading, setIsUpLoading] = useState(false);

  useEffect(() => {
    if (focused) {
      fetchEvents();
    }
  }, [focused]);

  const fetchEvents = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl(
        `participants?type=${eventType}&user_id=${currentUser?.id}&status=Invited`
      )
    );
    dispatch(allActions.DataAction.AppLoader(false));
    // console.log('response....?', response);
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      const filterData = _data.filter(
        (item) =>
          item?.event?.event_schedules[item?.event?.event_schedules?.length - 1]
            ?.is_expired !== true
      );
      setEventList(filterData);
      setNextApiUrl(nextPageUrl);
    } else {
      alert(language?.serverError);
    }
  };

  const getNextApiData = async () => {
    // console.log(nextApiUrl);
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl +
          `&type=${eventType}&user_id=${currentUser?.id}&status=Invited`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        const filterData = _data.filter(
          (item) =>
            item?.event?.event_schedules[
              item?.event?.event_schedules?.length - 1
            ]?.is_expired !== true
        );
        setEventList([...eventList, ...filterData]);
        setNextApiUrl(nextPageUrl);
      } else {
        setNextApiUrl(null);
        setIsLoading(false);
        alert("Sever Error.");
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

  const renderEvents = ({ item, index }) => {
    // console.log(item)
    return (
      <UserInviteCard
        User={item?.user}
        btnTitle={item?.status}
        invited={item?.status == "Invited" ? true : false}
        btnDisable={item?.status == "Invited" ? false : true}
        showBorder={item?.status == "Accepted" ? false : true}
        // onPress={async () => {
        //   item.status = "Accepted";
        //   setListChanged(!listChanged);
        //   const body = {
        //     status: "Accepted",
        //   };
        //   const response = await MindAxios.post(
        //     Env.paramUrl(`participants`, item?.id),
        //     body
        //   );
        // }}
        onPress={() => {
          dispatch(allActions.DetailAction.EventDetail(item?.event));
          props.navigation.navigate("EventDetail");
        }}
        onCancelInvite={async () => {
          item.status = "Rejected";
          setListChanged(!listChanged);
          const response = await MindAxios.delete(
            Env.paramUrl(`participants`, item?.id)
          );
        }}
        onViewDetail={() => {
          dispatch(allActions.DetailAction.EventDetail(item?.event));
          props.navigation.navigate("EventDetail");
        }}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      {eventList?.length ? (
        <FlatList
          data={eventList}
          extraData={listChanged}
          renderItem={renderEvents}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          onEndReached={getNextApiData}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={isUpLoading}
              tintColor={colors.lightTheme}
            />
          }
          style={styles.listStyle}
        />
      ) : (
        <View style={styles.mainItem}>
          <AppText style={[styles.itemText, { color: theme?.theme }]}>
            {language?.noInvitationFound}
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
  text: {
    fontSize: 16,
    color: colors.heading,
    fontFamily: Fonts.IBM_SemiBold,
  },
  listStyle: {
    paddingTop: hp(1.5),
    paddingHorizontal: wp(3),
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
