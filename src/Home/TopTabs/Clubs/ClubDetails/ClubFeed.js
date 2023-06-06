import React from "react";
import { FlatList, View, ActivityIndicator, StyleSheet } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import colors from "../../../../../constant/colors";
import { ClubFeedCard } from "../../../../../components";

export const ClubFeed = ({
  opt,
  feeds,
  onRefresh,
  isFetching,
  listHeader,
  endLoading,
  navigation,
  fetchMoreData,
}) => {
  const renderFooter = () => {
    return (
      <View style={styles.loader}>
        {endLoading && <ActivityIndicator size="large" color={colors.theme} />}
      </View>
    );
  };

  const renderClubFeeds = ({ item, index }) => {
    // console.log("index", index);
    let user_name =
      item?.club_feed_type !== "FlagTicket"
        ? item?.club_feed?.user?.full_name
        : item?.club_feed?.flaggable?.user?.full_name;
    opt.index = index;
    return (
      <View style={{ marginBottom: hp(1) }}>
        <ClubFeedCard
          opt={opt}
          item={item}
          userName={user_name}
          navigation={navigation}
          feedItem={item?.club_feed}
          feedType={item?.club_feed_type}
        />
      </View>
    );
  };

  return (
    <FlatList
      data={feeds}
      refreshing={isFetching}
      style={styles.listStyle}
      onEndReachedThreshold={0.5}
      renderItem={renderClubFeeds}
      onEndReached={fetchMoreData}
      onRefresh={() => onRefresh()}
      ListHeaderComponent={listHeader}
      ListFooterComponent={renderFooter}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    height: hp(6.2),
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  listStyle: {
    // backgroundColor: colors.cWhite,
    paddingTop: hp(1.2),
  },
});
