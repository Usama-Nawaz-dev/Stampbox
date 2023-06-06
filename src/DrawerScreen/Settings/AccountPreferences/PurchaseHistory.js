import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import FastImage from "react-native-fast-image";
import { MainHeader } from "../../../../components";
import ThemeContext from "../../../Context/ThemeContext";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";
import { useDispatch, useSelector } from "react-redux";
import allActions from "../../../../redux/actions";
import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";
import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
// import { dark as theme } from "../../../../constant/colorsConfig";

export function PurchaseHistory(props) {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const focused = useIsFocused();

  const [historyData, setHistoryData] = useState(null);

  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (focused) {
      getPurchaseHistory();
    }
  }, [focused]);

  const getPurchaseHistory = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl(`transactions?user_id=${currentUser?.id}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));

    if (response.status === 200) {
      let _data = response?.data?.result?.paginated_items?.data;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      // console.log("purchase history", response?.data?.result?.paginated_items);
      setHistoryData(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert("Server Error");
    }
  };

  const getNextApiUrl = async () => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${currentUser?.id}`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setHistoryData([...historyData, ..._data]);
        setNextApiUrl(nextPageUrl);
      } else {
        setNextApiUrl(null);
        setIsLoading(false);
        alert("Sever Error..");
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
          style={{ marginBottom: 15, marginTop: 10 }}
        />
      </View>
    ) : null;
  };

  const PurchaseHistoryCard = (props) => {
    return (
      <View style={styles.cardContainer}>
        <View style={[styles.cardView, { backgroundColor: theme?.cardColor }]}>
          <View style={styles.cardInnerView}>
            <View style={styles.iconView}>
              <FastImage
                source={require("../../../../assets/icons/purchase-history.png")}
                style={styles.image}
                tintColor="#fff"
              />
            </View>
            <AppText style={styles.cardText}>{props.title}</AppText>
          </View>
          <AppText style={{ fontSize: 16 }}>${props?.amount}</AppText>
        </View>
        <AppText
          style={{ alignSelf: "flex-end", marginRight: 12, marginTop: 7 }}
        >
          {props.time}
        </AppText>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <PurchaseHistoryCard
        title={item?.transactionable_type}
        amount={item?.amount}
        time={moment(item?.created_at).format("YYYY-MM-DD [at] h:mm A")}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title="Purchase History"
        onPressBack={() => props.navigation.goBack()}
      />

      <FlatList
        data={historyData}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.5}
        onEndReached={getNextApiUrl}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  cardContainer: {
    // height: 100,
    width: wp(100),
    alignItems: "center",
  },
  cardView: {
    height: hp(7.2),
    width: wp(95),
    backgroundColor: "#fff",
    marginTop: 10,
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.34,
    shadowRadius: 1.41,
  },
  iconView: {
    height: 45,
    width: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: colors.darkTheme,
  },
  cardText: {
    fontSize: 16,
    // fontWeight: '500',
    marginLeft: 15,
  },
  cardInnerView: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    height: 30,
    width: 30,
  },
});
