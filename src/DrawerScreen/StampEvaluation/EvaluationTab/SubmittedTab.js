import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import Btn from "../../../../components/Btn";
import { CertifySheet } from "./CertifySheet";
import colors from "../../../../constant/colors";
import Fonts from "../../../../assets/fonts/Fonts";
import AppText from "../../../../components/AppText";
import { EvalModal } from "../Evaluations/EvalModal";
import { BottomSheet, StampCard } from "../../../../components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";

import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";

export const SubmittedTab = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const certifySheetRef = useRef();
  const { status } = props?.route?.params;

  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [showModal, setShowModal] = useState(false);
  const [stampList, setStampList] = useState(null);

  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const { theme } = useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    if (focused) {
      getStampList();
    }
  }, [focused]);

  const onRefresh = async () => {
    setLoading(true);
    await getStampList("");
    setLoading(false);
  };

  const getStampList = async (value) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(
        "evaluations",
        `?user_id=${currentUser?.id}&status=${status}`
      )
    );
    dispatch(allActions.DataAction.AppLoader(false));
    // console.log("stamplist....", response);
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      setStampList(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert("Sever Error.");
    }
  };

  const getNextStampList = async (value) => {
    if (nextApiUrl !== null && stampList?.length >= 10) {
      setIsLoading(true);

      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${currentUser?.id}&status=${status}`
      );

      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setStampList([...stampList, _data]);
        setNextApiUrl(nextPageUrl);
      } else {
        setNextApiUrl(null);
        setIsLoading(false);
        alert("Sever Error..");
      }
    }
  };

  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator
          size={"large"}
          color={colors.lightTheme}
          style={{ marginBottom: 20 }}
        />
      </View>
    ) : null;
  };

  const onPressDetail = async (stampId) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.paramUrl("stamp-items", stampId));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const data = response?.data?.result?.stamp_item;
      dispatch(allActions.DetailAction.StampDetail(data));
      props.navigation.navigate("StampDetail");
    } else {
      alert(language?.serverError);
    }
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === stampList.length - 1;
    return (
      <View
        style={{
          marginRight: wp(3),
          marginTop: hp(1.5),
          marginBottom: isEnd ? hp(3) : 0,
          marginLeft: index % 2 == 0 ? 2 : 0,
        }}
      >
        <StampCard
          Item={item?.evaluable}
          onPress={() => onPressDetail(item?.evaluable_id)}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      {stampList?.length ? (
        <FlatList
          numColumns={2}
          data={stampList}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={loading}
              tintColor={colors.lightTheme}
            />
          }
          refreshing={loading}
          renderItem={renderItem}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          style={{ paddingHorizontal: wp(5) }}
          showsVerticalScrollIndicator={false}
          onEndReached={getNextStampList}
        />
      ) : (
        <View style={styles.mainItem}>
          <AppText
            onPress={() => setShowModal(true)}
            style={[styles.itemText, { color: theme.lightText }]}
          >
            No stamp is submitted for evaluation.
          </AppText>
          <Btn
            fontSize={12}
            height={hp(5)}
            width={wp(45)}
            label={`Submit Stamp`}
            style={{ marginTop: hp(1) }}
            onPress={() => props.navigation.navigate("EvalStamps")}
          />
          <Btn
            fontSize={12}
            height={hp(5)}
            width={wp(45)}
            style={{ marginTop: hp(1) }}
            label={`Get Expert Certification`}
            onPress={() => certifySheetRef?.current?.open()}
          />
        </View>
      )}

      {/* Certify Sheet */}
      <BottomSheet
        ref={certifySheetRef}
        sheetHeight={hp(45)}
        ChildComponent={
          <CertifySheet
            onCloseSheet={() => {
              certifySheetRef?.current?.close();
            }}
          />
        }
      />

      <EvalModal
        showModal={showModal}
        onPress={() => {
          setShowModal(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  topSection: {
    marginTop: hp(1),
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: wp(3),
    justifyContent: "space-between",
  },
  text: {
    fontSize: 16,
    fontFamily: Fonts.IBM_SemiBold,
  },
  listStyle: {
    paddingTop: hp(1.5),
    paddingHorizontal: wp(3),
  },
  mainItem: {
    flex: 0.9,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightText,
  },
});
