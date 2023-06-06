import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Fonts from "../../../assets/fonts/Fonts";
import AntDesign from "react-native-vector-icons/AntDesign";
import colors from "../../../constant/colors";
import { MainHeader } from "../../../components";
import { mock as initial } from "./mockres";
import Helper from "../../Helper";
import { useIsFocused } from "@react-navigation/native";
import MindAxios from "../../../api/MindAxios";
import Env from "../../../api/Env";
import { useDispatch } from "react-redux";
import allActions from "../../../redux/actions";
import { ImageList } from "./ImageList";
import FastImage from "react-native-fast-image";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import { Pressable } from "react-native";
import _ from "lodash";
import { BlockItem } from "./BlockItem";
import Empty from "../../../components/Empty";
import EmptyState from "../../../components/EmptyState";

export const Similar = (props) => {
  const {
    navigation,
    route: {
      params: { stampId },
    },
  } = props;
  const [myItem, setMyItem] = useState();
  const [myItemCopy, setMyItemCopy] = useState();
  const [mySimilars, setSimilars] = useState();
  const [selectedImage, setSelectedImage] = useState(initial);
  //   console.log("params", stampId);
  const focused = useIsFocused();
  const dispatch = useDispatch();
  useEffect(() => {
    if (focused) {
      (async () => {
        // dispatch(allActions.DataAction.ActivityModal(true));
        await getStampInfo();
        await getSimilars();
        // dispatch(allActions.DataAction.ActivityModal(false));
      })();
    }
  }, [focused]);
  const getStampInfo = async () => {
    if (stampId) {
      //   dispatch(allActions.DataAction.ActivityModal(true));
      const response = await MindAxios.get(
        Env.paramUrl("stamp-items", stampId)
      );
      //   dispatch(allActions.DataAction.ActivityModal(false));
      console.log("res", response);
      if (response?.status == 200) {
        const {
          data: {
            result: { stamp_item },
          },
        } = response;
        console.log("stamp_item", stamp_item);
        setMyItem(stamp_item);
        setMyItemCopy(stamp_item);
      }
    }
  };
  const getSimilars = async () => {
    if (stampId) {
      console.log("getSimilars", stampId);
      //   dispatch(allActions.DataAction.ActivityModal(true));
      const response = await MindAxios.get(
        Env.createUrl(
          `get-similar?similarable_id=${stampId}&similarable_type=stamp_item`
        )
      );
      //   dispatch(allActions.DataAction.ActivityModal(false));
      console.log("similars", response);
      if (response?.status == 200) {
        const {
          data: { result },
        } = response;
        console.log("similars", result);
        setSimilars(result);
        if (result?.length) {
          setSelectedImage(result[0]);
        }
      }
    }
  };
  const resetMyItem = () => {
    setMyItem(myItemCopy);
  };
  const updateMyitem = async () => {
    dispatch(allActions.DataAction.ActivityModal(true));
    const response = await MindAxios.post(
      Env.paramUrl("stamp-items", stampId),
      myItem
    );
    dispatch(allActions.DataAction.ActivityModal(false));
    console.log("res", response);
    if (response?.status == 200) {
      const {
        data: {
          result: { stamp_item },
        },
      } = response;
      console.log("updated stamp_item", stamp_item);
      setMyItem(stamp_item);
      setMyItemCopy(stamp_item);
      Helper.showToastMessage(
        "Your Stamp-item updated successfully",
        colors.green
      );
    }
  };
  return (
    <SafeAreaView style={styles.main}>
      <MainHeader
        title="Stamp Comparison"
        onPressBack={() => {
          navigation.goBack();
        }}
        rightIcon={
          !_.isEqual(myItem, myItemCopy) ? (
            <Text
              onPress={updateMyitem}
              style={{ color: "#fff", fontWeight: "600", fontSize: 18 }}
            >
              Update
            </Text>
          ) : null
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {mySimilars?.length ? (
          <View style={{ width: "95%", alignSelf: "center" }}>
            <View style={styles.stampContainer}>
              <View style={styles.otherItem}>
                <Text style={styles.itemTxt}>Other Item</Text>
                <FastImage
                  source={{ uri: selectedImage?.medias[0]?.media_url }}
                  style={{ height: 50, width: 70 }}
                  resizeMode="cover"
                />
              </View>
              <View
                style={[
                  styles.otherItem,
                  { backgroundColor: colors.borderColor },
                ]}
              >
                <Text style={styles.itemTxt}>My Item</Text>
                <FastImage
                  source={{ uri: myItem?.medias[0]?.media_url }}
                  style={{ height: 50, width: 70 }}
                  resizeMode="cover"
                />
              </View>
            </View>
            <BlockItem
              myItem={myItem}
              unChanged={myItemCopy}
              mock={selectedImage}
              change={setMyItem}
            />
            {mySimilars?.length > 1 ? (
              <ImageList
                similars={mySimilars}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                reset={resetMyItem}
              />
            ) : null}
          </View>
        ) : (
          <View style={{ height: hp(80), width: wp(100) }}>
            <EmptyState onPress={getSimilars} desc={"Found no similar items"} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1 },
  block: {
    flex: 0.3,
    // backgroundColor: "orange",
    justifyContent: "center",
  },
  otherItem: {
    flex: 0.5,
    // backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  txt: { fontSize: 12, marginHorizontal: 5 },
  separator: {
    height: 0.7,
    backgroundColor: colors.color4,
    width: "100%",
  },
  mainBlock: {
    height: 33,
    // backgroundColor: "grey",
    flexDirection: "row",
  },
  stampContainer: {
    height: 90,
    marginTop: 10,
    width: "70%",
    alignSelf: "flex-end",
    flexDirection: "row",
    borderColor: colors.color4,
    borderWidth: 1,
  },
  itemTxt: { fontSize: 11, bottom: 5, fontWeight: "600" },
});
