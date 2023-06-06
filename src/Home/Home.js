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
import { AppHeader } from "../../components";
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

// For Step by Step Walkthrough
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";

const Home = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const rdxFeeds = useSelector((state) => state.ApiReducer.homeFeeds);
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

  useEffect(() => {
    (async () => {
      // getFcmToken();
      if (!userFcm) {
        dispatch(allActions.ApiAction.setUserFcm());
      }
      await requestUserPermission();
      await dispatch(allActions.ApiAction.getUserApi());
      await getStoreInfo();
      await getFeeds();
      let cart = await Helper.getObj("cart");
      if (cart?.length > 0) {
        dispatch(allActions.DataAction.cart_products(cart));
      }
    })();
  }, []);

  const { signOut, myState } = useContext(AuthContext);
  const { language } = myState;
  // console.log("lang", language);

  useEffect(() => {
    showHomeGuide();
  }, []);

  const showHomeGuide = async () => {
    let homeGuide = await Helper.getData("showHGuide");
    if (!homeGuide) {
      props.start();
      await Helper.storeData("showHGuide", "false");
    }
  };

  //Making a WalkthroughableTouchableOpacity
  const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

  const logOut = async () => {
    await MindAxios.post(Env.createUrl("logout"));
    signOut();
    Helper.showToastMessage("Logged out");
  };

  const getFeeds = async (load) => {
    // console.log("token");
    if (load) {
      if (filter) {
        await dispatch(allActions.ApiAction.getFeeds(null, logOut, filter));
      } else {
        await dispatch(allActions.ApiAction.getFeeds(null, logOut));
      }
    } else {
      dispatch(allActions.ApiAction.setFeedLoad(true));
      await dispatch(allActions.ApiAction.getFeeds(null, logOut));
      dispatch(allActions.ApiAction.setFeedLoad(false));
    }
  };

  const getStoreInfo = async () => {
    const localStore = await Helper.getData("local");
    // console.log('localStore', localStore)
    if (!localStore) {
      const userId = await Helper.getData("userId");
      // console.log('id--->', userId)
      if (userId) {
        const response = await MindAxios.get(Env.paramUrl("users", userId));
        // console.log("user res--->", response);
        if (response?.status == 200) {
          const {
            data: {
              result: { user },
            },
          } = response;
          let { store } = user;
          if (store !== null && store !== undefined) {
            let local = await Helper.storeData("local", "true");
            setLocal(local);
          }
        }
      }
    } else {
      setLocal(localStore);
    }
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
          <Feeds
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
              {`No ${filter ? filter : "Feed"}s Posted Yet!`}
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
      {/* Guide Icons */}
      <CopilotStep
        text="Get more features from thie menu."
        order={1}
        name="firstUniqueKey"
      >
        <WalkthroughableTouchableOpacity style={styles.guide1} />
      </CopilotStep>
      <CopilotStep
        text="You can check available coin here."
        order={2}
        name="secondUniqueKey"
      >
        <WalkthroughableTouchableOpacity style={styles.guide2} />
      </CopilotStep>
      <CopilotStep
        text="You can proceed checkout process from here."
        order={3}
        name="thirdUniqueKey"
      >
        <WalkthroughableTouchableOpacity style={styles.guide3} />
      </CopilotStep>
      <CopilotStep
        text="Control Stampbox main play."
        order={6}
        name="sixthUniqueKey"
      >
        <WalkthroughableTouchableOpacity style={styles.guide4} />
      </CopilotStep>

      <AppHeader
        title={language.home}
        cartLength={cartProducts?.length}
        coins={currentUser?.coins}
        onPressMenu={() => navigation.openDrawer()}
        onPressCart={() => navigation.navigate("MyCart")}
        onPressWallet={() => {
          Helper.fbEvent("open_wallet_from_main_screen");
          navigation.navigate("MainWallet");
        }}
        search={() => navigation.navigate("HomeSearch")}
      />

      <View>
        <Flip
          flip={flip}
          Front={<TopView navigation={navigation} storeInfo={storeLocal} />}
          Back={<FeedsShortcuts setFilter={setFilter} logOut={logOut} />}
        />
      </View>

      <View style={[styles.addPostSection, { backgroundColor: theme?.white }]}>
        <Image
          source={{
            uri: currentUser
              ? currentUser.image_url
              : "https://randomuser.me/api/portraits/men/71.jpg",
          }}
          style={styles.postImg}
        />
        <CopilotStep
          // text="It's easy to access app's shortcuts and feed shortcuts."
          text="Want to create a new post?"
          order={4}
          name="fourthUniqueKey"
        >
          <WalkthroughableTouchableOpacity
            style={styles.postAdd}
            onPress={() => navigation.navigate("SharePost")}
          >
            <AppText style={styles.addPostText}>{language.createAPost}</AppText>
            <Image
              style={{ width: hp(2.5), height: hp(2.5) }}
              source={images.IconImages}
              tintColor={theme?.darkGrey}
              resizeMode="contain"
            />
          </WalkthroughableTouchableOpacity>
        </CopilotStep>
        <CopilotStep
          text="It's easy to access app's shortcuts and feed shortcuts."
          order={5}
          name="fifthUniqueKey"
        >
          <WalkthroughableTouchableOpacity
            onPress={() => setFlip(!flip)}
            style={{
              height: hp(5),
              width: "15%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ width: hp(3), height: hp(3) }}
              source={images.Option}
              tintColor={theme?.darkGrey}
              resizeMode="contain"
            />
          </WalkthroughableTouchableOpacity>
        </CopilotStep>
      </View>
      {feedBody()}
      <ShareModal
        modalVisible={shareModalVisible}
        setShareModalVisible={setShareModalVisible}
        userId={currentUser?.id}
        selected={selected}
        setSelected={setSelected}
        selectedItem={itemType}
      />
    </View>
  );
};

export default copilot({
  animated: true, // Can be true or false
  overlay: "svg", // Can be either view or svg
})(Home);
