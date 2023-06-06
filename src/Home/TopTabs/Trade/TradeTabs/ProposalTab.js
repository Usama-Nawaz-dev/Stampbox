import React, { useState, useEffect, useRef, useContext } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";

import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Empty from "../../../../../components/Empty";
import colors from "../../../../../constant/colors";

import {
  ProposalsCard,
  BottomSheet,
  EmptyList,
} from "../../../../../components";

import { ProposalSheet } from "../../../../Sheets";
import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";
// import { dark as theme } from "../../../../../constant/colorsConfig";

export const ProposalTab = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const proposalSheetRef = useRef();

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const tradeCrud = currentUser?.user_permissions?.includes(
    "my_store.for_trade.view"
  );

  const { theme }= useContext(ThemeContext);
  const [offerList, setOfferList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [proposalList, setProposalList] = useState(null);

  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    if (focused && tradeCrud) {
      getData();
    }
  }, [focused]);

  const getData = async () => {
    const userId = await Helper.getData("userId");
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl("trade-proposals", `?user_id=${userId}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      let _data = response?.data?.result?.paginated_items?.data;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      // console.log("_data", _data);
      // console.log("next", nextPageUrl);
      setNextApiUrl(nextPageUrl);
      if (_data?.length > 0) {
        let filterRemoved = _data.filter((item) => item?.status !== "Removed");
        console.log("filtered..", filterRemoved);
        setProposalList(filterRemoved);
      }
    }
  };

  const getNextApiData = async () => {
    const userId = await Helper.getData("userId");
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(nextApiUrl + `&user_id=${userId}`);
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setNextApiUrl(nextPageUrl);
        if (_data?.length > 0) {
          let filterRemoved = _data.filter(
            (item) => item?.status !== "Removed"
          );
          // console.log("filtered..", filterRemoved);
          setProposalList([...proposalList, ...filterRemoved]);
        }
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
  const getOffer = async (id) => {
    dispatch(allActions.DataAction.ActivityModal(true));
    const response = await MindAxios.get(
      Env.paramUrl(`trade-proposals`, `${id}/offers`)
    );
    dispatch(allActions.DataAction.ActivityModal(false));
    if (response?.status == 200) {
      setOfferList(response?.data?.result?.proposal?.trade_offers);
      proposalSheetRef?.current?.open();
    } else {
      alert(language?.serverError);
    }
  };
  const _accept = async (accept, id) => {
    let status_check = accept ? "Accepted" : "Rejected";
    let body = {
      status: status_check,
      action_reason: accept ? "I like your offer" : "Sorry",
    };

    dispatch(allActions.DataAction.ActivityModal(true));

    const response = await MindAxios.post(
      Env.createUrl(`trade-offers/${id}`),
      body
    );
    dispatch(allActions.DataAction.ActivityModal(false));
    // console.log("verify response-->", res);
    if (response.status == 200) {
      Helper.showToastMessage(
        `${language?.counterOffer} ${status_check}`,
        "green"
      );
      proposalSheetRef?.current?.close();
    } else {
      alert(language?.serverError);
    }
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === proposalList.length - 1;
    // console.log("item ------>",item);
    return (
      <View
        style={{
          marginBottom: isEnd ? hp(4) : null,
          marginTop: hp(1.5),
          marginRight: wp(3),
          //   paddingBottom: 1,
        }}
      >
        <ProposalsCard
          ItemDetail={item}
          onViewProposal={() => getOffer(item?.id)}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      {proposalList?.length ? (
        <FlatList
          data={proposalList}
          style={{ paddingHorizontal: wp(3) }}
          renderItem={renderItem}
          numColumns={2}
          onEndReachedThreshold={0.5}
          onEndReached={getNextApiData}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.mainItem}>
          {tradeCrud ? (
            <Empty />
          ) : (
            <EmptyList description="Please update your plan for viewing items." />
          )}
        </View>
      )}

      <BottomSheet
        ref={proposalSheetRef}
        dropDown={false}
        title={language?.viewProposal}
        onPressClose={() => proposalSheetRef?.current?.close()}
        sheetHeight={offerList?.length > 1 ? hp(94) : hp(60)}
        ChildComponent={
          <ProposalSheet
            currentUser={currentUser}
            ItemDetail={offerList}
            from="proposals"
            onPressDetail={(item, counterPlaced) => {
              item.check_counter_offer = counterPlaced;
              proposalSheetRef?.current?.close();
              setTimeout(() => {
                props?.navigation?.navigate("OfferDetail", {
                  ItemDetail: item,
                });
              }, 300);
            }}
            onClose={() => proposalSheetRef?.current?.close()}
            refresh={async () => await getData()}
            onCounter={(params) => {
              console.log("params", params);
              proposalSheetRef?.current?.close();
              props.navigation.navigate("SendProposal", {
                ProposalId: params?.proposalId,
                counter: params,
              });
            }}
            onAnotherOffer={(params, ids) => {
              console.log("params", params);
              proposalSheetRef?.current?.close();
              dispatch(allActions.SheetAction.checkStamps(ids));
              props.navigation.navigate("SendProposal", {
                ProposalId: params?.proposalId,
                counter: params,
              });
            }}
            onProceed={(data) => {
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
            _accept={(accept, id) => _accept(accept, id)}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(1),
    backgroundColor: colors.cWhite,
  },
  mainItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cWhite,
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightText,
  },
  mainItem: {
    flex: 0.9,
    alignItems: "center",
    justifyContent: "center",
  },
});
