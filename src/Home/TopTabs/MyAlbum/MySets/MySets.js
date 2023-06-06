import React, { useState, useEffect, useContext } from "react";
import { View, TouchableOpacity, FlatList, Alert } from "react-native";

import Octicons from "react-native-vector-icons/Octicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import { styles } from "./styles";
import Btn from "../../../../../components/Btn";
import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";
import AlbumCard from "../../../../../components/AlbumCard";
import SetsInfoCard from "../../../../../components/SetsInfoCard";
import { SimpleHeader } from "../../../../../components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";

import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";

export const MySets = ({ navigation }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const [setsList, setSetsList] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (isFocused) {
      (async () => {
        await getSets();
      })();
    }
  }, [isFocused]);

  const getSets = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(`albums`, `?type=Set&user_id=${currentUser?.id}`)
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
      setSetsList(_data);
    } else {
      alert("Sever Error.");
    }
  };

  const removeSetAlert = (id) =>
    Alert.alert("Delete Set ?", "Are you sure you want to delete this set ?", [
      { text: "Cancel" },
      { text: "OK", onPress: () => onDeleteSet(id) },
    ]);

  const onDeleteSet = async (id) => {
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
          getSets();
        }
      })
      .catch((error) => {
        dispatch(allActions.DataAction.AppLoader(false));
        alert(error);
      });
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === setsList?.length - 1;
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
          btnTitle="View Set"
          onDelete={() => removeSetAlert(item.id)}
          onViewAlbum={() => navigation.navigate("SetDetail", { Item: item })}
          onEdit={() =>
            navigation.navigate("CreateAlbum", {
              type: "Edit",
              screenName: "Set",
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
            screenName: "Set",
          })
        }
      >
        <Octicons name="plus" size={hp(3)} color="#fff" />
      </TouchableOpacity>
      <SimpleHeader
        title={language?.mySets}
        showSearch={true}
        showFilter={false}
        onPressBack={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          })
        }
      />
      {/* <SetsInfoCard /> */}
      {!setsList?.length ? (
        <View style={styles.addSection}>
          <AppText style={{ color: theme?.darkGrey }}>
            You have no listed item this time.
          </AppText>
          <Btn
            label="Create a Set"
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
                screenName: "Sets",
              })
            }
          />
        </View>
      ) : (
        <FlatList
          data={setsList}
          style={{ paddingHorizontal: wp(5), marginTop: 10 }}
          renderItem={renderItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};
