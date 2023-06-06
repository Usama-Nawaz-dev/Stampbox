import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Share,
  FlatList,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { debounce } from "lodash";

import { styles } from "./styles";
import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";
import { images } from "../../../../assets/images/Images";
import OnlyDropDown from "../../../../components/OnlyDropDown";

import {
  HtmlTag,
  AwardModal,
  EventHeader,
  ImageListSlider,
  ImageZoomViewer,
} from "../../../../components";

import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Env from "../../../../api/Env";
import { appUrl } from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";

import { DescriptionLink } from "../../../../components";

export const BlogDetail = ({ route, navigation }) => {
  const {
    myState: { language },
    openPermissionSheet,
  } = useContext(AuthContext);

  const [following, setfollowing] = useState(null);
  const [followerCount, setfollowerCount] = useState(null);
  const [imageViewerInitialIndex, setImageViewerInitialIndex] = useState(0);

  const focused = useIsFocused();
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);

  const sort_by = [
    { label: "Edit it", value: "Edit it" },
    { label: "Delete it", value: "Delete it" },
    { label: "Create New Blog", value: "Create New Blog" },
  ];

  const data = useSelector((state) => state.DetailReducer.blogDetail);
  const currentUser = useSelector((state) => state.ApiReducer.user);

  // console.log("data....", currentUser);
  const [comments, setComments] = useState(null);
  const [sort_value, setSortValue] = useState("");
  const [imageViewer, setImageViewer] = useState(false);
  const [imageViewerData, setImageViewerData] = useState([]);
  const [awardModalVisible, setAwardModalVisible] = useState(false);
  const created_at = moment(data.created_at).format("YYYY-MM-DD [at] h:mm A");

  useEffect(() => {
    if (focused) {
      setfollowing(data?.is_current_user_following);
      setfollowerCount(data?.followers_count);
      let tempArray = [];

      data?.medias?.map((x, index) => {
        tempArray.push({ url: x.media_url });
      });
      setImageViewerData([...tempArray]);
      fetchComments();
    }
  }, [focused]);

  const fetchComments = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl(`comments?commentable_id=${data?.id}&commentable_type=Blog`)
    );
    // console.log("responseeee", response);
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      // console.log(_data);
      setComments(_data);
    } else {
      alert(language?.serverError);
    }
  };

  const deleteBlog = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.delete(Env.createUrl(`blogs/${data?.id}`));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      navigation.goBack();
    } else {
      alert(language?.serverError);
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Please get Stampbox item from this link: ${appUrl}blog/show/${data?.id}`,
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

  const INTERVAL = 1000;
  const likeBlog = debounce(
    () => {
      if (following === 0) {
        setfollowing(1);
        setfollowerCount(followerCount + 1);
      } else {
        setfollowing(0);
        setfollowerCount(followerCount - 1);
      }
      hitLike();
    },
    INTERVAL,
    { leading: true, trailing: false, maxWait: INTERVAL }
  );
  const hitLike = async () => {
    data.is_reactionable = 1;
    const res = await MindAxios.post(Env.createUrl("followable"), {
      followable_type: "Blog",
      followable_id: data?.id,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme?.white }]}>
      <EventHeader
        title="Blog Detail"
        pickerIcon={
          data?.user_id === currentUser?.id ? (
            <OnlyDropDown
              data={sort_by}
              value={sort_value}
              onChangeText={(value) => {
                if (value === "Edit it") {
                  dispatch(allActions.DataAction.SelectedImg(data?.medias));
                  navigation.navigate("CreateBlog", data);
                } else if (value === "Delete it") {
                  deleteBlog();
                } else {
                  navigation.navigate("CreateBlog");
                }
              }}
              position={-4}
              width="40%"
              left={wp(14)}
              iconRight={5}
              icon={() => (
                <Entypo name="dots-three-vertical" size={20} color="#fff" />
              )}
            />
          ) : null
        }
        onPressBack={() => navigation.goBack()}
        // onDelete={removeEventAlert}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <TouchableWithoutFeedback>
          <View style={{ backgroundColor: colors.background }}>
            <ImageListSlider
              data={data?.medias}
              timer={2000}
              imageKey={"media_url"}
              width={wp(100)}
              height={hp(35)}
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
              resizeMode={"stretch"}
              // currentIndexCallback={index => console.log('Index', index+1)}
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={{ padding: 10 }}>
          <AppText style={styles.heading}>{data?.title}</AppText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <AppText style={[styles.text, { color: theme?.lightText }]}>
              {created_at}
            </AppText>
            <AppText style={[styles.text, { color: theme?.lightText }]}>
              By: {data?.user?.full_name}
            </AppText>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
              }}
            >
              <Ionicons
                name="ios-eye-outline"
                style={[styles.iconText, { fontSize: 18, color: colors.red }]}
              />
              <AppText style={[styles.iconText, { marginLeft: 5 }]}>
                N/A
              </AppText>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
              }}
            >
              <Ionicons
                name="ios-chatbox-ellipses-outline"
                style={[styles.iconText, { fontSize: 16, color: colors.red }]}
              />
              <AppText style={[styles.iconText, { marginLeft: 5 }]}>
                {comments != null ? comments.length : 0}
              </AppText>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 15,
              }}
            >
              <EvilIcons name="like" size={24} color={colors.red} />
              <AppText style={[styles.iconText, { marginLeft: 0 }]}>
                {followerCount}
              </AppText>
            </View>
          </View>
          <HtmlTag
            style={{
              marginTop: hp(1.5),
              color: theme?.darkGrey,
              fontFamily: Fonts.Inter_Regular,
            }}
            description={data?.description}
          />
        </View>

        <View style={styles.commentsSection}>
          {data?.user_id === currentUser?.id ? null : (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.rowSection}
              onPress={likeBlog}
            >
              <AntDesign
                name={following ? "like1" : "like2"}
                size={20}
                color={following ? colors.lightTheme : "#a9a9a9"}
              />
              <AppText
                style={[
                  styles.publicText,
                  {
                    color: following ? colors.lightTheme : "#a9a9a9",
                  },
                ]}
              >
                {"Follow"}
              </AppText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.rowSection}
            onPress={() => {
              navigation.navigate("PostComment", { data: data, type: "Blog" });
            }}
          >
            <Image
              style={[styles.commentIcon, { tintColor: colors.lightTheme }]}
              resizeMode="contain"
              source={images.Comment}
              tintColor={colors.lightTheme}
            />
            <AppText style={[styles.publicText, { color: colors.lightTheme }]}>
              {/* {language?.posts} */}
              Entries
            </AppText>
          </TouchableOpacity>
          {data?.user_id === currentUser?.id ? null : (
            <TouchableOpacity
              style={styles.rowSection}
              onPress={() => setAwardModalVisible(true)}
            >
              <Image
                style={[styles.commentIcon, { tintColor: colors.lightTheme }]}
                resizeMode="contain"
                source={images.coin_stack}
                tintColor={colors.lightTheme}
              />
              <AppText
                style={[styles.publicText, { color: colors.lightTheme }]}
              >
                Give award
              </AppText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.rowSection}
            onPress={() => {
              onShare();
            }}
          >
            <Image
              style={[styles.commentIcon, { tintColor: colors.lightTheme }]}
              resizeMode="contain"
              source={images.Share}
              tintColor={colors.lightTheme}
            />
            <AppText style={[styles.publicText, { color: colors.lightTheme }]}>
              {language?.share}
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.commentSection}>
          <AppText style={[styles.cText, { color: "#223" }]}>
            {/* {language?.posts} */}
            Entries
          </AppText>
          {comments?.length > 0 ? (
            <FlatList
              data={comments}
              // scrollEnabled={false}
              keyExtractor={(key) => key.id}
              renderItem={({ item }) => (
                <CommentCard
                  image={item?.user?.image_url}
                  inverted={true}
                  title={item?.user?.full_name}
                  message={item?.message}
                  item={item}
                  data={data}
                  userId={currentUser?.id}
                  navigation={navigation}
                />
              )}
              inverted
            />
          ) : (
            <View>
              <Text style={{ alignSelf: "center", margin: 10 }}>
                Review not found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={styles.commentButton}
          onPress={() =>
            navigation.navigate("PostComment", { data: data, type: "Blog" })
          }
        >
          <Text style={{ color: "#555", fontSize: 12 }}>
            {language?.write_a_comment}...
          </Text>
          <View style={styles.commentIcon}>
            {/* replace it woth icon */}
            <FontAwesome name="send" size={16} color="white" />
          </View>
        </TouchableOpacity>
      </View>
      <ImageZoomViewer
        onPressClose={() => {
          setImageViewer(false);
        }}
        visible={imageViewer}
        images={imageViewerData}
        index={imageViewerInitialIndex}
      />

      {/* Coins Award Modal */}
      <AwardModal
        type={"Blog"}
        userId={data?.user_id}
        modalVisible={awardModalVisible}
        setModalVisible={setAwardModalVisible}
      />
    </SafeAreaView>
  );
};

const CommentCard = ({
  image,
  inverted,
  title,
  message,
  item,
  data,
  userId,
  navigation,
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={styles.CCard}>
      <Image source={{ uri: image }} style={styles.CCImage} />
      <View style={{ marginLeft: 10, width: "75%" }}>
        <AppText style={styles.heading}>{title}</AppText>
        <DescriptionLink theme={theme} content={message} />
      </View>
      <View>
        {item?.user_id === userId ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("PostComment", { data: data, type: "Blog" });
            }}
          >
            <Entypo
              name="dots-three-vertical"
              size={20}
              color="#000"
              style={{ marginTop: 8 }}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
