import React, { useContext, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { styles } from "./styles";

import colors from "../../../../../constant/colors";

import { images } from "../../../../../assets/images/Images";
import UserCard from "../../../../../components/UserCard";
import AppText from "../../../../../components/AppText";

import { MainHeader } from "../../../../../components";
import AntDesign from "react-native-vector-icons/AntDesign";
import { FlatList } from "react-native-gesture-handler";
import Btn from "../../../../../components/Btn";
import { useSelector } from "react-redux";
import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";

export const OfferDetail = (props) => {
  const { ItemDetail } = props.route.params;
  const offer_Item = ItemDetail?.trade?.accepting_offer;
  const offer_amount = ItemDetail?.trade?.offer_amount;
  const check_counter_offer = ItemDetail?.check_counter_offer
    ? ItemDetail?.check_counter_offer
    : null;
  const id = ItemDetail?.trade_id;
  const currentUser = useSelector((state) => state.ApiReducer.user);
  let checkOwner = currentUser?.id == ItemDetail?.trade?.user_id;
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const stampUri =
    ItemDetail?.trade?.tradeables[0]?.tradeable?.medias[0]?.media_url;

  // console.log("Owner", checkOwner);
  const offerList = ItemDetail?.trade_offerables;

  const stampList = offerList?.filter((item) => item?.type == "Model");
  const coinData = offerList?.filter((item) => item?.type == "Coin");

  const multiple = stampList?.length >= 1 && coinData?.length >= 1;
  let sendParams = {
    tradeUri: stampUri,
    offer: offer_Item?.split("_"),
    multipleOffer: offer_Item,
    offer_amount,
    id: id,
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={[
          styles.card,
          {
            marginVertical: 3,
            alignSelf: "center",
          },
        ]}
      >
        <Image
          source={{ uri: item?.trade_offerable?.medias[0]?.media_url }}
          style={styles.stampIcon}
        />
      </View>
    );
  };
  const renderItem1 = ({ item, index }) => {
    return (
      <View
        style={[
          styles.itemCard,
          {
            marginVertical: 3,
            alignSelf: "center",
          },
        ]}
      >
        <Image
          source={{ uri: item?.trade_offerable?.medias[0]?.media_url }}
          style={styles.stampIcon1}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title="Offer Detail"
        onPressBack={() => props?.navigation.goBack()}
      />
      <View style={styles.topSection}>
        <View>
          <UserCard
            User={ItemDetail?.user}
            imgSize={50}
            starSize={14}
            nameStyle={{ fontSize: 16, maxWidth: wp(50) }}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <AppText style={styles.detailText}>Status</AppText>
          <AppText style={styles.activeText}>{ItemDetail?.status}</AppText>
        </View>
      </View>
      <View style={styles.infoSection}>
        <AppText style={styles.nameText}>{ItemDetail?.description}</AppText>
        <TouchableOpacity style={styles.commentSection}>
          <Image
            source={images.Comments}
            style={[styles.commentIcon, { tintColor: theme?.lightText }]}
          />
        </TouchableOpacity>
      </View>
      {offer_Item === "coins_and_stamps" && multiple ? (
        <View style={styles.cardSection}>
          <View style={{ alignItems: "center" }}>
            <AppText style={styles.text}>I Want</AppText>
            <View style={styles.card}>
              <Image source={{ uri: stampUri }} style={styles.stampIcon} />
            </View>
          </View>
          <View
            style={{ width: ItemDetail?.trade_offerables[1] ? wp(67) : wp(50) }}
          >
            <AppText style={styles.text}>Offered Item's</AppText>
            <View style={styles.offerSection}>
              <AntDesign name="swap" color={colors.theme} size={22} />
              <View style={{ width: wp(25), height: 104 }}>
                <FlatList data={stampList} renderItem={renderItem} />
              </View>
              <AntDesign name="plus" size={22} color={colors.theme} />
              <View style={styles.card}>
                <Image source={images.Coin} style={styles.coinIcon} />
                <AppText style={styles.priceText}>
                  ESV US($): {coinData[0]?.value}
                </AppText>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={[styles.cardSection, { justifyContent: "space-around" }]}>
          <View>
            <AppText style={styles.text}>I Want</AppText>
            <View style={styles.itemCard}>
              <Image source={{ uri: stampUri }} style={styles.stampIcon1} />
            </View>
          </View>
          <AntDesign
            name="swap"
            size={30}
            color={colors.theme}
            style={{ marginTop: 35 }}
          />
          {coinData?.length >= 1 && (
            <View>
              <AppText style={styles.text}>Coins Offered</AppText>
              <View style={styles.itemCard}>
                <Image source={images.Coin} style={styles.coinIcon1} />
                <AppText style={{ fontWeight: "500", fontSize: 12 }}>
                  ESV US($): {coinData[0]?.value}
                </AppText>
              </View>
            </View>
          )}
          {stampList?.length >= 1 && (
            <View>
              <AppText style={styles.text}>Offered Item's</AppText>
              <View style={{ width: wp(38), height: 150 }}>
                <FlatList data={stampList} renderItem={renderItem1} />
              </View>
            </View>
          )}
        </View>
      )}
      {!ItemDetail?.trade?.is_expired &&
      !check_counter_offer &&
      !checkOwner &&
      ItemDetail?.status == "Rejected" &&
      !ItemDetail?.trade?.is_trade_winner_declared ? (
        <Btn
          onPress={() =>
            props.navigation.navigate("SendProposal", {
              ProposalId: ItemDetail?.proposal_id,
              counter: sendParams,
            })
          }
          label={language?.placeAnotherOffer}
          style={{
            alignSelf: "center",
            marginTop: 30,
            width: "60%",
            height: 50,
          }}
        />
      ) : null}
    </View>
  );
};
