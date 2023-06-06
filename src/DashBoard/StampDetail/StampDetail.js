import React, { useState, useEffect, useContext } from "react";
import { View, ScrollView, TouchableOpacity, Pressable } from "react-native";

import { styles } from "./styles";
import colors from "../../../constant/colors";
import AppText from "../../../components/AppText";
import {
  MainHeader,
  GradBtn,
  ImageListSlider,
  ImageZoomViewer,
  InterestItem,
  ListingModal,
} from "../../../components";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import { createMaterialTopTabNavigator } from "../../../CustomPackages/material-top-tabs";
import { FlagsTab } from "./FlagsTab";
import { HistoryTab } from "./HistoryTab";
import { SimilarTab } from "./SimilarTab";
import { SuggestionTab } from "./SuggestionTab";

import Env from "../../../api/Env";
import Helper from "../../Helper";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";
import { ActivityIndicator } from "react-native";
// import { dark as theme } from "../../../constant/colorsConfig";

const Tab = createMaterialTopTabNavigator();
export const StampDetail = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const stampDetail = useSelector((state) => state.DetailReducer.stampDetail);

  const owner = currentUser?.id === stampDetail?.user_id;
  const [itemDetail, setItemDetail] = useState(null);
  const [imageViewer, setImageViewer] = useState(false);
  const [load, setLoad] = useState(false);
  const [imageViewerData, setImageViewerData] = useState([]);
  const [imageViewerInitialIndex, setImageViewerInitialIndex] = useState(0);
  const [isFav, setisFav] = useState(stampDetail?.is_wishable ? true : false);
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    if (focused) {
      setItemDetail(stampDetail);
      let tempArray = [];
      stampDetail?.medias?.map((x, index) => {
        tempArray.push({ url: x.media_url });
      });
      setImageViewerData([...tempArray]);
    }
  }, [focused]);

  // console.log("detail", stampDetail)
  const toggleFav = async (id) => {
    setisFav(!isFav);
    let body = {
      wishable_type: "StampItem",
      wishable_id: itemDetail?.id,
    };
    const response = await MindAxios.post(Env.createUrl("wishlists"), body);
    if (response?.status == 200) {
      if (!isFav) {
        Helper.showToastMessage("Stamp added to favourite", colors.green);
      } else {
        Helper.showToastMessage("Stamp remove from favourite", colors.green);
      }
    } else {
      Helper.showToastMessage(
        "Thers's some issue while adding stamp to favourite",
        colors.danger
      );
      setisFav(!isFav);
    }
  };

  const listingChecker = (type) => {
    if (type === "Auction") {
      if (itemDetail?.status.includes("FOR_AUCTION")) {
        props.navigation.navigate("CreateAuction", { item: itemDetail });
        setModalVisible(false);
      } else {
        Helper.showToastMessage(
          "This Stamp is not available for Auction.",
          colors.blueTheme
        );
      }
    } else if (type === "Trade") {
      if (itemDetail?.status?.includes("FOR_TRADE")) {
        props.navigation.navigate("CreateTrade", { item: itemDetail });
        setModalVisible(false);
      } else {
        Helper.showToastMessage(
          "This Stamp is not available for Trade.",
          colors.blueTheme
        );
      }
    } else {
      Helper.showToastMessage("Coming Soon.", colors.blueTheme);
    }
  };
  const flags_checker = async () => {
    // console.log("stamp", stampDetail);
    setLoad(true);
    const res = await MindAxios.get(
      Env.createUrl(`flag-tickets?user_id=${currentUser?.id}&type=sent`)
    );
    setLoad(false);
    if (res?.status == 200) {
      let paginated = res?.data?.result?.paginated_items?.data;
      // console.log("paginated", paginated);
      const isIdIncluded = paginated?.some(
        (item) => item.flaggable_id === stampDetail?.id
      );
      console.log("isIdIncluded", isIdIncluded);
      if (!isIdIncluded) {
        Helper.fbEvent("create_flag_from_stamp_detail_activity");
        props.navigation.navigate("Flagging", {
          id: stampDetail?.id,
        });
      } else {
        Helper.showToastMessage("You've already flagged", colors.task);
      }

      // return isIdIncluded;
    } else {
      Helper.showToastMessage("Can't flag at this moment!", colors.danger);
      // return true;
    }

    // console.log("res", res);
  };
  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title={language?.stamp + " " + language?.detail}
        onPressBack={() => {
          props.navigation.goBack();
          dispatch(allActions.DetailAction.StampDetail(null));
        }}
      />
      <ScrollView
        stickyHeaderIndices={[4]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ backgroundColor: colors.background }}>
          <ImageListSlider
            data={stampDetail?.medias}
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
        <AppText style={styles.stampText}>{itemDetail?.name}</AppText>
        <View style={styles.infoSection}>
          <InfoItem
            item={language?.year}
            value={itemDetail?.year_issued ? itemDetail?.year_issued : "N/A"}
          />
          <InfoItem
            item="Color"
            value={itemDetail?.color ? itemDetail?.color : "N/A"}
          />
          <InfoItem
            item="Shape"
            value={itemDetail?.shape ? itemDetail?.shape : "N/A"}
          />
          <InfoItem
            item="Grade"
            value={itemDetail?.grade ? itemDetail?.grade : "N/A"}
          />
          <InfoItem
            item={language?.country}
            value={itemDetail?.country ? itemDetail?.country : "N/A"}
          />
          <InfoItem
            item="Formats"
            value={itemDetail?.format ? itemDetail?.format : "N/A"}
          />
          <InfoItem
            item="Condition"
            value={itemDetail?.condition ? itemDetail?.condition : "N/A"}
          />
          <InfoItem
            item="Coins Value"
            value={itemDetail?.coins_value ? itemDetail?.coins_value : "N/A"}
          />
          <InfoItem
            item={language?.perforation}
            value={itemDetail?.perforation ? itemDetail?.perforation : "N/A"}
          />
          <InfoItem
            item="Total Stamps"
            value={
              itemDetail?.total_stamps_issued
                ? itemDetail?.total_stamps_issued
                : "N/A"
            }
          />
          <InfoItem
            item="Denomination"
            value={itemDetail?.denomination ? itemDetail?.denomination : "N/A"}
          />
          {itemDetail?.catalogue_number?.length ? (
            <InfoItem
              item={itemDetail?.catalogue_number[0]?.type}
              value={itemDetail?.catalogue_number[0]?.number}
            />
          ) : null}
          <InfoItem
            item={language?.typeOfIssue}
            value={itemDetail?.issue_type ? itemDetail?.issue_type : "N/A"}
          />
          <InfoItem
            item="Quantity"
            value={
              itemDetail?.quality?.length
                ? itemDetail?.quality?.toString()
                : "N/A"
            }
          />
          <InfoItem
            item="Status"
            value={
              itemDetail?.status?.length
                ? itemDetail?.status?.toString()
                : "N/A"
            }
          />
          <InfoItem
            item="Description"
            value={itemDetail?.description ? itemDetail?.description : "N/A"}
          />
        </View>
        <View style={{ paddingHorizontal: wp(3), paddingTop: hp(1) }}>
          <AppText style={styles.subHeading}>Topics of Intetrest</AppText>
          {itemDetail?.topics?.length ? (
            <ScrollView horizontal>
              {itemDetail?.topics?.map((item, index) => {
                return (
                  <View style={{ marginBottom: hp(0.5), marginRight: wp(2) }}>
                    <InterestItem item={item?.name} maxWidth={wp(45)} />
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <View>
              <AppText style={[styles.emptyList, { color: theme?.theme }]}>
                Stamp don't have any selected topics
              </AppText>
            </View>
          )}
          <AppText style={styles.subHeading}>
            {language?.categoriesOfInterest}
          </AppText>
          {itemDetail?.categories?.length ? (
            <ScrollView horizontal>
              {itemDetail?.categories?.map((item, index) => {
                return (
                  <View style={{ marginRight: wp(2) }}>
                    <InterestItem item={item?.name} maxWidth={wp(45)} />
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <View>
              <AppText style={[styles.emptyList, { color: theme?.theme }]}>
                Stamp don't have any selected categories
              </AppText>
            </View>
          )}
        </View>
        <View>
          <View style={styles.priceSection}>
            <AppText style={styles.priceText}>
              Price:
              <AppText style={{ color: theme?.theme }}> 0$</AppText>
            </AppText>
            <View style={styles.rowSection}>
              {!owner && (
                <TouchableOpacity
                  onPress={toggleFav}
                  style={{ marginRight: wp(2) }}
                >
                  <Ionicons
                    name={isFav ? "heart" : "heart-outline"}
                    color={isFav ? theme?.theme : theme?.black}
                    size={28}
                  />
                </TouchableOpacity>
              )}
              <Pressable
                onPress={async () => {
                  if (!owner) {
                    await flags_checker();
                  }
                }}
              >
                {load ? (
                  <ActivityIndicator size={"small"} color={colors.lightTheme} />
                ) : (
                  <>
                    <Ionicons
                      name="flag-outline"
                      size={24}
                      color={theme?.theme}
                    />
                    <View style={styles.counter}>
                      <AppText style={styles.counterText}>
                        {itemDetail?.flag_tickets_count}
                      </AppText>
                    </View>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </View>
        {owner && (
          <View style={styles.btnSection}>
            <GradBtn
              height={35}
              fontSize={13}
              width={wp(45)}
              fontWeight={"500"}
              label={"Add to Market"}
              style={styles.button}
              onPress={() =>
                currentUser?.store
                  ? setModalVisible(true)
                  : Helper.showToastMessage(
                      "Please create store for Listing.",
                      colors.blueTheme
                    )
              }
            />
            <GradBtn
              height={35}
              fontSize={13}
              width={wp(45)}
              fontWeight={"500"}
              label={"Add to Album"}
              style={styles.button}
              onPress={() => props.navigation.navigate("AddToAlbum")}
            />
          </View>
        )}
        <TouchableOpacity
          style={styles.commentText}
          onPress={() =>
            props.navigation.navigate("PostComment", {
              data: itemDetail,
              type: "StampItem",
            })
          }
        >
          <AppText style={styles.comment}>
            {itemDetail?.comments_count} {language?.comments}
          </AppText>
        </TouchableOpacity>
        <View style={{ minHeight: owner ? hp(70) : hp(77) }}>
          <Tab.Navigator
            initialRouteName="Shop"
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
              name="Flags"
              component={FlagsTab}
              options={{ tabBarLabel: "Flags" }}
            />
            <Tab.Screen
              name="Find Similar"
              component={SimilarTab}
              options={{ tabBarLabel: "Find Similar" }}
            />
            <Tab.Screen
              name="Item History"
              component={HistoryTab}
              options={{ tabBarLabel: "Item History" }}
            />
            <Tab.Screen
              name="Suggestion"
              component={SuggestionTab}
              options={{ tabBarLabel: "Suggestions" }}
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
      <ListingModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onListItem={(type) => listingChecker(type)}
      />
    </View>
  );
};

const InfoItem = (props) => {
  const { item, value } = props;
  // console.log(key)
  return (
    <View style={styles.rowSection}>
      <AppText style={styles.keyText}>{item}:</AppText>
      <AppText style={styles.valueText}>{value}</AppText>
    </View>
  );
};
