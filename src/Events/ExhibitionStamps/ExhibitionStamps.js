import React, { useState, useEffect, useContext } from "react";
import { View, FlatList } from "react-native";

import { styles } from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AuthContext from "../../Context/AuthContext";
import { SimpleHeader, SelectStamp, GradBtn } from "../../../components";

import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

const arrayChecker = (arr1, arr2) => {
  arr1.forEach((el) => {
    if (arr2?.length) {
      arr2.forEach((el2) => {
        if (el.id == el2?.id) {
          el.isSelected = true;
        }
      });
    }
  });
};

export const ExhibitionStamps = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const selectedStamp = useSelector((state) => state.DetailReducer.stampsList);

  const [stampList, setStampList] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [listChanged, setListChanged] = useState(true);

  const {
    myState: { language },
  } = useContext(AuthContext);

  const filterStamps = stampList?.filter((item) => item?.isSelected);

  useEffect(() => {
    if (isFocused) {
      getStamps();
    }
  }, [isFocused]);

  const getStamps = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(`stamp-items`, `?user_id=${currentUser?.id}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const newData = _data?.map((item) => {
        item.isSelected = false;
        return item;
      });
      arrayChecker(newData, selectedStamp)
      setStampList(newData);
      setCurrentData(newData);
    } else {
      alert(language?.serverError);
    }
  };

  const searchData = (x) => {
    let text = x.toLowerCase();
    if (x) {
      let filteredStamp = stampList.filter((item) => {
        return item.name.toLowerCase().match(text);
      });
      setStampList(filteredStamp);
    } else {
      setStampList(currentData);
    }
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === stampList.length - 1;
    return (
      <View style={{ marginBottom: isEnd ? hp(2) : 0 }}>
        <SelectStamp
          ItemDetail={item}
          borderWidth={item?.isSelected ? 2 : 0}
          onPress={() => {
            item.isSelected = !item?.isSelected;
            setListChanged(!listChanged);
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SimpleHeader
        showSearch={true}
        showFilter={false}
        title="Select Stamp"
        onChangeValue={(text) => searchData(text)}
        onPressBack={() => {
          props.navigation.goBack();
          dispatch(allActions.DetailAction.StampDetail([]));
        }}
      />
      <FlatList
        numColumns={2}
        data={stampList}
        renderItem={renderItem}
        extraData={listChanged}
        keyExtractor={(item) => item.id}
        style={{ paddingHorizontal: wp(3), marginTop: hp(1.5) }}
      />
      {filterStamps?.length ? (
        <View style={styles.bottomBtn}>
          <GradBtn
            label={language?.next}
            height={50}
            width={"90%"}
            style={{ marginTop: 0 }}
            onPress={() => {
              dispatch(allActions.DetailAction.StampsList(filterStamps));
              props.navigation.goBack();
            }}
          />
        </View>
      ) : null}
    </View>
  );
};
