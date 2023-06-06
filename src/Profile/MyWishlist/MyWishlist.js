import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Octicons from "react-native-vector-icons/Octicons";

import { styles } from "./styles";
import { StampSheet } from "./StampSheet";
import { SelectionSheet } from "../../Sheets";
import colors from "../../../constant/colors";
import { WishlistSheet } from "./WishlistSheet";
import AppText from "../../../components/AppText";

import {
  FavStamp,
  FavTrade,
  MainHeader,
  FavProduct,
  BottomSheet,
  UserAlbumCard,
} from "../../../components";

import { createMaterialTopTabNavigator } from "../../../CustomPackages/material-top-tabs";
const Tab = createMaterialTopTabNavigator();

import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";
import { images } from "../../../assets/images/Images";

const selectionItems = [
  { key: "color", isSelected: false },
  { key: "condition", isSelected: false },
  { key: "country", isSelected: false },
  { key: "denomination", isSelected: false },
  { key: "format", isSelected: false },
  { key: "name", isSelected: false },
  { key: "shape", isSelected: false },
  { key: "year_issued", isSelected: false },
];

export const MyWishlist = (props) => {
  const sheetRef = useRef();
  const stampSheetRef = useRef();
  const selectionSheetRef = useRef();
  const dispatch = useDispatch();

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [itemList, setItemList] = useState(null);
  const [selectData, setSelectData] = useState(selectionItems);

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const otherUser = useSelector((state) => state.DetailReducer.otherUser);
  const owner = currentUser?.id === otherUser?.id;

  const filterMatches = selectData?.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });

  const placeHolderChecker = () => {
    if (filterMatches?.length == 1) {
      return filterMatches[0]?.key;
    } else if (filterMatches?.length === 1) {
      return `${filterMatches[0]?.key}`;
    } else if (filterMatches?.length === 2) {
      return `${filterMatches[0]?.key} , ${filterMatches[1]?.key}`;
    } else if (filterMatches?.length > 2) {
      return `${filterMatches[0]?.key} , ${filterMatches[1]?.key} & more`;
    } else {
      return "Select field(s) to find matches.";
    }
  };

  const toggleItem = (selected, i, data, setState) => {
    if (selected) {
      var res = data.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            isSelected: false,
          };
        } else {
          return item;
        }
      });
      setState(res);
    } else {
      var res = data.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            isSelected: true,
          };
        } else {
          return item;
        }
      });
      setState(res);
    }
  };

  const onApplyFilter = async (check) => {
    const body = {
      // user_id: 17,
      user_id: otherUser?.id,
    };
    // console.log(body)
    if (check) {
      body.by_meta_data = filterMatches?.map((item) => item?.key);
    }
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.post(
      Env.createUrl("get-similar-wishlist"),
      body
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result;
      setItemList(_data);
      stampSheetRef?.current?.open();
    } else {
      Helper.showToastMessage(
        "There's some issue while fetching similar item.",
        colors.danger
      );
    }
  };

  return (
    <View style={styles.container}>
      <MainHeader
        title={owner ? "My Wishlist" : "Wishlist"}
        onPressBack={() => props.navigation.goBack()}
        rightIcon={
          !owner && (
            <TouchableOpacity onPress={() => sheetRef?.current?.open()}>
              <Image
                source={images.Option}
                style={{
                  height: hp(2.8),
                  width: hp(2.8),
                  tintColor: colors.cWhite,
                }}
              />
            </TouchableOpacity>
          )
        }
      />
      <Tab.Navigator
        initialRouteName="Albums"
        tabBarOptions={{
          activeTintColor: colors.theme,
          inactiveTintColor: colors.lightText,
          labelStyle: styles.labelStyle,
        }}
        screenOptions={{
          //use this config
          tabBarIndicatorStyle: { backgroundColor: theme?.theme },
          tabBarScrollEnabled: true,
          tabBarStyle: {
            backgroundColor: theme?.white,
            height: 50,
          },
          tabBarItemStyle: {
            width: "auto",
            alignItems: "flex-start",
          },
        }}
      >
        <Tab.Screen
          name="Albums"
          component={AlbumTab}
          options={{ tabBarLabel: "Albums" }}
        />
        <Tab.Screen
          name="Stamps"
          component={StampsTab}
          options={{ tabBarLabel: "Stamps" }}
        />
        <Tab.Screen
          name="Products"
          component={ProductsTab}
          options={{ tabBarLabel: "Products" }}
        />
        <Tab.Screen
          name="Trades"
          component={TradeTab}
          options={{ tabBarLabel: "Trades" }}
        />
      </Tab.Navigator>

      {/* Filter Sheet */}
      <BottomSheet
        ref={sheetRef}
        sheetHeight={hp(30)}
        ChildComponent={
          <WishlistSheet
            selectData={selectData}
            placeHolderChecker={placeHolderChecker}
            onSelectItem={() => {
              sheetRef?.current?.close();
              setTimeout(() => {
                selectionSheetRef?.current?.open();
              }, 350);
            }}
            onApplyFilter={(check) => {
              if (check) {
                if (filterMatches?.length) {
                  sheetRef?.current?.close();
                  onApplyFilter(check);
                } else {
                  alert("Please select one or more item for matches.");
                }
              } else {
                sheetRef?.current?.close();
                onApplyFilter(check);
              }
            }}
            onReset={() => {
              sheetRef?.current?.close();
            }}
          />
        }
      />

      <BottomSheet
        ref={selectionSheetRef}
        title={"Select field(s) to find matches"}
        onPressClose={() => {
          selectionSheetRef?.current?.close();
          setTimeout(() => {
            sheetRef?.current?.open();
          }, 350);
        }}
        dropDown={false}
        sheetHeight={hp(55)}
        ChildComponent={
          <SelectionSheet
            Data={selectData}
            onValueChange={(selected, index) =>
              toggleItem(selected, index, selectData, setSelectData)
            }
          />
        }
      />

      <BottomSheet
        ref={stampSheetRef}
        title={"User similar item(s)."}
        onPressClose={() => stampSheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={hp(94)}
        ChildComponent={
          <StampSheet
            stampList={itemList}
            stampSheetRef={stampSheetRef}
            navigation={props.navigation}
          />
        }
      />
    </View>
  );
};

const ProductsTab = (props) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const otherUser = useSelector((state) => state.DetailReducer.otherUser);
  const owner = currentUser?.id === otherUser?.id;

  const [productList, setProductList] = useState(null);
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);
  // Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // console.log(productList)

  useEffect(() => {
    if (isFocused) {
      (async () => {
        await getProducts();
      })();
    }
  }, [isFocused]);

  const getProducts = async () => {
    setLoading(true);
    const response = await MindAxios.get(
      Env.paramUrl(`wishlists`, `?user_id=${otherUser?.id}&type=Product`)
    );
    setLoading(false);
    if (response?.status == 200) {
      setProductList(response?.data?.result?.paginated_items?.data);
      setNextApiUrl(response?.data?.result?.paginated_items?.next_page_url);
    } else {
      alert(language?.serverError);
    }
  };

  const getNextProducts = async () => {
    if (nextApiUrl) {
      setIsLoading(true);
      const response = await MindAxios.get(
        Env.paramUrl(`wishlists`, `?user_id=${otherUser?.id}&type=Product`)
      );
      setIsLoading(false);
      if (response?.status == 200) {
        setProductList([
          ...productList,
          ...response?.data?.result?.paginated_items?.data,
        ]);
        setNextApiUrl(response?.data?.result?.paginated_items?.next_page_url);
      } else {
        setNextApiUrl(null);
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

  const toggleFav = async (id) => {
    let body = {
      wishable_type: "Product",
      wishable_id: id,
    };
    const response = await MindAxios.post(Env.createUrl("wishlists"), body);
    // console.log("res-->", response);
    if (response?.status == 200) {
      let favList = productList.map((item) => {
        if (item?.wishable?.id === id) {
          if (item.wishable.is_wishable === 1) {
            item.wishable.is_wishable = 0;
            Helper.showToastMessage(
              "Product removed from wishlist",
              colors.green
            );
          } else {
            Helper.showToastMessage("Product Added to wishlist", colors.green);
            item.wishable.is_wishable = 1;
          }
        }
        return item;
      });
      setProductList(favList);
    } else {
      alert(language?.serverError);
    }
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === productList.length - 1;
    return (
      <View
        style={{
          marginRight: wp(3),
          marginLeft: index % 2 == 0 ? 2 : 0,
          marginTop: hp(1.5),
          marginBottom: isEnd ? hp(3) : 0,
        }}
      >
        <FavProduct
          Item={item?.wishable}
          btnTitle="Buy Now"
          onToggleFav={() => toggleFav(item?.wishable?.id)}
          onPress={() => {
            dispatch(allActions.DetailAction.StampDetail(item?.wishable));
            props.navigation.navigate("ProductDetail");
          }}
        />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {owner && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => props.navigation.navigate("AllProducts")}
        >
          <Octicons name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      )}
      {productList?.length ? (
        <FlatList
          data={productList}
          style={styles.listStyle}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          ListFooterComponent={renderFooter}
          onEndReached={getNextProducts}
        />
      ) : (
        <View style={styles.emptyList}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.theme} />
          ) : (
            <AppText style={styles.emptyText}>
              No Product Added to Wishlist.
            </AppText>
          )}
        </View>
      )}
    </View>
  );
};

const StampsTab = (props) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const otherUser = useSelector((state) => state.DetailReducer.otherUser);
  const owner = currentUser?.id === otherUser?.id;
  const { theme } = useContext(ThemeContext);

  const [stampList, setStampList] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    if (isFocused) {
      (async () => {
        await getStamps();
      })();
    }
  }, [isFocused]);

  const getStamps = async () => {
    setLoading(true);
    const response = await MindAxios.get(
      Env.paramUrl(`wishlists`, `?user_id=${otherUser?.id}&type=StampItem`)
    );
    setLoading(false);
    if (response?.status == 200) {
      setStampList(response?.data?.result?.paginated_items?.data);
      setNextApiUrl(response?.data?.result?.paginated_items?.next_page_url);
    } else {
      alert(language?.serverError);
    }
  };

  const getNextStamps = async () => {
    if (nextApiUrl !== null) {
      setLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${otherUser?.id}&type=StampItem`
      );
      setLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        setStampList([...stampList, ..._data]);
        setNextApiUrl(response?.data?.result?.paginated_items?.next_page_url);
      } else {
        setNextApiUrl(null);
        alert("Server error.");
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

  const toggleFav = async (id) => {
    let body = {
      wishable_type: "StampItem",
      wishable_id: id,
    };
    const response = await MindAxios.post(Env.createUrl("wishlists"), body);
    // console.log("res-->", response);
    if (response?.status == 200) {
      let favList = stampList.map((item) => {
        if (item?.wishable?.id === id) {
          if (item.wishable.is_wishable === 1) {
            item.wishable.is_wishable = 0;
            Helper.showToastMessage(
              "Stamp removed from Wishlist",
              colors.green
            );
          } else {
            item.wishable.is_wishable = 1;
            Helper.showToastMessage("Stamp added to Wishlist", colors.green);
          }
        }
        return item;
      });
      setStampList(favList);
    } else {
      alert(language?.serverError);
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
      alert(language?.serverError);
    }
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === stampList.length - 1;
    // console.log(item?.wishable?.user)
    return (
      <View
        style={{
          marginRight: wp(3),
          marginLeft: index % 2 == 0 ? 2 : 0,
          marginTop: hp(1.5),
          marginBottom: isEnd ? hp(3) : 0,
        }}
      >
        <FavStamp
          Item={item?.wishable}
          onToggleFav={() => toggleFav(item?.wishable?.id)}
          onPress={() => onPressDetail(item?.wishable_id)}
          // onPressUser={() => {
          //   dispatch(allActions.DetailAction.OtherUser(item?.wishable?.user));
          //   props.navigation.navigate("UserProfile");
          // }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {owner && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => props.navigation.navigate("AllStamps")}
        >
          <Octicons name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      )}
      {stampList?.length ? (
        <FlatList
          data={stampList}
          style={styles.listStyle}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          ListFooterComponent={renderFooter}
          onEndReached={getNextStamps}
        />
      ) : (
        <View style={styles.emptyList}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.theme} />
          ) : (
            <AppText style={styles.emptyText}>
              No Stamps Added to Wishlist.
            </AppText>
          )}
        </View>
      )}
    </View>
  );
};

const AlbumTab = (props) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const otherUser = useSelector((state) => state.DetailReducer.otherUser);
  const owner = currentUser?.id === otherUser?.id;

  const [albumList, setAlbumList] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    myState: { language },
  } = useContext(AuthContext);

  // Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (isFocused) {
      (async () => {
        await getAlbums();
      })();
    }
  }, [isFocused]);

  const getAlbums = async () => {
    setLoading(true);
    const response = await MindAxios.get(
      Env.paramUrl(`wishlists`, `?user_id=${otherUser?.id}&type=Album`)
    );
    setLoading(false);
    if (response?.status == 200) {
      setAlbumList(response?.data?.result?.paginated_items?.data);
      setNextApiUrl(response?.data?.result?.paginated_items?.next_page_url);
    } else {
      alert(language?.serverError);
    }
  };

  const getNextAlbums = async () => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${otherUser?.id}&type=Album`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        setAlbumList([...albumList, ..._data]);
        setNextApiUrl(response?.data?.result?.paginated_items?.next_page_url);
      } else {
        setNextApiUrl(null);
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

  // console.log(albumList[0]?.wishable?.id)

  const toggleFav = async (id) => {
    let body = {
      wishable_type: "Album",
      wishable_id: id,
    };
    const response = await MindAxios.post(Env.createUrl("wishlists"), body);
    // console.log("res-->", response, id);
    if (response?.status == 200) {
      let favList = albumList.map((item) => {
        if (item?.wishable?.id === id) {
          if (item.wishable.is_wishable === 1) {
            item.wishable.is_wishable = 0;
            Helper.showToastMessage(
              "Album removed from Wishlist",
              colors.green
            );
          } else {
            item.wishable.is_wishable = 1;
            Helper.showToastMessage("Album added to Wishlist", colors.green);
          }
        }
        return item;
      });
      setAlbumList(favList);
    } else {
      alert(language?.serverError);
    }
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === albumList.length - 1;
    const canSeeAlbum = item?.wishable?.is_private
      ? item?.wishable?.user?.is_current_user_following
      : true;

    return (
      <View
        style={{
          marginRight: wp(3),
          marginLeft: index % 2 == 0 ? 2 : 0,
          marginTop: hp(1.5),
          marginBottom: isEnd ? hp(3) : 0,
        }}
      >
        <UserAlbumCard
          ItemDetail={item?.wishable}
          disabled={!canSeeAlbum}
          onToggle={() => {
            toggleFav(item?.wishable?.id);
          }}
          onViewAlbum={() =>
            props.navigation.navigate("AlbumDetails", { Item: item?.wishable })
          }
          // disabled={}
        />
      </View>
    );
  };
  return (
    <View style={[styles.container, { paddingTop: hp(1) }]}>
      {owner && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => props.navigation.navigate("AllAlbums")}
        >
          <Octicons name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      )}
      {albumList?.length ? (
        <FlatList
          data={albumList}
          style={styles.listStyle}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          ListFooterComponent={renderFooter}
          onEndReached={getNextAlbums}
        />
      ) : (
        <View style={styles.emptyList}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.theme} />
          ) : (
            <AppText style={styles.emptyText}>
              No Album Added to Wishlist.
            </AppText>
          )}
        </View>
      )}
    </View>
  );
};

const TradeTab = (props) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const otherUser = useSelector((state) => state.DetailReducer.otherUser);
  const owner = currentUser?.id === otherUser?.id;

  const [tradeList, setTradeList] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    myState: { language },
  } = useContext(AuthContext);

  // Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (isFocused) {
      (async () => {
        await getAlbums();
      })();
    }
  }, [isFocused]);

  const getAlbums = async () => {
    setLoading(true);
    const response = await MindAxios.get(
      Env.paramUrl(`wishlists`, `?user_id=${otherUser?.id}&type=Trade`)
    );
    setLoading(false);
    if (response?.status == 200) {
      console.log(response?.data?.result?.paginated_items?.data);
      setTradeList(response?.data?.result?.paginated_items?.data);
      setNextApiUrl(response?.data?.result?.paginated_items?.next_page_url);
    } else {
      alert(language?.serverError);
    }
  };

  const getNextAlbums = async () => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${otherUser?.id}&type=Trade`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        setTradeList([...albumList, ..._data]);
        setNextApiUrl(response?.data?.result?.paginated_items?.next_page_url);
      } else {
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

  // console.log(albumList[0]?.wishable?.id)

  const toggleFav = async (id) => {
    let body = {
      wishable_type: "Trade",
      wishable_id: id,
    };
    const response = await MindAxios.post(Env.createUrl("wishlists"), body);
    // console.log("res-->", response, id);
    if (response?.status == 200) {
      let favList = tradeList.map((item) => {
        if (item?.wishable?.id === id) {
          if (item.wishable.is_wishable === 1) {
            item.wishable.is_wishable = 0;
            Helper.showToastMessage(
              "Trade removed from Wishlist",
              colors.green
            );
          } else {
            item.wishable.is_wishable = 1;
            Helper.showToastMessage("Trade added to Wishlist", colors.green);
          }
        }
        return item;
      });
      setTradeList(favList);
    } else {
      alert(language?.serverError);
    }
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === tradeList.length - 1;
    return (
      <View
        style={{
          marginRight: wp(3),
          marginLeft: index % 2 == 0 ? 2 : 0,
          marginTop: hp(1.5),
          marginBottom: isEnd ? hp(3) : 0,
        }}
      >
        <FavTrade
          Item={item?.wishable}
          onToggleFav={() => toggleFav(item?.wishable?.id)}
          onPress={() => {
            props.navigation.navigate("TradeStack", {
              screen: "TradeDetail",
            });
            dispatch(allActions.DetailAction.TradeDetail(item?.wishable));
          }}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: hp(1) }]}>
      {/* {owner && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => props.navigation.navigate("AllAlbums")}
        >
          <Octicons name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      )} */}
      {tradeList?.length ? (
        <FlatList
          data={tradeList}
          style={styles.listStyle}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          ListFooterComponent={renderFooter}
          onEndReached={getNextAlbums}
        />
      ) : (
        <View style={styles.emptyList}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.theme} />
          ) : (
            <AppText style={styles.emptyText}>
              No Album Added to Wishlist.
            </AppText>
          )}
        </View>
      )}
    </View>
  );
};
