import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";

import colors from "../../../../constant/colors";
import { BountyOfferSheet } from "../../../Sheets";
import AppText from "../../../../components/AppText";
import { HunterCard, MenuSheet, BottomSheet } from "../../../../components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import allActions from "../../../../redux/actions";
import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";
import Helper from "../../../Helper";

import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";
import Feather from "react-native-vector-icons/Feather";

export const BountyOfferTab = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const offerSheetRef = useRef();

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const bountyDetail = useSelector((state) => state.DetailReducer.bountyDetail);

  const [offerList, setOfferList] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);

  //Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("Stamp Item");
  const [filterOption, setFilterOption] = useState("StampItem");

  useEffect(() => {
    if (focused) {
      getMyOffers(filterOption);
    }
  }, [focused]);

  const getMyOffers = async (type) => {
    const userId = await Helper.getData("userId");
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(
        `bounty-offers`,
        `?bounty_id=${bountyDetail?.id}&referable_type=${type}`
      )
    );
    dispatch(allActions.DataAction.AppLoader(false));
    const { status } = response;
    if (status == 200) {
      let _data = response?.data?.result?.paginated_items?.data;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      setOfferList(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert("Something went wrong");
    }
  };

  const getNextBounties = async () => {
    const userId = await Helper.getData("userId");
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl +
          `&bounty_id=${bountyDetail?.id}&referable_type=${filterOption}`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setOfferList([...offerList, ..._data]);
        setNextApiUrl(nextPageUrl);
      } else {
        setNextApiUrl(null);
        setIsLoading(false);
        alert("Sever Error.");
      }
    }
  };

  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator
          size={"large"}
          color={theme?.theme}
          style={{ marginBottom: hp(2) }}
        />
      </View>
    ) : null;
  };

  const onStamps = () => {
    setTitle("Stamp Items");
    setFilterOption("StampItem");
    getMyOffers("StampItem");
  };
  const onAuctions = () => {
    setTitle("Auction Refs");
    setFilterOption("Auction");
    getMyOffers("Auction");
  };
  const onTrades = () => {
    setTitle("Trade Refs");
    setFilterOption("Trade");
    getMyOffers("Trade");
  };
  const onProducts = () => {
    setTitle("Product Refs");
    setFilterOption("Product");
    getMyOffers("Product");
  };

  const renderOffers = ({ item, index }) => {
    return (
      <HunterCard
        ItemDetail={item}
        onPress={() => {
          setCurrentItem(item);
          offerSheetRef?.current?.open();
        }}
        onChat={() => {
          let newItem = {};
          const name = item?.user?.full_name
            ? item?.user?.full_name
            : item?.user?.first_name;
          newItem.from = name;
          newItem.type = item?.user?.id;
          newItem.message = item?.user?.image_url;
          dispatch(allActions.SheetAction.user_chat(newItem));
          props.navigation.navigate("ChatScreen", { newItem });
        }}
      />
    );
  };

  const myIcon = (
    <Feather
      name="filter"
      size={hp(2.6)}
      color={theme?.darkGrey}
      style={{ transform: [{ rotateY: "180deg" }] }}
    />
  );

  const offerAction = async (status) => {
    const body = {
      status: status ? "Accepted" : "Rejected",
      action_reason: status ? "I like your offer" : "I didn't like your offer.",
    };
    if (status) {
      if (currentUser?.coins > bountyDetail?.offered_coins) {
        props.navigation.navigate("BountyPayment", {
          offerId: currentItem?.id,
        });
      } else {
        alert("You don't have enough coins.Please buy coins first.");
      }
    } else {
      dispatch(allActions.DataAction.AppLoader(true));
      const response = await MindAxios.post(
        Env.paramUrl(`bounty-offers`, currentItem?.id),
        body
      );
      dispatch(allActions.DataAction.AppLoader(false));
      if (response?.status == 200) {
        getMyOffers(filterOption);
        Helper.showToastMessage("Bounty Offer Rejected.", colors.green);
      } else {
        alert(language?.serverError);
      }
    }
  };

  const considReqAction = async () => {
    const body = {
      status: "Pending_evaluation",
      action_reason: "Pending_evaluation",
    };
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.post(
      Env.paramUrl(`bounty-offers`, currentItem?.id),
      body
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      getMyOffers(filterOption);
      Helper.showToastMessage("Bounty Offer Status Updated.", colors.green);
    } else {
      alert(language?.serverError);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors?.white }]}>
      <View style={styles.topSection}>
        <AppText style={styles.text}>{title}</AppText>
        <MenuSheet
          customButton={myIcon}
          options={[
            "Stamp Items",
            "Auction Refs",
            "Trade Refs",
            "Product Refs",
            "Cancel",
          ]}
          actions={[onStamps, onAuctions, onTrades, onProducts]}
        />
      </View>
      {offerList?.length ? (
        <FlatList
          data={offerList}
          renderItem={renderOffers}
          style={styles.listStyle}
          onEndReached={getNextBounties}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.mainItem}>
          <AppText style={styles.emptyList}>
            {language?.you_have_no_listed_item}
            {"."}
          </AppText>
        </View>
      )}

      <BottomSheet
        ref={offerSheetRef}
        sheetHeight={hp(45)}
        ChildComponent={
          <BountyOfferSheet
            offerItem={currentItem}
            onClose={() => {
              offerSheetRef?.current?.close();
            }}
            onOfferAction={(status) => {
              offerSheetRef?.current?.close();
              setTimeout(() => {
                offerAction(status);
              }, 300);
            }}
            pendingAction={() => {
              offerSheetRef?.current?.close();
              setTimeout(() => {
                considReqAction();
              }, 300);
            }}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  listStyle: {
    paddingHorizontal: wp(3),
    paddingTop: hp(1),
  },
  emptyList: {
    fontSize: 12,
    fontWeight: "500",
    alignSelf: "center",
    color: colors.lightTheme,
  },
  mainItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topSection: {
    marginTop: hp(1),
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: wp(3),
    justifyContent: "space-between",
  },
  text: {
    fontSize: 14,
    fontFamily: Fonts.IBM_Medium,
  },
});
