import React, { useState, useEffect, useContext } from "react";
import { View, TouchableOpacity } from "react-native";

import { styles } from "./styles";
import Image from "react-native-fast-image";

import Helper from "../Helper";
import Env from "../../api/Env";
import MindAxios from "../../api/MindAxios";
import allActions from "../../redux/actions";

import Flip from "../../components/Flip/Flip";
import FeedsShortcuts from "./FeedsShortcuts";
import AuthContext from "../Context/AuthContext";
import PostAnimated from "../../components/PostAnimated";

import { useSelector, useDispatch } from "react-redux";

import { Feeds } from "./Feeds";
import TopView from "./TopView";
import { AppHeader, SimpleHeader } from "../../components";
import AppText from "../../components/AppText";
import { images } from "../../assets/images/Images";
import EmptyState from "../../components/EmptyState";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import {
  getFcmToken,
  requestUserPermission,
} from "../utils/notificationService";

import { ShareModal } from "./ShareModal";
import ThemeContext from "../Context/ThemeContext";
import SupportAxios from "../../support_apis/SupportAxios";
import supportEnv from "../../support_apis/supportEnv";
import { SearchFeeds } from "./SearchFeeds";

// For Step by Step Walkthrough

export const SearchResults = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const rdxFeeds = useSelector((state) => state.DataReducer.searchFeeds);
  const userFcm = useSelector((state) => state.ApiReducer.fcm_res);
  const rdxNext = useSelector((state) => state.ApiReducer.next_pg);
  const loading = useSelector((state) => state.ApiReducer.feedLoad);
  const [endloading, setEndLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [itemType, setItemType] = useState(null);
  const [flip, setFlip] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [storeLocal, setLocal] = useState(null);
  const [itemOption, setOptions] = useState(null);
  const [filter, setFilter] = useState(null);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const cartProducts = useSelector((state) => state.DataReducer.cart);
  const { theme } = useContext(ThemeContext);
  //   const [rdxFeeds, setFeeds] = useState(null);
  //   useEffect(() => {
  //     (async () => {
  //       await getFeeds();
  //     })();
  //   }, []);

  const { signOut, myState } = useContext(AuthContext);
  const { language } = myState;
  // console.log("lang", language);

  const logOut = async () => {
    await MindAxios.post(Env.createUrl("logout"));
    signOut();
    Helper.showToastMessage("Logged out");
  };

  const getFeeds = async (load) => {
    // console.log("token");
    const response = await MindAxios.get(
      Env.createUrl("search/all?searchable_type=Trade&page_size=20")
    );
    console.log("res", response);
    const { e } = response;
    const error = e?.response?.data;
    if (response?.status == 200) {
      let paginated = response?.data?.result?.data;
      console.log("res", paginated);
      setFeeds(paginated);
    }
    // if (load) {
    //   if (filter) {
    //     await dispatch(allActions.ApiAction.getFeeds(null, logOut, filter));
    //   } else {
    //     await dispatch(allActions.ApiAction.getFeeds(null, logOut));
    //   }
    // } else {
    //   dispatch(allActions.ApiAction.setFeedLoad(true));
    //   await dispatch(allActions.ApiAction.getFeeds(null, logOut));
    //   dispatch(allActions.ApiAction.setFeedLoad(false));
    // }
  };

  const fetchMoreData = async () => {
    // console.log("filter", filter);
    if (rdxNext !== null) {
      setEndLoading(true);
      const response = await MindAxios.get(rdxNext);
      setEndLoading(false);
      // console.log("res-->", response);
      if (response?.status == 200) {
        let next_page;
        let paginated = response?.data?.result?.paginated_items;
        // console.log("data--->", data);
        if (filter) {
          next_page = paginated?.next_page_url;
          let currentPg = paginated?.current_page;
          let lastPg = paginated?.last_page;

          if (next_page) {
            next_page = next_page + "&type=" + filter;
          }
        } else {
          next_page = paginated?.next_page_url;
        }
        dispatch(allActions.ApiAction.setNextPg(next_page));
        await dispatch(
          allActions.ApiAction.getFeeds(
            [...rdxFeeds, ...paginated?.data],
            logOut
          )
        );
      }
    }
  };

  async function onRefresh() {
    setIsFetching(true);
    await getFeeds(true);
    setTimeout(() => {
      setIsFetching(false);
    }, 1000);
  }

  const feedBody = () => {
    if (!loading) {
      if (rdxFeeds?.length > 0) {
        return (
          <SearchFeeds
            navigation={navigation}
            feeds={rdxFeeds}
            endLoading={endloading}
            fetchMoreData={fetchMoreData}
            isFetching={isFetching}
            onRefresh={onRefresh}
            opt={{
              itemOption,
              setOptions,
              getFeeds,
              onUpdate: (data) => navigation.navigate("UpdatePost", { data }),
              loader: (val) =>
                dispatch(allActions.DataAction.ActivityModal(val)),
              updateFeeds: (val) =>
                dispatch(allActions.ApiAction.getFeeds(val)),
              feeds: rdxFeeds,
              modalVisible: shareModalVisible,
              setShareModalVisible,
              setSelected,
              setItemType,
            }}
          />
        );
      } else if (rdxFeeds?.length == 0) {
        return (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <AppText style={{ fontSize: 18, fontWeight: "500" }}>
              Search Results (0)
            </AppText>
          </View>
        );
      } else if (rdxFeeds?.length == undefined) {
        return (
          <EmptyState
            onPress={getFeeds}
            desc="We could not find the request you are looking for!"
          />
        );
      }
    } else {
      return <PostAnimated theme={theme} />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.white }}>
      <SimpleHeader
        title="Search Results"
        onPressBack={() => navigation.goBack()}
      />

      {feedBody()}
    </View>
  );
};
