import React, { useState, useEffect, useContext } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

import { styles } from "./styles";
import AppText from "../../../../../components/AppText";
import { MainHeader, GradBtn, SelectStamp } from "../../../../../components";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import colors from "../../../../../constant/colors";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";
import Env from "../../../../../api/Env";
import Helper from "../../../../Helper";
import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";

export const AlbumStamps = (props) => {
  const { Item } = props.route.params;
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [stampList, setStampList] = useState(null);
  const [listChang, setListChang] = useState(false);
  const [albumStamps, setAlbumStamps] = useState(null);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  // pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      dispatch(allActions.DataAction.AppLoader(true));
      await getAlbumStamps();
      await getStamps();
      dispatch(allActions.DataAction.AppLoader(false));
    })();
  }, [focused]);

  useEffect(() => {
    stampList?.forEach((el) => {
      if (albumStamps?.length) {
        albumStamps?.forEach((el2) => {
          if (el.id == el2.id) {
            el.isSelected = true;
          }
        });
      }
    });
    setListChang(!listChang);
  }, [stampList?.length]);

  const getAlbumStamps = async (type) => {
    const response = await MindAxios.get(
      Env.paramUrl("stamp-items", `?album_id=${Item?.id}&page_size=100`)
    );
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      setAlbumStamps(_data);
    } else {
      alert("Sever Error.");
    }
  };

  const getStamps = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`stamp-items`, `?user_id=${currentUser?.id}`)
    );
    console.log("response", response);
    if (response?.status == 200) {
      let {
        data: {
          result: {
            paginated_items: { data: _data },
          },
        },
      } = response;
      console.log("res --> stamps", nextPageUrl);
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      const newData = _data.map((item) => {
        item.isSelected = false;
        return item;
      });
      setStampList(newData);
      setNextApiUrl(nextPageUrl);
    } else {
      alert(language?.serverError);
    }
  };

  const getNextStamps = async () => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${currentUser?.id}`
      );
      setIsLoading(false);
      //   console.log("response", response);
      if (response?.status == 200) {
        let {
          data: {
            result: {
              paginated_items: { data: _data },
            },
          },
        } = response;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;

        // console.log("res --> stamps", _data);
        const newData = _data.map((item) => {
          item.isSelected = false;
          return item;
        });
        setStampList([...stampList, ...newData]);
        setNextApiUrl(nextPageUrl);
      } else {
        setNextApiUrl(null);
        alert(language?.serverError);
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

  const onAddToAlbum = async () => {
    const selected = stampList.filter((el) => el.isSelected == true);
    const body = {
      id: Item?.id,
      stamp_item_ids: JSON.stringify(selected.map((item) => item?.id)),
    };
    if (selected?.length) {
      dispatch(allActions.DataAction.AppLoader(true));
      const response = await MindAxios.post(
        Env.createUrl(`albums/sync-stamp-items`),
        body
      );
      dispatch(allActions.DataAction.AppLoader(false));
      if (response?.status === 200) {
        Helper.showToastMessage(
          "Stamps successfully synced with album",
          colors.green
        );
        props.navigation.goBack();
      } else {
        alert(language?.serverError);
      }
    } else {
      alert("Please select at leat one Stamp.");
    }
  };

  const renderUserStamps = ({ item, index }) => {
    const isEnd = index === stampList.length - 1;
    return (
      <View style={{ marginBottom: isEnd ? hp(10) : 0 }}>
        <SelectStamp
          ItemDetail={item}
          borderWidth={item.isSelected ? 2 : 0}
          onPress={() => {
            stampList[index].isSelected = !stampList[index].isSelected;
            setListChang(!listChang);
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MainHeader
        title={language?.addStamps}
        onPressBack={() => props.navigation.goBack()}
      />
      <View style={styles.infoCard}>
        <AppText style={styles.stampName}>{Item?.name}</AppText>
        <AppText style={styles.text}>
          Total Item:{" "}
          <AppText style={styles.infoText}>{Item?.stamp_items_count}</AppText>
        </AppText>
        <AppText style={styles.text}>
          Created By:{" "}
          <AppText style={styles.infoText}>{Item?.user?.full_name}</AppText>
        </AppText>
        {Item?.description && (
          <AppText style={styles.text}>
            Description:{" "}
            <AppText style={styles.infoText}>{Item?.description}</AppText>
          </AppText>
        )}
      </View>
      {stampList?.length ? (
        <FlatList
          numColumns={2}
          data={stampList}
          renderItem={renderUserStamps}
          style={{ paddingHorizontal: wp(3) }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          onEndReached={getNextStamps}
        />
      ) : (
        <View style={styles.emptyList}>
          <AppText style={styles.emptyText}>
            You don't have any active Stamps.
          </AppText>
        </View>
      )}
      <GradBtn
        label={`Add To ${Item?.type}`}
        height={45}
        width="90%"
        fontSize={15}
        fontWeight={"500"}
        style={styles.bottomButton}
        onPress={onAddToAlbum}
      />
    </View>
  );
};
