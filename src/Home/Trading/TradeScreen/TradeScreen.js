import React, { useCallback, useState, useRef, useContext } from "react";
import {
  Image, View, ScrollView,
  TouchableOpacity
} from "react-native";

import AnimatedHeader from "react-native-animated-header";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../../constant/colors";
import { placeHolder } from "../../../../constant/Paths";

import { styles } from "./styles";
import Btn from "../../../../components/Btn";
import BackIconBtn from "../../../../components/BackIconBtn";
import AppText from "../../../../components/AppText";

import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";

import Info from "../../../../components/Info";
import ItemCard from "./ItemCard";
import { images } from "../../../../assets/images/Images";
import { light as theme } from "../../../../constant/colorsConfig";

import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import allActions from "../../../../redux/actions";
import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";
import Helper from "../../../Helper";

import {
  TimeLeft, BottomSheet
} from "../../../../components";
import { UserInfoSheet } from "../../../Sheets";
import AuthContext from "../../../Context/AuthContext";

export const TradeScreen = (props) => {
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const detail = useSelector((state) => state.DetailReducer.tradeDetail);
  const otherUser = useSelector((state) => state.DetailReducer.otherUser);
  // console.log(currentUser,"................")

  const [load, setLoad] = useState(false);
  const tradeData = detail?.feedable ? detail?.feedable : detail;
  let user = tradeData?.user;

  const accepting_offer = tradeData?.accepting_offer;

  const offer_amount = tradeData?.offer_amount;

  const trade_offers_count = tradeData?.trade_offers_count;
  const {myState: {language}}=useContext(AuthContext);

  const data = tradeData?.tradeables?.length
    ? tradeData?.tradeables[0]?.tradeable : null
  // console.log('data----->', data)
  let screen = data?.name;
  let uri = data?.medias?.length ? data?.medias[0]?.media_url : null;
  let uuid = tradeData?.feedable?.uuid ?
    tradeData?.feedable?.uuid :
    tradeData?.uuid;

  let country = data?.country;
  let condition = data?.condition;
  let format = data?.format;
  let desc = data?.description;
  let denomination = data?.denomination;
  let type = data?.catalogue_number?.length
    ? data?.catalogue_number[0]?.type
    : null;
  let cataType1 = data?.catalogue_number?.length
    ? data?.catalogue_number[0]?.type
    : null;
  let cataVal1 = data?.catalogue_number?.length
    ? data?.catalogue_number[0]?.number
    : null;
  let yearIssued = data?.year_issued;
  let color = data?.color;
  let grade = data?.grade;
  let perforation = data?.perforation;
  let offers = tradeData?.feedable?.trade_offers_count;
  //   let DATA_ARRAY = [...Array(10).keys()];
  //   console.log(DATA_ARRAY)

  const [tradeList, setTradeList] = useState(null)

  const dispatch = useDispatch();
  const userInfoSheetRef = useRef();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await getRelated(tradeData?.id);
        await getUser(user?.id)
      })();
    }, [tradeData?.id])
  );

  const owner = currentUser?.id === otherUser?.id;

  const getRelated = async (id) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(
        `get-similar`,
        `?similarable_type=trade&similarable_id=${id}`
      )
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result;
      const newData = _data.filter((item) => item?.user_id != currentUser?.id);
      setTradeList(newData)
    } else {
      // alert("Server Error.")
    }
  };

  const getUser = async (id) => {
    const response = await MindAxios.get(Env.paramUrl("users", id));
    // console.log('user res--->', response?.data?.result?.user);
    if (response?.status == 200) {
      const data = response?.data?.result?.user;
      dispatch(allActions.DetailAction.OtherUser(data));
    }
  }

  return (
    <AnimatedHeader
      style={styles.container}
      // backText='Back'
      title={screen}
      renderLeft={() => (
        <BackIconBtn onPress={() => {
          dispatch(allActions.DetailAction.OtherUser(null));
          dispatch(allActions.DetailAction.TradeDetail({}));
          props.navigation.goBack();
        }} />
      )}
      // renderRight={() => (<Icon name='add' style={{ marginRight: 20 }} />)}
      backStyle={{ marginLeft: 60 }}
      backTextStyle={{ fontSize: 18 }}
      titleStyle={styles.titleStyle}
      headerMaxHeight={200}
      imageSource={{
        uri: uri,
      }}
      defaultSource={images.bigNoImg}
      loaded={load}
      onLoadImg={() => setLoad(true)}
      toolbarColor="#FFF"
      disabled={false}
    >
      <ScrollView>
        <AppText style={styles.idText}>UUID: {uuid} </AppText>
        <View style={styles.offerSection}>
          <View style={{ width: wp(35) }}>
            <AppText style={styles.offerText}>{language?.acceptingOffers}:</AppText>
            {accepting_offer !== 'stamps' &&
              <AppText style={styles.offerText}>{language?.acceptingCoins}:</AppText>}
            <AppText style={styles.offerText}>{language?.totalOffer}:</AppText>
          </View>
          <View>
            <AppText style={styles.offerText1}>{accepting_offer}</AppText>
            {accepting_offer !== 'stamps' &&
              <AppText style={styles.offerText1}>{offer_amount}</AppText>}
            <AppText style={styles.offerText1}>{trade_offers_count}</AppText>
          </View>
        </View>
        <AppText style={styles.heading}>{language?.itemDetails}:</AppText>
        <View style={{ width: "100%", flexDirection: "row" }}>
          <View style={{ width: "50%", flexDirection: "row" }}>
            <View style={{ width: wp(3) }} />
            <View>
              <Info key1={language?.country} val1={country} />
              <Info key1={cataType1} val1={cataVal1} />
              <Info key1={"Y&T"} val1={"ABCD"} />
              <Info key1={language?.perforation} val1={perforation} />
              <Info key1={"Condition"} val1={condition} />
              <Info key1={"Format"} val1={format} />
              <Info key1={language?.totalOffer} val1={offers} />
            </View>
          </View>
          <View style={{ width: "50%" }}>
            <Info key1={"Year"} val1={yearIssued} />
            <Info key1={"MI"} val1={type} />
            <Info key1={"Denomination"} val1={denomination} />
            <Info key1={"Color"} val1={color} />
            <Info key1={"Grade"} val1={grade} />
            <Info key1={language?.est_SC_Value} val1={null} />
          </View>
        </View>
        <Info key1={"Description"} val1={desc} style={{ paddingHorizontal: wp(3) }} />
        <TimeLeft label="Expiry Time" item={tradeData} noBid />
        <View style={styles.userSection}>
          <View style={styles.cardHeader}>
            <View style={styles.upperSection}>
              <Image style={styles.userImg} source={{ uri: user?.image_url }} />
              <View style={styles.nameSection}>
                <AppText style={styles.ownerText}>{language?.owner}</AppText>
                <AppText style={{ fontWeight: "500" }}>
                  {user?.full_name}
                </AppText>
              </View>
            </View>
            <Btn label={language?.myDetails}
              fontSize={10} height={30} width={wp(25)}
              iconLeft={
                <Ionicons name="eye-outline" color={"#fff"} size={hp(2)} />
              }
              onPress={() => userInfoSheetRef.current.open()}
            />
          </View>
          {!owner && <View style={[styles.cardHeader, { marginTop: hp(1.5) }]}>
            <View style={styles.upperSection}>
              <Btn label="Trade" fontSize={10}
                height={30} width={wp(25)}
                iconLeft={<AntDesign name="swap" color={"#fff"} size={hp(2)} />}
                onPress={() => props.navigation.navigate("ChooseProposal",
                  { ItemDetail: tradeData })}
              />
              <Btn label={language?.myMarket} fontSize={10}
                height={30} width={wp(25)} style={{ marginLeft: hp(1) }}
                iconLeft={
                  <Ionicons name="eye-outline" color={"#fff"} size={hp(2)} />
                }
                onPress={() => props.navigation.navigate("UserMarket")}
              />
            </View>
            <View style={styles.upperSection}>
              <Btn
                height={hp(4.5)}
                width={hp(4.5)}
                style={{ backgroundColor: "transparent" }}
                iconLeft={
                  <MaterialIcons
                    name="bookmark-border"
                    color={colors.theme}
                    size={hp(4.5)}
                  />
                }
              />
              {/* <TouchableOpacity style={styles.flagBtn}>
                <MaterialIcons
                  name="outlined-flag"
                  color={colors.lightText}
                  size={hp(3)}
                />
              </TouchableOpacity> */}
            </View>
          </View>}
        </View>
        <View style={styles.lowerSection}>
          <AppText style={styles.itemHeading}>{language?.topRelatedItems}</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tradeList?.map((item, index) => {
              // console.log(index);
              return (
                <View
                  style={{
                    marginRight: 10,
                    marginLeft: index == 0 ? 1 : 0,
                    marginBottom: hp(2)
                  }}
                >
                  <ItemCard Item={item}
                    onPress={() => {
                      dispatch(allActions.DetailAction.TradeDetail(item));
                      props.navigation.replace("TradeScreen");
                    }} />
                </View>
              );
            })}
          </ScrollView>
        </View>
        <BottomSheet
          ref={userInfoSheetRef}
          title={language?.userDetails}
          onPressClose={() => userInfoSheetRef?.current?.close()}
          dropDown={false}
          sheetHeight={hp(95)}
          ChildComponent={
            <UserInfoSheet currentUser={user}
              onSelectPhone={() => {
                userInfoSheetRef?.current?.close();
                setTimeout(() => {
                }, 300)
              }}
              onSelectStampbox={() => {
                userInfoSheetRef?.current?.close();
                setTimeout(() => {
                }, 300);
              }}
              onPressCancel={() => {
                setTimeout(() => {
                  userInfoSheetRef?.current?.close();
                }, 300);
              }}
            />
          }
        />
      </ScrollView>
    </AnimatedHeader>
  );
};
