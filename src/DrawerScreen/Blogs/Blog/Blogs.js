import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Entypo from "react-native-vector-icons/Entypo";

import moment from "moment";
import { debounce } from "lodash";
import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";

import AppText from "../../../../components/AppText";
import SearchBar from "../../../../components/SearchBar";
import OnlyDropDown from "../../../../components/OnlyDropDown";
import { BlogCard, EventHeader } from "../../../../components";

import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";

const sort_by = [
  { label: "All Blogs", value: "All Blogs" },
  { label: "My Blogs", value: "My Blogs" },
  { label: "Following", value: "Following" },
  { label: "Create Blog", value: "Create Blog" },
];

export const Blogs = (props) => {
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const [sort_value, setSortValue] = useState("");
  const [blogList, setBlogList] = useState(null);
  const [myBlogList, setMyBlogList] = useState(null);
  const [followList, setfollowList] = useState(null);
  const [currentList, setCurrentList] = useState(null);
  const [activeList, setActiveList] = useState(null);
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const { theme } = useContext(ThemeContext);

  //Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nextMyApiUrl, setNextMyApiUrl] = useState(null);

  const {
    myState: { language },
  } = useContext(AuthContext);
  // console.log(currentUser);

  useEffect(() => {
    if (focused) {
      fetchAllBlogs();
      fetchMyBlogs();
      fetchFollowBlogs();
      setSortValue("All Blogs");
    }
  }, [focused]);

  const fetchAllBlogs = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.createUrl("blogs"));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      setBlogList(_data);
      setCurrentList(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert(language?.serverError);
    }
  };

  const fetchFollowBlogs = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl(
        `followable?user_id=${currentUser?.id}&followable_type=${"Blog"}`
      )
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      // console.log(" ==== > ", _data);
      let tempArr = [];
      _data.map((item) => {
        tempArr.push(item.followable);
      });
      setfollowList(tempArr);
      // setCurrentList(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert(language?.serverError);
    }
  };

  const getNextAllBlogs = async (value) => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      // console.log("next....Api....url.....",nextApiUrl);
      const response = await MindAxios.get(nextApiUrl);
      // console.log("response....2", response);
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setBlogList([...blogList, ..._data]);
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
      <View style={{ height: hp(5), justifyContent: "center" }}>
        {isLoading ? (
          <ActivityIndicator size={"large"} color={theme?.theme} />
        ) : null}
      </View>
    );
  };

  const findItem = (val) => {
    if (sort_value === "All Blogs") {
      searchItems(val);
    } else {
      searchData(val);
    }
  };

  const searchData = (x) => {
    let text = x.toLowerCase();
    if (x) {
      let filteredName = activeList?.filter((item) => {
        return item.title.toLowerCase().match(text);
      });
      setCurrentList(filteredName);
    } else {
      setCurrentList(activeList);
    }
  };

  const INTERVAL = 1500;
  const searchItems = debounce(
    (x) => {
      searchBlogs(x);
    },
    INTERVAL,
    { leading: true, trailing: false, maxWait: INTERVAL }
  );

  const searchBlogs = async (text) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.createUrl(`blogs?search=${text}`));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      setBlogList(_data);
      setCurrentList(_data);
    } else {
      alert(language?.serverError);
    }
  };

  const fetchMyBlogs = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl(`blogs?user_id=${currentUser?.id}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      //   console.log("my Blogs Data.....",_data);
      setMyBlogList(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert(language?.serverError);
    }
  };

  const getNextMyBlogs = async (value) => {
    if (nextMyApiUrl !== null) {
      setIsLoading(true);
      // console.log("next....Api....url.....",nextApiUrl);
      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${currentUser?.id}`
      );
      // console.log("response....2", response);
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setMyBlogList([...myBlogList, ..._data]);
        // setCurrentList([...currentList, ..._data]);
        setNextMyApiUrl(nextPageUrl);
      } else {
        setNextMyApiUrl(null);
        setIsLoading(false);
        alert("Sever Error..");
      }
    }
  };

  const renderItem = ({ item, index }) => {
    const isEnd = currentList?.length - 1 === index;
    return (
      <BlogCard
        name={item?.title}
        description={item?.description}
        image_url={item?.medias[0]?.media_url}
        date={moment(item?.created_at).format("YYYY-MM-DD [at] h:mm A")}
        status={item?.status}
        by={item?.user?.full_name}
        onPress={() => {
          dispatch(allActions.DetailAction.BlogDetail(item));
          props.navigation.push("BlogDetail");
        }}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <EventHeader
        title={"Blogs"}
        pickerIcon={
          <OnlyDropDown
            data={sort_by}
            value={sort_value}
            onChangeText={(value) => {
              if (value === "Create Blog") {
                props.navigation.navigate("CreateBlog");
              }

              if (value === "All Blogs") {
                setCurrentList(blogList);
              } else if (value === "My Blogs") {
                setCurrentList(myBlogList);
                setActiveList(myBlogList);
              } else {
                setCurrentList(followList);
                setActiveList(followList);
              }
              setSortValue(value);
            }}
            position={-4}
            width="40%"
            left={wp(14)}
            iconRight={5}
            icon={() => (
              <Entypo name="dots-three-vertical" size={20} color="#fff" />
            )}
          />
        }
        onPressBack={() =>
          props.navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          })
        }
      />
      <View style={{ marginTop: hp(1.5) }} />
      <SearchBar
        placeholder="Search"
        border={1}
        borderRadius={5}
        onTermChange={(value) => findItem(value)}
        onTermSubmit={(value) => findItem(value)}
      />
      <View style={{ marginTop: hp(1) }} />
      {currentList?.length ? (
        <FlatList
          data={currentList}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          onEndReached={
            sort_value == "All Blogs" ? getNextAllBlogs : getNextMyBlogs
          }
        />
      ) : (
        <View style={styles.emptySection}>
          <AppText style={[styles.emptyText, { color: theme?.darkGrey }]}>
            No Blog Available.
          </AppText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptySection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontWeight: "500",
    marginBottom: hp(7),
  },
});
