import React, { useContext, useState } from "react";
import {
  Text,
  View,
  Alert,
  Share,
  Linking,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Image from "react-native-fast-image";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";

import TimeAgo from "./TimeAgo";
import GetItem from "./GetItem";
import AppText from "./AppText";
import colors from "../constant/colors";
import OnlyDropDown from "./OnlyDropDown";
import Fonts from "../assets/fonts/Fonts";

import { AwardModal } from "./AwardModal";
import { FeedBounty } from "./Card/FeedComp";
import { images } from "../assets/images/Images";
import { DescriptionLink } from "./DescriptionLink";
import { options, ownerOptions } from "../src/utils/constant";

import Env from "../api/Env";
import Helper from "../src/Helper";
import MindAxios from "../api/MindAxios";
import allActions from "../redux/actions";

import AuthContext from "../src/Context/AuthContext";
import ThemeContext from "../src/Context/ThemeContext";

import { debounce } from "lodash";
import Hyperlink from "react-native-hyperlink";
import { useSelector, useDispatch } from "react-redux";

const DesCheck = ({ str, theme }) => {
  return (
    <>
      {str ? (
        <Text
          style={[styles.descriptionText, { color: theme?.black }]}
          numberOfLines={3}
        >
          {str}
        </Text>
      ) : (
        <View style={{ marginVertical: 5 }} />
      )}
    </>
  );
};

const Description = ({ item, theme }) => {
  if (item?.feedable_type == "Event") {
    return <View style={{ marginVertical: 5 }} />;
  } else if (item?.feedable_type == "Product") {
    return (
      <DesCheck str={item?.feedable?.productable?.description} theme={theme} />
    );
  } else if (item?.feedable_type == "Auction") {
    return (
      <DesCheck str={item?.feedable?.auctionable?.description} theme={theme} />
    );
  } else if (
    item?.feedable_type == "Trade" &&
    item?.feedable?.tradeables?.length > 0
  ) {
    return (
      <DesCheck
        str={item?.feedable?.tradeables[0]?.tradeable?.description}
        theme={theme}
      />
    );
  } else if (item?.feedable_type == "Post") {
    return (
      <DescriptionLink
        theme={theme}
        content={item?.feedable?.content}
        media={item?.feedable?.media_url}
      />
    );
  } else if (item?.feedable_type == "FlagTicket") {
    return <View style={{ marginTop: 10 }} />;
  } else {
    return <DesCheck str={item?.feedable?.description} theme={theme} />;
  }
};
// const ButtonItem = ({ item }) => {};
const lastBid = (item) => {
  const { myState } = useContext(AuthContext);
  const { language } = myState;
  const { theme } = useContext(ThemeContext);

  if (item?.feedable?.last_bid) {
    return (
      <Text
        style={[styles.descriptionText, { color: colors.theme, fontSize: 14 }]}
      >
        <Text style={{ color: theme.davyGrey }}>
          {language.currentBid}
          {"  "}
        </Text>{" "}
        <Text
          style={[
            styles.descriptionText,
            { color: colors.theme, fontSize: 18, fontWeight: "600" },
          ]}
        >
          ${item?.feedable?.last_bid?.max_amount}
        </Text>
      </Text>
    );
  } else if (item?.feedable?.last_bid !== undefined) {
    return (
      <AppText
        style={[
          styles.descriptionText,
          { color: colors.theme, fontSize: 14, marginVertical: 0 },
        ]}
      >
        <AppText style={{ color: theme?.lightText }}>
          {language.currentBid}
          {"  "}
        </AppText>{" "}
        <AppText
          style={[
            styles.descriptionText,
            { color: colors.theme, fontSize: 18, fontWeight: "600" },
          ]}
        >
          ${item?.feedable?.initial_bid}
        </AppText>
      </AppText>
    );
  }
};

const deletePost = async (id, load, fresh) => {
  load(true);
  let res = await MindAxios.delete(Env.createUrl(`posts/${id}`));
  load(false);
  console.log("res==--==>", res);
  if (res.status == 200) {
    fresh(true);
    Helper.showToastMessage("Post deleted successfully", "green");
  }
};

const PostCard = (props) => {
  const dispatch = useDispatch();
  const { myState } = useContext(AuthContext);
  const { language } = myState;
  const { theme, mood } = useContext(ThemeContext);
  const [awardModalVisible, setAwardModalVisible] = useState(false);

  const { userName, onPlaceBid, onTrade, item, navigation, opt } = props;

  const {
    itemOption,
    setOptions,
    onUpdate,
    loader,
    getFeeds,
    updateFeeds,
    feeds,
    index,
    setShareModalVisible,
    modalVisible,
    setSelected,
    setItemType,
  } = opt;

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const owner =
    item?.feedable?.user?.id == currentUser?.id &&
    item?.feedable_type == "Post";

  const feedType = item?.feedable?.type;
  const feedUser = item?.feedable?.user?.id;
  const feedOwner = item?.feedable?.user?.id === currentUser?.id;

  let user =
    item?.feedable_type !== "FlagTicket"
      ? item?.feedable?.user
      : item?.feedable?.flaggable?.user;
  const reactions = () => {
    if (item?.reactions_count > 1) {
      if (item?.is_reactionable) {
        return `You and ${item?.reactions_count - 1} ${language?.others} ${
          language?.like
        }`;
      } else {
        return `${item?.reactions_count} ${language?.others} ${language?.like}`;
      }
    } else if (item?.reactions_count == 1) {
      if (item?.is_reactionable) {
        return "You Like this";
      } else {
        return `${item?.reactions_count} ${language?.others} ${language?.like}`;
      }
    }
  };
  const INTERVAL = 1000;
  const like = debounce(
    () => {
      hitLike();
    },
    INTERVAL,
    { leading: true, trailing: false, maxWait: INTERVAL }
  );
  const hitLike = async () => {
    toggleLike();
    const res = await MindAxios.post(Env.createUrl("reactions"), {
      reactionable_type: "Feed",
      reactionable_id: item?.id,
    });
    // console.log("res", res);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "Please get Stampbox item from this link: http://apps.apple.com/us/app/stampbox/168",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  const toggleLike = () => {
    let statusData = feeds;
    let selected = item?.is_reactionable;
    let count = item?.reactions_count;
    if (selected) {
      let res = statusData?.map((obj) => {
        if (obj?.id === item?.id) {
          return {
            ...obj,
            is_reactionable: 0,
            reactions_count: count - 1,
          };
        } else {
          return obj;
        }
      });
      // console.log("res", res);
      // dispatch(allActions.ApiAction.getFeeds(res));
      updateFeeds(res);
    } else {
      let res = statusData?.map((obj) => {
        if (obj?.id === item?.id) {
          return {
            ...obj,
            is_reactionable: 1,
            reactions_count: count + 1,
          };
        } else {
          return obj;
        }
      });
      // console.log("res2", res);
      // dispatch(allActions.ApiAction.getFeeds(res));
      updateFeeds(res);
    }
  };
  return (
    <View style={[styles.card, { backgroundColor: theme?.cardColor }]}>
      {item?.feedable_type === "Bounty" ? (
        <FeedBounty
          user={user}
          owner={owner}
          userName={userName}
          bounty_item={item}
          navigation={navigation}
        />
      ) : (
        <>
          <View style={styles.cardHeader}>
            <Pressable
              onPress={() => {
                // console.log("item", item?.feedable?.user);
                Helper.fbEvent("open_profile_from_home");
                // navigation.navigate("OtherUser", { user: user });
                dispatch(allActions.DetailAction.OtherUser(user));
                navigation.navigate("ProfileStack");
              }}
              style={styles.upperSection}
            >
              <Image style={styles.userImg} source={{ uri: user?.image_url }} />
              <View style={styles.nameSection}>
                <Text style={[styles.nameText, { color: theme?.black }]}>
                  {userName
                    ? Helper.capitalizeFirstLetter(userName)
                    : "Edie brown"}
                </Text>
                <View style={styles.timeSection}>
                  <TimeAgo
                    time={
                      item?.created_at
                        ? item?.created_at
                        : item?.feedable?.created_at
                    }
                    style={[styles.agoText, { color: theme?.black }]}
                  />
                  <Entypo name="dot-single" size={16} color={theme?.black} />
                  <Image
                    style={styles.earthIcon}
                    tintColor={colors.theme}
                    source={require("../assets/icons/earth.png")}
                  />
                </View>
              </View>
            </Pressable>
            <View>
              {
                owner ? (
                  <OnlyDropDown
                    // data={owner ? ownerOptions : options}
                    data={ownerOptions}
                    value={itemOption}
                    onChangeText={(value) => {
                      // setOptions(value);
                      // console.log("val", item);
                      if (value == "Edit") {
                        let des = item?.feedable?.content;
                        let uri = item?.feedable?.media_url;
                        let privacy = item?.feedable?.privacy_type;
                        let id = item?.feedable_id;
                        let sendParams = { des, uri, privacy, id };
                        setTimeout(() => {
                          onUpdate(sendParams);
                        }, 200);
                      } else if (value == "Delete") {
                        // let res =
                        // console.log('item', item);
                        setTimeout(() => {
                          Alert.alert(
                            "Delete Post?",
                            "Are you sure to delete this post?",
                            [
                              { text: "Cancel" },
                              {
                                text: "OK",
                                onPress: () =>
                                  deletePost(
                                    item?.feedable_id,
                                    loader,
                                    getFeeds
                                  ),
                              },
                            ]
                          );
                        }, 500);
                      }
                    }}
                    dropdownOffset={hp(-1.5)}
                    // position={owner ? -5.3 : -3.2}
                    position={-3.2}
                    width="35%"
                    left={wp(15)}
                    icon={() => (
                      <Entypo
                        name="dots-three-horizontal"
                        size={22}
                        color={colors.lightText}
                        // style={{ marginTop: -5 }}
                      />
                    )}
                  />
                ) : null
                // <Entypo
                //   onPress={() => Helper.showToastMessage("Coming Soon")}
                //   name="dots-three-horizontal"
                //   size={22}
                //   color={colors.lightText}
                //   style={{ marginTop: -5 }}
                // />
              }
            </View>
          </View>
          {item?.feedable?.desc || item?.feedable_type ? (
            <Description item={item} theme={theme} />
          ) : null}

          <GetItem cover={true} item={item} />
          {/* Post Date and Time */}
          {/* <Text style={styles.dateText}>{date}</Text> */}
          {/* <Text style={styles.stampInfoText}>{item?.feedable?.name}</Text> */}
          <GetItem item={item} desc={true} />
          {item?.feedable_type == "FlagTicket" ? (
            <GetItem item={item} vote={true} navigation={navigation} />
          ) : null}

          {lastBid(item)}
          <GetItem item={item} time={true} />
          {item?.feedable_type == "Event" ? (
            <GetItem item={item} eventUi={true} navigation={navigation} />
          ) : null}

          <GetItem item={item} navigation={navigation} />
        </>
      )}
      <View
        style={[styles.bottomSection, { backgroundColor: theme?.cardColor }]}
      >
        <View style={styles.countSection}>
          <AppText style={styles.publicText}>{reactions()}</AppText>
          <TouchableOpacity
          // onPress={() => props.navigation.navigate("HomeDetail")}
          >
            <AppText style={styles.commentCounter}>
              {item?.comments_count} {language?.comments}
            </AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.horizontalLine} />
        <View style={styles.commentsSection}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.rowSection}
            onPress={() => {
              like();
              // toggleLike();
              // Helper.showToastMessage("Coming Soon")
            }}
          >
            <AntDesign
              name={item?.is_reactionable ? "like1" : "like2"}
              size={20}
              color={item?.is_reactionable ? colors.lightTheme : theme.black}
            />
            <AppText
              style={[
                styles.publicText,
                {
                  color: item?.is_reactionable
                    ? colors.lightTheme
                    : theme?.black,
                },
              ]}
            >
              {language?.like}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowSection}
            onPress={() => {
              // let newItem = Helper.deepCopy(item);
              // newItem.type = "Feed";
              navigation.navigate("FeedComment", {
                data: item,
                type: "Feed",
              });
              // Helper.showToastMessage("Coming Soon")
            }}
          >
            <Image
              style={styles.commentIcon}
              resizeMode="contain"
              source={images.Comment}
              tintColor={theme?.black}
            />
            <AppText style={styles.publicText}>{language?.comment}</AppText>
          </TouchableOpacity>
          {item?.feedable_type == "Post" && !feedOwner ? (
            <TouchableOpacity
              style={styles.rowSection}
              onPress={() => {
                setAwardModalVisible(true);
              }}
            >
              <Image
                style={styles.commentIcon}
                resizeMode="contain"
                source={images.coin_stack}
                tintColor={theme?.black}
              />
              <AppText style={styles.publicText}>{"Give award"}</AppText>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.rowSection}
            onPress={() => {
              if (item?.feedable_type == "FlagTicket") {
                Helper.showToastMessage("Coming Soon");
              } else if (item?.feedable_type == "Event") {
                onShare();
              } else {
                setSelected(null);
                setItemType(item);
                setShareModalVisible(true);
              }
            }}
          >
            <Image
              style={styles.commentIcon}
              resizeMode="contain"
              source={images.Share}
              tintColor={theme?.black}
            />
            <AppText style={styles.publicText}>{language?.share}</AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Coins Award Modal */}
      <AwardModal
        type={"Post"}
        userId={feedUser}
        modalVisible={awardModalVisible}
        setModalVisible={setAwardModalVisible}
      />
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cWhite,
    paddingTop: 15,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(3),
  },
  upperSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImg: {
    width: 36,
    height: 36,
    borderRadius: hp(10),
  },
  nameSection: {
    marginLeft: wp(3),
  },
  timeSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameText: {
    fontSize: 16,
    fontFamily: Fonts.IBM_Medium,
    color: colors.lightBlack,
  },
  agoText: {
    fontSize: 12,
    color: colors.lightText,
    fontFamily: Fonts.Inter_Medium,
  },
  earthIcon: {
    width: 12,
    height: 12,
  },
  timeText: {
    fontSize: 8,
    color: "grey",
    // marginRight: hp(0.3)
  },
  descriptionText: {
    marginVertical: 10,
    fontSize: 12,
    paddingHorizontal: wp(3),
    fontFamily: Fonts.Inter_Regular,
    color: colors.lightText,
  },
  postImage: {
    width: wp(100),
    height: hp(25),
    marginTop: hp(0.5),
    resizeMode: "contain",
  },
  dateText: {
    fontSize: 10,
    color: colors.theme,
    marginTop: hp(0.5),
    marginLeft: wp(2),
  },
  stampInfoText: {
    marginTop: hp(0.5),
    marginLeft: wp(2),
    fontSize: 16,
  },
  button: {
    marginTop: hp(1),
    marginLeft: wp(1.5),
  },
  bottomSection: {
    backgroundColor: "#F6F6F6",
    paddingHorizontal: wp(3),
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  countSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 5,
    // backgroundColor: "orange",
  },
  horizontalLine: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginVertical: 10,
    borderColor: colors.borderColor,
  },
  rowSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCounter: {
    marginHorizontal: hp(0.3),
    fontSize: 10,
  },
  commentCounter: {
    fontSize: 14,
    // color: colors.comment,
  },
  commentsSection: {
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentIcon: {
    width: 16,
    height: 16,
  },
  publicText: {
    marginLeft: 5,
    fontSize: 14,
    // color: colors.lightText,
    fontWeight: "500",
    top: 2,
  },
});
