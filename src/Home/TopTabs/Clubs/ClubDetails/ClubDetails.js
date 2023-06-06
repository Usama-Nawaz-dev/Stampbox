import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";

import { styles } from "./styles";
import AppText from "../../../../../components/AppText";
import { images } from "../../../../../assets/images/Images";

import moment from "moment";
import AntDesign from "react-native-vector-icons/AntDesign";

import colors from "../../../../../constant/colors";
import { ClubInviteSheet } from "../../../../Sheets";
import { InterestItem } from "../../../../../components";

import {
  MainHeader,
  CustomButton,
  BottomSheet,
  GradBtn,
  HtmlTag,
} from "../../../../../components";

import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";

import { ClubFeed } from "./ClubFeed";
import { ClubMemberSheet } from "./MemberSheet";
import { ShareModal } from "../../../ShareModal";
import EmptyState from "../../../../../components/EmptyState";
import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";
// import { dark as theme } from "../../../../../constant/colorsConfig";

export const ClubDetails = (props) => {
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const clubDetail = useSelector((state) => state.DetailReducer.clubDetail);
  const [itemDetail, setItemDetail] = useState(null);

  const focused = useIsFocused();
  const dispatch = useDispatch();
  const inviteUserSheet = useRef();
  const memberSheetRef = useRef();
  const owner = currentUser?.id === itemDetail?.user_id;
  const created_at = moment(itemDetail?.created_at).format(
    "YYYY-MM-DD [at] h:mm A"
  );
  const updated_at = moment(itemDetail?.updated_at).format(
    "YYYY-MM-DD [at] h:mm A"
  );

  const [page, setPage] = useState(1);
  const [endPage, setEndPage] = useState(0);
  const [feedList, setFeedList] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [showJoin, setShowJoin] = useState(itemDetail?.is_current_user_pending);
  const {
    myState: { language },
  } = useContext(AuthContext);

  //Club Feed States
  const [selected, setSelected] = useState(null);
  const [itemType, setItemType] = useState(null);
  const [itemOption, setOptions] = useState(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const { theme }= useContext(ThemeContext);

  useEffect(() => {
    if (focused) {
      setItemDetail(clubDetail);
      fetchClubFeeds();
    }
  }, [focused]);

  const fetchClubFeeds = async () => {
    const response = await MindAxios.get(
      Env.createUrl(`club-feeds?club_id=${clubDetail?.id}`)
    );
    const { e } = response;
    const error = e?.response?.data;
    if (response?.status == 200) {
      let end_page;
      let paginated = response?.data?.result?.paginated_items;
      end_page = paginated?.last_page;
      //   const dataList = paginated?.data?.map(
      //     ({ club_feed: feedable, club_feed_type: feedable_type, ...rest }) => ({
      //       feedable,
      //       feedable_type,
      //       ...rest,
      //     })
      //   );
      // console.log(dataList, paginated?.last_page);
      const _data = response?.data?.result?.paginated_items?.data;
      setPage(1);
      setEndPage(end_page);
      setFeedList(_data);
    } else if (error) {
      alert("Error", `${error?.message}`);
    }
  };

  const onJoinClub = async () => {
    const body = {
      club_id: itemDetail?.id,
      invited_by_id: null,
      status: "Pending",
      user_id: currentUser?.id,
    };
    const response = await MindAxios.post(Env.createUrl(`club-members`), body);
    if (response?.status === 200) {
      setShowJoin(true);
      fetchSingleClub();
      Helper.showToastMessage("Club Request Sent Successfully", colors.green);
    } else {
      alert(language?.serverError);
    }
  };

  const onLeaveClub = async () => {
    const response = await MindAxios.delete(
      Env.paramUrl(`club-members`, itemDetail?.current_user_member_info[0]?.id)
    );
    false;
    if (response?.status === 200) {
      Helper.showToastMessage("Club Left Successfully", colors.green);
      fetchSingleClub();
    } else {
      alert(language?.serverError);
    }
  };

  const fetchSingleClub = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.paramUrl(`clubs`, itemDetail?.id));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result?.item;
      setItemDetail(_data);
    } else {
      alert("Sever Error.");
    }
  };

  const fetchMoreClubs = async () => {
    if (page < endPage && feedList?.length >= 10) {
      setIsLoading(true);
      const response = await MindAxios.get(
        Env.createUrl(`club-feeds?club_id=${itemDetail?.id}&page=${page + 1}`)
        // Env.createUrl(`club-feeds?club_id=${itemDetail?.id}&user_id=${currentUser?.id}&page=${page + 1}`)
      );
      setIsLoading(false);
      // console.log("res-->", response);
      const error = response?.response?.data;
      if (response?.status == 200) {
        let paginated = response?.data?.result?.paginated_items;
        // console.log("data--->", data);
        // const dataList = paginated?.data?.map(
        //   ({
        //     club_feed: feedable,
        //     club_feed_type: feedable_type,
        //     ...rest
        //   }) => ({
        //     feedable,
        //     feedable_type,
        //     ...rest,
        //   })
        // );
        const _data = response?.data?.result?.paginated_items?.data;
        setPage(page + 1);
        setFeedList([...feedList, ..._data]);
        // setFeedList([...feedList, ...dataList]);
      } else {
        alert("Error", `${error?.message}`);
      }
    }
  };

  async function onRefresh() {
    setIsFetching(true);
    await fetchClubFeeds(true);
    setTimeout(() => {
      setIsFetching(false);
    }, 1000);
  }

  const feedBody = () => {
    if (feedList?.length > 0) {
      return (
        <ClubFeed
          navigation={props?.navigation}
          feeds={feedList}
          endLoading={isLoading}
          fetchMoreData={fetchMoreClubs}
          isFetching={isFetching}
          onRefresh={onRefresh}
          header={<Header />}
          opt={{
            itemOption,
            setOptions,
            fetchClubFeeds,
            onUpdate: (data) =>
              props.navigation.navigate("UpdatePost", { data }),
            loader: (val) => dispatch(allActions.DataAction.ActivityModal(val)),
            updateFeeds: (val) => setFeedList(val),
            feeds: feedList,
            modalVisible: shareModalVisible,
            setShareModalVisible,
            setSelected,
            setItemType,
          }}
        />
      );
    } else if (feedList?.length == 0) {
      return (
        <View style={styles.noPost}>
          <AppText style={[styles.postText, { color: theme?.darkGrey}]}>
            {language?.noFeedsPostedYet}
          </AppText>
        </View>
      );
    } else if (feedList?.length == undefined) {
      return (
        <View style={{ marginVertical: hp(3) }}>
          <EmptyState
            onPress={fetchClubFeeds}
            desc="We could not find the request you are looking for!"
          />
        </View>
      );
    }
  };
  const Header = () => {
    return (
      <>
        <ImageBackground
          style={styles.clubImg}
          resizeMode="cover"
          source={{ uri: itemDetail?.image_url }}
        ></ImageBackground>
        <View style={styles.infoSection}>
          <AppText style={styles.heading}>
            {itemDetail?.name
              ? Helper.capitalizeFirstLetter(itemDetail?.name)
              : null}
          </AppText>
          <AppText style={[styles.infoText, { color: theme?.lightText}]}>
            {itemDetail?.privacy_type} {language?.group} .{" "}
            <AppText
              style={styles.memberText}
              onPress={() => memberSheetRef?.current?.open()}
            >
              {itemDetail?.club_members_count} {language?.members}
            </AppText>
          </AppText>
          <AppText style={[styles.infoText, { color: theme?.lightText}]}>
            {language?.created_at}: {created_at}
          </AppText>
          <AppText style={[styles.infoText, { color: theme?.lightText}]}>
            {language?.updated_at}: {updated_at}
          </AppText>
          {itemDetail?.is_current_user_joined ? (
            <View style={styles.btnSection}>
              {!owner ? (
                <CustomButton
                  label={language?.leaveClub}
                  height={25}
                  width={wp(25)}
                  fontSize={12}
                  fontWeight="500"
                  bg={colors.background}
                  textColor={colors.btnText}
                  onPress={() => onLeaveClub()}
                />
              ) : null}
              <CustomButton
                label={language?.Invite}
                height={25}
                width={wp(25)}
                fontSize={12}
                fontWeight="500"
                bg={colors.background}
                textColor={colors.btnText}
                onPress={() => inviteUserSheet?.current?.open()}
              />
            </View>
          ) : (
            <View style={styles.btnSection}>
              {showJoin ? (
                <GradBtn
                  height={25}
                  fontSize={12}
                  disabled={true}
                  fontWeight={"500"}
                  label={"Request Pending"}
                  style={[styles.button, { width: wp(31) }]}
                />
              ) : (
                <GradBtn
                  height={25}
                  fontSize={12}
                  fontWeight={"500"}
                  style={styles.button}
                  label={"Join Club"}
                  onPress={onJoinClub}
                />
              )}
            </View>
          )}
        </View>
        <View style={styles.infoSection1}>
          <AppText style={styles.subHeading}>About Club</AppText>
          <AppText style={[styles.detail, { color: theme?.lightText}]}>
            {itemDetail?.description ? itemDetail?.description : "N/A"}
          </AppText>
          <AppText style={styles.subHeading}>Club Rules</AppText>
          {/* <AppText style={styles.detail}>{itemDetail?.rule ? itemDetail?.rule : 'N/A'}</AppText> */}
          <HtmlTag style={styles.htmlText} description={itemDetail?.rule} />
          <AppText style={styles.subHeading}>Topics</AppText>
          {itemDetail?.topics?.length ? (
            <ScrollView horizontal>
              {itemDetail?.topics?.map((item, index) => {
                return (
                  <View style={{ marginBottom: hp(0.5), marginRight: wp(2) }}>
                    <InterestItem item={item?.name} maxWidth={wp(45)} />
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <View>
              <AppText style={[styles.emptyList, { color: theme?.theme}]}>
                Club don't have any selected topics
              </AppText>
            </View>
          )}
          <AppText style={styles.subHeading}>{language?.categories}</AppText>
          {itemDetail?.categories?.length ? (
            <ScrollView horizontal>
              {itemDetail?.categories?.map((item, index) => {
                return (
                  <View style={{ marginBottom: hp(0.5), marginRight: wp(2) }}>
                    <InterestItem item={item?.name} maxWidth={wp(45)} />
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <View>
              <AppText style={[styles.emptyList, { color: theme?.theme}]}>
                Club don't have any selected categories
              </AppText>
            </View>
          )}
        </View>
        {itemDetail?.is_current_user_joined ? (
          <View style={[styles.addPost, { backgroundColor: theme?.white}]}>
            <Image
              source={{
                uri: currentUser
                  ? currentUser.image_url
                  : "https://randomuser.me/api/portraits/men/71.jpg",
              }}
              style={styles.postImg}
            />
            <TouchableOpacity
              style={styles.postAdd}
              onPress={() =>
                props.navigation.navigate("SharePost", { club: itemDetail })
              }
            >
              <AppText style={[styles.addPostText, { color: theme?.theme}]}>Create a post</AppText>
              <Image
                style={{ width: 22, height: 22, tintColor: theme?.darkGrey}}
                source={images.IconImages}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: theme?.white}]}>
      <MainHeader
        title={language?.clubDetail}
        onPressBack={() => {
          props.navigation.goBack();
          dispatch(allActions.DetailAction.ClubDetail(null));
        }}
        rightIcon={
          owner || itemDetail?.is_current_user_admin ? (
            <TouchableOpacity
              style={styles.edit}
              onPress={() =>
                props.navigation.navigate("CreateClub", { Item: itemDetail })
              }
            >
              <AntDesign name="edit" color={colors.cWhite} size={22} />
            </TouchableOpacity>
          ) : null
        }
      />
      <ScrollView>
        {Header()}
        {itemDetail?.is_current_user_joined ? (
          feedBody()
        ) : (
          <View style={styles.noPost}>
            <AppText style={[styles.postText, { color: theme?.theme}]}>
              Join Club to see its posts!
            </AppText>
          </View>
        )}
      </ScrollView>

      <BottomSheet
        ref={inviteUserSheet}
        title={"Invite Members in Club"}
        onPressClose={() => inviteUserSheet?.current?.close()}
        dropDown={false}
        sheetHeight={hp(80)}
        ChildComponent={<ClubInviteSheet />}
      />

      <BottomSheet
        ref={memberSheetRef}
        title={"Club Members"}
        onPressClose={() => memberSheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={hp(80)}
        ChildComponent={<ClubMemberSheet />}
      />

      {/* Share Feeds Modal */}
      <ShareModal
        modalVisible={shareModalVisible}
        setShareModalVisible={setShareModalVisible}
        userId={currentUser?.id}
        selected={selected}
        setSelected={setSelected}
        selectedItem={itemType}
      />
    </View>
  );
};
