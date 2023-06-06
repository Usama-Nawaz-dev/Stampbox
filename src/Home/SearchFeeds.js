import React, { useState, useEffect, useContext } from "react";
import { FlatList, Text, View, ActivityIndicator } from "react-native";
import PostCard from "../../components/PostCard";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../constant/colors";
import Helper from "../Helper";
import ThemeContext from "../Context/ThemeContext";
import SearchPost from "../../components/SearchPost";
// import { dark as theme } from "../../constant/colorsConfig";

export const SearchFeeds = ({
  navigation,
  feeds,
  endLoading,
  fetchMoreData,
  isFetching,
  onRefresh,
  opt,
}) => {
  const { theme, mood } = useContext(ThemeContext);
  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <View
        style={{
          height: 60,
          width: "100%",
          // backgroundColor: "orange",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {endLoading && <ActivityIndicator size="large" color={theme?.theme} />}
      </View>
    );
  };

  const renderPosts = ({ item, index }) => {
    // console.log("index", index);
    let user_name =
      item?.title !== "FlagTicket"
        ? item?.searchable?.user?.full_name
        : item?.searchable?.flaggable?.user?.full_name;
    opt.index = index;
    return (
      <>
        {/* {item?.feedable_type !== "FlagTicket" ? ( */}
        <View style={{ marginBottom: 10 }}>
          <SearchPost
            item={item}
            userName={user_name}
            navigation={navigation}
            opt={opt}
          />
        </View>
        {/* ) : null} */}
      </>
    );
  };

  return (
    <FlatList
      data={feeds}
      style={{
        backgroundColor: theme?.white,
        width: "93%",
        alignSelf: "center",
      }}
      keyExtractor={(item, index) => index.toString()}
      // keyExtractor={()=> Helper.keyGenerator()}
      showsVerticalScrollIndicator={false}
      renderItem={renderPosts}
      //   ListFooterComponent={renderFooter}
      //   onEndReachedThreshold={0.2}
      //   onEndReached={fetchMoreData}
      //   onRefresh={() => onRefresh()}
      //   refreshing={isFetching}
    />
  );
};
