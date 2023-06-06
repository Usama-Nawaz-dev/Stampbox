import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Share,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { styles } from "./styles";
import Btn from "../../../../../components/Btn";
import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";
import AlbumCard from "../../../../../components/AlbumCard";
import SearchBar from "../../../../../components/SearchBar";

import { ItemCard, MainHeader, ListingModal } from "../../../../../components";

import { debounce } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";
import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";

import { appUrl } from "../../../../../api/Env";
import { createMaterialTopTabNavigator } from "../../../../../CustomPackages/material-top-tabs";
const Tab = createMaterialTopTabNavigator();

export const AuctionStamps = (props) => {
  const { theme } = useContext(ThemeContext);

  const {
    myState: { language },
  } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <MainHeader
        title={language?.myItems}
        onPressBack={() => {
          props.navigation.goBack();
        }}
        rightIcon={
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("AddStamps", { item: false })
            }
          >
            <Ionicons
              name="md-add-circle-outline"
              color={colors.cWhite}
              size={hp(3)}
            />
          </TouchableOpacity>
        }
      />
      <Tab.Navigator
        initialRouteName="UserStamps"
        tabBarOptions={{
          activeTintColor: theme?.theme,
          inactiveTintColor: theme?.lightText,
          labelStyle: styles.labelStyle,
        }}
        screenOptions={{
          //use this config
          tabBarIndicatorStyle: { backgroundColor: theme?.theme },
          tabBarStyle: { backgroundColor: theme?.white },
        }}
      >
        <Tab.Screen
          name="UserStamps"
          component={UserStamps}
          options={{ tabBarLabel: "My Stamps" }}
        />
        <Tab.Screen
          name="UserLots"
          component={UserLots}
          options={{ tabBarLabel: "My Lots" }}
        />
      </Tab.Navigator>
    </View>
  );
};

const UserStamps = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const [stampList, setStampList] = useState(null);
  const [currentData, setCurrentData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [itemData, setItemData] = useState(null);
  const [statusCheck, setStatusCheck] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [ isSearch, setIsSearch] = useState(false)
  const { theme } = useContext(ThemeContext);

  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    if (focused) {
      fetchStamps();
    }
  }, [focused]);

  const fetchStamps = async () => {
    const userId = await Helper.getData("userId");
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl("stamp-items", `?user_id=${userId}&status=FOR_AUCTION`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    // console.log("first...?", response);
    if (response?.status == 200) {
      let _data = response?.data?.result?.paginated_items?.data;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      setStampList(_data);
      setCurrentData(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert("Server Error.");
    }
  };

  const getNextStamps = async () => {
    const userId = await Helper.getData("userId");
    if (nextApiUrl !== null && stampList.length >= 10) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${userId}&status=FOR_AUCTION`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setStampList([...stampList, ..._data]);
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

  const INTERVAL = 1500;
  const searchItemsApi = debounce(
    (x) => {
      searchStampsApi(x);
    },
    INTERVAL,
    { leading: true, trailing: false, maxWait: INTERVAL }
  );

  const searchStampsApi = async (x) => {
    const userId = await Helper.getData("userId");
    if (x) {
      let text = x.toLowerCase();
      let filterAuctions = stampList.filter((item) => {
        return item.name.toLowerCase().match(text);
      });
      // setLoading(true)
      // const response = await MindAxios.get(
      //     Env.createUrl(`stamp-items?user_id=${userId}&search=${x}&status=FOR_AUCTION`)
      // );
      // setLoading(false)
      // if (response?.status == 200) {
      //     const _data = response?.data?.result?.paginated_items?.data;
      //     setStampList(_data);
      // }
      setStampList(filterAuctions);
    } else {
      setStampList(currentData);
    }
  };

  const onShare = async (itemId) => {
    try {
      const result = await Share.share({
        message: `Please find my album item using this link: ${appUrl}stamp-items/${itemId}/show`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === stampList.length - 1;
    return (
      <View
        style={{
          marginRight: wp(3),
          marginLeft: index % 2 == 0 ? 2 : 0,
          marginTop: hp(1.5),
          marginBottom: isEnd ? hp(3) : 0,
        }}
      >
        <ItemCard
          Item={item}
          onEdit={() => onEditStamp(item?.id)}
          onViewDetail={() => onPressDetail(item?.id)}
          onShare={() => onShare(item?.id)}
          onListPress={() => {
            setItemData(item);
            setModalVisible(true);
          }}
        />
      </View>
    );
  };

  const onEditStamp = async (stampId) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.paramUrl("stamp-items", stampId));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const data = response?.data?.result?.stamp_item;
      dispatch(allActions.DataAction.StampDetail(data));
      dispatch(allActions.DataAction.SelectedImg(data?.medias));
      props.navigation.navigate("EditStamps", { item: data });
    } else {
      alert("Server Error");
    }
  };

  const onPressDetail = async (stampId) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.paramUrl("stamp-items", stampId));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const data = response?.data?.result?.stamp_item;
      dispatch(allActions.DetailAction.StampDetail(data));
      props.navigation.navigate("StampDetail");
    } else {
      alert("Server Error");
    }
  };

  const listingChecker = (type) => {
    if (type === "Auction") {
      if (itemData?.status.includes("FOR_AUCTION")) {
        props.navigation.navigate("CreateAuction", { item: itemData });
        setModalVisible(false);
      } else {
        Helper.showToastMessage(
          "This Stamp is not available for Auction.",
          colors.blueTheme
        );
      }
    } else if (type === "Trade") {
      if (itemData?.status?.includes("FOR_TRADE")) {
        props.navigation.navigate("CreateTrade", { item: itemData });
        setModalVisible(false);
      } else {
        Helper.showToastMessage(
          "This Stamp is not available for Trade.",
          colors.blueTheme
        );
      }
    } else {
      Helper.showToastMessage("Coming Soon.", colors.blueTheme);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <SearchBar
        placeholder={language?.search + "..."}
        borderRadius={5}
        border={1}
        top={hp(1.5)}
        onTermChange={(text) => {
          searchStampsApi(text);
        }}
        onTermSubmit={(text) => {
          searchStampsApi(text);
        }}
      />
      {loading && (
        <ActivityIndicator
          color={colors.color8}
          size="small"
          style={{ marginTop: hp(2) }}
        />
      )}
      {stampList?.length ? (
        <FlatList
          numColumns={2}
          data={stampList}
          renderItem={renderItem}
          style={styles.listStyle}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.5}
          onEndReached={getNextStamps}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.mainItem}>
          <AppText style={styles.itemText}>
            You have no Item listed at this time.
          </AppText>
          <Btn
            label={language?.addStamp}
            fontSize={12}
            height={40}
            width={wp(36)}
            style={{ marginTop: hp(1.5) }}
            iconLeft={
              <SimpleLineIcons
                name="plus"
                size={22}
                color="#fff"
                style={{ marginRight: 5 }}
              />
            }
            onPress={() =>
              props.navigation.navigate("AddStamps", { item: false })
            }
          />
        </View>
      )}
      <ListingModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onListItem={(type) => listingChecker(type)}
      />
    </View>
  );
};

const UserLots = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [albumList, setAlbumList] = useState(null);
  const [currentData, setCurrentData] = useState(null);

  // pagination states
  const [isLoading, setIsLoading] = useState(false);
  const [nextApiUrl, setNextApiUrl] = useState(null);

  const { theme, mood } = useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    if (isFocused) {
      (async () => {
        await getAlbums();
      })();
    }
  }, [isFocused]);

  const searchData = (x) => {
    let text = x.toLowerCase();
    if (x) {
      let filteredData = albumList.filter((item) => {
        return item.name.toLowerCase().match(text);
      });
      setAlbumList(filteredData);
    } else {
      setAlbumList(currentData);
    }
  };

  const getAlbums = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(`albums`, `?type=Lot&user_id=${currentUser?.id}`)
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
      setAlbumList(_data);
      setCurrentData(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert("Sever Error.");
    }
  };

  const getNextAlbums = async () => {
    try {
      if (nextApiUrl !== null) {
        setIsLoading(true);
        const response = await MindAxios.get(
          nextApiUrl + `&type=Lot&user_id=${currentUser?.id}`
        );
        setIsLoading(false);
        // console.log("response getAlbum", response);
        if (response?.status == 200) {
          let {
            data: {
              result: {
                paginated_items: { data: _data },
              },
            },
          } = response;
          let nextPageUrl =
            response?.data?.result?.paginated_items?.next_page_url;
          // console.log(nextPageUrl);
          setNextApiUrl(nextPageUrl);
          setAlbumList([...albumList, ..._data]);
          setCurrentData([...currentData, ..._data]);
        } else {
          setIsLoading(false);
          setNextApiUrl(null);
          alert("Sever Error.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator
          // animation={loder}
          size={"large"}
          color={theme?.theme}
          style={{ marginBottom: 10 }}
        />
      </View>
    ) : null;
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === albumList.length - 1;
    return (
      <View
        style={{
          marginRight: wp(3),
          marginTop: hp(1.5),
          marginBottom: isEnd ? hp(3) : 0,
          marginLeft: index % 2 == 0 ? 2 : 0,
        }}
      >
        <AlbumCard
          ItemDetail={item}
          onEdit={() =>
            navigation.navigate("CreateAlbum", {
              type: "Lot",
              ItemDetail: item,
            })
          }
          onDelete={() => removeAlbumAlert(item.id)}
          onViewAlbum={() =>
            navigation.navigate("AlbumDetails", { Item: item })
          }
          onPress={() =>
            props.navigation.navigate("CreateAuction", { item: item })
          }
        />
      </View>
    );
  };

  const onDeleteAlbum = async (id) => {
    dispatch(allActions.DataAction.AppLoader(true));
    let { headers } = await MindAxios.formdataConfig();
    fetch(Env.paramUrl("albums", `${id}`), {
      method: "DELETE",
      headers: headers,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result?.success) {
          dispatch(allActions.DataAction.AppLoader(false));
          Helper.showToastMessage("Album Deleted Successfully", colors.green);
          getAlbums();
        }
      })
      .catch((error) => {
        dispatch(allActions.DataAction.AppLoader(false));
        alert(error);
      });
  };

  const removeAlbumAlert = (id) =>
    Alert.alert("Delete Lot ?", "Are you sure you want to delete this Lot ?", [
      { text: "Cancel" },
      { text: "OK", onPress: () => onDeleteAlbum(id) },
    ]);

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <SearchBar
        placeholder={language?.search + "..."}
        borderRadius={5}
        border={1}
        top={hp(1.5)}
        onTermChange={(text) => {
          searchData(text);
        }}
        onTermSubmit={(text) => {
          searchData(text);
        }}
      />
      {albumList?.length == 0 ? (
        <View style={styles.mainItem}>
          <AppText style={styles.itemText}>
            You have no Item listed at this time
          </AppText>
        </View>
      ) : (
        <FlatList
          data={albumList}
          style={{ paddingHorizontal: wp(5) }}
          renderItem={renderItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          onEndReached={getNextAlbums}
        />
      )}
    </View>
  );
};
