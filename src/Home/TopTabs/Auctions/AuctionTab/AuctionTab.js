import React, { useContext } from "react";
import { StyleSheet, View, FlatList } from "react-native";

import Btn from "../../../../../components/Btn";
import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";
import BidCard from "../../../../../components/BidCard";
import { EmptyList } from "../../../../../components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useDispatch, useSelector } from "react-redux";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import Helper from "../../../../Helper";
import allActions from "../../../../../redux/actions";

import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";

export const AuctionTab = (props) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const {
    type,
    edit,
    hideBtn,
    isWinner,
    dataList,
    listFooter,
    navigation,
    onEndReached,
  } = props;
  const auctionCrud = currentUser?.user_permissions?.includes("auctions.crud");

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const renderItem = ({ item, index }) => {
    const isEnd = index === dataList.length - 1;
    const new_item = Helper.deepCopy(item);
    if (edit !== undefined) {
      new_item.edit_able = false;
    } else {
      new_item.edit_able = true;
    }
    return (
      <View
        style={{
          marginRight: wp(3),
          marginTop: hp(0.5),
          marginBottom: isEnd ? hp(3) : hp(1),
        }}
      >
        <BidCard
          Item={item}
          type={type}
          isWinner={isWinner}
          onPress={() => {
            dispatch(allActions.DetailAction.AuctionDetail(new_item));
            navigation.navigate("AuctionDetail");
          }}
        />
      </View>
    );
  };
  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      {dataList?.length ? (
        <FlatList
          data={dataList}
          style={{ paddingHorizontal: wp(3) }}
          renderItem={renderItem}
          numColumns={2}
          onEndReachedThreshold={0.5}
          ListFooterComponent={listFooter}
          onEndReached={onEndReached}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.mainItem}>
          {auctionCrud ? (
            <>
              <AppText style={[styles.itemText, { color: theme?.darkGrey }]}>
                {language?.you_have_no_Item_listed}
              </AppText>
              {!hideBtn && (
                <Btn
                  label="Add Auction"
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
                    currentUser?.store
                      ? navigation.navigate("AuctionStamps")
                      : Helper.showToastMessage(
                          "Please create your store first.",
                          colors.blueTheme
                        )
                  }
                />
              )}
            </>
          ) : (
            <EmptyList description="Please update your plan for viewing items." />
          )}
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
  mainItem: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightText,
  },
});
