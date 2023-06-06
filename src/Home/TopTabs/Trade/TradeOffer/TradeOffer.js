import React, { useState, useEffect, useContext } from "react";
import { View, Image, FlatList } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
  FloatingInput, GradBtn, SimpleHeader,
} from "../../../../../components";

import { styles } from "./styles";

import AppText from "../../../../../components/AppText";
import colors from "../../../../../constant/colors";
import { images } from "../../../../../assets/images/Images";

import CustomDropDown from "../../../../../components/CustomDropDown";
import AntDesign from "react-native-vector-icons/AntDesign";


const resonData = [
  { value: 'For Sale' },
  { value: 'For Trade' },
  { value: 'For Auction' },
  { value: 'For Exhitbition' },
]

import { useDispatch } from "react-redux";
import MindAxios from "../../../../../api/MindAxios";
import Env from "../../../../../api/Env";
import allActions from "../../../../../redux/actions";
import Helper from "../../../../Helper";
import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";

export const TradeOffer = (props) => {
  const { data, accept, ItemDetail } = props.route.params;
  const { id } = data;

  const stampUri1 = ItemDetail?.trade?.tradeables[0]?.tradeable?.medias[0]?.media_url
  const offer_Item = ItemDetail?.trade?.accepting_offer
  const offerList = ItemDetail?.trade_offerables;

  const stampList = offerList?.filter((item) => item?.type == 'Model');
  const coinData = offerList?.filter((item) => item?.type == 'Coin');

  const multiple = stampList?.length >= 1 && coinData?.length >= 1;
  
  const offer = accept ? "ACCEPT" : "REJECT";
  const myMsg = accept ? "Offer Accepted!" : "Offer Rejected!"
  
  const dispatch = useDispatch();
  
  const [reason, setReason] = useState(null)
  const [message, setMessage] = useState(myMsg);
  const [error, setError] = useState(null);
  const { myState: {language}}=useContext(AuthContext);
  const { theme }= useContext(ThemeContext);
  
  useEffect(() => {
    setTimeout(() => {
      if (stampList?.length) {
        Helper.showToastMessage("Scroll to see Offered Stamps", 'lightblue')
      }
    }, 1000)
  }, [])

  const checkValidations = async () => {
    let isValid = true;
    if (!message) {
      setError("Please enter the Message.");
      isValid = false;
    }

    if (isValid) {
      let body = {
        status: accept ? "Accepted" : "Rejected",
        action_reason: accept ? "I like your offer" : reason,
      };
 
      dispatch(allActions.DataAction.ActivityModal(true));

      const response = await MindAxios.post(Env.createUrl(`trade-offers/${id}`), body);
      dispatch(allActions.DataAction.ActivityModal(false));
      // console.log("verify response-->", res);
      if (response.status == 200) {
        accept ? props.navigation.navigate("ShipDetail", { item: data }) :
          props.navigation.goBack();
      } else { alert(language?.serverError) }
    }

  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={[styles.card,
      {
        marginVertical: 3,
        alignSelf: 'center',
      }]}>
        <Image source={{ uri: item?.trade_offerable?.medias[0]?.media_url }}
          style={styles.stampIcon} />
      </View>

    )
  }
  const renderItem1 = ({ item, index }) => {
    return (
      <View style={[styles.itemCard,
      {
        marginVertical: 3,
        alignSelf: 'center',
      }]}>
        <Image source={{ uri: item?.trade_offerable?.medias[0]?.media_url }}
          style={styles.stampIcon1} />
      </View>

    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <SimpleHeader
        title="Trade Offer"
        onPressBack={() => props?.navigation.goBack()}
      />
      <AppText style={styles.title}>{offer} TRADE OFFER</AppText>
      <View style={[styles.mainCard, {backgroundColor: theme?.cardColor}]}>
        {offer_Item === 'coins_and_stamps' && multiple ?
          <View style={styles.cardSection}>
            <View style={styles.card}>
              <Image source={{ uri: stampUri1 }} style={styles.stampIcon} />
            </View>
            <AntDesign name="swap" color={colors.theme}
              size={22} />
            <View style={{ width: wp(25), height: 104 }}>
              <FlatList
                data={stampList}
                renderItem={renderItem}
              />
            </View>
            <AntDesign name="plus" size={22} color={colors.theme} />
            <View style={styles.card}>
              <Image source={images.Coin} style={styles.coinIcon} />
              <AppText style={styles.priceText}>ESV US($):{" "}
                {coinData[0]?.value}</AppText>
            </View>
          </View> : <View style={styles.cardSection}>
            <View style={styles.itemCard}>
              <Image source={{ uri: stampUri1 }} style={styles.stampIcon1} />
            </View>
            <AntDesign name="swap" size={30} color={colors.theme} />
            {coinData?.length >= 1 &&
              <View style={styles.itemCard}>
                <Image source={images.Coin} style={styles.coinIcon1} />
                <AppText style={{ fontWeight: '500', fontSize: 12 }}
                >ESV US($):{" "}{coinData[0]?.value}</AppText>
              </View>}
            {stampList?.length >= 1 &&
              <View style={{ width: wp(38), height: 150 }}>
                <FlatList
                  data={stampList}
                  renderItem={renderItem1}
                />
              </View>}
          </View>}

        <FloatingInput
          label="Message" value={message}
          onChangeText={(text) => {
            setMessage(text);
            setError(false)
          }}
          error={error ? error : false}
        />
        {/* {!accept && <CustomDropDown
          data={resonData} style={{ marginBottom: 5 }}
          label={"Decline Reason"} value={reason}
          onChangeText={(value) => {
            setReason(value);
          }}
        />} */}
      </View>
      <GradBtn
        label="Send"
        height={50}
        onPress={() => {
          checkValidations();
        }}
        width="90%"
      />
    </View>
  );
};

