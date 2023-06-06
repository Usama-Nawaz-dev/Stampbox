import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import { styles } from "./styles";

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "../../../components/RadioButton/Radio";

import AppText from "../../../components/AppText";
import Feather from "react-native-vector-icons/Feather";
import MediaCard from "../../../components/MediaCard";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import MindAxios from "../../../api/MindAxios";
import Env from "../../../api/Env";
import Helper from "../../Helper";

import { useDispatch, useSelector } from "react-redux";
import allActions from "../../../redux/actions";
import colors from "../../../constant/colors";
import Empty from "../../../components/Empty";

import { useIsFocused } from "@react-navigation/native";

import { OptionHeader } from "../../../components";
import AuthContext from "../../Context/AuthContext";

export const StamBox = (props) => {
  const dispatch = useDispatch();

  const [isSelected, setIsSelected] = useState(false);
  const [mediaData, setMediaData] = useState(null);
  const [filterModal, setFilterModal] = useState(false);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const isFocused = useIsFocused();
  const [firstRender, setRen] = useState(true);

  let radio_props = [
    { label: "Added", value: 0 },
    { label: "Update", value: 1 },
    { label: "Ready for Album", value: 2 },
  ];

  const [recent, setRecent] = useState({
    types3: radio_props,
    value3: 0,
    value3Index: 0,
  });

  var radio_props1 = [
    { label: "10", value: 0 },
    { label: "20", value: 1 },
    { label: "40", value: 2 },
    { label: "100", value: 3 },
  ];

  const [itemNo, setItemNo] = useState({
    types3: radio_props1,
    value3: 0,
    value3Index: 0,
  });
  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener("focus", async () => {
  //     // console.log("focused", isSelected);
  //     // The screen is focused
  //     const userId = await Helper.getData("userId");
  //     const response = await MindAxios.get(
  //       Env.paramUrl("medias/user", `${userId}?is_stamp=${isSelected ? 0 : 1}`)
  //     );
  //     setMediaData(response?.data?.result?.media?.data);
  //   });

  //   // Return the function to unsubscribe from
  //   // the event so it gets removed on unmount
  //   return unsubscribe;
  // }, [props.navigation]);

  useEffect(() => {
    if (isFocused) {
      (async () => {
        await getMedias();
      })();
    }
  }, [isFocused]);

  useEffect(() => {
    if (!firstRender) {
      getMedias();
    } else {
      setRen(false);
    }
  }, [isSelected]);

  const getMedias = async () => {
    const userId = await Helper.getData("userId");
    dispatch(allActions.DataAction.ActivityModal(true));
    const response = await MindAxios.get(
      Env.paramUrl("medias/user", `${userId}?is_stamp=${isSelected ? 0 : 1}`)
    );
    dispatch(allActions.DataAction.ActivityModal(false));
    if (response?.status == 200) {
      setMediaData(response?.data?.result?.media?.data);
    } else {
      alert(language?.serverError);
    }
  };

  const result = mediaData?.filter((item) => item.is_meta_attached >= 1);

  // const onPressTab = async () => {
  //   dispatch(allActions.DataAction.ActivityModal(true));
  //   const userId = await Helper.getData("userId");
  //   const response = await MindAxios.get(
  //     Env.paramUrl("medias/user", `${userId}?is_stamp=${isSelected ? 1 : 0}`)
  //   );
  //   setMediaData(response?.data?.result?.media?.data);
  //   dispatch(allActions.DataAction.ActivityModal(false));
  // }

  const onApplyFilter = async () => {
    setFilterModal(!filterModal);
    dispatch(allActions.DataAction.ActivityModal(true));
    const userId = await Helper.getData("userId");
    let limit = 0;
    if (itemNo.value3 == 1) {
      limit = 20;
    } else if (itemNo.value3 == 2) {
      limit = 40;
    } else if (itemNo.value3 == 3) {
      limit = 100;
    } else {
      limit = 10;
    }
    let order_by = "MostRecentEditedStamp";
    // console.log(limit)
    const response = await MindAxios.get(
      Env.paramUrl(
        "medias/user",
        `${userId}?is_stamp=${
          isSelected ? 0 : 1
        }&page_size=${limit}&order_by=${order_by}`
      )
    );
    dispatch(allActions.DataAction.ActivityModal(false));
    // console.log(response)
    setMediaData(response?.data?.result?.media?.data);
    // setFilterModal(!filterModal);
  };

  const renderItem = ({ item, index }) => {
    const imgData = [{ id: item.id, uri: item.media_url }];
    return (
      <View
        style={{
          marginRight: wp(6),
          marginLeft: index % 2 == 0 ? 2 : 0,
          marginBottom: index == mediaData?.length - 1 ? hp(8) : null,
          marginTop: 15,
        }}
      >
        <MediaCard
          uri={item.media_url}
          mediaCount={item.is_meta_attached}
          onEdit={async () => {
            if (item.is_meta_attached == 0) {
              dispatch(allActions.DataAction.SelectedImg(imgData));
              if (!isSelected) {
                props.navigation.navigate("AddStamps", { item: item });
              } else {
                Helper.showToastMessage("Coming Soon.");
              }
            } else {
              // Helper.showToastMessage(("Coming Soon"))
              let stampItemId = item.stamp_items[0].stamp_id;
              // console.log(stampItemId)
              if (stampItemId) {
                const response = await MindAxios.get(
                  Env.paramUrl("stamp-items", stampItemId)
                );
                // console.log('Stamp Item--->', response?.data?.result?.stamp_item);

                if (response?.status == 200) {
                  const data = response?.data?.result?.stamp_item;
                  dispatch(allActions.DataAction.StampDetail(data));
                  dispatch(allActions.DataAction.SelectedImg(data?.medias));
                  if (!isSelected) {
                    props.navigation.navigate("EditStamps", { item: item });
                  } else {
                    Helper.showToastMessage();
                  }
                }
              }
            }
          }}
          editImg={() => {
            // console.log("item-->", item)
            if (!isSelected) {
              props.navigation.navigate("EditImage", { item: item });
            } else {
              Helper.showToastMessage("Coming Soon.");
            }
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <OptionHeader
        title={language?.myStampbox}
        showIcon={true}
        onPressBack={() => props.navigation.goBack()}
        addStamp={() => {
          props.navigation.navigate("AddItem", { isStamp: 1 });
        }}
        addMedia={() => {
          props.navigation.navigate("AddItem", { isStamp: 0 });
        }}
      />
      <View style={styles.switchSection}>
        <TouchableOpacity
          style={!isSelected ? styles.selectedTab : styles.defaultTab}
          onPress={() => {
            setIsSelected(false);
            // onPressTab();
          }}
        >
          <AppText style={[styles.tabText, isSelected && { color: "grey" }]}>
            {language?.myStamp}
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={isSelected ? styles.selectedTab : styles.defaultTab}
          onPress={() => {
            setIsSelected(true);
            // onPressTab();
          }}
        >
          <AppText style={[styles.tabText, !isSelected && { color: "grey" }]}>
            My Supplies
          </AppText>
        </TouchableOpacity>
      </View>
      <AppText style={styles.itemText}>Total Item: {mediaData?.length}</AppText>
      <View style={[styles.switchSection, { marginTop: hp(-0.5) }]}>
        <AppText style={styles.itemText1}>
          Total Items Ready for Albums: {result?.length}{" "}
        </AppText>
        <View style={styles.filterSection}>
          <AppText style={styles.itemText1}>Filter items</AppText>
          <TouchableOpacity
            style={styles.filter}
            onPress={() => setFilterModal(true)}
          >
            <Feather
              name="filter"
              size={16}
              style={{ transform: [{ rotateY: "180deg" }] }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {isSelected ? (
        <>
          {mediaData?.length ? (
            <FlatList
              style={{ paddingHorizontal: wp(9), marginTop: 10 }}
              data={mediaData}
              renderItem={renderItem}
              numColumns={2}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Empty desc="We could not find any Stamps" />
          )}
        </>
      ) : (
        <>
          {mediaData?.length ? (
            <FlatList
              style={{ paddingHorizontal: wp(9), marginTop: 10 }}
              data={mediaData}
              renderItem={renderItem}
              numColumns={2}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Empty desc="We could not find any Stamps" />
          )}
        </>
      )}
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
            <AppText style={styles.modalText1}>Filter by most recent</AppText>
            <RadioForm formHorizontal={true} animation={true}>
              {/* To create radio buttons, loop through your array of options */}
              {recent?.types3?.map((obj, i) => {
                var onPress = (value, index) => {
                  // console.log("val---->", value)
                  setRecent({
                    ...recent,
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
                      isSelected={recent.value3Index === i}
                      onPress={onPress}
                      borderWidth={2}
                      buttonInnerColor={colors.theme}
                      buttonOuterColor={
                        recent.value3Index === i
                          ? colors.theme
                          : colors.lightText
                      }
                      buttonSize={15}
                      buttonOuterSize={25}
                      buttonStyle={{}}
                      buttonWrapStyle={{ marginLeft: i == 0 ? 0 : wp(8) }}
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
            <AppText style={[styles.modalText1, { marginTop: 10 }]}>
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
                      buttonInnerColor={colors.theme}
                      buttonOuterColor={
                        itemNo.value3Index === i
                          ? colors.theme
                          : colors.lightText
                      }
                      buttonSize={15}
                      buttonOuterSize={25}
                      buttonStyle={{}}
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
            <Pressable style={styles.buttonClose} onPress={onApplyFilter}>
              <AppText style={styles.textStyle}>APPLY</AppText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};
