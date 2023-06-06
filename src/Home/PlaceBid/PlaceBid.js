import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Pressable,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { styles } from "./styles";
import Btn from "../../../components/Btn";
import { HtmlTag } from "../../../components";
import AppText from "../../../components/AppText";
import UserCard from "../../../components/UserCard";

import {
  BottomSheet,
  MainHeader,
  FloatingInput,
  GradBtn,
  ImageListSlider,
  ImageZoomViewer,
  TimeLeft,
  CustomButton,
} from "../../../components";

import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

import colors from "../../../constant/colors";
import Fonts from "../../../assets/fonts/Fonts";
import BorderBtn from "../../../components/BorderBtn";

import { createMaterialTopTabNavigator } from "../../../CustomPackages/material-top-tabs";
const Tab = createMaterialTopTabNavigator();

import { BidListingTab } from "./BidListingTab";
import { AuctionReview } from "./AuctionReview";
import { SimilarItemTab } from "./SimilarItemsTab";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

// For Step by Step Walkthrough
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";

const PlaceBid = (props) => {
  const { navigation } = props;

  const sliderComp = useRef();
  const editSheetRef = useRef();
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const { openPermissionSheet } = useContext(AuthContext);
  const canUserBid = currentUser?.user_permissions?.includes(
    "marketplace.auctions.bidding_access"
  );

  const ItemDetail = useSelector((state) => state.DetailReducer.auctionDetail);
  const myAuction = ItemDetail?.feedable ? ItemDetail?.feedable : ItemDetail;
  const owner = currentUser?.id === myAuction?.user?.id;

  const [auctionDetail, setAuctionDetail] = useState(myAuction);

  const [bid, setBid] = useState(null);
  const [err, setError] = useState(null);
  const [bidList, setBidList] = useState(null);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [imageViewer, setImageViewer] = useState(false);
  const [imageViewerData, setImageViewerData] = useState([]);
  const [imageViewerInitialIndex, setImageViewerInitialIndex] = useState(0);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const mediaList = myAuction?.auctionable?.medias?.length
    ? myAuction?.auctionable?.medias
    : [{ media_url: myAuction?.auctionable?.image_url }];

  useEffect(() => {
    if (focused) {
      setBid(null);
      setCurrent(null);
      if (sliderComp?.current) {
        sliderComp?.current?.refresh(mediaList);
      }
      let tempArray = [];
      mediaList?.map((x, index) => {
        tempArray.push({ url: x.media_url });
      });
      setImageViewerData([...tempArray]);
      fetchAuction();
    }
  }, [focused]);

  useEffect(() => {
    if (owner) {
      showAuctionGuide();
    }
  }, []);

  const showAuctionGuide = async () => {
    let auctionGuide = await Helper.getData("auctionDetailGuide");
    if (!auctionGuide) {
      props.start();
      await Helper.storeData("auctionDetailGuide", "false");
    }
  };

  //Making a WalkthroughableTouchableOpacity
  const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

  const bidChecker = (bid) => {
    const lastBid = Number(bid);
    const bids = [lastBid + 1, lastBid + 5, lastBid + 10];
    setBidList(bids);
  };

  const fetchAuction = async () => {
    const response = await MindAxios.get(
      Env.createUrl(`auctions/${myAuction?.id}`)
    );
    if (response?.status === 200) {
      const _data = response?.data?.result?.item;
      const bidValue = _data.last_bid
        ? _data?.last_bid?.max_amount
        : _data?.initial_bid;
      setAuctionDetail(_data);
      bidChecker(bidValue);
    } else {
      alert("Server Error");
    }
  };

  const draftAlert = () =>
    Alert.alert(
      "Delete Auction ?",
      "Are you sure you want to draft the auction ?",
      [{ text: "Cancel" }, { text: "OK", onPress: () => deleteAuction() }]
    );

  const deleteAuction = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.delete(
      Env.createUrl(`auctions/${ItemDetail?.id}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      navigation.goBack();
    } else {
      alert(language?.serverError);
    }
  };

  const handlePublish = async (check) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const body = {
      is_published: check ? 1 : 0,
    };
    const response = await MindAxios.post(
      Env.createUrl(`auctions/${ItemDetail?.id}`),
      body
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      navigation.goBack();
    } else {
      alert(language?.serverError);
    }
  };

  const placeBid = () => {
    canUserBid ? setModalVisible(true) : openPermissionSheet();
  };

  const submitBid = async () => {
    // console.log("bid", bid);'
    if (bid) {
      if (Number(bid) >= Number(bidList[0])) {
        setLoading(true);
        let body = {
          amount: Number(bid),
        };
        const response = await MindAxios.post(
          Env.createUrl(
            `auctions/${
              ItemDetail?.feedable_id ? ItemDetail?.feedable_id : ItemDetail?.id
            }/bids`
          ),
          body
        );
        if (response?.status == 200) {
          setLoading(false);
          setModalVisible(false);
          setBid(null);
          setCurrent(null);
          bidChecker(bid);
          Helper.showToastMessage("Your bid placed successfully!", "green");
        } else {
          setLoading(false);
          Helper.showToastMessage(
            response?.e?.response?.data.message,
            colors.danger
          );
        }
      } else {
        setLoading(false);
        Helper.showToastMessage("Please bid higher than the last bid!", "red");
      }
    } else {
      setError("enter bid");
    }
  };

  const checker = () => {
    const auctionBid = auctionDetail?.last_bid
      ? auctionDetail?.last_bid
      : false;
    const winnerId = auctionBid?.is_winner_notify
      ? auctionBid?.bidder_id
      : false;
    // const isCurrentUserWon = currentUser?.id === winnerId;
    const isCurrentUserWon = currentUser?.id === auctionBid?.bidder_id;

    if (!owner) {
      // This is based on either winner is notified or not
      // if (auctionDetail?.is_order_placed !== 1 && isCurrentUserWon) {
      if (
        isCurrentUserWon &&
        auctionDetail?.is_expired &&
        auctionDetail?.is_order_placed !== 1
      ) {
        return (
          <BorderBtn
            radius={5}
            fontSize={16}
            width={wp(35)}
            height={hp(4)}
            color={colors.borderColor}
            fontColor={colors.btnText}
            label={isCurrentUserWon ? "Pay to collect" : language?.placeOrder}
            fontFamily={Fonts.IBM_Regular}
            onPress={() => {
              const Item = ItemDetail?.feedable
                ? ItemDetail?.feedable
                : ItemDetail;
              navigation.navigate("ShipDetails", { item: Item });
            }}
          />
        );
      } else if (
        !winnerId &&
        !auctionDetail.is_expired &&
        !auctionDetail?.is_order_placed
      ) {
        return (
          <View style={styles.buySection}>
            <GradBtn
              fontSize={12}
              height={hp(3.8)}
              fontWeight={"500"}
              label={language?.placeBids}
              style={styles.button}
              onPress={placeBid}
            />
            {auctionDetail?.can_buy_now ? (
              <CustomButton
                label="Buy Now"
                height={hp(3.8)}
                width={wp(35)}
                fontSize={12}
                fontWeight="500"
                bg={colors.background}
                textColor={colors.btnText}
                fontFamily={Fonts.IBM_Regular}
                onPress={() => {
                  if (canUserBid) {
                    navigation.navigate("ShipDetails", { item: auctionDetail });
                  } else {
                    openPermissionSheet();
                  }
                }}
              />
            ) : null}
          </View>
        );
      }
    }
  };

  const BottomComponent = () => {
    return (
      <View style={styles.bottomSheetView}>
        {/* Edit Auction */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("CreateAuction", { item: ItemDetail });
            editSheetRef?.current?.close();
          }}
        >
          <View style={styles.bottomSheetOptionView}>
            <Feather name="edit" size={hp(3)} color={theme?.black} />
            <AppText style={styles.bottomSheetText}>
              {language?.editThisAuction}
            </AppText>
          </View>
        </TouchableOpacity>
        {/* Delete Auction */}
        <TouchableOpacity
          onPress={() => {
            editSheetRef?.current?.close();
            draftAlert(ItemDetail?.id);
          }}
        >
          <View style={styles.bottomSheetOptionView}>
            <AntDesign name="delete" size={hp(3)} color={theme?.black} />
            <AppText style={styles.bottomSheetText}>
              {language?.deleteThisAuction}
            </AppText>
          </View>
        </TouchableOpacity>
        {/* Handle Puclish Auction */}
        <TouchableOpacity
          onPress={() => {
            {
              ItemDetail?.is_published
                ? handlePublish(false)
                : handlePublish(true);
            }
            editSheetRef?.current?.close();
          }}
        >
          <View style={styles.bottomSheetOptionView}>
            <Ionicons
              name={
                ItemDetail.is_published
                  ? "ios-cloud-offline-outline"
                  : "ios-cloud-upload-sharp"
              }
              size={hp(3)}
              color={theme?.black}
            />
            <AppText style={styles.bottomSheetText}>
              {ItemDetail.is_published
                ? language?.unpublishThisAuction
                : language?.publishThisAuction}
            </AppText>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const OptionBtn = () => {
    if (currentUser?.id == ItemDetail?.user?.id) {
      if (ItemDetail?.is_expired) {
        if (ItemDetail?.bids_count === 0) {
          return (
            <TouchableOpacity onPress={() => editSheetRef?.current?.open()}>
              <View style={styles.optionBtn}>
                <Entypo name="dots-three-vertical" size={20} color="#000" />
              </View>
            </TouchableOpacity>
          );
        } else {
          return null;
        }
      } else {
        return (
          <TouchableOpacity onPress={() => editSheetRef?.current?.open()}>
            <View style={styles.optionBtn}>
              <Entypo name="dots-three-vertical" size={20} color="#000" />
            </View>
          </TouchableOpacity>
        );
      }
    } else {
      return null;
    }
    // return currentUser?.id == ItemDetail?.user?.id &&
    //   !ItemDetail?.is_expired &&
    //   ItemDetail?.bids_count === 0 ? (
    //   <TouchableOpacity onPress={() => editSheetRef?.current?.open()}>
    //     <View style={styles.optionBtn}>
    //       <Entypo name="dots-three-vertical" size={20} color="#000" />
    //     </View>
    //   </TouchableOpacity>
    // ) : null;
  };

  // console.log(auctionDetail);

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <CopilotStep
        text="Check auction options by clicking here."
        order={1}
        name="firstUniqueKey"
      >
        <WalkthroughableTouchableOpacity style={styles.guideIcon} />
      </CopilotStep>
      <MainHeader
        title={language?.auction + " " + language?.detail}
        rightIcon={!auctionDetail?.is_order_placed ? <OptionBtn /> : null}
        onPressBack={() => {
          dispatch(allActions.DetailAction.AuctionDetail({}));
          props.navigation.goBack();
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[3]}
      >
        <View style={{ backgroundColor: colors.background }}>
          <ImageListSlider
            ref={sliderComp}
            data={mediaList}
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
          />
        </View>
        <View style={styles.detailsSection}>
          <AppText style={[styles.uidText, { color: theme?.theme }]}>
            UUID: {auctionDetail?.uuid}
          </AppText>
          <View style={styles.cardHeader}>
            <AppText style={styles.expiryText}>
              {language?.initialBid}:{" "}
              <AppText
                style={[styles.timeText, { fontSize: 16, color: theme?.theme }]}
              >
                ${auctionDetail?.initial_bid}
              </AppText>
            </AppText>
            <CopilotStep
              text="Total bids on current auction."
              order={2}
              name="secondUniqueKey"
            >
              <WalkthroughableTouchableOpacity>
                <AppText style={styles.infoText}>
                  ({auctionDetail?.bids_count} {language?.BIDS})
                </AppText>
              </WalkthroughableTouchableOpacity>
            </CopilotStep>
          </View>
          <TimeLeft
            label={language?.expiry + " " + language?.time}
            item={ItemDetail}
            digitColor={theme?.white}
            style={[
              { color: theme?.darkGrey },
              { color: theme?.black, fontSize: 14 },
            ]}
          />
          {checker()}
          {auctionDetail?.auctionable_type === "Album" ? (
            <View style={styles.collectionSection}>
              <AppText style={styles.cText}>
                {Helper.capitalizeFirstLetter(language?.collection)}:{" "}
                {ItemDetail?.auctionable?.stamp_items_count}
              </AppText>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("AlbumDetails", {
                    Item: auctionDetail?.auctionable,
                  })
                }
              >
                <FontAwesome5 name="eye" color={theme.theme} size={hp(2.5)} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <AppText
                style={[
                  styles.text,
                  { marginTop: hp(2), paddingHorizontal: wp(3) },
                ]}
              >
                {language?.item + " " + language?.detail}
              </AppText>
              <View>
                <View style={styles.infoSection}>
                  <View style={styles.infoContainer}>
                    <AppText style={styles.text}>{language?.country}</AppText>
                    <AppText style={styles.infoText}>
                      {auctionDetail?.auctionable?.country}
                    </AppText>
                  </View>
                  <View style={styles.infoContainer}>
                    <AppText style={styles.text}>{language?.year}</AppText>
                    <AppText style={styles.infoText}>
                      {auctionDetail?.auctionable?.year_issued}
                    </AppText>
                  </View>
                  <View style={styles.infoContainer}>
                    <AppText style={styles.text}>
                      {auctionDetail?.auctionable?.catalogue_number?.length
                        ? auctionDetail?.auctionable?.catalogue_number[0]?.type
                        : "N/A"}
                      :
                    </AppText>
                    <AppText style={styles.infoText}>
                      {auctionDetail?.auctionable?.catalogue_number?.length
                        ? auctionDetail?.auctionable?.catalogue_number[0]
                            ?.number
                        : "N/A"}
                    </AppText>
                  </View>
                </View>
                <View style={styles.infoSection}>
                  <View style={styles.infoContainer}>
                    <AppText style={styles.text}>{language?.Format}</AppText>
                    <AppText style={styles.infoText}>
                      {auctionDetail?.auctionable?.format}
                    </AppText>
                  </View>
                  <View style={styles.infoContainer}>
                    <AppText style={styles.text}>
                      {language?.qty + " " + language?.owned}
                    </AppText>
                    <AppText style={styles.infoText}>
                      M:{" "}
                      {auctionDetail?.auctionable?.quantity_owned?.mint
                        ? auctionDetail?.auctionable?.quantity_owned?.mint
                        : "N/A"}{" "}
                      U:{" "}
                      {auctionDetail?.auctionable?.quantity_owned?.used
                        ? auctionDetail?.auctionable?.quantity_owned?.used
                        : "N/A"}
                    </AppText>
                  </View>
                  <View style={styles.infoContainer}>
                    <AppText style={styles.text}>
                      {language?.perforation}
                    </AppText>
                    <AppText style={styles.infoText}>
                      {auctionDetail?.auctionable?.perforation
                        ? auctionDetail?.auctionable?.perforation
                        : "N/A"}
                    </AppText>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
        <View style={styles.userSection}>
          <AppText style={styles.expiryText}>
            {language?.SELLER + " " + language?.information}
          </AppText>
          <UserCard
            nameStyle={{ fontSize: 14 }}
            starSize={12}
            User={auctionDetail?.user}
          />
        </View>
        <CopilotStep
          text="Scroll up to see auction detail tabs."
          order={3}
          name="thirdUniqueKey"
        >
          <WalkthroughableTouchableOpacity />
        </CopilotStep>
        <View style={{ minHeight: hp(86) }}>
          <Tab.Navigator
            // initialRouteName="Shop"
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
              name="BidListTab"
              component={BidListingTab}
              options={{ tabBarLabel: language?.bidOffers }}
            />
            <Tab.Screen
              name="SimilarItems"
              component={SimilarItemTab}
              options={{ tabBarLabel: language?.similarItems }}
            />
            <Tab.Screen
              name="Reviews"
              component={AuctionReview}
              options={{ tabBarLabel: "Reviews" }}
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

      {/* Stamp Listing Modal */}

      {/* </AnimatedHeader> */}
      <BottomSheet
        ref={editSheetRef}
        sheetHeight={hp(30)}
        ChildComponent={<BottomComponent />}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert(language?.modal_has_been_closed);
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View
            style={{
              height: 330,
              width: wp(93),
              backgroundColor: "#fff",
              justifyContent: "center",
              borderRadius: 2,
            }}
          >
            <Pressable
              onPress={() => {
                setBid(null);
                setCurrent(null);
                setModalVisible(!modalVisible);
                if (err) {
                  setError(null);
                }
              }}
              style={{
                backgroundColor: theme.porcelain,
                height: 35,
                width: 35,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                top: -15,
                right: -5,
              }}
            >
              <Entypo name="cross" color="#000" size={30} />
            </Pressable>

            <View style={{ width: "90%", alignSelf: "center" }}>
              <AppText style={{ fontWeight: "600", fontSize: 16 }}>
                {language?.placeBidOnItem}
              </AppText>
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  marginTop: 10,
                }}
              >
                {bidList?.map((item, index) => {
                  return (
                    <Btn
                      label={`$${item}`}
                      style={{ height: 33, width: "30%", margin: 5 }}
                      textColor={current == index ? "#fff" : "#000"}
                      bg={current == index ? theme.theme : theme.porcelain}
                      fontWeight="400"
                      fontSize={16}
                      onPress={() => {
                        setCurrent(index);
                        setBid(item.toString());
                        if (err) {
                          setError(null);
                        }
                      }}
                    />
                  );
                })}
              </View>

              <FloatingInput
                label="Custom Bid"
                marginTop={4}
                value={bid}
                keyboardType="numeric"
                // width="90%"
                onChangeText={(text) => {
                  // console.log("text", text);
                  setBid(text);
                  if (err) {
                    setError(null);
                  }
                }}
                error={err ? err : null}
              />
              <AppText style={{ color: theme.chalice, marginTop: 10 }}>
                By placing a bid, you're committing to buy this item, if you
                win.
              </AppText>
              <GradBtn
                height={45}
                width="90%"
                label="Submit Bid"
                loading={loading}
                onPress={() => submitBid()}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default copilot({
  animated: true, // Can be true or false
  overlay: "svg", // Can be either view or svg
})(PlaceBid);
