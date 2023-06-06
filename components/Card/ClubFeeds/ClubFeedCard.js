import React, { useContext } from "react";
import {
  Text,
  View,
  Alert,
  Share,
  Pressable,
  TouchableOpacity,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Image from "react-native-fast-image";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";

import { styles } from "./styles";
import TimeAgo from "../../TimeAgo";
import AppText from "../../AppText";
import colors from "../../../constant/colors";
import OnlyDropDown from "../../OnlyDropDown";

import { ClubBounty } from "./ClubBounty";
import { PostSection } from "./PostSection";
import { images } from "../../../assets/images/Images";
import { ownerOptions } from "../../../src/utils/constant";

import Env from "../../../api/Env";
import Helper from "../../../src/Helper";
import MindAxios from "../../../api/MindAxios";

import { debounce } from "lodash";
import { useSelector } from "react-redux";
import AuthContext from "../../../src/Context/AuthContext";
import ThemeContext from "../../../src/Context/ThemeContext";
// import { dark as theme } from "../../../constant/colorsConfig";
import { DescriptionLink } from "../../DescriptionLink";

const Description = ({ feedType, feedItem }) => {
  const { myState } = useContext(AuthContext);
  const { language } = myState;
  const { theme } = useContext(ThemeContext);

  if (feedType == "Event") {
    return (
      <Text
        style={[styles.descriptionText, { color: theme?.lightText }]}
        numberOfLines={3}
      >
        {feedItem?.desc}
      </Text>
    );
  } else if (feedType == "Product") {
    return (
      <Text
        style={[styles.descriptionText, { color: theme?.lightText }]}
        numberOfLines={3}
      >
        {feedItem?.productable?.description}
      </Text>
    );
  } else if (feedType == "Auction") {
    return (
      <Text
        style={[styles.descriptionText, { color: theme?.lightText }]}
        numberOfLines={3}
      >
        {feedItem?.auctionable?.description}
      </Text>
    );
  } else if (feedType == "Trade" && feedItem?.tradeables?.length > 0) {
    return (
      <Text
        style={[styles.descriptionText, { color: theme?.lightText }]}
        numberOfLines={3}
      >
        {feedItem?.tradeables[0]?.tradeable?.description}
      </Text>
    );
  } else if (feedType == "Post") {
    return (
      <DescriptionLink
        theme={theme}
        content={feedItem?.content}
        media={feedItem?.media_url}
      />
    );
    // return (
    //   <Text style={styles.descriptionText} numberOfLines={3}>
    //     {feedItem?.content}
    //   </Text>
    // );
  } else if (feedType == "FlagTicket") {
    return <View style={{ marginTop: 10 }} />;
  } else {
    return (
      <Text
        style={[styles.descriptionText, { color: theme?.lightText }]}
        numberOfLines={3}
      >
        {feedItem?.description}
      </Text>
    );
  }
};
const lastBid = (feedItem, feedType) => {
  const { myState } = useContext(AuthContext);
  const { language } = myState;

  if (feedItem?.last_bid) {
    return (
      <Text
        style={[styles.descriptionText, { color: colors.theme, fontSize: 14 }]}
      >
        <Text style={{ color: "#000" }}>
          {language.currentBid}
          {"  "}
        </Text>{" "}
        <Text
          style={[
            styles.descriptionText,
            { color: colors.theme, fontSize: 18, fontWeight: "600" },
          ]}
        >
          ${feedItem?.last_bid?.max_amount}
        </Text>
      </Text>
    );
  } else if (feedItem?.last_bid !== undefined) {
    return (
      <AppText
        style={[
          styles.descriptionText,
          { color: colors.theme, fontSize: 14, marginVertical: 0 },
        ]}
      >
        <AppText style={{ color: colors.lightText }}>
          {language.currentBid}
          {"  "}
        </AppText>{" "}
        <AppText
          style={[
            styles.descriptionText,
            { color: colors.theme, fontSize: 18, fontWeight: "600" },
          ]}
        >
          ${feedItem?.initial_bid}
        </AppText>
      </AppText>
    );
  }
};

const deletePost = async (id, load, fresh) => {
  load(true);
  let res = await MindAxios.delete(Env.createUrl(`posts/${id}`));
  load(false);
  // console.log("res==--==>", res);
  if (res.status == 200) {
    fresh(true);
    Helper.showToastMessage("Post deleted successfully", "green");
  }
};

export const ClubFeedCard = (props) => {
  const { myState } = useContext(AuthContext);
  const { language } = myState;

  const { userName, item, navigation, opt, feedItem, feedType } = props;
  const {
    feeds,
    loader,
    onUpdate,
    itemOption,
    updateFeeds,
    setSelected,
    setItemType,
    fetchClubFeeds,
    setShareModalVisible,
  } = opt;

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const owner = feedItem?.user?.id == currentUser?.id && feedType == "Post";
  const { theme } = useContext(ThemeContext);

  let user =
    feedType !== "FlagTicket" ? feedItem?.user : feedItem?.flaggable?.user;
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
      reactionable_type: "ClubFeed",
      reactionable_id: item?.id,
    });
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
      updateFeeds(res);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme?.cardColor }]}>
      {feedType === "Bounty" ? (
        <ClubBounty
          user={user}
          owner={owner}
          item={item}
          feedItem={feedItem}
          feedType={feedType}
          userName={userName}
          navigation={navigation}
        />
      ) : (
        <>
          <View style={styles.cardHeader}>
            <Pressable
              onPress={() => {
                Helper.fbEvent("open_profile_from_home");
                navigation.navigate("OtherUser", { user: user });
              }}
              style={styles.upperSection}
            >
              <Image style={styles.userImg} source={{ uri: user?.image_url }} />
              <View style={styles.nameSection}>
                <Text style={[styles.nameText, { color: theme?.darkGrey }]}>
                  {userName ? userName : "Edie brown"}
                </Text>
                <View style={styles.timeSection}>
                  <TimeAgo
                    time={
                      item?.created_at ? item?.created_at : feedItem?.created_at
                    }
                    style={[styles.agoText, { color: theme?.lightGrey }]}
                  />
                  <Entypo
                    name="dot-single"
                    size={16}
                    color={colors.lightText}
                  />
                  <Image
                    style={styles.earthIcon}
                    tintColor={colors.theme}
                    source={require("../../../assets/icons/earth.png")}
                  />
                </View>
              </View>
            </Pressable>
            <View>
              {owner ? (
                <OnlyDropDown
                  data={ownerOptions}
                  // data={[{ label: "Delete", value: "Delete" }]}
                  value={itemOption}
                  onChangeText={(value) => {
                    if (value == "Edit") {
                      let des = feedItem?.content;
                      let uri = feedItem?.media_url;
                      let privacy = feedItem?.privacy_type;
                      let id = feedItem?.id;
                      let sendParams = { des, uri, privacy, id };
                      setTimeout(() => {
                        onUpdate(sendParams);
                      }, 200);
                    } else if (value == "Delete") {
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
                                  feedItem?.id,
                                  loader,
                                  fetchClubFeeds
                                ),
                            },
                          ]
                        );
                      }, 500);
                    }
                  }}
                  dropdownOffset={hp(-1.5)}
                  position={-3.2}
                  width="35%"
                  left={wp(15)}
                  icon={() => (
                    <Entypo
                      name="dots-three-horizontal"
                      size={22}
                      color={colors.lightText}
                    />
                  )}
                />
              ) : null}
            </View>
          </View>
          {feedItem?.desc || feedType ? (
            <Description feedItem={feedItem} feedType={feedType} />
          ) : null}
          <PostSection
            cover={true}
            item={item}
            feedItem={feedItem}
            feedType={feedType}
          />
          <PostSection
            desc={true}
            item={item}
            feedItem={feedItem}
            feedType={feedType}
          />
          {feedType == "FlagTicket" ? (
            <PostSection
              vote={true}
              item={item}
              feedType={feedType}
              feedItem={feedItem}
              navigation={navigation}
            />
          ) : null}

          {lastBid(feedItem, feedType)}
          <PostSection
            time={true}
            item={item}
            feedItem={feedItem}
            feedType={feedType}
          />
          {feedType == "Event" ? (
            <PostSection
              eventUi={true}
              navigation={navigation}
              feedItem={feedItem}
              feedType={feedType}
            />
          ) : null}

          <PostSection
            item={item}
            feedType={feedType}
            feedItem={feedItem}
            navigation={navigation}
          />
        </>
      )}
      <View style={styles.bottomSection}>
        <View style={styles.countSection}>
          <AppText style={[styles.publicText, { color: theme?.lightText }]}>
            {reactions()}
          </AppText>
          <TouchableOpacity>
            <AppText
              style={[styles.commentCounter, { color: theme?.lightText }]}
            >
              {item?.comments_count} {language?.comments}
            </AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.horizontalLine} />
        <View style={styles.commentsSection}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.rowSection}
            onPress={() => like()}
          >
            <AntDesign
              name={item?.is_reactionable ? "like1" : "like2"}
              size={20}
              color={item?.is_reactionable ? colors.lightTheme : theme?.black}
            />
            <AppText
              style={[
                styles.publicText,
                {
                  color: item?.is_reactionable
                    ? colors.lightTheme
                    : theme.lightText,
                },
              ]}
            >
              {language?.like}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowSection}
            onPress={() => {
              navigation.navigate("FeedComment", {
                data: item,
                type: "ClubFeed",
              });
            }}
          >
            <Image
              style={styles.commentIcon}
              resizeMode="contain"
              source={images.Comment}
              tintColor={theme?.lightText}
            />
            <AppText style={[styles.publicText, { color: theme?.lightText }]}>
              {language?.comment}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowSection}
            onPress={() => {
              if (feedType == "FlagTicket") {
                Helper.showToastMessage("Coming Soon");
              } else if (feedType == "Event") {
                onShare();
              } else {
                let newItem = item;
                newItem.feedable_type = feedType;
                newItem.feedable_id = feedItem?.id;
                setSelected(null);
                setItemType(newItem);
                setShareModalVisible(true);
              }
            }}
          >
            <Image
              style={styles.commentIcon}
              resizeMode="contain"
              source={images.Share}
              tintColor={theme?.lightText}
            />
            <AppText style={[styles.publicText, { color: theme?.lightText }]}>
              {language?.share}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
