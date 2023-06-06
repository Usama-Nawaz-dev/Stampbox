import React, { useState, useEffect , useContext} from "react";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import allActions from "../../../redux/actions";
import MindAxios from "../../../api/MindAxios";
import Env from "../../../api/Env";

import colors from "../../../constant/colors";
import AppText from "../../../components/AppText";
import BidCard from "../../../components/BidCard";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";
// import { dark as theme } from "../../../constant/colorsConfig";

export const SimilarItemTab = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);
    const [auctionList, setAuctionList] = useState(null);
    const {myState:{language}}=useContext(AuthContext);
    const { theme }= useContext(ThemeContext);

  const ItemDetail = useSelector((state) => state.DetailReducer.auctionDetail);
  let _Id = ItemDetail?.feedable ? ItemDetail?.feedable?.id : ItemDetail?.id;

  useEffect(() => {
    if (isFocused) {
      getRelated(_Id);
    }
  }, [isFocused]);

  const getRelated = async (id) => {
    setLoading(true);
    const response = await MindAxios.get(
      Env.createUrl(`get-similar?similarable_type=auction&similarable_id=${id}`)
    );
    setLoading(false);
    // console.log("getRelated....", response);
    if (response?.status == 200) {
      setAuctionList(response?.data?.result);
    } else {
      alert(language?.serverError);
    }
  };

  const renderSimilarItems = ({ item }) => {
    return (
      <View style={{ marginRight: 10, margin: 1, marginBottom: 10 }}>
        <BidCard
          Item={item}
          onPress={() => {
            dispatch(allActions.DetailAction.AuctionDetail(item));
            props.navigation.replace("AuctionDetail");
          }}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      {auctionList?.length ? (
        <FlatList
          numColumns={2}
          data={auctionList}
          style={styles.listStyle}
          keyExtractor={(key) => key.id}
          renderItem={renderSimilarItems}
        />
      ) : (
        <View style={styles.mainItem}>
          {loading ? (
            <ActivityIndicator size="large" color={theme?.theme} />
          ) : (
            <AppText style={[styles.itemText, { color: theme?.theme}]}>
              Auction don't have any similar Item.
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
    height: hp(80),
    paddingTop: hp(1),
    backgroundColor: colors.cWhite,
  },
  listStyle: {
    paddingHorizontal: wp(3),
  },

  //Empty List
  mainItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: colors.cWhite,
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightTheme,
  },
});
