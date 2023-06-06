import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import FastImage from "react-native-fast-image";
import { styles } from "./styles";

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "../../../components/RadioButton/Radio";

import AppText from "../../../components/AppText";
import MediaCard from "../../../components/MediaCard";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import allActions from "../../../redux/actions";
import MindAxios from "../../../api/MindAxios";
import Env from "../../../api/Env";
import Helper from "../../Helper";

import { useDispatch, useSelector } from "react-redux";
import { images } from "../../../assets/images/Images";
import colors from "../../../constant/colors";
import Empty from "../../../components/Empty";

import { useIsFocused } from "@react-navigation/native";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

export const SupplyItems = (props) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const isFocused = useIsFocused();
  const [mediaData, setMediaData] = useState(null);
  const [filterModal, setFilterModal] = useState(false);

  const [limit, setLimit] = useState(null);
  // pagination states
  const [isLoading, setIsLoading] = useState(false);
  const [nextApiUrl, setNextApiUrl] = useState();

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  var size_props = [
    { label: "10", value: 0 },
    { label: "20", value: 1 },
    { label: "40", value: 2 },
    { label: "100", value: 3 },
  ];

  const [itemNo, setItemNo] = useState({
    types3: size_props,
    value3: 0,
    value3Index: 0,
  });

  useEffect(() => {
    if (isFocused) {
      (async () => {
        await getMedias();
      })();
    }
  }, [isFocused]);

  const getMedias = async () => {
    const userId = await Helper.getData("userId");
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl("medias/user", `${userId}?is_stamp=0`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      setMediaData(response?.data?.result?.media?.data);
      let nextPageUrl = response?.data?.result?.media?.next_page_url;
      console.log(nextPageUrl);
      setNextApiUrl(nextPageUrl);
    } else {
      alert(language?.serverError);
    }
  };

  const getNextMedia = async () => {
    try {
      if (nextApiUrl !== null) {
        setIsLoading(true);
        const response = await MindAxios.get(
          nextApiUrl + `&is_stamp=0&page_size=${Number(limit)}`
        );
        setIsLoading(false);
        console.log("response getAlbum", response);
        if (response?.status == 200) {
          let _data = response?.data?.result?.media?.data;
          let nextPageUrl = response?.data?.result?.media?.next_page_url;
          console.log(nextPageUrl);
          setMediaData([...mediaData, ..._data]);
          setNextApiUrl(nextPageUrl);
        } else {
          setIsLoading(false);
          setNextApiUrl(null);
          alert("Sever Error.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator
          // animation={loder}
          size={"large"}
          color={theme?.theme}
          style={{ bottom: hp(2.5), marginBottom: 10 }}
        />
      </View>
    ) : null;
  };

  const onApplyFilter = async () => {
    setFilterModal(!filterModal);
    dispatch(allActions.DataAction.AppLoader(true));
    const userId = await Helper.getData("userId");
    let limit = 0;
    if (itemNo.value3 == 1) {
      limit = 20;
      setLimit(20);
    } else if (itemNo.value3 == 2) {
      limit = 40;
      setLimit(40);
    } else if (itemNo.value3 == 3) {
      limit = 100;
      setLimit(100);
    } else {
      limit = 10;
      setLimit(10);
    }

    // console.log(limit)
    const response = await MindAxios.get(
      Env.paramUrl("medias/user", `${userId}?is_stamp=0&page_size=${limit}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    setMediaData(response?.data?.result?.media?.data);
  };

  const removeMediaAlert = (item) =>
    Alert.alert(
      "Delete Media ?",
      "Are you sure you want to delete this media ?",
      [{ text: "Cancel" }, { text: "OK", onPress: () => removeMedia(item?.id) }]
    );
  const removeMedia = async (id) => {
    const response = await MindAxios.delete(Env.paramUrl(`medias`, id));
    if (response?.status == 200) {
      const filterMedia = mediaData?.filter((item) => item?.id !== id);
      setMediaData(filterMedia);
    } else {
      alert(language?.serverError);
    }
  };

  const renderItem = ({ item, index }) => {
    const imgData = [{ id: item.id, uri: item.media_url }];
    return (
      <View
        style={{
          marginRight: wp(5),
          marginBottom: index == mediaData?.length - 1 ? hp(8) : null,
          marginTop: hp(1.5),
        }}
      >
        <MediaCard
          item={item}
          showInfo={false}
          onEdit={async () => {
            if (currentUser?.store) {
              dispatch(allActions.DataAction.SelectedImg(imgData));
              props.navigation.navigate("StoreSupply");
            } else {
              Helper.showToastMessage("Please create store first.", "red");
            }
          }}
          editImg={() =>
            props.navigation.navigate("EditImage", { item: item, isStamp: 0 })
          }
          onRemove={() => removeMediaAlert(item)}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => props.navigation.navigate("AddItem", { isStamp: 0 })}
      >
        <FastImage
          source={images.Add}
          tintColor={colors.cWhite}
          style={{ width: hp(2.6), height: hp(2.6) }}
        />
      </TouchableOpacity>
      <View style={styles.switchSection}>
        <AppText style={[styles.itemText1, { color: theme?.black }]}>
          Total Items: {mediaData?.length}{" "}
        </AppText>
        <View style={styles.filterSection}>
          <AppText style={[styles.itemText1, { color: theme?.black }]}>
            Filter items
          </AppText>
          <TouchableOpacity
            style={styles.filter}
            onPress={() => setFilterModal(true)}
          >
            <FastImage
              source={images.Option}
              style={{ width: hp(2), height: hp(2) }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {mediaData?.length ? (
        <FlatList
          style={{ paddingHorizontal: wp(7.5), marginTop: hp(1) }}
          data={mediaData}
          renderItem={renderItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          onEndReached={getNextMedia}
        />
      ) : (
        <Empty desc="We could not find any media" />
      )}

      {/* Filter Modal */}
      <Modal
        animationType="none"
        animation={true}
        transparent={true}
        visible={filterModal}
        onRequestClose={() => {
          Alert.alert(language?.modal_has_been_closed);
          setFilterModal(!filterModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <AppText style={styles.modalText}>Search Item for</AppText>
            <AppText style={[styles.modalText1, { marginTop: hp(1) }]}>
              Item per page
            </AppText>
            <RadioForm formHorizontal={true} animation={true}>
              {/* To create radio buttons, loop through your array of options */}
              {itemNo?.types3?.map((obj, i) => {
                var onPress = (value, index) => {
                  // console.log("val---->", value)
                  setItemNo({
                    ...itemNo,
                    value3: value,
                    value3Index: index,
                  });
                };
                return (
                  <RadioButton labelHorizontal={true} key={i}>
                    {/*  You can set RadioButtonLabel before RadioButtonInput */}
                    <RadioButtonInput
                      obj={obj}
                      index={i}
                      // isSelected={obj.value3Index === i}
                      isSelected={itemNo.value3Index === i}
                      onPress={onPress}
                      borderWidth={2}
                      buttonInnerColor={colors.lightTheme}
                      buttonOuterColor={
                        itemNo.value3Index === i
                          ? colors.lightTheme
                          : colors.lightText
                      }
                      buttonSize={hp(2)}
                      buttonOuterSize={hp(3)}
                      buttonWrapStyle={{ marginLeft: i == 0 ? 0 : wp(12) }}
                    />
                    <RadioButtonLabel
                      obj={obj}
                      index={i}
                      labelHorizontal={true}
                      onPress={onPress}
                      labelStyle={{ fontSize: 12, color: colors.cBlack }}
                      labelWrapStyle={{}}
                    />
                  </RadioButton>
                );
              })}
            </RadioForm>
            <View style={styles.btnSection}>
              <Pressable style={styles.applyBtn} onPress={onApplyFilter}>
                <AppText style={styles.textStyle}>Apply</AppText>
              </Pressable>
              <Pressable
                style={styles.closeBtn}
                onPress={() => setFilterModal(false)}
              >
                <AppText style={styles.cancelText}>Cancel</AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
