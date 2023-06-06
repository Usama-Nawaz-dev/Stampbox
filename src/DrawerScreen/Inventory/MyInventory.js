import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView } from "react-native";

import { styles } from "./styles";
import colors from "../../../constant/colors";
import { MainHeader } from "../../../components";
import AppText from "../../../components/AppText";

import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

export const MyInventory = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const user = useSelector((state) => state.ApiReducer.user);
  const [countList, setCountList] = useState(null);
  const [countryCount, setCountryCount] = useState(null);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (focused) {
      getInventoryCount();
      getCountryCount();
    }
  }, [focused]);

  const getInventoryCount = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const res = await MindAxios.get(
      Env.paramUrl("inventory", `get-counts?user_id=${user?.id}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (res?.status == 200) {
      const _data = res?.data?.result?.counts;
      setCountList(_data);
    } else {
      Helper.showToastMessage(language?.serverError, colors.danger);
    }
  };

  const getCountryCount = async () => {
    const res = await MindAxios.get(
      Env.paramUrl(
        "inventory",
        `get-counts?user_id=${user?.id}&count_type=country`
      )
    );
    if (res?.status == 200) {
      const _data = res?.data?.result?.counts?.data;
      setCountryCount(_data);
    } else {
      Helper.showToastMessage(language?.serverError, colors.danger);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title="My Inventory"
        onPressBack={() => props.navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView style={styles.listStyle} horizontal>
          <CountCard
            type={"Est. value of My Collection"}
            value={"$" + countList?.total_estimate_value?.toFixed(1)}
          />
          <CountCard
            type={"Est. value of My Album"}
            value={"$" + countList?.album_total_estimate_value?.toFixed(1)}
          />
          <CountCard
            type={"Stamp Item in My Collection"}
            value={countList?.total_items_count}
          />
          <CountCard
            type={"Topics in My Collection"}
            value={countList?.total_topics_count}
          />
          <CountCard
            type={"Total Trade items in My Collection"}
            value={countList?.total_trade_count}
          />
          <CountCard
            type={"Total Auction items in My Collection"}
            value={countList?.total_auction_count}
          />
          <CountCard
            type={"Total Auction items in My Collection"}
            value={countList?.total_product_count}
          />
          <CountCard
            type={"Item on Reference Library"}
            value={countList?.item_on_reference_count}
          />
          <CountCard
            type={"Total active items in Market"}
            value={countList?.item_on_reference_count}
          />
        </ScrollView>
        <View style={styles.cardSection}>
          <BreakDownObj
            heading={"Estimated My Albums"}
            data={countList?.album_estimate_value_by_country}
          />
          <BreakDownCard
            heading={"My Collection Format Breakdown"}
            data={countList?.format_count}
          />
        </View>
        <View
          style={[styles.collectionCard, { backgroundColor: theme?.cardColor }]}
        >
          <View style={styles.cardHeader}>
            <AppText style={styles.headerText}>
              Countires in My Collection
            </AppText>
            <View style={styles.subHeader}>
              <AppText style={[styles.itemText, { color: theme?.iridium }]}>
                {language?.country}
              </AppText>
              <View style={styles.subHeaderRight}>
                <AppText style={[styles.itemText, { color: theme?.iridium }]}>
                  Total items
                </AppText>
                <AppText style={[styles.itemText, { color: theme?.iridium }]}>
                  Used items
                </AppText>
                <AppText style={[styles.itemText, { color: theme?.iridium }]}>
                  Mint items
                </AppText>
              </View>
            </View>
          </View>
          {countryCount?.length && (
            <ScrollView>
              {countryCount?.map((item, index) => {
                return (
                  <ConditionComponent
                    name={item?.country}
                    val1={item?.total_count}
                    val2={item?.mint_count}
                    val3={item?.used_count}
                  />
                );
              })}
            </ScrollView>
          )}
        </View>
        <View style={styles.cardSection}>
          <BreakDownCard
            heading={"Grade of My Item"}
            data={countList?.item_by_grade_count}
          />
          <View style={[styles.mulCard, { backgroundColor: theme?.cardColor }]}>
            <View style={styles.cardHeader}>
              <AppText style={styles.headerText}>
                {"Marketplace Active Listing"}
              </AppText>
            </View>
            <ItemComponent
              name={"Item on Sale"}
              value={countList?.marketplace_active_product_count}
            />
            <ItemComponent
              name={"Item on Auction"}
              value={countList?.marketplace_active_auction_count}
            />
            <ItemComponent
              name={"Item on Trade"}
              value={countList?.marketplace_active_trade_count}
            />
          </View>
        </View>
        <View style={[styles.cardSection, { marginBottom: 20 }]}>
          <BreakDownObj
            heading={"Countires in My Collection"}
            data={countList?.estimate_value_by_country}
          />
          <BreakDownCard
            heading={"Condition of My Collection"}
            data={countList?.condition_count}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export const CountCard = (props) => {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={[styles.card, { backgroundColor: theme?.cardColor }]}>
      <AppText style={styles.countText}>
        {props.value ? props?.value : "00"}
      </AppText>
      <AppText style={styles.infoText}>{props?.type}</AppText>
    </View>
  );
};

export const BreakDownCard = (props) => {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={[styles.mulCard, { backgroundColor: theme?.cardColor }]}>
      <View style={styles.cardHeader}>
        <AppText style={styles.headerText}>{props?.heading}</AppText>
      </View>
      {props?.data?.length ? (
        <ScrollView>
          {props?.data?.map((item, index) => {
            if (item?.format) {
              return (
                <ItemComponent name={item?.format} value={item?.total_count} />
              );
            } else if (item?.grade === null || item?.grade) {
              return (
                <ItemComponent
                  name={item?.grade ? item?.grade : "null"}
                  value={item?.total_count}
                />
              );
            } else if (item?.condition) {
              return (
                <ItemComponent
                  name={item?.condition}
                  value={item?.total_count}
                />
              );
            }
          })}
        </ScrollView>
      ) : null}
    </View>
  );
};

export const BreakDownObj = (props) => {
  const { theme } = useContext(ThemeContext);
  const objData = props?.data;
  const objKeys = props?.data ? Object.keys(props?.data) : [];
  return (
    <View style={[styles.mulCard, { backgroundColor: theme?.cardColor }]}>
      <View style={styles.cardHeader}>
        <AppText style={styles.headerText}>{props?.heading}</AppText>
      </View>
      {objKeys?.length ? (
        <ScrollView>
          {objKeys?.map((key) => {
            return <ItemComponent name={key} value={objData[`${key}`]} />;
          })}
        </ScrollView>
      ) : null}
    </View>
  );
};

export const ConditionComponent = (props) => {
  return (
    <View style={styles.constionComp}>
      <AppText style={styles.valueText}>{props?.name}</AppText>
      <View style={styles.subHeaderRight}>
        <AppText style={styles.valueText}>{props?.val1}</AppText>
        <AppText style={styles.valueText}>{props?.val2}</AppText>
        <AppText style={styles.valueText}>{props?.val3}</AppText>
      </View>
    </View>
  );
};

export const ItemComponent = (props) => {
  return (
    <View style={styles.constionComp}>
      <AppText style={styles.valueText1}>{props?.name}</AppText>
      <AppText style={styles.valueText1}>{props?.value}</AppText>
    </View>
  );
};
