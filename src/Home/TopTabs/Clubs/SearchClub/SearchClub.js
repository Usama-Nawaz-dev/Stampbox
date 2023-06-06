import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { styles } from "./styles";
import AppText from "../../../../../components/AppText";
import colors from "../../../../../constant/colors";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Entypo from "react-native-vector-icons/Entypo";

import {
  MainHeader,
  ClubCard,
  BottomSheet,
  MenuSheet,
} from "../../../../../components";
import { ItemSheet } from "../../../../Sheets";
import { countries, newTopics } from "../../../../../constant/staticData";

import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import Env from "../../../../../api/Env";
import allActions from "../../../../../redux/actions";
import MindAxios from "../../../../../api/MindAxios";

import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";

export const SearchClub = (props) => {
  const { navigation } = props;
  const { params } = props.route;
  // console.log(params?.userId)

  const dispatch = useDispatch();
  const focused = useIsFocused();
  const singleSheetRef = useRef();
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [clubList, setClubList] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    myState: { language },
  } = useContext(AuthContext);

  // Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpLoading, setIsUpLoading] = useState(false);
  const [first, setFirst] = useState(true);
  const [type, setType] = useState("");
  const { theme } = useContext(ThemeContext);

  const [data, setData] = useState(null);
  const [title, setTitle] = useState(null);
  const countryList = countries?.map((item) => item.value);
  const topicList = newTopics?.map((item) => item?.value);

  useEffect(() => {
    if (focused) {
      fetchClubs();
    }
  }, [focused]);

  const fetchClubs = async () => {
    setLoading(true);
    const response = await MindAxios.get(
      Env.createUrl(
        `clubs${params?.id ? `?category_id=${params?.id}` : ""}${
          params?.userId ? `?user_id=${params?.userId}` : ""
        }`
      )
    );
    setLoading(false);
    if (response?.status == 200) {
      let {
        data: {
          result: {
            paginated_items: { data: _data },
          },
        },
      } = response;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      // console.log("next..", nextPageUrl);
      setClubList(_data);
      setCurrentData(_data);
      setNextApiUrl(nextPageUrl);
      setFirst(true);
    } else {
      alert("Sever Error.");
    }
  };

  const getNextClubApiData = async () => {
    // console.log(nextApiUrl);
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl +
          `${params?.id ? `&category_id=${params?.id}` : ""}${
            params?.userId ? `&user_id=${params?.userId}` : ""
          }`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setClubList([...clubList, ..._data]);
        setCurrentData([...currentData, ..._data]);
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
    await fetchClubs("");
    setTimeout(() => {
      setIsUpLoading(false);
    }, 1000);
  };

  const filterClubs = async (type) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      type === "joined"
        ? Env.createUrl(
            `clubs?joined_club=${currentUser?.id}${
              params?.id ? `&category_id=${params?.id}&` : ""
            }`
          )
        : Env.createUrl(
            `clubs?privacy_type=${type}${
              params?.id ? `&category_id=${params?.id}` : ""
            }${params?.userId ? `&user_id=${params?.userId}` : ""}`
          )
    );

    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      let {
        data: {
          result: {
            paginated_items: { data: _data },
          },
        },
      } = response;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      // console.log(" filter next..", nextPageUrl);
      setClubList(_data);
      setCurrentData(_data);
      setNextApiUrl(nextPageUrl);
      setFirst(false);
    } else {
      alert("Sever Error.");
    }
  };

  const getNextFilterClubApiData = async (type) => {
    // console.log(nextApiUrl);
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        type === "joined"
          ? nextApiUrl +
              `&joined_club=${currentUser?.id}${
                params?.id ? `&category_id=${params?.id}&` : ""
              }`
          : nextApiUrl +
              `&privacy_type=${type}${
                params?.id ? `&category_id=${params?.id}` : ""
              }${params?.userId ? `&user_id=${params?.userId}` : ""}`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setClubList([...clubList, ..._data]);
        setCurrentData([...currentData, ..._data]);
        setNextApiUrl(nextPageUrl);
      } else {
        setNextApiUrl(null);
        setIsLoading(false);
        alert("Sever Error.");
      }
    }
  };

  //   const searchClub = (x) => {
  //     let text = x.toLowerCase();
  //     if (x) {
  //       let filteredName = clubList.filter((item) => {
  //         return item.name.toLowerCase().match(text);
  //       });
  //       setClubList(filteredName);
  //     } else {
  //       setClubList(currentData);
  //     }
  //   };

  const searchClubApi = async (x) => {
    if (x) {
      setLoading(true);
      const response = await MindAxios.get(Env.createUrl(`clubs?search=${x}`));
      setLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        setClubList(_data);
      }
    } else {
      setClubList(currentData);
    }
  };

  const renderMyClubs = ({ item, index }) => {
    return (
      <ClubCard
        Item={item}
        onViewClub={() => {
          dispatch(allActions.DetailAction.ClubDetail(item));
          navigation.navigate("ClubDetails");
        }}
      />
    );
  };

  const optionIcon = (
    <Entypo size={22} color={colors.cWhite} name="dots-three-vertical" />
  );

  const searchAll = () => {
    filterClubs("");
    setType("");
  };
  const filterPublic = () => {
    filterClubs("Public");
    setType("Public");
  };
  const filterPrivate = () => {
    filterClubs("Private");
    setType("Private");
  };
  const joinedClubs = () => {
    filterClubs("joined");
    setType("joined");
  };
  const filterByTopic = () => {
    setTitle("Topic");
    setData(topicList);
    singleSheetRef?.current?.open();
  };
  const filterByCountry = () => {
    setTitle("Country");
    setData(countryList);
    singleSheetRef?.current?.open();
  };

  const sortUserClubs = async (val, index) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl(
        `clubs${
          title === "Topic" ? `?topic_id=${index + 1}` : `?location=${val}`
        }`
      )
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      setClubList(_data);
      setNextApiUrl(null);
    } else {
      alert("Sever Error.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title={language?.clubs}
        showSearch={true}
        onPressBack={() => navigation.goBack()}
        onChangeValue={(text) => searchClubApi(text)}
        rightIcon={
          <MenuSheet
            customButton={optionIcon}
            options={[
              language?.all,
              language?.public,
              language?.private,
              "Search by Topic",
              "Search by Country",
              language?.joinedClubs,
              language?.cancel,
            ]}
            actions={[
              searchAll,
              filterPublic,
              filterPrivate,
              filterByTopic,
              filterByCountry,
              joinedClubs,
            ]}
          />
        }
      />
      {clubList?.length ? (
        <FlatList
          numColumns={2}
          data={clubList}
          style={styles.listStyle}
          renderItem={renderMyClubs}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          onEndReached={() =>
            first ? getNextClubApiData() : getNextFilterClubApiData(type)
          }
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={isUpLoading}
              tintColor={colors.lightTheme}
            />
          }
        />
      ) : (
        <View style={styles.emptyList}>
          {loading ? (
            <ActivityIndicator color={theme?.theme} size="large" />
          ) : (
            <AppText style={[styles.emptyText, { color: theme?.theme }]}>
              {language?.you_dont_have_any_active_club}
            </AppText>
          )}
        </View>
      )}

      {/* Selection Sheet */}
      <BottomSheet
        ref={singleSheetRef}
        title={`Filter By ${title}`}
        onPressClose={() => {
          singleSheetRef?.current?.close();
        }}
        dropDown={false}
        sheetHeight={hp(94)}
        ChildComponent={
          <ItemSheet
            Data={data}
            onPress={(val, index) => {
              singleSheetRef?.current?.close();
              sortUserClubs(val, index);
            }}
          />
        }
      />
    </View>
  );
};
