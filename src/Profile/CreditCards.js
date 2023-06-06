import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Image from "react-native-fast-image";

import Helper from "../Helper";
import Env from "../../api/Env";
import MindAxios from "../../api/MindAxios";
import allActions from "../../redux/actions";

import colors from "../../constant/colors";
import { EmptyList } from "../../components";
import { HistoryCard } from "../../components";
import AppText from "../../components/AppText";
import ThemeContext from "../Context/ThemeContext";
import { CardsCarousel } from "../../CardsCarousel";
import { images } from "../../assets/images/Images";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const CreditCards = ({ navigation }) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const user = useSelector((state) => state.ApiReducer.user);

  const [cards, setCards] = useState(null);
  const [defaultCard, setDefaultCard] = useState(null);

  const [loading, setLoading] = useState(false);
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [histroyList, setHistoryList] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      if (focused) {
        fetchHistroy();
        dispatch(allActions.DataAction.AppLoader(true));
        await fetchCard("All");
        await fetchCard("Default");
        dispatch(allActions.DataAction.AppLoader(false));
      }
    })();
  }, [focused]);

  const fetchCard = async (type) => {
    const response = await MindAxios.get(
      Env.createUrl(`payment/methods?payment_method_type=${type}`)
    );
    if (response?.status == 200) {
      const data = response?.data?.result?.payments;
      //   console.log("response", data);
      if (type == "All") {
        setCards(data);
      } else {
        setDefaultCard(data);
      }
    }
  };

  const fetchHistroy = async () => {
    const paramUrl = `payment/wallet-payment-logs?user_id=${user?.id}`;
    const response = await MindAxios.get(Env.createUrl(paramUrl));
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      setHistoryList(_data);
      setNextApiUrl(nextPageUrl);
    }
  };

  const loadMoreHistory = async () => {
    if (nextApiUrl !== null && histroyList?.length >= 10) {
      setLoading(true);
      const response = await MindAxios.get(nextApiUrl + `&user_id=${user?.id}`);
      setLoading(false);
      if (response.status === 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setHistoryList([...histroyList, ..._data]);
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
    return loading ? (
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

  const renderItem = ({ item, index }) => {
    let isEnd = index == histroyList.length - 1 ? hp(5) : null;
    let createdAt = moment(item?.created_at).format("YYYY-MM-DD [at] h:mmA");
    return (
      <HistoryCard
        labels={{
          title: item?.type,
          lower: item?.description,
          val: item?.amount,
          sign: item?.type == "credit" ? "+" : "^",
          time: createdAt,
        }}
        icon={
          <Image
            source={images.Trade}
            tintColor={"#fff"}
            style={{
              height: hp(2.5),
              width: hp(2.5),
            }}
          />
        }
        style={{ marginBottom: isEnd }}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <Text style={[styles.title, { color: theme?.black }]}>
        Your Payment Methods
      </Text>
      {cards?.length ? (
        <CardsCarousel
          cards={cards}
          defaultCard={defaultCard}
          refresh={fetchCard}
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            bottom: 50,
          }}
        >
          <Text style={{ color: theme?.black }}>No Payment Methods Found</Text>
        </View>
      )}
      <AppText style={styles.creditText}>Card Details</AppText>
      {histroyList?.length ? (
        <FlatList
          data={histroyList}
          renderItem={renderItem}
          onEndReached={loadMoreHistory}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.itemView}>
          <EmptyList description={"No Transaction Found."} />
        </View>
      )}

      <Pressable
        onPress={() => {
          navigation.navigate("BuyPlan");
        }}
        style={styles.addBtn}
      >
        <Ionicons name="ios-add-outline" size={31} color="#fff" />
      </Pressable>
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
        style={[styles.addBtn, { left: 20 }]}
      >
        <Ionicons name="ios-chevron-back" size={31} color="#fff" />
      </Pressable>
    </View>
  );
};

export { CreditCards };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "orange",
  },
  title: { fontSize: 21, fontWeight: "500", margin: 20 },
  addBtn: {
    height: 60,
    width: 60,
    backgroundColor: colors.lightTheme,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 20,
    bottom: 40,
  },
  card: {
    height: 200,
    width: "95%",
    borderRadius: 20,
    backgroundColor: "#fff",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  creditText: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: wp(3),
  },
  itemView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
