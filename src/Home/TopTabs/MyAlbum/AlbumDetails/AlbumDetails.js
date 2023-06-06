import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Dimensions,
  FlatList,
  Alert,
  TouchableOpacity,
  View,
  ScrollView,
  Share,
  ActivityIndicator,
} from "react-native";

import { styles } from "./styles";
import { AlbumList } from "../AlbumTabs";
import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";
import OnlyDropDown from "../../../../../components/OnlyDropDown";
import { MainHeader, MenuSheet, BottomSheet } from "../../../../../components";

import moment from "moment";
const { width } = Dimensions.get("window");
import FastImage from "react-native-fast-image";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";

import { AlbumPrintSheet } from "./AlbumPrintSheet";
import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";

// For Step by Step Walkthrough
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";
import { appUrl } from "../../../../../api/Env";

const sort_values = [
  { label: "Most Recent", value: "most_recent" },
  { label: "Mint", value: "Mint" },
  { label: "Used", value: "Used" },
  { label: "Year Issued", value: "year_issued" },
  { label: "Catalogue Number", value: "catalogue_number" },
];

const headers = [
  "All",
  "My Private",
  "My For Sale",
  "My For Auction",
  "My For Trade",
  "My For Exhibition",
  "My Open To Offers",
  "My For Reference",
];

const AlbumDetails = (props) => {
  const { Item } = props.route.params;
  const dispatch = useDispatch();
  const printSheetRef = useRef();
  const isFocused = useIsFocused();

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const { theme, mood } = useContext(ThemeContext);

  // pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { openPermissionSheet } = useContext(AuthContext);
  const canUserSort = currentUser?.user_permissions?.includes(
    "my_collection.view.sort"
  );

  const [ItemDetail, setItemDetail] = useState(null);
  const [albumList, setAlbumList] = useState({
    all: null,
    myPrivate: null,
    forSale: null,
    forAuction: null,
    forTrade: null,
    forExhibition: null,
    openToOffer: null,
    forReference: null,
  });
  const owner = currentUser?.id === ItemDetail?.user_id;
  const [isFav, setIsFav] = useState(Item?.is_wishable ? true : false);

  const [active, setActive] = useState(0);
  const headerScrollView = useRef();
  const itemScrollView = useRef();

  useEffect(() => {
    if (owner) {
      showHomeGuide();
    }
  }, [ItemDetail]);

  const showHomeGuide = async () => {
    let albumGuide = await Helper.getData("albumDetailGuide");
    if (!albumGuide) {
      props.start();
      await Helper.storeData("albumDetailGuide", "false");
    }
  };

  //Making a WalkthroughableTouchableOpacity
  const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

  useEffect(() => {
    headerScrollView.current.scrollToIndex({
      index: active,
      viewPosition: 0.5,
    });
  }, [active]);

  const onPressHeader = (index) => {
    itemScrollView.current.scrollToIndex({ index });
    setActive(index);
  };

  const onMomentumScrollEnd = (e) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (active != newIndex) {
      setActive(newIndex);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getAlbumDetail();
      getAlbumList();
    }
  }, [isFocused]);

  const getAlbumDetail = async () => {
    const response = await MindAxios.get(Env.paramUrl(`albums`, Item?.id));
    if (response?.status == 200) {
      // console.log(response?.data?.result?.album)
      setItemDetail(response?.data?.result?.album);
    } else {
      alert("Sever Error.");
    }
  };

  const toggleFav = async () => {
    setIsFav(!isFav);
    let body = {
      wishable_type: "Album",
      wishable_id: ItemDetail?.id,
    };
    const response = await MindAxios.post(Env.createUrl("wishlists"), body);
    if (response?.status == 200) {
      if (!isFav) {
        Helper.showToastMessage("Album added to Wishlist", colors.green);
      } else {
        Helper.showToastMessage("Album remove from Wishlist", colors.green);
      }
    } else {
      Helper.showToastMessage(
        "There's some issue while adding album to Wishlist",
        colors.danger
      );
      setIsFav(!isFav);
    }
  };

  const getAlbumList = async (type) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(
        "stamp-items",
        type
          ? `?album_id=${Item?.id}&selected_value=${type ? type : ""}
                ${type == "most_recent" ? "" : `&order_by=${type}`}`
          : `?album_id=${Item?.id}`
      )
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      // console.log(nextPageUrl);
      setNextApiUrl(nextPageUrl);
      const all = _data;
      const myPrivate = _data.filter((item) => item.status.includes("PRIVATE"));
      const forSale = _data.filter((item) => item.status.includes("FOR_SALE"));
      const forAuction = _data.filter((item) =>
        item.status.includes("FOR_AUCTION")
      );
      const forTrade = _data.filter((item) =>
        item.status.includes("FOR_TRADE")
      );
      const forExhibition = _data.filter((item) =>
        item.status.includes("FOR_EXHIBITION")
      );
      const openToOffer = _data.filter((item) =>
        item.status.includes("OPEN_TO_OFFERS")
      );
      const forReference = _data.filter((item) =>
        item.status.includes("FOR_REFERENCE")
      );
      setAlbumList({
        all: all,
        myPrivate: myPrivate,
        forSale: forSale,
        forAuction: forAuction,
        forTrade: forTrade,
        forExhibition: forExhibition,
        openToOffer: openToOffer,
        forReference: forReference,
      });
    } else {
      alert("Sever Error.");
    }
  };

  const getNextAlbumList = async () => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + type
          ? `&album_id=${Item?.id}&selected_value=${type ? type : ""}
                  ${type == "most_recent" ? "" : `&order_by=${type}`}`
          : `&album_id=${Item?.id}`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        // console.log(nextPageUrl);
        setNextApiUrl(nextPageUrl);
        const all = _data;
        const myPrivate = _data.filter((item) =>
          item.status.includes("PRIVATE")
        );
        const forSale = _data.filter((item) =>
          item.status.includes("FOR_SALE")
        );
        const forAuction = _data.filter((item) =>
          item.status.includes("FOR_AUCTION")
        );
        const forTrade = _data.filter((item) =>
          item.status.includes("FOR_TRADE")
        );
        const forExhibition = _data.filter((item) =>
          item.status.includes("FOR_EXHIBITION")
        );
        const openToOffer = _data.filter((item) =>
          item.status.includes("OPEN_TO_OFFERS")
        );
        const forReference = _data.filter((item) =>
          item.status.includes("FOR_REFERENCE")
        );
        setAlbumList({
          ...albumList,
          all: [...albumList?.all, ...all],
          myPrivate: [...albumList?.myPrivate, ...myPrivate],
          forSale: [...albumList?.forSale, ...forSale],
          forAuction: [...albumList?.forAuction, ...forAuction],
          forTrade: [...albumList?.forTrade, ...forTrade],
          forExhibition: [...albumList?.forExhibition, ...forExhibition],
          openToOffer: [...albumList?.openToOffer, ...openToOffer],
          forReference: [...albumList?.forReference, ...forReference],
        });
      } else {
        setNextApiUrl(null);
        alert("Sever Error.");
      }
    }
  };

  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator
          // animation={loder}
          size={"large"}
          color={theme?.theme}
          style={{ marginBottom: 20 }}
        />
      </View>
    ) : null;
  };

  const optionIcon = (
    <Entypo size={22} color={colors.cWhite} name="dots-three-vertical" />
  );

  const removeAlbumAlert = () =>
    Alert.alert(
      `Delete ${Item?.type} ?`,
      `Are you sure you want to delete this ${Item?.type} ?`,
      [{ text: "Cancel" }, { text: "OK", onPress: () => onDeleteAlbum() }]
    );

  const onDeleteAlbum = async () => {
    const response = await MindAxios.delete(Env.paramUrl(`albums`, Item?.id));
    if (response?.status == 200) {
      Helper.showToastMessage("Album Deleted Successfully", colors.green);
      props.navigation.goBack();
    } else {
      alert(language?.serverError);
    }
  };

  const AddAlbumStamps = () =>
    props.navigation.navigate("AlbumStamps", { Item: ItemDetail });

  const onEdit = () =>
    props.navigation.navigate("CreateAlbum", {
      type: ItemDetail?.type,
      ItemDetail: ItemDetail,
    });

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Please find my album item using this link: ${appUrl}Albums/${Item?.id}/show`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const printAlbum = () => printSheetRef?.current?.open();

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <CopilotStep
        text="Check album options by clicking here."
        order={1}
        name="firstUniqueKey"
      >
        <WalkthroughableTouchableOpacity
          style={styles.guideIcon}
        ></WalkthroughableTouchableOpacity>
      </CopilotStep>
      <MainHeader
        title={`${Item?.type} Detail`}
        onPressBack={() => props.navigation.goBack()}
        rightIcon={
          owner && (
            <MenuSheet
              destructiveIndex={4}
              customButton={optionIcon}
              options={[
                `Edit ${Item?.type}`,
                language?.addStamps,
                `Share ${Item?.type}`,
                "Print",
                `Delete ${Item?.type}`,
                "Cancel",
              ]}
              actions={[
                onEdit,
                AddAlbumStamps,
                onShare,
                printAlbum,
                removeAlbumAlert,
              ]}
            />
          )
        }
      />
      <ScrollView style={{ width: width }} showsVerticalScrollIndicator={false}>
        <FastImage
          source={{ uri: ItemDetail?.image_url }}
          style={styles.albumImg}
        />
        <View style={styles.upperSection}>
          <AppText style={styles.leftText}>{ItemDetail?.name}</AppText>
          {!owner && (
            <TouchableOpacity
              onPress={toggleFav}
              style={{ marginRight: wp(2) }}
            >
              <Ionicons
                name={isFav ? "heart" : "heart-outline"}
                color={isFav ? colors.color8 : colors.cBlack}
                size={28}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.infoCard, { backgroundColor: theme?.white }]}>
          <AppText style={styles.text}>
            Total Items:{" "}
            <AppText style={styles.infoText}>
              {ItemDetail?.stamp_items_count}
            </AppText>
          </AppText>
          <AppText style={styles.text}>
            Created By:{" "}
            <AppText style={styles.infoText}>
              {ItemDetail?.user?.full_name}
            </AppText>
          </AppText>
          <AppText style={styles.text}>
            Created On:{" "}
            <AppText style={styles.infoText}>
              {moment(ItemDetail?.created_at).format("YYYY-MM-DD [at] h:mmA")}
            </AppText>
          </AppText>
          <AppText style={styles.text}>
            Last Modified:{" "}
            <AppText style={styles.infoText}>
              {moment(ItemDetail?.updated_at).format("YYYY-MM-DD [at] h:mmA")}
            </AppText>
          </AppText>
          <AppText style={styles.text}>
            Description:{" "}
            <AppText style={styles.infoText}>{ItemDetail?.description}</AppText>
          </AppText>
        </View>
        <View style={styles.sortBy}>
          <AppText style={styles.sortByText}>Sort By</AppText>
          <CopilotStep
            text="You can sort album item by clicking here."
            order={2}
            name="secondUniqueKey"
          >
            <WalkthroughableTouchableOpacity>
              <OnlyDropDown
                width="40%"
                left={wp(15)}
                position={-5.2}
                data={sort_values}
                dropdownOffset={hp(0.1)}
                onChangeText={(value) =>
                  canUserSort
                    ? getAlbumList(value)
                    : setTimeout(() => {
                        openPermissionSheet();
                      }, 500)
                }
                icon={() => (
                  <Ionicons
                    name="md-filter-outline"
                    size={22}
                    color={theme?.black}
                  />
                )}
              />
            </WalkthroughableTouchableOpacity>
          </CopilotStep>
        </View>
        <View style={styles.tabsSection}>
          <FlatList
            data={headers}
            ref={headerScrollView}
            keyExtractor={(item) => item}
            horizontal
            style={styles.headerScroll}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View>
                <TouchableOpacity
                  onPress={() => onPressHeader(index)}
                  key={item}
                  style={[
                    styles.headerItem,
                    {
                      backgroundColor:
                        active == index ? theme?.white : theme?.white,
                    },
                  ]}
                >
                  <AppText
                    style={{
                      color: active == index ? theme?.theme : theme?.black,
                      padding: 3,
                      fontSize: 12,
                    }}
                  >
                    {item}
                  </AppText>
                </TouchableOpacity>
                {active == index && (
                  <View
                    style={[
                      styles.headerBar,
                      { backgroundColor: theme?.theme },
                    ]}
                  />
                )}
              </View>
            )}
          />
          <FlatList
            data={headers}
            ref={itemScrollView}
            keyExtractor={(item) => item}
            horizontal
            pagingEnabled
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onMomentumScrollEnd}
            renderItem={({ item, index }) => {
              switch (index) {
                case 0:
                  return (
                    <AlbumList
                      album={Item}
                      showBtn={owner}
                      ItemList={albumList.all}
                      getAlbumList={getAlbumList}
                      navigation={props.navigation}
                      ListFooterComponent={renderFooter}
                      onEndReached={getNextAlbumList}
                    />
                  );
                case 1:
                  return (
                    <AlbumList
                      album={Item}
                      showBtn={owner}
                      getAlbumList={getAlbumList}
                      navigation={props.navigation}
                      ItemList={albumList.myPrivate}
                      ListFooterComponent={renderFooter}
                      onEndReached={getNextAlbumList}
                    />
                  );
                case 2:
                  return (
                    <AlbumList
                      album={Item}
                      showBtn={owner}
                      getAlbumList={getAlbumList}
                      ItemList={albumList.forSale}
                      navigation={props.navigation}
                      ListFooterComponent={renderFooter}
                      onEndReached={getNextAlbumList}
                    />
                  );
                case 3:
                  return (
                    <AlbumList
                      album={Item}
                      showBtn={owner}
                      getAlbumList={getAlbumList}
                      navigation={props.navigation}
                      ItemList={albumList.forAuction}
                      ListFooterComponent={renderFooter}
                      onEndReached={getNextAlbumList}
                    />
                  );
                case 4:
                  return (
                    <AlbumList
                      album={Item}
                      showBtn={owner}
                      getAlbumList={getAlbumList}
                      ItemList={albumList.forTrade}
                      navigation={props.navigation}
                      ListFooterComponent={renderFooter}
                      onEndReached={getNextAlbumList}
                    />
                  );
                case 5:
                  return (
                    <AlbumList
                      album={Item}
                      showBtn={owner}
                      getAlbumList={getAlbumList}
                      navigation={props.navigation}
                      onEndReached={getNextAlbumList}
                      ItemList={albumList.forExhibition}
                      ListFooterComponent={renderFooter}
                    />
                  );
                case 6:
                  return (
                    <AlbumList
                      album={Item}
                      showBtn={owner}
                      getAlbumList={getAlbumList}
                      navigation={props.navigation}
                      ItemList={albumList.openToOffer}
                      ListFooterComponent={renderFooter}
                      onEndReached={getNextAlbumList}
                    />
                  );
                case 7:
                  return (
                    <AlbumList
                      album={Item}
                      showBtn={owner}
                      getAlbumList={getAlbumList}
                      navigation={props.navigation}
                      ItemList={albumList.forReference}
                      ListFooterComponent={renderFooter}
                      onEndReached={getNextAlbumList}
                    />
                  );
                default:
                  return (
                    <View key={item} style={styles.mainItem}>
                      <AppText style={styles.itemText}>
                        You have no Item listed at this time
                      </AppText>
                    </View>
                  );
              }
            }}
          />
        </View>
      </ScrollView>

      {/* Print Album Option Sheet */}
      <BottomSheet
        ref={printSheetRef}
        sheetHeight={hp(35)}
        ChildComponent={
          <AlbumPrintSheet sheetRef={printSheetRef} album={Item} />
        }
      />
    </View>
  );
};

export default copilot({
  animated: true, // Can be true or false
  overlay: "svg", // Can be either view or svg
})(AlbumDetails);
