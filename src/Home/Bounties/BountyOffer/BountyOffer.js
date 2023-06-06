import React, { useContext, useState } from "react";
import { View, Image, TouchableOpacity, TextInput } from "react-native";

import { styles } from "./styles";
import AppText from "../../../../components/AppText";
import colors from "../../../../constant/colors";
import ErrorMessage from "../../../forms/ErrorMessage";

import { MainHeader, FloatingInput, GradBtn } from "../../../../components";

import Octicons from "react-native-vector-icons/Octicons";
import { useSelector, useDispatch } from "react-redux";

import allActions from "../../../../redux/actions";
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";
import Helper from "../../../Helper";
// import { dark as theme } from '../../../../constant/colorsConfig';

export const BountyOffer = (props) => {
  const { ItemDetail } = props.route.params;
  const dispatch = useDispatch();

  // console.log(ItemDetail)

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const selectedStamp = useSelector((state) => state.DetailReducer.stampDetail);
  // console.log(selectedStamp?.type)

  let uri = ItemDetail?.medias[0]?.media_url;
  let detailText;
  if (ItemDetail?.offered_coins > 0 && ItemDetail?.offered_amount > 0) {
    detailText = `By sending a bounty offer, if owner accept you will earn ${ItemDetail?.offered_coins} coins and $${ItemDetail?.offered_amount}`;
  } else if (ItemDetail?.offered_amount > 0) {
    detailText = `By sending a bounty offer, if owner accept you will earn $${ItemDetail?.offered_amount}`;
  } else if (ItemDetail?.offered_coins > 0) {
    detailText = `By sending a bounty offer, if owner accept you will earn ${ItemDetail?.offered_coins} coins`;
  }

  const [description, setDescription] = useState(null);
  const [link, setLink] = useState(null);

  const [error, setError] = useState(false);
  const [linkError, setLinkError] = useState(false);

  const [isStamp, setIsStamp] = useState(true);
  const [isMarket, setIsMarket] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const onConfirm = async () => {
    let isValid = true;
    if (!description) {
      setError("Please enter description.");
      isValid = false;
    }

    if (isLink && !link) {
      setLinkError("Please add item link.");
      isValid = false;
    }
    if (selectedStamp?.id == undefined && !isLink) {
      alert("Please add Stamp Item");
      isValid = false;
    }

    if (isValid) {
      let body;
      if (isLink) {
        body = {
          bounty_id: ItemDetail?.id,
          description: description,
          user_id: currentUser?.id,
          referral_link: link,
          referable_type: null,
          referable_id: null,
        };
      } else {
        body = {
          bounty_id: ItemDetail?.id,
          description: description,
          user_id: currentUser?.id,
          referral_link: null,
          referable_type: selectedStamp?.type,
          referable_id: selectedStamp?.id,
        };
      }
      //   console.log(body);
      dispatch(allActions.DataAction.AppLoader(true));
      const response = await MindAxios.post(
        // Bounty Offer -> Create
        Env.createUrl("bounty-offers"),
        body
      );
      dispatch(allActions.DataAction.AppLoader(false));
      // console.log(response)
      if (response.status == 200) {
        dispatch(allActions.DetailAction.StampDetail([]));
        Helper.showToastMessage("Bounty Offer Created.", colors.green);
        props.navigation.goBack();
      } else {
        alert(language?.serverError);
      }
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title="Send Bounty Offer"
        onPressBack={() => {
          dispatch(allActions.DetailAction.StampDetail([]));
          props.navigation.goBack();
        }}
      />
      <Image source={{ uri: uri }} style={styles.stampImg} />
      <View style={styles.infoSection}>
        <FloatingInput
          label="Description"
          value={description}
          onChangeText={(text) => {
            setError(false);
            setDescription(text);
          }}
          error={error}
        />
        <AppText style={[styles.offer, { color: theme?.lightText }]}>
          {detailText}
        </AppText>
        <AppText style={[styles.choose, { color: theme?.theme }]}>
          Choose Stamp From
        </AppText>
      </View>
      <View style={styles.tabSection}>
        <TouchableOpacity
          style={isStamp ? styles.selectedTab : styles.defaultTab}
          onPress={() => {
            setIsStamp(true);
            setIsMarket(false);
            setIsLink(false);
          }}
        >
          <AppText
            style={[styles.tabText, isStamp && { color: colors.cWhite }]}
          >
            {language?.myStamp}
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={isMarket ? styles.selectedTab : styles.defaultTab}
          onPress={() => {
            setIsStamp(false);
            setIsMarket(true);
            setIsLink(false);
          }}
        >
          <AppText
            style={[styles.tabText, isMarket && { color: colors.cWhite }]}
          >
            Marketplace
          </AppText>
        </TouchableOpacity>
        {/* <TouchableOpacity
                    style={isLink ? styles.selectedTab : styles.defaultTab}
                    onPress={() => {
                        setIsStamp(false);
                        setIsMarket(false);
                        setIsLink(true);
                    }}
                >
                    <AppText
                        style={[
                            styles.tabText,
                            isLink && { color: colors.cWhite },
                        ]}
                    >
                        Url_Link
                    </AppText>
                </TouchableOpacity> */}
      </View>
      <View style={styles.itemSection}>
        {!isLink ? (
          <TouchableOpacity
            style={styles.addStampCard}
            onPress={() => {
              isStamp
                ? props.navigation.navigate("UserStamp")
                : props.navigation.navigate("MarketStamp");
            }}
          >
            {!selectedStamp?.id ? (
              <Octicons name="plus" size={44} color={colors.theme} />
            ) : (
              <Image
                style={styles.img}
                source={{
                  uri: selectedStamp?.image_url
                    ? selectedStamp?.image_url
                    : selectedStamp?.medias?.length
                    ? selectedStamp?.medias[0]?.media_url
                    : null,
                }}
              />
            )}
          </TouchableOpacity>
        ) : (
          <>
            <TextInput
              style={styles.input}
              value={link}
              autoCapitalize="none"
              onChangeText={(text) => {
                setLinkError(false);
                setLink(text);
              }}
              placeholder="www.stampbox.com/stamp_id"
            />
            <ErrorMessage
              visible={linkError ? true : false}
              error={linkError}
            />
          </>
        )}
      </View>
      <View style={styles.bottomButton}>
        <GradBtn
          width={"90%"}
          borderRadius={7}
          height={50}
          label={"Confirm"}
          fontSize={16}
          bold={true}
          onPress={onConfirm}
        />
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => props.navigation.goBack()}
        >
          <AppText style={styles.cancelText}>Cancel</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};
