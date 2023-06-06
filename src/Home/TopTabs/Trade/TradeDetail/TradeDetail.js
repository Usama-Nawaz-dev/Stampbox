import React, { useState, useRef, useEffect, useContext } from "react";
import { Image, View, ScrollView, TouchableOpacity } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { styles } from "./styles";
import Btn from "../../../../../components/Btn";
import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";

import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";

import Info from "../../../../../components/Info";
import { UserInfoSheet } from "../../../../Sheets";
import { BottomSheet } from "../../../../../components";
import { images } from "../../../../../assets/images/Images";
// import { light as theme } from "../../../../../constant/colorsConfig";

import { StackActions } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import AuthContext from "../../../../Context/AuthContext";

import { RelatedTab, ProposalTab, ReviewsTab, MyProposal } from "../DetailTabs";
import { createMaterialTopTabNavigator } from "../../../../../CustomPackages/material-top-tabs";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";

const Tab = createMaterialTopTabNavigator();

import {
  TimeLeft,
  MenuSheet,
  ImageZoomViewer,
  MainHeader,
  ImageListSlider,
} from "../../../../../components";
import ThemeContext from "../../../../Context/ThemeContext";
// import { dark as theme } from "../../../../../constant/colorsConfig";

// For Step by Step Walkthrough
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";

const TradeDetail = (props) => {
  const propsData = props.route.params;

  const sliderComp = useRef();
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const userInfoSheetRef = useRef();
  const popAction = StackActions.pop();

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  // console.log("lang.....?", language);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const tradeData = useSelector((state) => state.DetailReducer.tradeDetail);

  const { openPermissionSheet } = useContext(AuthContext);
  const canSendProposal = currentUser?.user_permissions?.includes(
    "marketplace.trading.sending_proposal"
  );

  const accepting_offer = tradeData?.feedable?.accepting_offer
    ? tradeData?.feedable?.accepting_offer
    : tradeData?.accepting_offer;

  const offer_amount = tradeData?.feedable?.offer_amount
    ? tradeData?.feedable?.offer_amount
    : tradeData?.offer_amount;

  const trade_offers_count = tradeData?.feedable?.trade_offers_count
    ? tradeData?.feedable?.trade_offers_count
    : tradeData?.trade_offers_count;

  let data = tradeData?.tradeables?.length
    ? tradeData?.tradeables[0]?.tradeable
    : null;
  let userDetail = tradeData?.user;

  let screen = data?.name;
  let uri = data?.medias?.length ? data?.medias : [];
  let uuid = tradeData?.uuid;
  let country = data?.country;
  let condition = data?.condition;
  let format = data?.format;
  let desc = data?.description;
  let denomination = data?.denomination;
  let type = data?.catalogue_number?.length
    ? data?.catalogue_number[0]?.type
    : null;
  let cataType1 = data?.catalogue_number?.length
    ? data?.catalogue_number[0]?.type
    : null;
  let cataVal1 = data?.catalogue_number?.length
    ? data?.catalogue_number[0]?.number
    : null;
  let yearIssued = data?.year_issued;
  let color = data?.color;
  let grade = data?.grade;
  let perforation = data?.perforation;
  let offers = tradeData?.feedable?.trade_offers_count;
  const owner = currentUser?.id === userDetail?.id;

  //Toggle States
  const [isFav, setIsFav] = useState(tradeData?.is_wishable ? true : false);
  const [isMarked, setIsMarked] = useState(
    tradeData?.is_book_marked ? true : false
  );

  // Image Viewer States
  const [imageViewer, setImageViewer] = useState(false);
  const [imageViewerData, setImageViewerData] = useState([]);
  const [imageViewerInitialIndex, setImageViewerInitialIndex] = useState(0);

  useEffect(() => {
    if (focused) {
      getUser();
      if (sliderComp?.current) {
        sliderComp?.current?.refresh(data?.medias);
      }
      let tempArray = [];
      data?.medias?.map((x, index) => {
        tempArray.push({ url: x.media_url });
      });
      setImageViewerData([...tempArray]);
    }
  }, [focused]);

  useEffect(() => {
    if (owner) {
      showTradenGuide();
    }
  }, []);

  const showTradenGuide = async () => {
    let tradeGuide = await Helper.getData("tradeDetailGuide");
    if (!tradeGuide) {
      props.start();
      await Helper.storeData("tradeDetailGuide", "false");
    }
  };

  //Making a WalkthroughableTouchableOpacity
  const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

  const getUser = async () => {
    const response = await MindAxios.get(Env.paramUrl("users", userDetail?.id));
    // console.log('user res--->', response?.data?.result?.user);
    if (response?.status == 200) {
      const data = response?.data?.result?.user;
      dispatch(allActions.DetailAction.OtherUser(data));
    }
  };

  const toggleFav = async () => {
    let body = {
      wishable_type: "Trade",
      wishable_id: tradeData?.id,
    };
    const response = await MindAxios.post(Env.createUrl("wishlists"), body);
    if (response?.status == 200) {
      if (isFav) {
        setIsFav(false);
        Helper.showToastMessage("Trade removed from wishlist.", colors.green);
      } else {
        setIsFav(true);
        Helper.showToastMessage("Trade added to wishlist.", colors.green);
      }
    } else {
      alert(language?.serverError);
    }
  };

  const toggleBookmark = async () => {
    let body = {
      book_markable_type: "Trade",
      book_markable_id: tradeData?.id,
    };
    const response = await MindAxios.post(Env.createUrl("bookmarks"), body);
    if (response?.status == 200) {
      if (isMarked) {
        setIsMarked(false);
        Helper.showToastMessage("Trade book mark removed.", colors.green);
      } else {
        setIsMarked(true);
        Helper.showToastMessage("Trade book mark added.", colors.green);
      }
    } else {
      alert(language?.serverError);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <CopilotStep
        text="You can edit trade by clicking here."
        order={1}
        name="firstUniqueKey"
      >
        <WalkthroughableTouchableOpacity style={styles.guideIcon} />
      </CopilotStep>
      <MainHeader
        title={language?.tradeDetails}
        rightIcon={
          owner && (
            <TouchableOpacity
              style={styles.edit}
              onPress={() =>
                props.navigation.navigate("EditTrade", { Item: tradeData })
              }
            >
              <AntDesign name="edit" color={colors.cWhite} size={22} />
            </TouchableOpacity>
          )
        }
        onPressBack={() => {
          props.navigation.goBack();
          dispatch(allActions.DetailAction.TradeDetail(null));
        }}
      />
      <ScrollView
        stickyHeaderIndices={[5]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mediaSection}>
          <ImageListSlider
            ref={sliderComp}
            data={data?.medias}
            timer={2000}
            imageKey={"media_url"}
            width={wp(100)}
            height={hp(26)}
            local={false}
            separator={0}
            loop={false}
            autoscroll={false}
            indicator
            animation
            onPress={(i, data) => {
              setImageViewerInitialIndex(i);
              setImageViewer(true);
            }}
            // currentIndexCallback={index => console.log('Index', index+1)}
          />
        </View>
        <View style={styles.offerSection}>
          <View style={{ width: wp(35) }}>
            <AppText style={styles.offerText}>{language?.tradeId}:</AppText>
            <AppText style={styles.offerText}>
              {language?.acceptingOffers}:
            </AppText>
            {accepting_offer !== "stamps" && (
              <AppText style={styles.offerText}>
                {language?.acceptingCoins}:
              </AppText>
            )}
            <AppText style={styles.offerText}>{language?.totalOffer}:</AppText>
          </View>
          <View>
            <AppText style={styles.offerText1}>{uuid}</AppText>
            <AppText style={styles.offerText1}>{accepting_offer}</AppText>
            {accepting_offer !== "stamps" && (
              <AppText style={styles.offerText1}>{offer_amount}</AppText>
            )}
            <AppText style={styles.offerText1}>{trade_offers_count}</AppText>
          </View>
        </View>
        <TimeLeft label="Expiry Time" item={tradeData} noBid />
        <AppText style={styles.heading}>{language?.itemDetails}</AppText>
        <View style={{ width: "100%", flexDirection: "row" }}>
          <View style={{ width: "50%", flexDirection: "row" }}>
            <View style={{ width: wp(3) }} />
            <View>
              <Info key1={language?.country} val1={country} />
              <Info key1={cataType1} val1={cataVal1} />
              {/* <Info key1={"Y&T"} val1={"ABCD"} /> */}
              <Info key1={language?.perforation} val1={perforation} />
              <Info key1={language?.condition} val1={condition} />
              <Info key1={language?.Format} val1={format} />
              <Info key1={language?.totalOffer} val1={offers} />
              <Info key1={language?.description} val1={desc} />
            </View>
          </View>
          <View style={{ width: "50%" }}>
            <Info key1={language?.year} val1={yearIssued} />
            <Info key1={"MI"} val1={type} />
            <Info key1={language?.denomination} val1={denomination} />
            <Info key1={language?.color} val1={color} />
            <Info key1={language?.grade} val1={grade} />
            <Info key1={language?.est_SC_Value} val1={null} />
          </View>
        </View>

        <View style={styles.userSection}>
          <View style={styles.cardHeader}>
            <TouchableOpacity
              style={styles.upperSection}
              onPress={() => {
                Helper.fbEvent("open_profile_from_trade_detail");
                props.navigation.navigate("OtherUser", { user: userDetail });
              }}
            >
              <Image
                style={styles.userImg}
                source={{ uri: userDetail?.image_url }}
              />
              <View style={styles.nameSection}>
                <AppText style={{ fontWeight: "500" }}>
                  {userDetail?.full_name}
                </AppText>
                <AppText style={styles.ownerText}>{language?.owner}</AppText>
              </View>
            </TouchableOpacity>
            <Btn
              label={language?.myDetails}
              fontSize={10}
              height={hp(3.2)}
              width={wp(25)}
              iconLeft={
                <Ionicons name="eye-outline" color={"#fff"} size={hp(2)} />
              }
              onPress={() => userInfoSheetRef.current.open()}
            />
          </View>
          <View style={[styles.cardHeader, { marginTop: hp(1.5) }]}>
            <View style={styles.upperSection}>
              {!owner && (
                <Btn
                  label="Trade"
                  fontSize={10}
                  height={hp(3.3)}
                  width={wp(25)}
                  iconLeft={
                    <AntDesign name="swap" color={"#fff"} size={hp(2)} />
                  }
                  onPress={() =>
                    canSendProposal
                      ? props.navigation.navigate("ChooseProposal", {
                          ItemDetail: tradeData,
                        })
                      : openPermissionSheet()
                  }
                />
              )}
              <Btn
                label={language?.myMarket}
                fontSize={10}
                height={hp(3.2)}
                width={wp(25)}
                style={{ marginLeft: hp(1) }}
                iconLeft={
                  <Ionicons name="eye-outline" color={"#fff"} size={hp(2)} />
                }
                onPress={() => props.navigation.navigate("UserMarket")}
              />
            </View>
            <View style={styles.upperSection}>
              {!owner && (
                <Btn
                  height={hp(4.5)}
                  width={hp(4.5)}
                  onPress={toggleFav}
                  style={{ backgroundColor: "transparent" }}
                  iconLeft={
                    <Image
                      resizeMode="contain"
                      source={isFav ? images.Heart1 : images.Heart}
                      style={[
                        styles.toggleIcons,
                        { marginRight: wp(2), tintColor: theme?.lightText },
                      ]}
                    />
                  }
                />
              )}

              {!owner && (
                <Btn
                  height={hp(4.5)}
                  width={hp(4.5)}
                  onPress={toggleBookmark}
                  style={{ backgroundColor: "transparent" }}
                  iconLeft={
                    <Image
                      resizeMode="contain"
                      style={[
                        styles.toggleIcons,
                        { tintColor: theme?.lightText },
                      ]}
                      source={isMarked ? images.Bookmark1 : images.Bookmark}
                    />
                  }
                />
              )}
            </View>
          </View>
        </View>
        <CopilotStep
          text="Scroll up to see trade detail tabs."
          order={2}
          name="secondUniqueKey"
        >
          <WalkthroughableTouchableOpacity />
        </CopilotStep>
        <View style={{ minHeight: hp(72) }}>
          <Tab.Navigator
            initialRouteName="Related"
            tabBarOptions={{
              activeTintColor: theme?.theme,
              inactiveTintColor: theme?.lightText,
              labelStyle: styles.labelStyle,
            }}
            screenOptions={{
              //use this config
              tabBarIndicatorStyle: { backgroundColor: theme?.theme },
              tabBarStyle: { backgroundColor: theme?.white },
            }}
          >
            <Tab.Screen
              name="Related"
              component={RelatedTab}
              options={{ tabBarLabel: language?.topRelatedItems }}
            />
            {owner ? (
              <Tab.Screen
                name="Proposal"
                component={ProposalTab}
                options={{ tabBarLabel: language?.tradeProposal }}
              />
            ) : (
              <Tab.Screen
                name="MyProposal"
                component={MyProposal}
                options={{ tabBarLabel: "My Sent Proposal" }}
              />
            )}
            <Tab.Screen
              name="Reviews"
              component={ReviewsTab}
              options={{ tabBarLabel: language?.reviews }}
            />
          </Tab.Navigator>
        </View>
      </ScrollView>
      {/* Image Zoom Modal */}
      <ImageZoomViewer
        onPressClose={() => {
          setImageViewer(false);
        }}
        visible={imageViewer}
        images={imageViewerData}
        index={imageViewerInitialIndex}
      />

      {/* User Info Sheet */}
      <BottomSheet
        ref={userInfoSheetRef}
        title={language?.userDetails}
        onPressClose={() => userInfoSheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={hp(95)}
        ChildComponent={
          <UserInfoSheet
            currentUser={userDetail}
            onSelectPhone={() => {
              userInfoSheetRef?.current?.close();
              setTimeout(() => {}, 300);
            }}
            onSelectStampbox={() => {
              userInfoSheetRef?.current?.close();
              setTimeout(() => {}, 300);
            }}
            onPressCancel={() => {
              setTimeout(() => {
                userInfoSheetRef?.current?.close();
              }, 300);
            }}
          />
        }
      />
    </View>
  );
};

export default copilot({
  animated: true, // Can be true or false
  overlay: "svg", // Can be either view or svg
})(TradeDetail);
