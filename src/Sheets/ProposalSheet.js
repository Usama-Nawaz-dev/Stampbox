import React, { useContext, useState } from "react";
import {
  View,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";

import SheetModal from "./SheetModal";
import colors from "../../constant/colors";
import AppText from "../../components/AppText";
import UserCard from "../../components/UserCard";
import { images } from "../../assets/images/Images";

import AuthContext from "../Context/AuthContext";
import ThemeContext from "../Context/ThemeContext";

export const ProposalSheet = (props) => {
  const {
    from,
    _accept,
    onClose,
    refresh,
    stampUri,
    onAccept,
    onCounter,
    onProceed,
    stamp_name,
    ItemDetail,
    currentUser,
    onViewOrder,
    onPressDetail,
    onAnotherOffer,
  } = props;

  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useContext(ThemeContext);
  const [selected, setSelected] = useState({
    item1: false,
    item2: false,
  });

  // console.log("from", from);

  let isExpired = ItemDetail[0]?.trade?.is_expired;
  const [description, setDescription] = useState("");
  const this_tradeable = ItemDetail[0]?.trade?.tradeables[0]?.tradeable;
  const ItemUri = this_tradeable?.medias[0]?.media_url;

  const {
    myState: { language },
  } = useContext(AuthContext);

  let getIds = [];
  ItemDetail.map((item, index) => {
    const { trade_offerables: offerables } = item;
    if (offerables?.length > 0) {
      offerables.forEach((el) => {
        getIds.push(el?.trade_offerable?.id);
      });
    }
  });
  // console.log("getIds--->", getIds);

  const checker = (status, _d, item, sendParams, last, offerType) => {
    // console.log("status", status);
    // let showCounter = count && index == ItemDetail?.length - 1;
    // console.log("showCounter", showCounter)
    // console.log(item);
    if (from == "details") {
      // if (status == "Accepted" || status == "CounterOffer_Placed")
      if (status == "Accepted" && item?.trade?.is_owner_order_placed == 0) {
        return (
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => {
              // console.log("-->", _d)
              Alert.alert("Alert !", language?.pleaseMakeSure, [
                { text: "OK", onPress: () => onProceed(_d) },
              ]);
            }}
          >
            <AppText style={styles.offerText}>
              {language?.proceedWithTrade}
            </AppText>
          </TouchableOpacity>
        );
      } else if (
        status == "Accepted" &&
        item?.trade?.is_owner_order_placed == 1
      ) {
        return (
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => {
              // onProceed(_d)
              onViewOrder(item);
            }}
          >
            <AppText style={styles.offerText}>{language?.viewOrder}</AppText>
          </TouchableOpacity>
        );
      } else if (status == "Rejected" || status == "Draft") {
        return null;
      } else {
        if (status == "CounterOffer_Placed") {
          // console.log("showCounter", count, last)
          if (last && !isExpired) {
            return (
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => {
                  sendParams.status = "CounterOffer_Placed";
                  onCounter(sendParams);
                }}
              >
                <AppText style={styles.offerText}>
                  {language?.counterOffer}
                </AppText>
              </TouchableOpacity>
            );
          } else {
            return null;
          }
        } else {
          return (
            <>
              <View style={styles.cardSection}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => onAccept(_d, false, item)}
                >
                  <AppText style={styles.rejectText}>
                    {language?.reject}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button1}
                  onPress={() => onAccept(_d, true, item)}
                >
                  <AppText style={styles.acceptText}>
                    {language?.accept}
                  </AppText>
                </TouchableOpacity>
              </View>
              {!isExpired ? (
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => {
                    sendParams.status = "CounterOffer_Placed";
                    sendParams.user_id = sendParams.otherUserId;
                    onCounter(sendParams);
                  }}
                >
                  <AppText style={styles.offerText}>
                    {language?.counterOffer}
                  </AppText>
                </TouchableOpacity>
              ) : null}
            </>
          );
        }
      }
    } else if (from == "proposals") {
      if (item?.trade?.is_trade_winner_declared) {
        // console.log("coming here", item?.trade?.is_winner_order_placed);

        if (offerType !== "coins") {
          if (
            status == "Accepted" &&
            item?.trade?.is_winner_order_placed == 0
          ) {
            return (
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => {
                  // console.log("-->", _d)
                  Alert.alert("Alert !", language?.pleaseMakeSure, [
                    { text: "OK", onPress: () => onProceed(_d) },
                  ]);
                }}
              >
                <AppText style={styles.offerText}>
                  {language?.proceedWithTrade}
                </AppText>
              </TouchableOpacity>
            );
          } else if (
            status == "Accepted" &&
            item?.trade?.is_winner_order_placed == 1
          ) {
            return (
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => {
                  // console.log('item', item)
                  // onProceed(_d)
                  onViewOrder(item);
                }}
              >
                <AppText style={styles.offerText}>
                  {language?.viewOrder}
                </AppText>
              </TouchableOpacity>
            );
          }
        } else {
          if (status == "Accepted" && item?.trade?.is_owner_order_placed == 1) {
            return (
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => {
                  // console.log('item', item)
                  // onProceed(_d)
                  onViewOrder(item);
                }}
              >
                <AppText style={styles.offerText}>
                  {language?.viewOrder}
                </AppText>
              </TouchableOpacity>
            );
          }
        }
      } else if (status == "CounterOffer_Placed") {
        if (last) {
          return (
            <View
              style={[styles.cardSection, { justifyContent: "space-around" }]}
            >
              <TouchableOpacity
                style={[styles.button, { width: "40%", height: 30 }]}
                onPress={() => _accept(false, item?.id)}
              >
                <AppText style={[styles.rejectText, { fontSize: 12 }]}>
                  {language?.rejectCounterOffer}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button1, { width: "40%", height: 30 }]}
                onPress={() => _accept(true, item?.id)}
              >
                <AppText style={[styles.acceptText, { fontSize: 12 }]}>
                  {language?.acceptCounterOffer}
                </AppText>
              </TouchableOpacity>
            </View>
          );
        } else {
          return null;
        }
      } else if (status == "Active") {
        // console.log("status", status);
        return (
          <View style={styles.cardSection}>
            <TouchableOpacity
              style={styles.button1}
              onPress={() => {
                // console.log("rescind", item);
                setModalVisible(true);
              }}
            >
              <AppText style={styles.acceptText}>{language?.rescind}</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button1}
              onPress={() => {
                sendParams.status = null;
                sendParams.user_id = currentUser?.id;
                onAnotherOffer(sendParams, getIds);
              }}
            >
              <AppText style={styles.acceptText}>
                {language?.placeAnotherOffer}
              </AppText>
            </TouchableOpacity>
          </View>
        );
      } else if (status == "Rejected") {
        return (
          <TouchableOpacity
            style={[styles.button1, { alignSelf: "center", marginTop: 20 }]}
            onPress={() => {
              // console.log("rescind", item);
              setModalVisible(true);
            }}
          >
            <AppText style={styles.acceptText}>{language?.rescind}</AppText>
          </TouchableOpacity>
        );
      }
    } else {
      return null;
    }
  };
  // console.log("this check", ItemDetail);

  // const cards = [...Array(1).keys()];
  const userIdChecker = (offer, stampId, coinId) => {
    if (offer == "coins") {
      return coinId;
    } else if (offer == "stamps") {
      return stampId;
    } else {
      return coinId;
    }
  };
  const treatAs = (len, type, offer) => {
    if (offer !== "coins_and_stamps") {
      return offer;
    } else {
      if (len > 1) {
        return "stamps";
      } else {
        if (type == "Model") {
          return "stamps";
        } else {
          return "coins";
        }
      }
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {ItemDetail.map((item, index) => {
        // console.log("item--?", item);
        const {
          status,
          id,
          proposal_id,
          user_id: forCoin_id,
          trade: { offer_amount, accepting_offer, user_id: forStamp_id },
          trade_offerables: offer_ables,
          trade_id,
        } = item;
        const [{ trade_offerable: offerable, value: coinsVal, type }] =
          offer_ables;
        const treat_As = treatAs(offer_ables?.length, type, accepting_offer);
        let last = index == 0;
        let countOfCounters = ItemDetail?.filter(
          (el) => el.status == "CounterOffer_Placed"
        );
        let count = countOfCounters ? countOfCounters?.length : 0;
        // console.log("offer_ables", offer_ables);
        // const {offer_amount} = trade;
        // const coinsVal = offerable?.value;
        const stampImg = offerable?.medias[0]?.media_url;
        // const stampName = offerable?.name;

        let this_id = treat_As == "coins" ? forCoin_id : forStamp_id;
        // console.log("treat as==>", this_id);
        const sendForward = {
          id,
          trade_id,
          stampUri: ItemUri,
          coinsVal,
          offer_amount,
          user_id: from == "proposals" ? this_id : forCoin_id,
          stampName: this_tradeable?.name,
          // otherUserId: forCoin_id,
        };
        let sendParams = {
          tradeUri: stampUri,
          offer: accepting_offer?.split("_"),
          multipleOffer: accepting_offer,
          offer_amount,
          id: trade_id,
          proposalId: proposal_id,
          user_id: this_id,
          otherUserId: forCoin_id,
        };

        return (
          <View style={[styles.itemCard, { backgroundColor: theme?.white }]}>
            <View style={styles.topSection}>
              <View>
                <UserCard
                  User={item?.user}
                  imgSize={45}
                  starSize={14}
                  nameStyle={{ fontSize: 16, maxWidth: wp(50) }}
                />
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <AppText
                  onPress={() => onPressDetail(item, count)}
                  style={styles.detailText}
                >
                  {language?.seeDetails}
                </AppText>
                <AppText style={styles.activeText}>{status}</AppText>
              </View>
            </View>
            <View style={styles.infoSection}>
              <AppText numberOfLines={2} style={styles.nameText}>
                {item?.description}
              </AppText>
              <Image source={images.Comment} style={styles.commentIcon} />
            </View>
            <View style={styles.cardSection}>
              <View style={styles.card}>
                <Image
                  source={stampImg ? { uri: stampImg } : images.Coin}
                  style={stampImg ? styles.stampIcon : styles.coinIcon}
                />
                {!stampImg ? (
                  <AppText style={{ fontWeight: "500", fontSize: 12 }}>
                    {language?.coin}: {coinsVal}
                  </AppText>
                ) : null}
              </View>
              <AntDesign name="swap" size={30} color={colors.theme} />
              <View style={styles.card}>
                <Image source={{ uri: ItemUri }} style={styles.stampIcon} />
              </View>
            </View>
            {/* {!isExpired
              ? {checker(status, sendForward, item, sendParams, last, treat_As)}
              : null} */}
            {checker(status, sendForward, item, sendParams, last, treat_As)}
            <SheetModal
              item={item}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              selected={selected}
              setSelected={setSelected}
              description={description}
              setDescription={setDescription}
              onClose={onClose}
              refresh={refresh}
            />
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: colors.cWhite,
    paddingHorizontal: wp(6),
  },
  itemCard: {
    width: "95%",
    alignSelf: "center",
    backgroundColor: "#fff",
    marginTop: 15,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  detailText: {
    fontSize: 12,
    color: colors.theme,
    textDecorationLine: "underline",
  },
  activeText: {
    fontSize: 12,
    color: colors.green,
    marginTop: 5,
  },
  commentIcon: {
    height: 22,
    width: 22,
    resizeMode: "contain",
    tintColor: colors.theme,
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  cardSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "500",
    // color: colors.lightBlack,
    maxWidth: wp(75),
  },
  card: {
    backgroundColor: colors.cWhite,
    width: "42%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
    borderRadius: 10,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  stampIcon: {
    height: 140,
    width: "90%",
    margin: "5%",
    resizeMode: "contain",
    borderRadius: 5,
    alignSelf: "center",
  },
  coinIcon: {
    width: "60%",
    margin: "5%",
    resizeMode: "contain",
    alignSelf: "center",
  },
  button: {
    width: "48%",
    height: 36,
    backgroundColor: colors.background,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  rejectText: {
    fontWeight: "600",
    color: colors.btnText,
  },
  button1: {
    width: "48%",
    height: 36,
    backgroundColor: colors.lightTheme,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  acceptText: {
    fontWeight: "600",
    color: colors.cWhite,
  },
  counterBtn: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.lightTheme,
    marginTop: 15,
  },
  offerText: {
    color: colors.lightTheme,
    fontWeight: "600",
  },
});
