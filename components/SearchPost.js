import React, { useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
  Alert,
  Linking,
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
import { FeedBounty } from "./Card/FeedComp";
import { images } from "../assets/images/Images";
import { options, ownerOptions } from "../src/utils/constant";

import { useSelector } from "react-redux";

import Env from "../api/Env";
import Helper from "../src/Helper";
import MindAxios from "../api/MindAxios";

import AuthContext from "../src/Context/AuthContext";
import { debounce } from "lodash";
import { Share } from "react-native";
import ThemeContext from "../src/Context/ThemeContext";
// import { dark as theme } from "../constant/colorsConfig";
import Hyperlink from "react-native-hyperlink";
import { DescriptionLink } from "./DescriptionLink";
import SearchGetItem from "./SearchGetItem";

const Description = ({ item }) => {
  const { myState } = useContext(AuthContext);
  const { language } = myState;
  const { theme } = useContext(ThemeContext);

  if (item?.title == "Event") {
    return (
      <Text
        style={[styles.descriptionText, { color: theme?.black }]}
        numberOfLines={3}
      >
        {item?.searchable?.desc}
      </Text>
    );
  } else if (item?.title == "Product") {
    return (
      <Text
        style={[styles.descriptionText, { color: theme?.black }]}
        numberOfLines={3}
      >
        {item?.searchable?.productable?.description}
      </Text>
    );
  } else if (item?.title == "Auction") {
    return (
      <Text
        style={[styles.descriptionText, { color: theme?.black }]}
        numberOfLines={3}
      >
        {item?.searchable?.auctionable?.description}
      </Text>
    );
  } else if (
    item?.title == "Trade" &&
    item?.searchable?.tradeables?.length > 0
  ) {
    return (
      <Text
        style={[styles.descriptionText, { color: theme?.black }]}
        numberOfLines={3}
      >
        {item?.searchable?.tradeables[0]?.tradeable?.description}
      </Text>
    );
  } else if (item?.title == "Post") {
    return (
      <DescriptionLink
        theme={theme}
        content={item?.searchable?.content}
        media={item?.searchable?.media_url}
      />
    );
  } else if (item?.title == "FlagTicket") {
    return <View style={{ marginTop: 10 }} />;
  } else {
    return (
      <Text
        style={[styles.descriptionText, { color: theme?.black }]}
        numberOfLines={3}
      >
        {item?.searchable?.description}
      </Text>
    );
  }
};
// const ButtonItem = ({ item }) => {};
const lastBid = (item) => {
  const { myState } = useContext(AuthContext);
  const { language } = myState;
  const { theme } = useContext(ThemeContext);

  if (item?.searchable?.last_bid) {
    return (
      <Text
        style={[styles.descriptionText, { color: colors.theme, fontSize: 14 }]}
      >
        <Text style={{ color: "#fff" }}>
          {language.currentBid}
          {"  "}
        </Text>{" "}
        <Text
          style={[
            styles.descriptionText,
            { color: colors.theme, fontSize: 18, fontWeight: "600" },
          ]}
        >
          ${item?.searchable?.last_bid?.max_amount}
        </Text>
      </Text>
    );
  } else if (item?.searchable?.last_bid !== undefined) {
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
          ${item?.searchable?.initial_bid}
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

const SearchPost = (props) => {
  const { myState } = useContext(AuthContext);
  const { language } = myState;
  // console.log("lang..", language);
  const { theme, mood } = useContext(ThemeContext);

  const { userName, onPlaceBid, onTrade, item, navigation, opt } = props;
  // let date = moment(item.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a");
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
    item?.searchable?.user?.id == currentUser?.id && item?.title == "Post";

  let user =
    item?.title !== "FlagTicket"
      ? item?.searchable?.user
      : item?.searchable?.flaggable?.user;
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
      // console.log("hit index", index);
      // console.log("hit item");
      hitLike();
    },
    INTERVAL,
    { leading: true, trailing: false, maxWait: INTERVAL }
  );
  const hitLike = async () => {
    //  console.log("Helper.keyGenerator", Helper.keyGenerator())
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
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
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
      {item?.title === "Bounty" ? (
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
                // console.log("item", item?.searchable?.user);
                Helper.fbEvent("open_profile_from_home");
                navigation.navigate("OtherUser", { user: user });
              }}
              style={styles.upperSection}
            >
              <Image style={styles.userImg} source={{ uri: user?.image_url }} />
              <View style={styles.nameSection}>
                <Text style={[styles.nameText, { color: theme?.black }]}>
                  {userName ? userName : "Edie brown"}
                </Text>
                <View style={styles.timeSection}>
                  <TimeAgo
                    time={
                      item?.created_at
                        ? item?.created_at
                        : item?.searchable?.created_at
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
                        let des = item?.searchable?.content;
                        let uri = item?.searchable?.media_url;
                        let privacy = item?.searchable?.privacy_type;
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
          {item?.searchable?.desc || item?.title ? (
            <Description item={item} />
          ) : null}
          {/* <SearchGetItem desc={true} item={item} /> */}
          <SearchGetItem cover={true} item={item} />
          {/* Post Date and Time */}
          {/* <Text style={styles.dateText}>{date}</Text> */}
          {/* <Text style={styles.stampInfoText}>{item?.searchable?.name}</Text> */}
          <SearchGetItem item={item} desc={true} />
          {item?.title == "FlagTicket" ? (
            <SearchGetItem item={item} vote={true} navigation={navigation} />
          ) : null}

          {lastBid(item)}
          <SearchGetItem item={item} time={true} />
          {item?.title == "Event" ? (
            <SearchGetItem item={item} eventUi={true} navigation={navigation} />
          ) : null}

          <SearchGetItem item={item} navigation={navigation} />
        </>
      )}
    </View>
  );
};

export default SearchPost;

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
    paddingTop: 10,
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
