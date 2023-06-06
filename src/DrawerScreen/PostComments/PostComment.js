import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { styles } from "./styles";
import colors from "../../../constant/colors";
import { BottomSheet } from "../../../components";
import AppText from "../../../components/AppText";

import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import Helper from "../../Helper";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

import { DescriptionLink } from "../../../components";

export const PostComment = (props) => {
  const data = props.route.params;
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [commentList, setCommentList] = useState([]);
  const [commentText, setCommentText] = useState("");
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const editSheetRef = useRef();
  let scrollViewRef;
  const [prevMessage, setprevMessage] = useState("");
  const [editCheck, setEditCheck] = useState(true);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    // console.log("current user===>", currentUser);
    if (focused) {
      fetchComments();
    }
  }, [focused]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      onKeyboardDidShow
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      onKeyboardDidHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onKeyboardDidShow = (e) => {
    setKeyboardHeight(e.endCoordinates.height);
  };

  const onKeyboardDidHide = () => {
    setKeyboardHeight(0);
  };

  const fetchComments = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl(
        `comments?commentable_id=${data?.data?.id}&commentable_type=${data?.type}`
      )
    );
    // console.log("responseeee", response);
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const _nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      // console.log(_data,"next.....", _nextPageUrl);
      setCommentList(_data);
      setNextApiUrl(_nextPageUrl);
    } else {
      alert(language?.serverError);
    }
  };

  const nextPageComments = async () => {
    const response = await MindAxios.get(
      nextApiUrl +
        `&commentable_id=${data?.data?.id}&commentable_type=${data?.type}`
    );
    // console.log("next response" , response);
    if (response?.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const _nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      // console.log(_data,"next.....", _nextPageUrl);
      setCommentList([...commentList, ..._data]);
      setNextApiUrl(_nextPageUrl);
    } else {
      alert(language?.serverError);
    }
  };

  const postComment = async () => {
    var valid = true;

    if (commentText == "") {
      await Helper.showToastMessage("Please Write Something", colors.blueTheme);
      valid = false;
    }

    if (valid) {
      dispatch(allActions.DataAction.AppLoader(true));
      const body = {
        commentable_type: data?.type,
        commentable_id: data?.data?.id,
        message: commentText,
      };
      const response = await MindAxios.post(Env.createUrl(`comments`), body);
      // console.log("responseeee", response);
      dispatch(allActions.DataAction.AppLoader(false));

      if (response?.status === 200) {
        fetchComments();
        setCommentText("");
      } else {
        alert(language?.serverError);
      }
    }
  };

  const deleteComment = async () => {
    const response = await MindAxios.delete(
      Env.createUrl(`comments/${selectedCommentId}`)
    );
    // console.log("responseeee", response);

    if (response?.status === 200) {
      fetchComments();
    } else {
      alert(language?.serverError);
    }
  };

  const updateComment = async () => {
    const body = {
      message: commentText,
    };
    const response = await MindAxios.post(
      Env.createUrl(`comments/${selectedCommentId}`),
      body
    );

    // console.log("responseeee", response);

    if (response?.status === 200) {
      fetchComments();
      setCommentText("");
    } else {
      alert(language?.serverError);
    }
  };

  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator
          // animation={loder}
          size={"large"}
          color={colors.lightTheme}
          style={{ marginBottom: 20 }}
        />
      </View>
    ) : null;
  };

  const handleLoadMore = () => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      nextPageComments();
    } else {
      setIsLoading(false);
    }
  };

  const renderComment = ({ item, index }) => {
    return item ? (
      <View style={styles.CCard}>
        <Image source={{ uri: item?.user?.image_url }} style={styles.CCImage} />
        <View style={styles.commentBlock}>
          <View>
            <AppText style={styles.heading}>{item?.user?.full_name}</AppText>
            {/* <AppText style={styles.commentText}>{item?.message}</AppText> */}
            <DescriptionLink theme={theme} content={item?.message} />
            <AppText style={[styles.commentText, { fontSize: 9 }]}>
              {moment(item?.created_at).format("YYYY-MM-DD [at] h:mm A")}
            </AppText>
          </View>
          {item?.user_id === currentUser?.id ? (
            <TouchableOpacity
              style={styles.dotIcon}
              onPress={() => {
                editSheetRef?.current?.open();
                setSelectedCommentId(item?.id);
                setprevMessage(item?.message);
              }}
            >
              <MaterialCommunityIcons
                size={22}
                name="dots-vertical"
                color={colors.btnText}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    ) : (
      <View style={{ height: hp(90), width: "100%" }} />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#888" }}>
      {/* **************** HeaderView ***************** */}

      <View style={styles.header}>
        <Text style={styles.headerText}>Post Comments</Text>
        <TouchableWithoutFeedback onPress={() => props.navigation.goBack()}>
          <AntDesign name="close" style={styles.headerText} />
        </TouchableWithoutFeedback>
      </View>
      {/* ***************** Comment View ********************* */}
      {/* <ScrollView> */}
      <View style={styles.commentView}>
        {commentList?.length ? (
          <FlatList
            data={commentList}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            key={(key) => key.id}
            inverted
            renderItem={renderComment}
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={0.5}
            onEndReached={handleLoadMore}
          />
        ) : null}
      </View>

      <View
        style={{
          width: wp(95),
          maxHeight: "15%",
          alignItems: "center",
          flexDirection: "row",
          borderRadius: 25,
          paddingVertical: 7,
          alignSelf: "center",
          marginBottom: keyboardHeight ? keyboardHeight : hp(3),
          backgroundColor: "#DCDCDC",
        }}
      >
        <TextInput
          value={commentText}
          multiline={true}
          style={styles.input}
          placeholder={language?.write_a_comment + "..."}
          onChangeText={(val) => setCommentText(val)}
        />
        <TouchableOpacity
          style={styles.inputIcon}
          onPress={() => {
            if (editCheck === true) {
              postComment();
            } else {
              updateComment();
              setEditCheck(true);
            }
          }}
        >
          {/* replace it woth icon */}
          <FontAwesome name="send" size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* Edit Comment Sheet*/}
      <BottomSheet
        ref={editSheetRef}
        borderRadius={1}
        sheetHeight={hp(25)}
        ChildComponent={
          <View style={styles.bottomSheetView}>
            <TouchableOpacity
              onPress={() => {
                setCommentText(prevMessage);
                editSheetRef?.current?.close();
                setEditCheck(false);
              }}
            >
              <View style={styles.bottomSheetOptionView}>
                <Feather name="edit" size={30} />
                <AppText style={styles.bottomSheetText}>Edit Comment</AppText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                deleteComment();
                editSheetRef?.current?.close();
              }}
            >
              <View style={styles.bottomSheetOptionView}>
                <AntDesign name="delete" size={30} />
                <AppText style={styles.bottomSheetText}>Delete Comment</AppText>
              </View>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};
