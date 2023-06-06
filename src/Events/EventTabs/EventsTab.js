import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import Btn from "../../../components/Btn";
import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";
import AppText from "../../../components/AppText";
import { EventCard, MenuSheet } from "../../../components";

import Feather from "react-native-vector-icons/Feather";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

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

export const EventsTab = (props) => {
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const eventType = useSelector((state) => state.SheetReducer.eventType);
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("All Items");
  const [eventList, setEventList] = useState(null);
  //Pagination states
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpLoading, setIsUpLoading] = useState(false);
  const [filterOption, setFilterOption] = useState("");
  const { theme }= useContext(ThemeContext);

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

  const fetchEvents = async (mType) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl(
        `events?type=${eventType}&user_id=${currentUser?.id}&meeting_type=${mType}`
      )
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      // console.log(nextApiUrl);
      setEventList(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert(language?.serverError);
    }
  };

  const getNextApiData = async (mType) => {
    console.log(nextApiUrl);
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl +
          `&type=${eventType}&user_id=${currentUser?.id}&meeting_type=${mType}`
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

  // const filterEvents = async (mType) => {
  //   dispatch(allActions.DataAction.AppLoader(true));
  //   const response = await MindAxios.get(
  //     Env.createUrl(
  //       `events?user_id=${currentUser?.id}&type=${eventType}&meeting_type=${mType}`
  //     )
  //   );
  //   dispatch(allActions.DataAction.AppLoader(false));
  //   if (response?.status == 200) {
  //     const _data = response?.data?.result?.paginated_items?.data;
  //     setEventList(_data);
  //   } else {
  //     alert(language?.serverError);
  //   }
  // };

  const renderEvents = ({ item, index }) => {
    return (
      <EventCard
        ItemDetail={item}
        onPressDetail={() => {
          dispatch(allActions.DetailAction.EventDetail(item));
          props.navigation.navigate("EventDetail");
        }}
      />
    );
  };

  const onAll = () => {
    setTitle("All Item");
    setFilterOption("");
    fetchEvents("");
  };
  const onVirtual = () => {
    setTitle("Virtual");
    setFilterOption("Virtual");
    fetchEvents("Virtual");
    // filterEvents("Virtual");
  };
  const onI_Person = () => {
    setTitle("In Person");
    setFilterOption("In_Person");
    fetchEvents("In_Person");
    // filterEvents("In_Person");
  };
  const onBoth = () => {
    setTitle("In Person And Virtual");
    setFilterOption("In_Person_And_Virtual");
    fetchEvents("In_Person_And_Virtual");
    // filterEvents("In_Person_And_Virtual");
  };

  const myIcon = (
    <Feather
      name="filter"
      color={theme?.darkGrey}
      size={24}
      style={{ transform: [{ rotateY: "180deg" }] }}
    />
  );


  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <View style={styles.topSection}>
        <AppText style={[styles.text, { color: theme?.darkGrey}]}>{title}</AppText>
        {/* <TouchableOpacity>
                    <Feather name='filter' size={24} color={colors.lightText}
                        style={{ transform: [{ rotateY: '180deg' }] }} />
                </TouchableOpacity> */}
        <MenuSheet
          customButton={myIcon}
          // destructiveIndex={5}
          options={[
            "All",
            "Virtual",
            "In Person",
            "In Person And Virtual",
            language?.cancel,
          ]}
          actions={[onAll, onVirtual, onI_Person, onBoth]}
        />
      </View>
      {eventList?.length ? (
        <FlatList
          data={eventList}
          numColumns={2}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          onEndReached={() => getNextApiData(filterOption)}
          renderItem={renderEvents}
          style={styles.listStyle}
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
          <AppText style={styles.itemText}>
            You have no Item listed at this time
          </AppText>
          <Btn
            label={`Add an ${eventType}`}
            fontSize={12}
            height={40}
            width={wp(40)}
            style={{ marginTop: hp(1.5) }}
            onPress={() => props.navigation.navigate("CreateEvent")}
            iconLeft={
              <SimpleLineIcons
                name="plus"
                size={22}
                color="#fff"
                style={{ marginRight: 5 }}
              />
            }
          />
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
    color: colors.heading,
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
    fontSize: 12,
    fontWeight: "500",
    // color: colors.lightText,
  },
});
