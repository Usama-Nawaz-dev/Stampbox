import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";

import { styles } from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { MainHeader, SelectStamp, GradBtn } from "../../../../components";

import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";

import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import allActions from "../../../../redux/actions";
import Helper from "../../../Helper";
import AuthContext from "../../../Context/AuthContext";
import colors from "../../../../constant/colors";
import ThemeContext from "../../../Context/ThemeContext";

export const UserTradeStamp = (props) => {
  const { userId } = props.route.params;
  // console.log("userId ->", userId)
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const usedIds = useSelector((state) => state.SheetReducer.stampIds);

  const [stampList, setStampList] = useState(null);
  const [selectedItem, setSelectedItem] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [listChang, setListChang] = useState(false);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const [type, setType] = useState(null);
  // pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme }= useContext(ThemeContext);

  // console.log(stampList)

  useEffect(() => {
    if (isFocused) {
      (async () => {
        await getStamps();
      })();
    }
  }, []);

  const getStamps = async () => {
    dispatch(allActions.DataAction.ActivityModal(true));
    const response = await MindAxios.get(
      Env.paramUrl(
        `stamp-items`,
       `?user_id=${userId ? userId : currentUser?.id}`
      )
    );
    console.log("response", response);
    dispatch(allActions.DataAction.ActivityModal(false));
    if (response?.status == 200) {
      let {
        data: {
          result: {
            paginated_items: { data: _data },
          },
        },
      } = response;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;

      let newData = _data.map((item) => {
        item.isSelected = false;
        return item;
      });
      console.log("res --> stamps", nextPageUrl);
      setStampList(newData);
      setNextApiUrl(nextPageUrl);
    } else {
      alert(language?.serverError);
    }
  };

  const getNextApiUrl = async () => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl  + `&user_id=${userId ? userId : currentUser?.id}`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        let newData = _data.map((item) => {
          item.isSelected = false;
          return item;
        });
        setStampList([...stampList, ...newData]);
        setNextApiUrl(nextPageUrl);
      } else {
        setNextApiUrl(null);
        alert("Sever Error..");
      }
    }
  };
  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator
          // animation={loder}
          size={"large"}
          color={theme?.theme}
          style={{ marginBottom: 20 }}
        />
      </View>
    ) : null;
  };
  const renderItem = ({ item, index }) => {
    const isEnd = index === stampList.length - 1;
    return (
      <View style={{ marginBottom: isEnd ? hp(2) : 0 }}>
        <SelectStamp
          ItemDetail={item}
          borderWidth={item.isSelected ? 2 : 0}
          onPress={() => {
            // console.log("item", usedIds);
            if (usedIds?.length) {
              if (usedIds.includes(item?.id)) {
                console.log("include");
                Helper.showToastMessage("Already submitted", "red");
              } else {
                stampList[index].isSelected = !stampList[index].isSelected;
                setStampList(stampList);
                setListChang(!listChang);
              }
            } else {
              stampList[index].isSelected = !stampList[index].isSelected;
              setStampList(stampList);
              setListChang(!listChang);
            }
          }}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <MainHeader
        title="Select Stamp"
        onPressBack={() => {
          dispatch(allActions.DetailAction.StampDetail([]));
          props.navigation.goBack();
        }}
      />
      <FlatList
        data={stampList}
        style={{ paddingHorizontal: wp(3), marginTop: hp(1.5) }}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={listChang}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.4}
        onEndReached={getNextApiUrl}
      />
      <View style={styles.bottomBtn}>
        <GradBtn
          label={language?.next}
          height={50}
          width={"90%"}
          style={{ marginTop: 0 }}
          onPress={() => {
            // selectedItem["type"] = type;
            let selected = stampList.filter((el) => el.isSelected == true);
            if (selected?.length) {
              dispatch(allActions.DetailAction.StampsList([...selected]));
              props.navigation.goBack();
            } else {
              alert("Please Select Stamps.");
            }
          }}
        />
      </View>
    </View>
  );
};
