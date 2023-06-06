import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  Modal,
  FlatList,
  Clipboard,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { styles } from "./styles";
import { GradBtn } from "../../../components";
import colors from "../../../constant/colors";
import AppText from "../../../components/AppText";
import { placeHolder } from "../../../constant/Paths";
import { images } from "../../../assets/images/Images";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

import {
  UserInfo,
  StatusComp,
  SelectStamp,
  CustomButton,
  ProfileHeader,
  UserAlbumCard,
  ProficiencyComp,
} from "../../../components";

import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

export const UserProfile = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  // Redux values

  const otherUser = useSelector((state) => state.DetailReducer.otherUser);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const owner = currentUser?.id === otherUser?.id;

  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState(null);
  const { theme } = useContext(ThemeContext);

  const [stampList, setStampList] = useState(null);
  const [wishlist, setWishlist] = useState(null);
  const [collections, setCollections] = useState(null);

  const [isStampScreen, setIsStampScreen] = useState(true);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isCollection, setIsCollection] = useState(false);

  const [followModal, setFollowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    myState: { language },
  } = useContext(AuthContext);

  const subscription = userData?.subscriptions
    ? userData?.subscriptions[0]?.subscription_plan
    : null;

  useEffect(() => {
    if (isFocused) {
      setUserData(otherUser);
      setProfile(otherUser?.image_url);
      fetchSingle();
      getStamps();
      getWishlist();
      getCollections();
    } else {
      setProfile(null);
    }
  }, [isFocused]);

  const fetchSingle = async () => {
    const response = await MindAxios.get(
      Env.createUrl(`users/${otherUser?.id}`)
    );
    if (response?.status === 200) {
      const _data = response?.data?.result?.user;
      setUserData(_data);
      dispatch(allActions.DetailAction.OtherUser(_data));
    } else {
      alert(language?.serverError);
    }
  };

  const getStamps = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`stamp-items`, `?user_id=${otherUser?.id}`)
    );
    if (response?.status == 200) {
      setStampList(response?.data?.result?.paginated_items?.data);
    } else {
      alert(language?.serverError);
    }
  };

  const getWishlist = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`wishlists`, `?user_id=${otherUser?.id}&type=StampItem`)
    );
    if (response?.status == 200) {
      setWishlist(response?.data?.result?.paginated_items?.data);
    } else {
      alert(language?.serverError);
    }
  };

  const getCollections = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`albums`, `?type=Album&user_id=${otherUser?.id}`)
    );
    if (response?.status == 200) {
      let {
        data: {
          result: {
            paginated_items: { data: _data },
          },
        },
      } = response;
      setCollections(_data);
    } else {
      alert("Sever Error.");
    }
  };

  const onPressDetail = async (stampId) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.paramUrl("stamp-items", stampId));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const data = response?.data?.result?.stamp_item;
      dispatch(allActions.DetailAction.StampDetail(data));
      props.navigation.navigate("StampDetail");
    } else {
      alert(language?.serverError);
    }
  };

  const renderStamps = ({ item, index }) => {
    return (
      <View style={{ marginBottom: hp(2) }}>
        <SelectStamp
          ItemDetail={item?.wishable ? item?.wishable : item}
          onPress={() =>
            onPressDetail(item?.wishable ? item?.wishable?.id : item?.id)
          }
        />
      </View>
    );
  };

  const renderCollections = ({ item, index }) => {
    const canSeeAlbum = item?.is_private
      ? otherUser?.is_current_user_following
      : true;
    return (
      <View
        style={{
          marginRight: wp(3),
          marginLeft: index == 0 ? wp(1) : 0,
          marginTop: hp(1),
          marginBottom: hp(2),
        }}
      >
        <UserAlbumCard
          ItemDetail={item}
          disabled={!canSeeAlbum}
          onViewAlbum={() =>
            props.navigation.navigate("AlbumDetails", { Item: item })
          }
        />
      </View>
    );
  };

  //Follow User
  const followUser = async (item) => {
    const body = {
      target_user_id: otherUser?.id,
    };
    // console.log(body)
    const response = await MindAxios.post(
      Env.createUrl("users/toggle-follow"),
      body
    );
    // console.log("res-->", response);
    if (response?.status == 200) {
      Helper.showToastMessage("Follow request sent.", colors.green);
      fetchSingle();
    } else {
      alert(language?.serverError);
    }
  };

  // Cancel Request
  const cancelRequest = async (item) => {
    const body = {
      target_user_id: otherUser?.id,
    };
    // console.log(body)
    const response = await MindAxios.post(
      Env.createUrl("users/toggle-follow"),
      body
    );
    if (response?.status == 200) {
      Helper.showToastMessage("Follow request canceled.", colors.green);
      fetchSingle();
    } else {
      alert(language?.serverError);
    }
  };

  // Toggle Following
  const toggleFollow = async () => {
    setFollowModal(false);
    let body = {
      target_user_id: otherUser?.id,
    };
    // console.log(selectedItem)
    const response = await MindAxios.post(
      Env.createUrl("users/toggle-follow"),
      body
    );
    // console.log(response)
    if (response?.status == 200) {
      Helper.showToastMessage("Following removed.", colors.green);
      fetchSingle();
    } else {
      alert(language?.serverError);
    }
  };

  // On Accept Request
  const onAccept = async () => {
    setModalVisible(false);
    const body = { status: "Accepted" };
    const response = await MindAxios.post(
      Env.paramUrl(`follows`, otherUser?.following[0]?.follower_id),
      body
    );
    // console.log("Request Accept Response.", response)
    if (response?.status == 200) {
      Helper.showToastMessage("User request accepted.", colors.green);
      fetchSingle();
    } else {
      alert(language?.serverError);
    }
  };

  //On Reject Request
  const onReject = async () => {
    setModalVisible(false);
    const response = await MindAxios.delete(
      Env.paramUrl(`follows`, otherUser?.following[0]?.follower_id)
    );
    // console.log("Decline Request", response);
    if (response?.status == 200) {
      Helper.showToastMessage("User request rejected.", colors.green);
      fetchSingle();
    } else {
      alert(language?.serverError);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <ProfileHeader
        edit={false}
        title="User Profile"
        onPressBack={() => {
          dispatch(allActions.DetailAction.OtherUser(null));
          props.navigation.goBack();
        }}
      />
      <View style={styles.userSection}>
        <Image
          style={styles.userImage}
          source={profile ? { uri: profile } : placeHolder}
        />
      </View>
      <AppText style={styles.userText}>{userData?.full_name}</AppText>
      <View style={styles.userDetail}>
        <View style={styles.idSection}>
          <AppText style={[styles.userInfo, { color: theme?.black }]}>
            ID:{" "}
            <AppText style={[styles.valueText, { color: theme?.black }]}>
              {userData?.user_detail?.member_id}
            </AppText>
          </AppText>
          <TouchableOpacity
            style={{ marginLeft: wp(1) }}
            onPress={() => {
              Clipboard.setString(userData?.user_detail?.member_id);
              Helper.showToastMessage("Copied to Clipboard.", colors.green);
            }}
          >
            <Feather name="copy" size={hp(2)} color={theme.theme} />
          </TouchableOpacity>
        </View>
        <AppText style={styles.userInfo}>
          Scores: <AppText style={styles.valueText}>0 points</AppText>
        </AppText>
        <AppText style={styles.userInfo}>
          Sel: <AppText style={styles.valueText}>{userData?.mrs_badge}</AppText>
        </AppText>
      </View>
      <ScrollView style={{ marginBottom: hp(5), paddingTop: 10 }}>
        <View style={styles.followSection}>
          <Pressable
            style={styles.countSection}
            onPress={() => {
              if (otherUser?.is_current_user_can_view || owner) {
                props.navigation.navigate("UserNetwork", {
                  initialRoute: "Follwers",
                });
              } else {
                Helper.showToastMessage("Private Profile.", colors.blueTheme);
              }
            }}
          >
            <AppText style={styles.countText}>
              {userData?.followers_count}
            </AppText>
            <AppText style={styles.followText}>Followers</AppText>
          </Pressable>
          <View style={styles.verticleLine}></View>
          <Pressable
            style={styles.countSection}
            onPress={() => {
              if (otherUser?.is_current_user_can_view || owner) {
                props.navigation.navigate("UserNetwork", {
                  initialRoute: "Following",
                });
              } else {
                Helper.showToastMessage("Private Profile.", colors.blueTheme);
              }
            }}
          >
            <AppText style={styles.countText}>
              {userData?.following_count}
            </AppText>
            <AppText style={styles.followText}>{language?.following}</AppText>
          </Pressable>
          <View style={styles.verticleLine}></View>
          <View style={styles.countSection}>
            <AppText style={styles.countText}>
              {userData?.rating?.toFixed(1)}
            </AppText>
            <AppText style={styles.followText}>Rating</AppText>
          </View>
        </View>
        {!owner ? (
          <View style={styles.followBtn}>
            {userData?.is_follower_request_received ? (
              <View style={styles.rightSection}>
                {!userData?.is_current_user_following &&
                  !userData?.is_following_request_send && (
                    <TouchableOpacity onPress={followUser}>
                      <AppText style={styles.flBtn}>{language?.follow}</AppText>
                    </TouchableOpacity>
                  )}
                <CustomButton
                  bg={colors.background}
                  label={language?.followRequest}
                  textColor={colors.lightTheme}
                  fontWeight="500"
                  width={wp(26)}
                  height={30}
                  fontSize={10}
                  onPress={() => setModalVisible(true)}
                />
              </View>
            ) : userData?.is_following_request_send ? (
              <CustomButton
                bg={colors.background}
                label={language?.cancelRequest}
                textColor={colors.lightTheme}
                fontWeight="500"
                width={wp(26)}
                height={30}
                fontSize={10}
                onPress={cancelRequest}
              />
            ) : userData?.is_current_user_following ? (
              <CustomButton
                bg={colors.background}
                label={language?.following}
                textColor={colors.lightTheme}
                fontWeight="500"
                width={wp(22)}
                height={30}
                fontSize={12}
                onPress={() => setFollowModal(true)}
              />
            ) : (
              <CustomButton
                bg={colors.background}
                label={language?.follow}
                textColor={colors.lightTheme}
                fontWeight="500"
                width={wp(22)}
                height={30}
                fontSize={12}
                onPress={followUser}
              />
            )}
          </View>
        ) : null}
        {otherUser?.is_current_user_can_view || owner ? (
          <>
            <View style={{ marginTop: hp(3), paddingHorizontal: wp(3) }}>
              <StatusComp
                currentUser={false}
                subscription={subscription}
                userName={`${userData?.first_name} is`}
              />
            </View>
            <View style={{ marginTop: hp(3), paddingHorizontal: wp(3) }}>
              <ProficiencyComp
                selLevel={userData?.mrs_badge}
                cocaLeve={userData?.caco_level}
              />
            </View>
            <View style={{ marginVertical: hp(3), paddingHorizontal: wp(3) }}>
              <UserInfo userData={userData} />
            </View>
          </>
        ) : (
          <GradBtn
            width={wp(80)}
            fontSize={15}
            disabled={true}
            height={hp(5.5)}
            fontWeight={"600"}
            style={{ marginBottom: hp(2) }}
            label={"Private Profile"}
            icon={<Image source={images.Lock} style={styles.lockIcon} />}
          />
        )}
        <View style={styles.otherSection}>
          <AppText style={[styles.title, { color: theme?.black }]}>
            Others
          </AppText>
          <View style={styles.tabSection}>
            <TouchableOpacity
              style={isStampScreen ? styles.selectedTab : styles.defaultTab}
              onPress={() => {
                setIsStampScreen(true);
                setIsWishlist(false);
                setIsCollection(false);
              }}
            >
              <AppText
                style={[
                  styles.tabText,
                  isStampScreen && { color: colors.cWhite },
                ]}
              >
                Stamps
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={isWishlist ? styles.selectedTab : styles.defaultTab}
              onPress={() => {
                setIsStampScreen(false);
                setIsWishlist(true);
                setIsCollection(false);
              }}
            >
              <AppText
                style={[styles.tabText, isWishlist && { color: colors.cWhite }]}
              >
                Wishlist
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={isCollection ? styles.selectedTab : styles.defaultTab}
              onPress={() => {
                setIsStampScreen(false);
                setIsWishlist(false);
                setIsCollection(true);
              }}
            >
              <AppText
                style={[
                  styles.tabText,
                  isCollection && { color: colors.cWhite },
                ]}
              >
                Collections
              </AppText>
            </TouchableOpacity>
          </View>
          {isStampScreen &&
            (stampList?.length ? (
              <FlatList
                data={stampList}
                horizontal={true}
                style={{ paddingHorizontal: 2, marginVertical: hp(1.5) }}
                renderItem={renderStamps}
                keyExtractor={(item) => item.id}
              />
            ) : (
              <View style={styles.emptySection}>
                <AppText style={styles.emptyText}>
                  User don't have any Stamps.
                </AppText>
              </View>
            ))}
          {isWishlist &&
            (wishlist?.length ? (
              <FlatList
                data={wishlist}
                horizontal={true}
                style={{ paddingHorizontal: 2, marginVertical: hp(1.5) }}
                renderItem={renderStamps}
                keyExtractor={(item) => item.id}
              />
            ) : (
              <View style={styles.emptySection}>
                <AppText style={styles.emptyText}>
                  User don't have any wishlist Item.
                </AppText>
              </View>
            ))}
          {isCollection &&
            (collections?.length ? (
              <FlatList
                data={collections}
                horizontal={true}
                style={{ paddingHorizontal: 2, marginVertical: hp(1.5) }}
                renderItem={renderCollections}
                keyExtractor={(item) => item.id}
              />
            ) : (
              <View style={styles.emptySection}>
                <AppText style={styles.emptyText}>
                  User don't have any Collections.
                </AppText>
              </View>
            ))}
          {isWishlist && (
            <CustomButton
              bg={colors.color8}
              borderRadius={10}
              label="Show More"
              textColor={colors.cWhite}
              width={wp(50)}
              height={40}
              fontSize={14}
              style={{ alignSelf: "center" }}
              onPress={() => {
                if (isWishlist) {
                  props.navigation.navigate("MyWishlist");
                }
              }}
            />
          )}
        </View>
      </ScrollView>

      {/* Request Response Model */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert(language?.modal_has_been_closed);
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.requestModal}>
          <View style={styles.reqModalView}>
            <Image
              style={styles.userImg}
              source={
                userData?.image_url
                  ? { uri: userData.image_url }
                  : images.placeholder
              }
            />
            <AppText style={styles.infoText}>
              <AppText style={styles.nameText}>{userData?.full_name} </AppText>
              {language?.wants_to_be_your_follower}
              <AppText style={styles.nameText}> {userData?.full_name} </AppText>
              {language?.will_be_able_to_see}
            </AppText>
            <TouchableOpacity style={styles.button} onPress={onAccept}>
              <AppText style={styles.btnText}>
                {language?.acceptRequest}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onReject}>
              <AppText style={[styles.btnText, { color: colors.red }]}>
                {language?.declineRequest}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <AppText style={[styles.btnText, { color: colors.btnText }]}>
                Cancel
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Following Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={followModal}
        onRequestClose={() => {
          Alert.alert(language?.modal_has_been_closed);
          setFollowModal(!modalVisible);
        }}
      >
        <View style={styles.requestModal}>
          <View style={styles.reqModalView}>
            <Image
              style={styles.userImg}
              source={
                userData?.image_url
                  ? { uri: userData?.image_url }
                  : images.placeholder
              }
            />
            <AppText style={[styles.infoText, { fontWeight: "500" }]}>
              {language?.ifYouChangeMind}
            </AppText>
            <TouchableOpacity style={styles.button} onPress={toggleFollow}>
              <AppText style={[styles.btnText, { color: colors.lightTheme }]}>
                {language?.unfollow}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setFollowModal(false)}
            >
              <AppText style={[styles.btnText, { color: colors.btnText }]}>
                Cancel
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
