import React, { useState, useEffect, useContext } from "react";
import {
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { styles } from "./styles";
import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";
import SearchBar from "../../../../components/SearchBar";
import { MainHeader, MenuSheet, HtmlTag } from "../../../../components";

import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import Env from "../../../../api/Env";
import allActions from "../../../../redux/actions";
import MindAxios from "../../../../api/MindAxios";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { debounce } from "lodash";
import Entypo from "react-native-vector-icons/Entypo";

import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";

export const AllForums = (props) => {
  const focused = useIsFocused();
  const dispatch = useDispatch();

  const [forumList, setForumList] = useState(null);
  const [isMyForum, setIsMyForum] = useState(false);
  const [currentList, setCurrentList] = useState(null);
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const { theme } = useContext(ThemeContext);

  //Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    myState: { language },
  } = useContext(AuthContext);
  // console.log(currentUser);

  useEffect(() => {
    if (focused) {
      fetchAllForums();
    }
  }, [focused]);

  const fetchAllForums = async (check) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const url = check ? `forums?user_id=${currentUser?.id}` : "forums";
    const response = await MindAxios.get(Env.createUrl(url));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      console.log(_data);
      setForumList(_data);
      setCurrentList(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert(language?.serverError);
    }
  };

  const getMoreForums = async (value) => {
    if (nextApiUrl !== null && forumList?.length >= 10) {
      setIsLoading(true);
      const url = isMyForum
        ? nextApiUrl + `&user_id=${currentUser?.id}`
        : nextApiUrl;
      const response = await MindAxios.get(url);
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setForumList([...currentList, ..._data]);
        setCurrentList([...currentList, ..._data]);
        setNextApiUrl(nextPageUrl);
      } else {
        setIsLoading(false);
        setNextApiUrl(null);
        alert("Sever Error..");
      }
    }
  };

  const renderFooter = () => {
    return (
      <View style={{ height: hp(3), marginTop: hp(1) }}>
        {isLoading ? (
          <ActivityIndicator size={"large"} color={theme?.theme} />
        ) : null}
      </View>
    );
  };

  const onRefresh = async () => {
    setLoading(true);
    await fetchAllForums();
    setLoading(false);
  };

  const INTERVAL = 1500;
  const onSearch = debounce(
    (x) => {
      seachForums(x);
    },
    INTERVAL,
    { leading: true, trailing: false, maxWait: INTERVAL }
  );

  const seachForums = async (x) => {
    if (x) {
      setLoading(true);
      const response = await MindAxios.get(Env.createUrl(`forums?search=${x}`));
      setLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        setForumList(_data);
      }
    } else {
      setForumList(currentList);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <QuestionCard
        item={item}
        onPress={() => props.navigation.navigate("ForumDetail", { Item: item })}
      />
    );
  };

  const optionIcon = (
    <Entypo size={hp(2.6)} color={colors.cWhite} name="dots-three-vertical" />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title={"Forums"}
        onPressBack={() => {
          props.navigation.goBack();
          dispatch(allActions.DetailAction.ClubDetail(null));
        }}
        rightIcon={
          <MenuSheet
            destructiveIndex={4}
            customButton={optionIcon}
            options={["All Forums", "My Forums", "Create Forum", "Cancel"]}
            actions={[
              () => {
                fetchAllForums();
                setIsMyForum(false);
              },
              () => {
                fetchAllForums(true);
                setIsMyForum(true);
              },
              () => props.navigation.navigate("CreateForum"),
            ]}
          />
        }
      />
      <SearchBar
        border={1}
        top={hp(1.5)}
        borderRadius={5}
        placeholder="Search Forums..."
        onTermChange={(value) => onSearch(value)}
        onTermSubmit={(value) => onSearch(value)}
      />
      <AppText style={styles.headingText}>Questions</AppText>
      {forumList?.length ? (
        <FlatList
          data={forumList}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={loading}
              tintColor={colors.lightTheme}
            />
          }
          refreshing={loading}
          renderItem={renderItem}
          onEndReached={getMoreForums}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.emptyList}>
          <AppText style={[styles.emptyText, { color: theme?.darkGrey }]}>
            No Forum Available.
          </AppText>
        </View>
      )}
    </View>
  );
};

const QuestionCard = ({ item, onPress }) => {
  return (
    <Pressable style={styles.qCard} onPress={onPress}>
      <AppText style={styles.qText}>{item?.title}</AppText>
      <View style={styles.qInfoSection}>
        <View style={styles.borderView}>
          <AppText style={styles.viewText}>540 views</AppText>
        </View>
        <View style={styles.borderView}>
          <AppText style={styles.viewText}>05 comments</AppText>
        </View>
        <View style={styles.borderView}>
          <AppText style={styles.viewText}>3 helpful</AppText>
        </View>
      </View>
      {/* <AppText style={styles.ansText}>{item?.description}</AppText> */}
      <HtmlTag style={styles.ansText} description={item?.description} />
    </Pressable>
  );
};
