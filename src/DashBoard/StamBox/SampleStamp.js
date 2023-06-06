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
import { MenuSheet } from "../../../components";

import AppText from "../../../components/AppText";
import MediaCard from "../../../components/MediaCard";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Entypo from "react-native-vector-icons/Entypo";

import allActions from "../../../redux/actions";
import MindAxios from "../../../api/MindAxios";
import Env from "../../../api/Env";
import Helper from "../../Helper";

import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import colors from "../../../constant/colors";
import Empty from "../../../components/Empty";
import { images } from "../../../assets/images/Images";
import CustomDropDown from "../../../components/CustomDropDown";
import { stampFormatTypes, countries } from "../../../constant/staticData";

import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

export const SampleStamp = (props) => {
  const dispatch = useDispatch();

  const isFocused = useIsFocused();
  const [mediaData, setMediaData] = useState(null);
  const [filterModal, setFilterModal] = useState(false);

  const [itemFormat, setItemFormat] = useState(null);
  const [currentList, setCountriesList] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [limit, setLimit] = useState(0);
  const [order_by, setOrder_By] = useState("");

  // pagination states
  const [isLoading, setIsLoading] = useState(false);
  const [nextApiUrl, setNextApiUrl] = useState(null);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  let sort_props = [
    { label: "Most Recent", value: 0 },
    { label: "Most Recent Eidted", value: 1 },
    { label: "Ready For An Album", value: 2 },
    { label: "Unedited Only", value: 3 },
  ];

  const [sortBy, setSortBy] = useState({
    types3: sort_props,
    value3: 0,
    value3Index: 0,
  });

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
    } else {
      setSelectedCountry(null);
      setItemFormat(null);
    }
  }, [isFocused]);

  const getMedias = async () => {
    const userId = await Helper.getData("userId");
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl("medias/user", `${userId}?is_stamp=1&type=sample`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result?.media?.data;
      const nextPageUrl = response?.data?.result?.media?.next_page_url;
      setMediaData(_data);
      setCountriesList(_data);
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
          nextApiUrl +
            `&is_stamp=1&type=sample&page_size=${limit}&order_by=${order_by}`
        );
        setIsLoading(false);
        if (response?.status == 200) {
          const _data = response?.data?.result?.media?.data;
          const nextPageUrl = response?.data?.result?.media?.next_page_url;
          setMediaData([...mediaData, ..._data]);
          setMediaData([...currentList, ..._data]);
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

  const result = mediaData?.filter((item) => item.is_meta_attached >= 1);

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
    let order_by;
    if (sortBy.value3 == 1) {
      order_by = "MostRecentEditedStamp";
      setOrder_By("MostRecentEditedStamp");
    } else if (sortBy.value3 == 2) {
      order_by = "HasStampItems";
      setOrder_By("HasStampItems");
    } else if (sortBy.value3 == 3) {
      order_by = "HasNotItems";
      setOrder_By("HasNotItems");
    } else {
      order_by = "";
      setOrder_By("");
    }

    let apiUrl = `${userId}?is_stamp=1&type=sample&page_size=${limit}&order_by=${order_by}`;
    if (selectedCountry) {
      apiUrl = apiUrl + `&country=${selectedCountry}`;
    }
    if (itemFormat) {
      apiUrl = apiUrl + `&format=${itemFormat}`;
    }

    const response = await MindAxios.get(Env.paramUrl("medias/user", apiUrl));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      setMediaData(response?.data?.result?.media?.data);
      let nextPageUrl = response?.data?.result?.media?.next_page_url;
      setNextApiUrl(nextPageUrl);
    }
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
    const imgData = [{ id: item.id, uri: item.media_url, type: item?.type }];
    return (
      <View
        style={{
          marginRight: wp(5),
          // marginLeft: index % 2 == 0 ? 2 : 0,
          marginBottom: index == mediaData?.length - 1 ? hp(8) : null,
          marginTop: hp(1.5),
          // backgroundColor: "orange",
        }}
      >
        <MediaCard
          item={item}
          mediaCount={item.is_meta_attached}
          onEdit={async () => {
            if (item.is_meta_attached == 0) {
              dispatch(allActions.DataAction.SelectedImg(imgData));
              props.navigation.navigate("AddStamps", { item: item });
            } else {
              let stampItemId = item.stamp_items[0].stamp_id;
              // console.log(stampItemId)
              if (stampItemId) {
                const response = await MindAxios.get(
                  Env.paramUrl("stamp-items", stampItemId)
                );
                if (response?.status == 200) {
                  const data = response?.data?.result?.stamp_item;
                  dispatch(allActions.DataAction.StampDetail(data));
                  dispatch(allActions.DataAction.SelectedImg(data?.medias));
                  props.navigation.navigate("EditStamps", { item: item });
                }
              }
            }
          }}
          editImg={() =>
            props.navigation.navigate("EditImage", {
              item: item,
              isStamp: 1,
              type: "sample",
            })
          }
          onRemove={() => removeMediaAlert(item)}
          rightIcon={
            <MenuSheet
              destructiveIndex={4}
              customButton={optionIcon}
              options={
                item.is_meta_attached == 0
                  ? ["Move to My Stamps (Actual)", "Cancel"]
                  : ["Find Similar", "Move to My Stamps (Actual)", "Cancel"]
              }
              actions={
                item.is_meta_attached !== 0
                  ? [
                      () => {
                        console.log("first", item);

                        props.navigation.navigate("Similar", {
                          stampId: item?.stamp_items[0]?.stamp_id,
                        });
                      },
                      () => onMoveMedia(item),
                    ]
                  : [() => onMoveMedia(item)]
              }
            />
          }
        />
      </View>
    );
  };

  const optionIcon = (
    <View
      style={{
        height: 30,
        width: 30,
        // borderRadius: 15,
        // backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Entypo size={hp(1.6)} color={colors.black} name="dots-three-vertical" />
    </View>
  );

  const onMoveMedia = async (item) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const res = await MindAxios.post(Env.createUrl("medias/update"), {
      id: item?.id,
      type: "actual",
      is_stamp: item?.is_stamp,
      linked_with: item?.linked_with,
    });
    dispatch(allActions.DataAction.AppLoader(false));
    if (res?.status === 200) {
      const filterData = mediaData?.filter((val) => val?.id !== item?.id);
      setMediaData(filterData);
      Helper.showToastMessage("Media type changed to Sample.", colors.green);
    } else {
      Helper.showToastMessage(
        "There's some error while updating media type.",
        colors.danger
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          props.navigation.navigate("AddItem", { isStamp: 1, type: "sample" })
        }
      >
        <FastImage
          source={images.Add}
          tintColor={colors.cWhite}
          style={{ width: hp(2.6), height: hp(2.6) }}
        />
      </TouchableOpacity>
      <AppText style={[styles.itemText, { color: theme?.black }]}>
        Total Item: {mediaData?.length}
      </AppText>
      <View style={[styles.switchSection, { marginTop: hp(-0.5) }]}>
        <AppText style={[styles.itemText1, { color: theme?.black }]}>
          Total Items Ready for Albums: {result?.length}{" "}
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
            <AppText style={styles.modalText1}>Sort items by</AppText>
            <RadioForm formHorizontal={false} animation={true}>
              {/* To create radio buttons, loop through your array of options */}
              {sortBy?.types3?.map((obj, i) => {
                var onPress = (value, index) => {
                  // console.log("val---->", value)
                  setSortBy({
                    ...sortBy,
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
                      isSelected={sortBy.value3Index === i}
                      onPress={onPress}
                      borderWidth={2}
                      buttonInnerColor={colors.lightTheme}
                      buttonOuterColor={
                        sortBy.value3Index === i
                          ? colors.lightTheme
                          : colors.lightText
                      }
                      buttonSize={hp(2)}
                      buttonOuterSize={hp(3)}
                      buttonStyle={{}}
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
            <View>
              <CustomDropDown
                height={hp(25)}
                data={countries}
                borderColor={"#000"}
                value={selectedCountry}
                label={"Filter by country"}
                onChangeText={(value) => {
                  setSelectedCountry(value);
                }}
              />
              <CustomDropDown
                height={hp(25)}
                value={itemFormat}
                borderColor={"#000"}
                data={stampFormatTypes}
                label={"Filter by format"}
                onChangeText={(value) => {
                  setItemFormat(value);
                }}
              />
            </View>
            <View style={styles.btnSection}>
              <Pressable style={styles.applyBtn} onPress={onApplyFilter}>
                <AppText style={styles.textStyle}>Apply</AppText>
              </Pressable>
              <Pressable
                style={styles.applyBtn}
                onPress={() => {
                  setItemFormat(null);
                  setFilterModal(false);
                  setSelectedCountry(null);
                  setMediaData(currentList);
                }}
              >
                <AppText style={styles.textStyle}>Reset</AppText>
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
