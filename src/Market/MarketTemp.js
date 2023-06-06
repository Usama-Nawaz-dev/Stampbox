import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
} from "react";

import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
import { useFocusEffect } from "@react-navigation/native";

import { styles } from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../constant/colors";
import AppText from "../../components/AppText";
import { images } from "../../assets/images/Images";

import { AllTab } from "./AllTab/AllTab";
import { ForTradeTab } from "./ForTradeTab/ForTradeTab";
import { AuctionTab } from "./AuctionTab/AuctionTab";
import { BountiesTab } from "./BountiesTab/BountiesTab";
import { SalesTab } from "./SalesTab/SalesTab";
import { SuppliesTab } from "./SuppliesTab/SuppliesTab";
import { MarketHeader } from "../../components";

import Env from "../../api/Env";
import MindAxios from "../../api/MindAxios";
import Helper from "../Helper";
import allActions from "../../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import AuthContext from "../Context/AuthContext";

const headers = ["All", "Trade", "Auction", "Bounty", "Sale", "Supplies"];

export const Market = ({ navigation }) => {
  const [active, setActive] = useState(0);
  const headerScrollView = useRef();
  const itemScrollView = useRef();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const cartProducts = useSelector((state) => state.DataReducer.cart);

  const [suppliesList, setSuppliesList] = useState(null);
  const [salesList, setSalesList] = useState(null);
  const [bountiesList, setBountiesList] = useState(null);
  const [auctionList, setAuctionList] = useState(null);
  const [tradesList, setTradesList] = useState(null);

  const auctionsAccess = currentUser?.user_permissions?.includes(
    "marketplace.auctions.listing"
  );
  const tradeAccess = currentUser?.user_permissions?.includes("auctions.crud");
  // console.log(currentUser)
  const {
    myState: { language },
  } = useContext(AuthContext);

  // console.log(listData)

  useEffect(() => {
    headerScrollView.current.scrollToIndex({
      index: active,
      viewPosition: 0.5,
    });
  }, [active]);
  const onPressHeader = (index) => {
    itemScrollView.current.scrollToIndex({ index });
    setActive(index);
  };
  const onMomentumScrollEnd = (e) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (active != newIndex) {
      setActive(newIndex);
    }
  };
  const iconChecker = (index) => {
    if (index == 0) {
      return images.All;
    } else if (index == 1) {
      return images.Trade;
    } else if (index == 2) {
      return images.Auction;
    } else if (index == 3) {
      return images.Bounty;
    } else if (index == 4) {
      return images.Sale;
    } else if (index == 5) {
      return images.Supplies;
    } else {
      icon = null;
    }
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        dispatch(allActions.DataAction.AppLoader(true));
        getSupplies();
        getBounties();
        getAuctions();
        await getSales();
        await getTrades();
        dispatch(allActions.DataAction.AppLoader(false));
      })();
    }, [])
  );

  const getSupplies = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`products`, `?is_published=1&productable_type=Supply`)
    );
    // console.log("response", response);
    if (response?.status == 200) {
      setSuppliesList(response?.data?.result?.paginated_items?.data);
    }
  };
  const getSales = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`products`, `?productable_type=StampItem`)
    );
    // console.log("response", response);
    if (response?.status == 200) {
      setSalesList(response?.data?.result?.paginated_items?.data);
    }
  };
  const getBounties = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`bounties`, `?status=Active`)
    );
    // console.log("response", response);
    if (response?.status == 200) {
      setBountiesList(response?.data?.result?.paginated_items?.data);
    }
  };
  const getAuctions = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`auctions`, `?type=active`)
    );
    // console.log("response", response);
    if (response?.status == 200) {
      setAuctionList(response?.data?.result?.paginated_items?.data);
    }
  };
  const getTrades = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`trades`, `?type=active`)
    );
    // console.log("response", response);
    if (response?.status == 200) {
      setTradesList(response?.data?.result?.paginated_items?.data);
    }
  };

  const toggleFav = async (tradeId) => {
    let body = {
      wishable_type: "Trade",
      wishable_id: tradeId,
    };
    const response = await MindAxios.post(Env.createUrl("wishlists"), body);
    if (response?.status == 200) {
      let updatedList = tradesList.map((item) => {
        if (item.id === tradeId) {
          if (item.is_wishable === 1) {
            item.is_wishable = 0;
            Helper.showToastMessage(
              "Trade removed from wishlist",
              colors.green
            );
          } else {
            item.is_wishable = 1;
            Helper.showToastMessage("Trade added to wishlist", colors.green);
          }
        }
        return item;
      });
      setTradesList(updatedList);
    } else {
      alert(language?.serverError);
    }
  };

  const toggleBookmark = async (tradeId) => {
    let body = {
      book_markable_type: "Trade",
      book_markable_id: tradeId,
    };
    const response = await MindAxios.post(Env.createUrl("bookmarks"), body);
    if (response?.status == 200) {
      let updatedList = tradesList.map((item) => {
        if (item.id === tradeId) {
          if (item.is_book_marked === 1) {
            item.is_book_marked = 0;
            Helper.showToastMessage("Trade book mark added", colors.green);
          } else {
            item.is_book_marked = 1;
            Helper.showToastMessage("Trade book mark removed", colors.green);
          }
        }
        return item;
      });
      setTradesList(updatedList);
    } else {
      alert(language?.serverError);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <MarketHeader
        title={language?.marketplace}
        cartLength={cartProducts?.length}
        coins={currentUser?.coins}
        onPressMenu={() => navigation.openDrawer()}
        onPressCart={() => navigation.navigate("MyCart")}
        onPressCoin={() => navigation.navigate("MainWallet")}
      />
      <View style={styles.container}>
        <FlatList
          data={headers}
          ref={headerScrollView}
          keyExtractor={(item) => item}
          horizontal
          style={styles.headerScroll}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <View>
                <TouchableOpacity
                  onPress={() => onPressHeader(index)}
                  key={item}
                  style={[
                    styles.headerItem,
                    {
                      backgroundColor:
                        active == index ? colors.theme : "transparent",
                    },
                  ]}
                >
                  <Image
                    source={iconChecker(index)}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: active == index ? null : colors.disable,
                    }}
                    resizeMode="contain"
                  />
                  <AppText
                    style={{
                      fontFamily: "IBMPlexSans-Regular",
                      color: active == index ? colors.cWhite : colors.disable,
                      fontWeight: "500",
                      fontSize: 14,
                      marginTop: 5,
                    }}
                  >
                    {item}
                  </AppText>
                </TouchableOpacity>
              </View>
            );
          }}
        />
        <FlatList
          data={headers}
          ref={itemScrollView}
          keyExtractor={(item) => item}
          horizontal
          pagingEnabled
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          renderItem={({ item, index }) => {
            switch (index) {
              case 0:
                return (
                  <AllTab
                    navigation={navigation}
                    onTradeFav={(id) => toggleFav(id)}
                    onTradeMark={(id) => toggleBookmark(id)}
                    onPress={(index) => onPressHeader(index)}
                    listData={[
                      suppliesList,
                      salesList,
                      bountiesList,
                      auctionList,
                      tradesList,
                    ]}
                  />
                );
              case 1:
                return (
                  <ForTradeTab
                    tradesList={tradesList}
                    navigation={navigation}
                    onTradeFav={(id) => toggleFav(id)}
                    onTradeMark={(id) => toggleBookmark(id)}
                  />
                );
              case 2:
                return (
                  <AuctionTab
                    auctionList={auctionList}
                    navigation={navigation}
                  />
                );
              case 3:
                return (
                  <BountiesTab
                    bountiesList={bountiesList}
                    navigation={navigation}
                  />
                );
              case 4:
                return (
                  <SalesTab salesList={salesList} navigation={navigation} />
                );
              case 5:
                return (
                  <SuppliesTab
                    suppliesList={suppliesList}
                    navigation={navigation}
                  />
                );
              default:
                return (
                  <View key={item} style={styles.mainItem}>
                    <Text>Animation happens once scrolling ended</Text>
                    <Text>card {index + 1}</Text>
                  </View>
                );
            }
          }}
        />
      </View>
    </View>
  );
};
