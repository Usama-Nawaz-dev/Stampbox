import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { styles } from "./styles";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";
import { StampCard, SimpleHeader, BottomSheet } from "../../../../components";

import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Helper from "../../../Helper";
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";

import { ExpertSheet } from "./ExpertSheet";
import { EvalModal } from "../Evaluations/EvalModal";

import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";

export const EvalStamps = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const expertSheetRef = useRef();

  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [stampId, setStampId] = useState(null);
  const [stampList, setStampList] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentList, setCurrentList] = useState(null);

  const {
    myState: { language },
  } = useContext(AuthContext);

  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const { theme, mood } = useContext(ThemeContext);

  useEffect(() => {
    if (focused) {
      fetchData();
    }
  }, [focused]);

  const fetchData = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    await getStampList("");
    dispatch(allActions.DataAction.AppLoader(false));
  };

  const getStampList = async (value) => {
    const response = await MindAxios.get(
      Env.paramUrl("stamp-items", `?user_id=${currentUser?.id}&status=${value}`)
    );
    // console.log("stamplist....", response);
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      const myData = _data.map((item) => {
        item.isSelected = false;
        return item;
      });
      setStampList(myData);
      setCurrentList(myData);
      setNextApiUrl(nextPageUrl);
    } else {
      alert("Sever Error.");
    }
  };

  const getNextStampList = async (value) => {
    // console.log("status...", status);
    if (nextApiUrl !== null && stampList?.length >= 10) {
      setIsLoading(true);
      // console.log("next....Api....url.....",nextApiUrl);
      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${currentUser?.id}&status=${value}`
      );
      // console.log("response....2", response);
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        const myData = _data.map((item) => {
          item.isSelected = false;
          return item;
        });
        setStampList([...stampList, ...myData]);
        setCurrentList([...stampList, ...myData]);
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
          Item={item}
          onPress={() => {
            setStampId(item?.id);
            expertSheetRef?.current?.open();
          }}
        />
      </View>
    );
  };

  const onRefresh = async () => {
    setLoading(true);
    await getStampList("");
    setLoading(false);
  };

  const INTERVAL = 1500;
  const searchItems = debounce(
    (x) => {
      onSearchData(x);
    },
    INTERVAL,
    { leading: true, trailing: false, maxWait: INTERVAL }
  );

  const onSearchData = async (x) => {
    if (x) {
      setLoading(true);
      const response = await MindAxios.get(
        Env.paramUrl(
          `stamp-items`,
          `?user_id=${currentUser?.id}&page_size=9&search=${x}`
        )
      );
      setLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        setStampList(_data);
      }
    } else {
      setStampList(currentList);
    }
  };

  const postEvalApi = async (id) => {
    const body = {
      expert_id: id,
      evaluable_id: stampId,
      evaluable_type: "StampItem",
    };
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.post(Env.createUrl("evaluations"), body);
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      setShowModal(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <SimpleHeader
        showSearch={true}
        showFilter={true}
        title={`My Stamps`}
        onPressBack={() => props.navigation.goBack()}
      />
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
        <View style={[styles.mainItem, { backgroundColor: theme?.white }]}>
          <AppText style={styles.itemText}>
            You have no Item listed at this time.
          </AppText>
        </View>
      )}

      {/* Expert Sheet */}
      <BottomSheet
        ref={expertSheetRef}
        sheetHeight={hp(55)}
        ChildComponent={
          <ExpertSheet
            onSelectExpert={(id) => {
              expertSheetRef?.current?.close();
              setTimeout(() => {
                postEvalApi(id);
              }, 350);
            }}
          />
        }
      />

      {/* Stamp Submitted Modal */}
      <EvalModal
        showModal={showModal}
        onPress={() => {
          setShowModal(false);
          props?.navigation?.goBack();
        }}
      />
    </View>
  );
};
