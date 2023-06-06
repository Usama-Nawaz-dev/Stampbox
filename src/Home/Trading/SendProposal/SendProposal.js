import React, { useState, useContext } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  FlatList,
  Keyboard,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { styles } from "./styles";

import colors from "../../../../constant/colors";
import { images } from "../../../../assets/images/Images";
import AppText from "../../../../components/AppText";

import {
  MainHeader,
  FloatingInput,
  CustomButton,
  GradBtn,
} from "../../../../components";

import AntDesign from "react-native-vector-icons/AntDesign";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import Btn from "../../../../components/Btn";
import { useSelector, useDispatch } from "react-redux";
import allActions from "../../../../redux/actions";
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import Helper from "../../../Helper";
import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";

export const SendProposal = (props) => {
  const { ProposalId, counter } = props.route.params;
  // console.log("counter", counter);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const ItemDetail = useSelector((state) => state.DetailReducer.tradeDetail);
  const selectedStamp = useSelector((state) => state.DetailReducer.stampsList);
  const dispatch = useDispatch();
  const { theme }= useContext(ThemeContext);

  const { openPermissionSheet } = useContext(AuthContext);
  const canSendStamps = currentUser?.user_permissions?.includes(
    "marketplace.trading.items"
  );
  const canSendCoins = currentUser?.user_permissions?.includes(
    "marketplace.trading.coins"
  );
  const available_coins = currentUser?.coins;

  let trade_id = ItemDetail?.feedable_id
    ? ItemDetail?.feedable_id
    : ItemDetail?.id;
  const userId = counter ? counter?.user_id : null;
  const {
    myState: { language },
  } = useContext(AuthContext);

  // console.log(ItemDetail?.id, currentUser.id);
  // console.log(selectedStamp)
  // console.log(currentUser)

  let tradeUri, offer, multipleOffer, offer_amount;
  if (counter) {
    tradeUri = counter.tradeUri;
    offer = counter.offer;
    multipleOffer = counter.multipleOffer;
    offer_amount = counter.offer_amount;
    trade_id = counter.id;
  } else {
    tradeUri = ItemDetail?.feedable
      ? ItemDetail?.feedable?.tradeables[0]?.tradeable?.medias[0]?.media_url
      : ItemDetail?.tradeables[0]?.tradeable?.medias[0]?.media_url;

    offer = ItemDetail?.feedable
      ? ItemDetail?.feedable?.accepting_offer.split("_")
      : ItemDetail?.accepting_offer.split("_");

    multipleOffer = ItemDetail?.feedable
      ? ItemDetail?.feedable?.accepting_offer
      : ItemDetail?.accepting_offer;

    offer_amount = ItemDetail?.feedable
      ? ItemDetail?.feedable?.offer_amount
      : ItemDetail?.offer_amount;
  }

  const [comment, setComment] = useState(
    "hi, let me know if you wanted to trade in that offer"
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [coins, setCoins] = useState(null);
  const [error, setError] = useState(false);

  const renderStampList = ({ item, index }) => {
    return (
      <View style={[styles.card, { margin: 1, marginBottom: 5 }]}>
        <TouchableOpacity
          style={styles.removeItem}
          onPress={() => {
            let tempArray = [...selectedStamp];
            tempArray.splice(index, 1);
            dispatch(allActions.DetailAction.StampsList([...tempArray]));
          }}
        >
          <EvilIcons name="close" size={24} />
        </TouchableOpacity>
        <Image
          source={{ uri: item?.medias[0]?.media_url }}
          style={styles.stampIcon}
        />
      </View>
    );
  };
  const renderStampList1 = ({ item, index }) => {
    return (
      <View style={[styles.cardMultiple, { margin: 1, marginBottom: 5 }]}>
        <TouchableOpacity
          style={styles.removeItem}
          onPress={() => {
            let tempArray = [...selectedStamp];
            tempArray.splice(index, 1);
            dispatch(allActions.DetailAction.StampsList([...tempArray]));
          }}
        >
          <EvilIcons name="close" size={16} />
        </TouchableOpacity>
        <Image
          source={{ uri: item?.medias[0]?.media_url }}
          style={styles.stampIcon1}
        />
      </View>
    );
  };

  const checkValidation = async (check) => {
    let isValid = true;
    if (!comment) {
      setError("Description is Required.");
      isValid = false;
    }

    if (multipleOffer == "coins_and_stamps") {
      if (!coins && !selectedStamp?.length) {
        // console.log(coins, selectedStamp)
        alert("Please select coins or stamps.");
        isValid = false;
      } else if (coins > available_coins) {
        alert(`${coins} coins not available in your wallet`);
        isValid = false;
      }
    } else if (offer.includes("coins")) {
      if (!coins) {
        alert("Please Add Coins");
        isValid = false;
      } else if (coins > available_coins) {
        alert(`${coins} coins not available in your wallet`);
        isValid = false;
      }
    } else if (offer.includes("stamps")) {
      if (!selectedStamp?.length) {
        alert("Please Add Stamps");
        isValid = false;
      }
    }
    // console.log('check', counter ? counter?.status : (check ? null : "Draft"))

    if (isValid) {
      let body = {
        trade_id: trade_id,
        description: comment,
        proposal_id: ProposalId,
        status: counter?.status ? counter?.status : check ? null : "Draft",
      };
      if (userId) {
        body.user_id = userId;
      }
      let trade_offerables = [];
      if (coins) {
        trade_offerables.push({ type: "Coin", value: coins });
      }
      if (selectedStamp?.length) {
        for (let props of selectedStamp) {
          trade_offerables.push({
            type: "Model",
            trade_offerable_type: "StampItem",
            trade_offerable_id: props?.id,
          });
        }
      }
      body.trade_offerables = trade_offerables;
      // console.log("body", body);
      dispatch(allActions.DataAction.AppLoader(true));
      const response = await MindAxios.post(
        // TRADE_PROPOSAL -> CREATE
        Env.createUrl("trade-offers"),
        body
      );
      dispatch(allActions.DataAction.AppLoader(false));
      // console.log("res", response);
      if (response.status == 200) {
        dispatch(allActions.DetailAction.StampsList([]));
        Helper.showToastMessage("Proposal sent successfully", colors.green);
        props.navigation.goBack();
      } else {
        alert(language?.serverError);
      }
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <MainHeader
        title={language?.tradeProposal}
        onPressBack={() => {
          dispatch(allActions.DetailAction.StampsList([]));
          props?.navigation.goBack();
        }}
      />
      <View style={styles.topSection}>
        <AppText style={styles.nameText}>Proposal Info</AppText>
        <FloatingInput
          label="Description*"
          value={comment}
          onChangeText={(text) => {
            setError(false);
            setComment(text);
          }}
          error={error ? error : false}
        />
      </View>
      <AppText style={styles.itemText}>My Trade Item</AppText>
      {multipleOffer == "coins_and_stamps" ? (
        !selectedStamp?.length ? (
          <View style={styles.cardSection}>
            <View style={styles.card}>
              <Image source={images.Coin} style={styles.coinIcon} />
              <AppText style={{ fontSize: 12, fontWeight: "500" }}>
                Coin: {coins ? coins : "00"}
              </AppText>
            </View>
            <AntDesign name="swap" size={30} color={colors.theme} />
            <View style={styles.card}>
              <Image source={{ uri: tradeUri }} style={styles.stampIcon} />
            </View>
          </View>
        ) : (
          <View style={styles.cardSection}>
            <View style={{ height: 92 }}>
              <FlatList data={selectedStamp} renderItem={renderStampList1} />
            </View>
            <AntDesign name="plus" size={26} color={colors.theme} />
            <View style={styles.cardMultiple}>
              <Image source={images.Coin} style={styles.coinIcon1} />
              <AppText style={{ fontSize: 12, fontWeight: "500" }}>
                Coin: {coins ? coins : "00"}
              </AppText>
            </View>

            <AntDesign name="swap" size={26} color={colors.theme} />
            <View style={styles.cardMultiple}>
              <Image source={{ uri: tradeUri }} style={styles.stampIcon1} />
            </View>
          </View>
        )
      ) : (
        <View style={styles.cardSection}>
          {offer?.includes("coins") ? (
            <View>
              <View style={styles.card}>
                <Image source={images.Coin} style={styles.coinIcon} />
                <AppText style={{ fontSize: 12, fontWeight: "500" }}>
                  Coin: {coins ? coins : "00"}
                </AppText>
              </View>
            </View>
          ) : selectedStamp?.length ? (
            <View style={{ height: 142 }}>
              <FlatList data={selectedStamp} renderItem={renderStampList} />
            </View>
          ) : (
            <View style={styles.card}>
              <Image source={images.noImg} style={styles.stampIcon} />
              <AppText style={{ fontSize: 10 }}>Stamp Not Selected</AppText>
            </View>
          )}
          <AntDesign name="swap" size={30} color={colors.theme} />
          <View style={styles.card}>
            <Image source={{ uri: tradeUri }} style={styles.stampIcon} />
          </View>
        </View>
      )}
      <View style={styles.addSection}>
        {offer?.includes("coins") && (
          <TouchableOpacity
            style={styles.addItem}
            onPress={() =>
              canSendCoins ? setModalVisible(true) : openPermissionSheet()
            }
          >
            <Image source={images.Coin} style={styles.itemIcon} />
            <AppText style={styles.stampText}>Add Coins</AppText>
          </TouchableOpacity>
        )}
        {offer?.includes("stamps") && (
          <TouchableOpacity
            style={styles.addItem}
            onPress={() => {
              // console.log("counter", counter)
              canSendStamps
                ? props.navigation.navigate("UserTradeStamp", {
                    userId: counter?.user_id,
                  })
                : openPermissionSheet();
            }}
          >
            <Image source={images.IconImages} style={styles.itemIcon} />
            <AppText style={styles.stampText}>Add Stamps</AppText>
          </TouchableOpacity>
        )}
      </View>
      <View
        style={[
          styles.btnSection,
          { justifyContent: counter ? "center" : "space-between" },
        ]}
      >
        {!counter ? (
          <CustomButton
            bg={colors.cWhite}
            style={{ borderWidth: 1, borderColor: colors.borderColor }}
            label="Draft"
            textColor={colors.placeholderText}
            fontWeight="600"
            width={wp(45)}
            height={45}
            fontSize={16}
            onPress={() => checkValidation(false)}
          />
        ) : null}
        <GradBtn
          label="Send"
          height={45}
          width={wp(45)}
          style={{ marginTop: 0 }}
          fontWeight="600"
          onPress={() => checkValidation(true)}
        />
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <EvilIcons name="close" size={30} />
            </TouchableOpacity>
            <AppText style={styles.modalText}>Available Coins</AppText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <View style={styles.coinSection}>
                <Image source={images.Coin} style={styles.itemIcon} />
              </View>
              <View style={styles.valueSection}>
                <AppText style={styles.coinText}>{currentUser?.coins}</AppText>
              </View>
            </View>
            <View style={styles.inputSection}>
              <AppText style={styles.modalText}>Add For Trade</AppText>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={images.Coin} style={styles.itemIcon1} />
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => setCoins(text)}
                  value={coins}
                  placeholder="0000"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <Btn
              label="Go"
              height={36}
              width={60}
              fontSize={14}
              style={{ alignSelf: "flex-end", marginRight: 20, marginTop: 10 }}
              onPress={() => {
                Keyboard.dismiss();
                console.log("offer_amount", offer_amount);
                if (coins < offer_amount) {
                  Helper.showToastMessage(
                    `Coins must be greater then or equal to ${offer_amount}`,
                    colors.blueTheme
                  );
                } else if (coins > available_coins) {
                  Helper.showToastMessage(
                    `${coins} coins not available in your wallet`,
                    colors.blueTheme
                  );
                } else {
                  setModalVisible(!modalVisible);
                }
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
