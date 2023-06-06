import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import ChatHeader from "../../components/Headers/ChatHeader";
import { useDispatch, useSelector } from "react-redux";
import UserComp from "./UserComp";
import colors from "../../constant/colors";
import { FadeInFlatList } from "../../components/FadeInFlatList";
import moment from "moment";
import database from "@react-native-firebase/database";
import allActions from "../../redux/actions";
import Helper from "../Helper";
import { popTotop } from "../../constant/navigationMethods";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Octicons from "react-native-vector-icons/Octicons";

const InfoScreen = (props) => {
  const dispatch = useDispatch();
  const otherUser = useSelector((state) => state.SheetReducer.otherUser);
  const { id } = useSelector((state) => state.ApiReducer.user);
  let len = otherUser?.memberList?.length;
  let admin = len ? otherUser?.memberList[0].id == id?.toString() : null;
  const renderItem = ({ item, index }) => {
    if (item) {
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 20,
            marginBottom: 10,
          }}
        >
          <UserComp
            label={item?.name}
            label2={`joined ${moment(Number(item?.time)).format(
              "YYYY-MM-DD [at] h:mm A"
            )}`}
            item={item}
          />
          <Text
            onPress={() => {
              console.log("first");
              if (item?.type !== "creator") {
                Alert.alert(
                  "Remove user?",
                  `Are you sure to remove ${item?.name} from the group?`,
                  [
                    { text: "Cancel" },
                    {
                      text: "OK",
                      onPress: () => removeUser(item),
                    },
                  ]
                );
              }
            }}
            style={{ color: colors.lightTheme, fontWeight: "400" }}
          >
            {item?.type == "creator" ? "ADMIN" : admin ? "REMOVE" : null}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };
  const removeUser = (item) => {
    console.log("remove");
    dispatch(allActions.DataAction.AppLoader(true));
    let filterId = otherUser?.memberList?.findIndex(
      (obj) => obj?.id == item?.id
    );

    console.log("filterId", filterId);
    database()
      .ref(`/groups/${otherUser?.id}/memberList/${filterId}`)
      .remove()
      .then(() => {
        dispatch(allActions.DataAction.AppLoader(false));
        let filtered = otherUser?.memberList?.map((obj) => {
          if (obj?.id == item?.id) {
            return null;
          } else {
            return obj;
          }
        });
        let newItem = Helper.deepCopy(otherUser);
        newItem.memberList = filtered;
        dispatch(allActions.SheetAction.user_chat(newItem));
        // popTotop();
        Helper.showToastMessage("User removed successfully", colors.green);
      })
      .catch((e) => console.log("error", e));
  };
  return (
    <View style={{ flex: 1 }}>
      <ChatHeader
        item={otherUser}
        label={otherUser?.name}
        label2={`created ${moment(Number(otherUser?.time)).format(
          "YYYY-MM-DD [at] h:mm A"
        )}`}
        onPressBack={() => props.navigation.goBack()}
      />
      <FlatList
        // initialDelay={0}
        // durationPerItem={200}
        // parallelItems={1}
        // itemsToFadeIn={10}
        data={otherUser?.memberList}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        //   style={styles.listStyle}
      />
      {admin ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => props.navigation.navigate("AddMore")}
        >
          <Octicons name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export { InfoScreen };

const styles = StyleSheet.create({
  agoText: {
    fontSize: 12,
    color: colors.lightText,
    // fontFamily: Fonts.Inter_Medium,
  },
  addButton: {
    position: "absolute",
    backgroundColor: colors.color8,
    bottom: 20,
    right: wp(6),
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
