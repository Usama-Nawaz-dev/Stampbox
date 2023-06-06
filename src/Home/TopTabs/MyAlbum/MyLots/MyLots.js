import React, { useState, useEffect, useContext } from "react";
import { View, TouchableOpacity, FlatList, Alert } from "react-native";

import { styles } from "./styles";
import Btn from "../../../../../components/Btn";
import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";
import { SimpleHeader } from "../../../../../components";
import AlbumCard from "../../../../../components/AlbumCard";

import Octicons from "react-native-vector-icons/Octicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import allActions from "../../../../../redux/actions";
import MindAxios from "../../../../../api/MindAxios";

import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";

export const MyLots = ({ navigation }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [lotsList, setLotsList] = useState(null);

  useEffect(() => {
    if (isFocused) {
      (async () => {
        await getLots();
      })();
    }
  }, [isFocused]);

  const getLots = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(`albums`, `?type=Lot&user_id=${currentUser?.id}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      let {
        data: {
          result: {
            paginated_items: { data: _data },
          },
        },
      } = response;
      setLotsList(_data);
    } else {
      alert("Sever Error.");
    }
  };

  const removeLotAlert = (id) =>
    Alert.alert("Delete Lot ?", "Are you sure you want to delete this lot ?", [
      { text: "Cancel" },
      { text: "OK", onPress: () => onDeleteLot(id) },
    ]);

  const onDeleteLot = async (id) => {
    dispatch(allActions.DataAction.AppLoader(true));
    let { headers } = await MindAxios.formdataConfig();
    fetch(Env.paramUrl("albums", `${id}`), {
      method: "DELETE",
      headers: headers,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result?.success) {
          dispatch(allActions.DataAction.AppLoader(false));
          getLots();
        }
      })
      .catch((error) => {
        dispatch(allActions.DataAction.AppLoader(false));
        alert(error);
      });
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === lotsList.length - 1;
    return (
      <View
        style={{
          marginRight: wp(3),
          marginLeft: index % 2 == 0 ? 2 : 0,
          marginTop: hp(1.5),
          marginBottom: isEnd ? hp(3) : 0,
        }}
      >
        <AlbumCard
          ItemDetail={item}
          btnTitle="View Lot"
          onDelete={() => removeLotAlert(item.id)}
          onViewAlbum={() => navigation.navigate("SetDetail", { Item: item })}
          onEdit={() =>
            navigation.navigate("CreateAlbum", {
              type: "Edit",
              screenName: "Lot",
              ItemDetail: item,
            })
          }
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate("CreateAlbum", {
            type: "Create",
            screenName: "Lot",
          })
        }
      >
        <Octicons name="plus" size={22} color="#fff" />
      </TouchableOpacity>
      <SimpleHeader
        title={language?.myLots}
        showSearch={true}
        showFilter={false}
        onPressBack={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          })
        }
      />
      {/* <IconsHeader search={false} title="Lots" 
                onPressBack={() =>  navigation.reset({
                    index: 0,
                    routes: [{name: 'Home'}],
                  })}
                rightIconPress={() => console.log("Back Icon Pressed")}
            /> */}
      {/* <View style={styles.search}>
                <View style={styles.leftSection}>
                    <Ionicons name="search" size={22} color={colors.theme} />
                    <TextInput placeholder='Search for album' style={styles.input} />
                </View>
                <MaterialCommunityIcons name="camera-plus-outline" size={26} />
            </View> */}
      {!lotsList?.length ? (
        <View style={styles.addSection}>
          <AppText style={{ color: theme?.darkGrey }}>
            You have no listed item this time.
          </AppText>
          <Btn
            label="Create a Lot"
            fontSize={12}
            height={hp(4.5)}
            width={wp(40)}
            style={{ marginTop: hp(1.5) }}
            iconLeft={
              <SimpleLineIcons
                name="plus"
                size={hp(2.5)}
                color="#fff"
                style={{ marginRight: wp(2) }}
              />
            }
            onPress={() =>
              navigation.navigate("CreateAlbum", {
                type: "Create",
                screenName: "Lot",
              })
            }
          />
        </View>
      ) : (
        <FlatList
          numColumns={2}
          data={lotsList}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: wp(5), marginTop: hp(1) }}
        />
      )}
    </View>
  );
};
