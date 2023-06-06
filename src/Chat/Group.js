import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Helper from "../Helper";
import database from "@react-native-firebase/database";
import { styles } from "./styles";
import _ from "lodash";
import UserComp from "./UserComp";
import allActions from "../../redux/actions";
import moment from "moment";
import ThemeContext from "../Context/ThemeContext";
// import { dark as theme } from "../../constant/colorsConfig";
import Empty from "../../components/Empty";

const Group = ({ navigation }) => {
  const [userGroups, setUserGroups] = useState();
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  if (currentUser) {
    var { id, username, image_url } = currentUser;
  }
  useEffect(() => {
    let dt = database()
      .ref(`/groups`)
      .on("value", (snapshot) => {
        let val = snapshot?.val();
        console.log("User data: ", val);
        let groups = [];
        if (!_.isEmpty(val)) {
          Object?.keys(val)?.forEach((key, index) => {
            let obj = val[key];
            if (id) {
              let list = obj?.memberList;
              // console.log("obj?.memberList", list);
              // console.log("req array", list);
              let idExist = Array.isArray(list)
                ? list?.some((e) => e?.id === id?.toString())
                : Object.values(list)?.some((e) => e?.id === id?.toString());
              // console.log('idExist', idExist);
              if (idExist) {
                groups.push(obj);
              }
              // console.log('obj', obj)
            }
          });

          setUserGroups(groups);
          // dispatch(allActions.SheetAction.getGroups(groups))
        }
      });
    return () => database().ref(`/groups`).off("value", dt);
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: theme?.white }}>
      {userGroups?.length ? (
        <FlatList
          data={userGroups}
          style={{ marginTop: 15 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            // console.log("item", item);
            return (
              <>
                <Pressable
                  onPress={() => {
                    // let listing = item?.memberList?.filter(
                    //   (el) => !_.isEmpty(el)
                    // );
                    // item.memberList = listing;
                    // console.log("listing", item);
                    dispatch(allActions.SheetAction.user_chat(item));
                    navigation.navigate("GroupStack");
                  }}
                  style={styles.userSection}
                >
                  <UserComp
                    label={Helper.capitalizeFirstLetter(item?.name)}
                    label2={moment(Number(item?.time)).format(
                      "YYYY-MM-DD [at] h:mm a"
                    )}
                    // online={true}
                    item={item}
                  />
                </Pressable>
                <View
                  style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "lightgrey",
                    marginVertical: 5,
                  }}
                />
              </>
            );
          }}
        />
      ) : (
        <Empty desc="Create group" />
      )}
    </View>
  );
};

export default Group;
