import React, { useState, useEffect, useRef, useContext } from "react";
import { StyleSheet, View, ActivityIndicator, FlatList } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { ProposalSheet } from "../../../../Sheets";
import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";
import { ProposalsCard, BottomSheet } from "../../../../../components";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";
import AuthContext from "../../../../Context/AuthContext";
import Languages from "../../../../../constant/Languages";
import ThemeContext from "../../../../Context/ThemeContext";
// import { dark as theme } from "../../../../../constant/colorsConfig";

export const ProposalTab = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const proposalSheetRef = useRef();
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const tradeData = useSelector((state) => state.DetailReducer.tradeDetail);

  const { openPermissionSheet } = useContext(AuthContext);
  const canCounterProposal = currentUser?.user_permissions?.includes(
    "marketplace.trading.counter_proposal"
  );

  const [loading, setLoading] = useState(false);
  const [proposalList, setProposalList] = useState(null);
  const [currentProposal, setCurrentProposal] = useState(null);
  const { theme } = useContext(ThemeContext);

  // Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    myState: { language },
  } = useContext(AuthContext);
  //   const { en: language } = Languages;

  // const uri = null;
  const currentTrade = tradeData?.tradeables?.length
    ? tradeData?.tradeables[0]?.tradeable
    : null;
  const tradeUri = currentTrade?.medias?.length
    ? currentTrade.medias[0]?.media_url
    : null;

  useEffect(() => {
    getProposals();
  }, [focused]);

  const getProposals = async (id) => {
    setLoading(true);
    const response = await MindAxios.get(
      Env.paramUrl(`trade-proposals`, `?trade_id=${tradeData?.id}`)
    );
    setLoading(false);
    if (response?.status == 200) {
      let _data = response?.data?.result?.paginated_items?.data;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      if (_data?.length) {
        let filterRemoved = _data.filter((item) => item?.status !== "Removed");
        setProposalList(filterRemoved);
        setNextApiUrl(nextPageUrl);
      }
    } else {
      alert(language?.serverError);
    }
  };

  const getNextProposals = async () =>{
    if(nextApiUrl !== null){
      setIsLoading(true);
    const response = await MindAxios.get(
      nextApiUrl + `&trade_id=${tradeData?.id}`
    );
    setIsLoading(false);
    if (response?.status == 200) {
      let _data = response?.data?.result?.paginated_items?.data;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      if (_data?.length) {
        let filterRemoved = _data.filter((item) => item?.status !== "Removed");
        setProposalList([...proposalList, ...filterRemoved]);
        setNextApiUrl(nextPageUrl);
      }
    } else {
      setNextApiUrl(null)
      alert(language?.serverError);
    }
    }
  }

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

  const getOffers = async (id) => {
    // console.log("check this id -->", id);
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(`trade-proposals`, `${id}/offers`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      // console.log("response-->", response?.data?.result?.proposal?.trade_offers);
      let tradeOffers = response?.data?.result?.proposal?.trade_offers;
      // let countOfCounters = tradeOffers.filter(el => el.status == "CounterOffer_Placed");
      // console.log("countOfCounters", countOfCounters)
      setCurrentProposal(tradeOffers);
      proposalSheetRef?.current?.open();
    } else {
      alert(language?.serverError);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          marginRight: wp(3),
          marginLeft: index % 2 == 0 ? 1 : 0,
          marginTop: hp(1.5),
        }}
      >
        <ProposalsCard
          ItemDetail={item}
          onViewProposal={() => getOffers(item?.id)}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      {proposalList?.length ? (
        <FlatList
          numColumns={2}
          data={proposalList}
          renderItem={renderItem}
          style={{ paddingHorizontal: wp(3) }}
          ListFooterComponent={renderFooter}
          onEndReached={getNextProposals}
        />
      ) : (
        <View style={styles.mainItem}>
          {loading ? (
            <ActivityIndicator color={theme?.theme} size="large" />
          ) : (
            <AppText style={[styles.itemText, { color: theme?.theme }]}>
              Trade don't any proposal.
            </AppText>
          )}
        </View>
      )}
      {/* Trade Proposal Sheet */}
      <BottomSheet
        dropDown={false}
        ref={proposalSheetRef}
        title={language?.viewProposal}
        // title={"View Proposal"}
        onPressClose={() => proposalSheetRef?.current?.close()}
        sheetHeight={currentProposal?.length > 1 ? hp(95) : hp(60)}
        ChildComponent={
          <ProposalSheet
            stampUri={tradeUri}
            ItemDetail={currentProposal}
            stamp_name={currentTrade?.name}
            from="details"
            onPressDetail={(item) => {
              proposalSheetRef?.current?.close();
              setTimeout(() => {
                props?.navigation?.navigate("OfferDetail", {
                  ItemDetail: item,
                  stampUri: tradeUri,
                });
              }, 300);
            }}
            onCounter={(params) => {
              proposalSheetRef?.current?.close();
              if (canCounterProposal) {
                setTimeout(() => {
                  props.navigation.navigate("SendProposal", {
                    ProposalId: params?.proposalId,
                    counter: params,
                  });
                }, 300);
              } else {
                setTimeout(() => {
                  openPermissionSheet();
                }, 300);
              }
            }}
            onAccept={(proposal, accept, item) => {
              proposalSheetRef?.current?.close();
              setTimeout(() => {
                props.navigation.navigate("TradeOffer", {
                  data: proposal,
                  accept,
                  ItemDetail: item,
                });
              }, 300);
            }}
            onProposal={() => {
              proposalSheetRef?.current?.close();
              setTimeout(() => {
                props.navigation.navigate("TradeProposal");
              }, 300);
            }}
            onProceed={(data) => {
              // console.log("data", data)
              proposalSheetRef?.current?.close();
              setTimeout(() => {
                props.navigation.navigate("ShipDetail", { item: data });
              }, 300);
            }}
            onViewOrder={(data) => {
              proposalSheetRef?.current?.close();
              setTimeout(() => {
                props.navigation.navigate("OrderDetail", { item: data });
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
  mainItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: colors.cWhite,
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightTheme,
  },
});
