import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { styles } from "./styles";
import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";
import UserCard from "../../../../components/UserCard";

import { ShareModal } from "../../ShareModal";
import ErrorMessage from "../../../forms/ErrorMessage";

import {
  GradBtn,
  MenuSheet,
  MainHeader,
  BottomSheet,
  ImageListSlider,
  ImageZoomViewer,
} from "../../../../components";

import Entypo from "react-native-vector-icons/Entypo";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import AuthContext from "../../../Context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Helper from "../../../Helper";
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";
import ThemeContext from "../../../Context/ThemeContext";

//Bounty Tabs
import {
  HunterTab,
  BountyOfferTab,
  SelectHunterTab,
} from "../BountyDetailTabs";

import { BountyInviteSheet } from "../InvitationSheet/BountyInviteSheet";
import { createMaterialTopTabNavigator } from "../../../../CustomPackages/material-top-tabs";
const Tab = createMaterialTopTabNavigator();

export const Bounty = (props) => {
  const sliderComp = useRef();
  const offerSheetRef = useRef();
  const inviteUserSheet = useRef();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const bountyDetail = useSelector((state) => state.DetailReducer.bountyDetail);
  const currentBounty = bountyDetail?.feedable
    ? bountyDetail?.feedable
    : bountyDetail;

  const [itemDetail, setItemDetail] = useState(currentBounty);
  const [loading, setLoading] = useState(false);

  const [imageViewer, setImageViewer] = useState(false);
  const [imageViewerData, setImageViewerData] = useState([]);
  const [imageViewerInitialIndex, setImageViewerInitialIndex] = useState(0);

  const [errMsg, setErrMsg] = useState(false);
  const [errMsg1, setErrMsg1] = useState(false);

  const [subject, setSubject] = useState(null);
  const [notifyMsg, setNotifyMsg] = useState(null);
  const [selected, setSelected] = useState(null);

  const [hunterModalVisible, setHunterModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const { openPermissionSheet } = useContext(AuthContext);
  const canUserHunt = currentUser?.user_permissions?.includes(
    "marketplace.bounty.hunting"
  );
  const {
    myState: { language },
  } = useContext(AuthContext);

  const owner = currentUser?.id === itemDetail?.user?.id;
  const { theme } = useContext(ThemeContext);

  if (itemDetail?.medias) {
    var uri = itemDetail.medias[0]?.media_url;
  }

  useEffect(() => {
    if (isFocused) {
      //   getMyOffers();
      fetchSingleBounty();
      if (sliderComp?.current) {
        sliderComp?.current?.refresh(currentBounty?.medias);
      }
      let tempArray = [];
      itemDetail?.medias?.map((x, index) => {
        tempArray.push({ url: x.media_url });
      });
      setImageViewerData([...tempArray]);
    }
  }, [isFocused]);

  const fetchSingleBounty = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`bounties`, currentBounty?.id)
    );
    if (response.status === 200) {
      const _data = response?.data?.result?.item;
      let tempArray = [];
      _data?.medias?.map((x, index) => {
        tempArray.push({ url: x.media_url });
      });
      sliderComp?.current?.refresh(_data?.medias);
      setImageViewerData([...tempArray]);
      setItemDetail(_data);
    }
  };

  const optionIcon = (
    <Entypo size={22} color={colors.cWhite} name="dots-three-vertical" />
  );

  const updateBounty = () => {
    dispatch(allActions.DataAction.SelectedImg(itemDetail?.medias));
    props.navigation.navigate("EditBounty", { ItemDetail: itemDetail });
  };

  const removeBountyAlert = (item) =>
    Alert.alert(
      "Delete Bounty ?",
      "Are you sure you want to delete this bounty ?",
      [
        { text: "Cancel" },
        { text: "OK", onPress: () => removeBounty(item?.id) },
      ]
    );

  const removeBounty = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    let { headers } = await MindAxios.formdataConfig();
    fetch(Env.paramUrl("bounties", `${bountyDetail?.id}`), {
      method: "DELETE",
      headers: headers,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result?.success) {
          dispatch(allActions.DataAction.AppLoader(false));
          props.navigation.goBack();
        }
      })
      .catch((error) => {
        dispatch(allActions.DataAction.AppLoader(false));
        alert(error);
      });
  };

  const hunterOfferCheck = async () => {
    const userBadge = currentUser?.mrs_badge;

    if (
      (userBadge === "Gold" ||
        userBadge === "Platinum" ||
        userBadge === "Diamond") &&
      currentUser?.rating >= 3
    ) {
      onSendHunterOffer();
    } else {
      Helper.showToastMessage(
        "For sending hunter offer user badge must be gold or greater and user rating must be 3 or Greater.",
        colors.blueTheme
      );
    }
  };

  const onSendHunterOffer = async () => {
    setLoading(true);
    const body = { bounty_id: currentBounty?.id, status: "Hunting_request" };
    const response = await MindAxios.post(Env.createUrl(`bounty-offers`), body);
    setLoading(false);
    if (response.status === 200) {
      dispatch(allActions.DataAction.AppLoader(true));
      await fetchSingleBounty();
      dispatch(allActions.DataAction.AppLoader(false));
      Helper.showToastMessage("Hunter Offer Sent Successfully", colors.green);
    } else {
      Helper.showToastMessage(
        "There's some issue while sending hunter Offer",
        colors.danger
      );
    }
  };

  const checkValidation = async () => {
    if (subject !== null && notifyMsg !== null) {
      const body = {
        subject: subject,
        description: notifyMsg,
        bounty_id: currentBounty?.id,
      };
      setLoading(true);
      const response = await MindAxios.post(
        Env.createUrl(`notifications/custom-notfication`),
        body
      );
      setLoading(false);
      if (response.status === 200) {
        setHunterModalVisible(false);
        setSubject(null);
        setNotifyMsg(null);
        Helper.showToastMessage("Notification Sent Successfully", colors.green);
      } else {
        Helper.showToastMessage(
          "There's some issue while send Notification",
          colors.danger
        );
      }
    } else {
      if (!subject) {
        setErrMsg1("Notification subject is Required.");
      }
      if (!notifyMsg) {
        setErrMsg("Notification message is Required.");
      }
    }
  };

  const onClubShare = () => setShareModalVisible(true);
  const onInviteHunter = () => inviteUserSheet?.current?.open();

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title={"Bounty Detail"}
        onPressBack={() => {
          props.navigation.goBack();
        }}
        rightIcon={
          owner && (
            <MenuSheet
              customButton={optionIcon}
              options={[
                "Update Bounty",
                "Delete Bounty",
                "Share in Clubs",
                "Invite Hunters",
                "Cancel",
              ]}
              actions={[
                updateBounty,
                removeBountyAlert,
                onClubShare,
                onInviteHunter,
              ]}
            />
          )
        }
      />
      <ScrollView>
        <View style={{ backgroundColor: colors.background }}>
          <ImageListSlider
            ref={sliderComp}
            data={itemDetail?.medias}
            timer={2000}
            imageKey={"media_url"}
            width={wp(100)}
            height={hp(26)}
            local={false}
            separator={0}
            loop={false}
            autoscroll={false}
            indicator
            animation
            onPress={(i, data) => {
              setImageViewerInitialIndex(i);
              setImageViewer(true);
            }}
            // currentIndexCallback={index => console.log('Index', index+1)}
          />
        </View>
        <View style={styles.detailsSection}>
          <AppText style={[styles.uidText, { color: theme?.theme }]}>
            UUID: {itemDetail?.uuid}
          </AppText>
          <View style={styles.titleSection}>
            <AppText style={styles.titleText}>
              {Helper.capitalizeFirstLetter(itemDetail?.title)}
            </AppText>
            <>
              {owner ? (
                <GradBtn
                  height={hp(3.2)}
                  fontSize={12}
                  fontWeight={"500"}
                  borderRadius={hp(10)}
                  label={"Notify Hunters"}
                  style={styles.button1}
                  onPress={() => setHunterModalVisible(true)}
                />
              ) : null}
            </>
          </View>
          <AppText style={styles.description}>Item Description:</AppText>
          <View style={styles.infoSection}>
            <View style={styles.infoContainer}>
              <AppText style={styles.text}>Desire {language?.country}:</AppText>
              <AppText style={styles.text}>Desire {language?.year}:</AppText>
              <AppText style={styles.text}>Desire Format:</AppText>
              <AppText style={styles.text}>Desire Condition:</AppText>
              <AppText style={styles.text}>Desire Grade:</AppText>
              <AppText style={styles.text}>Desire Quality:</AppText>
              <AppText style={styles.text}>Status:</AppText>
            </View>
            <View>
              <AppText style={[styles.infoText, { color: theme?.lightText }]}>
                {itemDetail?.country ? itemDetail?.country : "N/A"}
              </AppText>
              <AppText style={[styles.infoText, { color: theme?.lightText }]}>
                {itemDetail?.year_issued ? itemDetail?.year_issued : "N/A"}
              </AppText>
              <AppText
                style={[styles.infoText, { color: theme?.lightText }]}
                numberOfLines={1}
              >
                {itemDetail?.format?.length
                  ? itemDetail?.format?.toString()
                  : "N/A"}
              </AppText>
              <AppText style={[styles.infoText, { color: theme?.lightText }]}>
                {itemDetail?.condition?.length ? itemDetail?.condition : "N/A"}
              </AppText>
              <AppText
                style={[styles.infoText, { color: theme?.lightText }]}
                numberOfLines={1}
              >
                {itemDetail?.grade?.length
                  ? itemDetail?.grade?.toString()
                  : "N/A"}
              </AppText>

              <AppText
                style={[styles.infoText, { color: theme?.lightText }]}
                numberOfLines={1}
              >
                {itemDetail?.quality?.length
                  ? itemDetail?.quality?.toString()
                  : "N/A"}
              </AppText>
              <AppText style={[styles.infoText, { color: theme?.lightText }]}>
                {itemDetail?.status ? itemDetail?.status : "N/A"}
              </AppText>
            </View>
          </View>
          <AppText>{itemDetail?.description}</AppText>
        </View>
        <AppText style={styles.offerText}>Bounty Award Offered</AppText>
        <View style={styles.offerSection}>
          <AppText style={styles.text}>
            Coins Offered:
            <AppText style={styles.priceText}>
              {" "}
              {itemDetail?.offered_coins}
            </AppText>
          </AppText>
          <AppText style={styles.text}>
            Amount Offered:
            <AppText style={styles.priceText}>
              {" "}
              ${itemDetail?.offered_amount ? itemDetail?.offered_amount : 0}
            </AppText>
          </AppText>
        </View>
        <AppText style={[styles.text, { paddingHorizontal: wp(3) }]}>
          Hunters Allowed:
          <AppText style={[styles.infoText, { color: theme?.lightText }]}>
            {" "}
            Multiple
          </AppText>
        </AppText>
        <View style={styles.userSection}>
          <AppText style={styles.sellerInfo}>Seller Information</AppText>
          <UserCard
            nameStyle={{ fontSize: 14, maxWidth: wp(70) }}
            starSize={hp(1.5)}
            imgSize={hp(5)}
            User={itemDetail?.user}
          />
          {!owner ? (
            <>
              {itemDetail?.is_hunter_selected ? (
                <GradBtn
                  label="Send Offer"
                  height={hp(6)}
                  fontSize={14}
                  fontWeight={"500"}
                  style={styles.button}
                  onPress={() =>
                    canUserHunt
                      ? props.navigation.navigate("BountyOffer", {
                          ItemDetail: itemDetail,
                        })
                      : openPermissionSheet()
                  }
                />
              ) : !itemDetail?.is_current_user_invited ===
                !itemDetail?.is_hunting_req_sent ? (
                <GradBtn
                  fontSize={14}
                  height={hp(6)}
                  loading={loading}
                  fontWeight={"500"}
                  style={styles.button}
                  label="Send Hunter Request"
                  onPress={hunterOfferCheck}
                />
              ) : null}
            </>
          ) : null}

          {/* Bounty Comment Compnent */}
          {/* <TouchableOpacity
            style={styles.commentBtn}
            onPress={() =>
              props.navigation.navigate("PostComment", {
                data: itemDetail,
                type: "Bounty",
              })
            }
          >
            <AppText style={styles.commentText}>
              {itemDetail?.comments_count} Comments
            </AppText>
          </TouchableOpacity> */}
        </View>
        {owner && (
          <View style={{ minHeight: hp(74) }}>
            <Tab.Navigator
              initialRouteName="Shop"
              tabBarOptions={{
                activeTintColor: theme?.theme,
                inactiveTintColor: theme?.lightText,
                labelStyle: styles.labelStyle,
              }}
              screenOptions={{
                //use this config
                tabBarIndicatorStyle: { backgroundColor: theme?.theme },
                tabBarStyle: { backgroundColor: theme?.white },
              }}
            >
              <Tab.Screen
                name="Bounty Offers"
                component={BountyOfferTab}
                options={{ tabBarLabel: "Bounty Offers" }}
              />
              <Tab.Screen
                name="Hunters Request"
                component={HunterTab}
                options={{ tabBarLabel: "Hunters Requests" }}
              />
              <Tab.Screen
                name="Select Hunters"
                component={SelectHunterTab}
                options={{ tabBarLabel: "Selected Hunter" }}
              />
            </Tab.Navigator>
          </View>
        )}
      </ScrollView>
      {/* Image Zoom Modal */}
      <ImageZoomViewer
        onPressClose={() => {
          setImageViewer(false);
        }}
        visible={imageViewer}
        images={imageViewerData}
        index={imageViewerInitialIndex}
      />

      {/* Notify Hunter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={hunterModalVisible}
        onRequestClose={() => {
          Alert.alert(language?.modal_has_been_closed);
          setJoinModalVisible(!hunterModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.headerSection}>
              <AppText style={styles.joinModalText}>Notify Hunters</AppText>
              <TouchableOpacity
                onPress={() => {
                  setHunterModalVisible(!hunterModalVisible);
                  setSubject(null);
                  setNotifyMsg(null);
                  setErrMsg(false);
                  setErrMsg1(false);
                }}
              >
                <EvilIcons name="close" size={hp(3.3)} color={colors.cWhite} />
              </TouchableOpacity>
            </View>

            <View style={styles.msgSection}>
              <AppText style={styles.msgText}>Write Subject*</AppText>
              <TextInput
                value={subject}
                style={styles.input}
                placeholder="Write Subject..."
                label={language?.enterDescription}
                onChangeText={(text) => {
                  setErrMsg1(false);
                  setSubject(text);
                }}
              />
              <ErrorMessage visible={errMsg1} error={errMsg1} />
              <AppText style={[styles.msgText, { marginTop: hp(1) }]}>
                Write Message*
              </AppText>
              <TextInput
                value={notifyMsg}
                style={styles.input}
                placeholder="Write Message..."
                label={language?.enterDescription}
                onChangeText={(text) => {
                  setErrMsg(false);
                  setNotifyMsg(text);
                }}
              />
              <ErrorMessage visible={errMsg} error={errMsg} />
              <GradBtn
                width="30%"
                label="Send"
                fontSize={14}
                height={hp(4)}
                loading={loading}
                style={styles.modalBtn}
                fontFamily={Fonts.IBM_Medium}
                onPress={checkValidation}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Share Bounty Modal in  Clubs */}
      <ShareModal
        from={"Bounty"}
        selected={selected}
        userId={currentUser?.id}
        setSelected={setSelected}
        selectedItem={itemDetail}
        modalVisible={shareModalVisible}
        setShareModalVisible={setShareModalVisible}
      />
      {/* Invite Hunters Sheet */}
      <BottomSheet
        ref={inviteUserSheet}
        title={"Invite Bounty Hunters"}
        dropDown={false}
        sheetHeight={hp(80)}
        ChildComponent={<BountyInviteSheet />}
        onPressClose={() => inviteUserSheet?.current?.close()}
      />
    </View>
  );
};
