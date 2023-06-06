import React, { useState, useEffect, useContext } from "react";
import { View, Alert, FlatList } from "react-native";

import { styles } from "./styles";
import colors from "../../../../../constant/colors";
import Header from "../../../../../components/Header";
import AppText from "../../../../../components/AppText";
import { MainHeader, MenuSheet, ItemCard } from "../../../../../components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Entypo from "react-native-vector-icons/Entypo";

import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";

import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";

export const SetDetail = (props) => {
  const { Item } = props.route.params;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [stampList, setStampList] = useState(null);
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log(Item);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme, mood } = useContext(ThemeContext);

  useEffect(() => {
    if (isFocused) {
      getSetStamps();
    }
  }, [isFocused]);

  const getSetStamps = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl("stamp-items", `?album_id=${Item?.id}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result?.paginated_items?.data;
      const nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      setNextApiUrl(nextPageUrl);
      setStampList(_data);
    } else {
      alert("Sever Error.");
    }
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === stampList.length - 1;
    return (
      <View
        style={{
          marginRight: wp(3),
          marginLeft: index % 2 == 0 ? 2 : 0,
          marginTop: hp(1.5),
          marginBottom: isEnd ? hp(3) : 0,
        }}
      >
        <ItemCard Item={item} showBtn={true} />
      </View>
    );
  };

  const optionIcon = (
    <Entypo size={22} color={colors.cWhite} name="dots-three-vertical" />
  );

  const addSetStamps = () =>
    props.navigation.navigate("AlbumStamps", { Item: Item });

  const removeSetAlert = () =>
    Alert.alert("Delete Set ?", "Are you sure you want to delete this set ?", [
      { text: "Cancel" },
      { text: "OK", onPress: () => onDeleteSet() },
    ]);

  const onDeleteSet = async () => {
    const response = await MindAxios.delete(Env.paramUrl(`albums`, Item?.id));
    if (response?.status == 200) {
      Helper.showToastMessage("Set Deleted Successfully", colors.green);
      props.navigation.goBack();
    } else {
      alert(language?.serverError);
    }
  };

  const onEdit = () =>
    props.navigation.navigate("CreateAlbum", {
      type: "Edit",
      screenName: "Sets",
      ItemDetail: Item,
    });

  return (
    <View style={styles.container}>
      {/* <Header
        title={"Set Detail"}
        multiple={true}
        // onAdd={() => props.navigation.navigate("CreateAlbum")}
        onDelete={() => console.log("Delete Pressed")}
        onEdit={() =>
          props.navigation.navigate("CreateAlbum", {
            type: "Edit",
            screenName: "Sets",
          })
        }
        onPress={() => props.navigation.goBack()}
      /> */}
      <MainHeader
        title={`${Item?.type} Detail`}
        onPressBack={() => props.navigation.goBack()}
        rightIcon={
          <MenuSheet
            destructiveIndex={1}
            customButton={optionIcon}
            options={[language?.addStamps, `Delete ${Item?.type}`, "Cancel"]}
            actions={[addSetStamps, removeSetAlert]}
          />
        }
      />
      <AppText style={styles.leftText}>{Item?.name}</AppText>
      <View style={styles.infoCard}>
        <AppText style={styles.text}>
          Created By:{" "}
          <AppText style={styles.infoText}>{Item?.user?.full_name}</AppText>
        </AppText>
        <AppText style={styles.text}>
          Item:{" "}
          <AppText style={styles.infoText}>{Item?.stamp_items_count}</AppText>
        </AppText>
        <AppText style={styles.description}>{Item?.description}</AppText>
      </View>
      <AppText style={styles.heading}>All Stamps</AppText>

      {stampList?.length ? (
        <FlatList
          numColumns={2}
          data={stampList}
          renderItem={renderItem}
          style={{ paddingHorizontal: wp(5) }}
          //   ListFooterComponent={ListFooterComponent}
          showsVerticalScrollIndicator={false}
          //   onEndReached={onEndReached}
        />
      ) : (
        <View style={styles.mainItem}>
          <AppText style={[styles.itemText, { color: theme?.theme }]}>
            {`${Item?.type} don't have any Stamps.`}
          </AppText>
        </View>
      )}
    </View>
  );
};
