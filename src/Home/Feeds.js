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
// import { dark as theme } from "../../constant/colorsConfig";

export const Feeds = ({
  navigation,
  feeds,
  endLoading,
  fetchMoreData,
  isFetching,
  onRefresh,
  opt,
}) => {
  const { theme , mood } = useContext(ThemeContext);
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
      item?.feedable_type !== "FlagTicket"
        ? item?.feedable?.user?.full_name
        : item?.feedable?.flaggable?.user?.full_name;
    opt.index = index;
    return (
      <>
        {/* {item?.feedable_type !== "FlagTicket" ? ( */}
        <View style={{ marginBottom: 10,  }}>
          <PostCard
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
      style={{ backgroundColor: theme?.white, paddingTop: 10 }}
      keyExtractor={(item, index) => index.toString()}
      // keyExtractor={()=> Helper.keyGenerator()}
      showsVerticalScrollIndicator={false}
      renderItem={renderPosts}
      ListFooterComponent={renderFooter}
      onEndReachedThreshold={0.2}
      onEndReached={fetchMoreData}
      onRefresh={() => onRefresh()}
      refreshing={isFetching}
    />
  );
};
