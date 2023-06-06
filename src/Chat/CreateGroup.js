import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { MainHeader } from "../../components";
import colors from "../../constant/colors";
import Entypo from "react-native-vector-icons/Entypo";
import { useDispatch, useSelector } from "react-redux";
import Helper from "../Helper";
import UserComp from "./UserComp";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import allActions from "../../redux/actions";
import storage from "@react-native-firebase/storage";
import database from "@react-native-firebase/database";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useFocusEffect } from "@react-navigation/native";

// const members = [1,2,3,4]
const CreateGroup = ({ navigation }) => {
  const [groupImage, setGroupImage] = useState(null);
  const [groupName, setGroupName] = useState(null);
  const dispatch = useDispatch();
  const members = useSelector((state) => state.SheetReducer.members);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  //   console.log("members", members);
  const inputRef = useRef();

  useEffect(() => {
    // re-render the screen on memebers update
  }, [members]);
  // useFocusEffect(()=>{
  //   setGroupImage(null)
  //   setGroupName(null)
  // },[])
  const uploadGroup = async () => {
    if (members?.length > 1 && groupImage && groupName) {
      dispatch(allActions.DataAction.AppLoader(true));
      // console.log("object", createObj);

      try {
        const result = await storage()
          .ref(`/group_image/${Date.now()}Stampbox.jpg`)
          .putFile(groupImage);
        if (result?.state == "success") {
          const {
            metadata: { fullPath },
          } = result;
          console.log("fullpath", fullPath);
          const storedUrl = await storage()
            .ref(`/${fullPath}`)
            .getDownloadURL();
          console.log("storedUrl", storedUrl);
          let now = Date.now();
          let createObj = members.map((obj) => {
            let me = currentUser?.id == obj?.id;
            let newObj = {};
            newObj.id = obj?.id.toString();
            newObj.image = obj?.image_url;
            newObj.name = obj?.full_name;
            newObj.time = now.toString();
            newObj.type = me ? "creator" : "visitor";
            return newObj;
          });
          let newBody = {
            name: groupName,
            id: now.toString(),
            image: storedUrl,
            time: now.toString(),
            memberList: createObj,
          };
          // console.log("body", body);
          // await database().ref(`/status/${id}`).set({ statusowner: username });
          await database().ref(`/groups/${now}`).set(newBody);
          setGroupImage(null);
          setGroupName(null);
          dispatch(allActions.DataAction.AppLoader(false));
          dispatch(allActions.SheetAction.groupMembers([]));
          navigation.goBack();
        }
      } catch (error) {
        dispatch(allActions.DataAction.AppLoader(false));
        console.log("error", error);
      }
    } else {
      alert("please add group image and name");
    }
  };
  const chooseFile = async () => {
    launchImageLibrary({
      multiple: true,
      maxWidth: 600,
      maxHeight: 600,
      quality: 1,
      // selectionLimit: 10
    })
      .then((images) => {
        if (images.assets) {
          // console.log('images.assets[0]', images.assets[0])
          console.log("images.assets[0]?.uri", images.assets[0]?.uri);
          setGroupImage(images.assets[0]?.uri);
        } else {
          // console.log("Cancled", images);
        }
      })
      .catch((err) => {
        //  console.log(err)
      });
  };
  const renderItem = ({ item, index }) => {
    let me = currentUser?.id == item?.id;
    return (
      <View
        style={{
          height: 70,
          width: "95%",
          //   backgroundColor: "lightgrey",
          alignItems: "center",
          margin: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
        }}
      >
        <UserComp
          label={Helper.capitalizeFirstLetter(item?.full_name)}
          label2="available"
          item={item}
        />
        {!me ? (
          <Entypo
            onPress={() => {
              if (members?.length > 2) {
                let filteredList = members?.filter(
                  (obj) => obj?.id !== item?.id
                );
                console.log("filteredList", filteredList);
                dispatch(allActions.SheetAction.groupMembers(filteredList));
              } else {
                dispatch(allActions.SheetAction.groupMembers([]));
                setTimeout(() => {
                  navigation.goBack();
                }, 1000);
              }
            }}
            name="squared-cross"
            size={25}
            color={colors.red}
          />
        ) : null}
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <MainHeader
        title="Group Members"
        onPressBack={() => {
          dispatch(allActions.SheetAction.groupMembers([]));
          navigation.goBack();
        }}
        rightIcon={
          <TouchableOpacity onPress={uploadGroup}>
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 18 }}>
              CREATE
            </Text>
          </TouchableOpacity>
        }
      />
      <View
        style={{
          height: 60,
          width: "95%",
          backgroundColor: colors.color3,
          alignSelf: "center",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        {groupImage ? (
          <Pressable onPress={chooseFile}>
            <Image
              source={{ uri: groupImage }}
              style={{
                height: 40,
                width: 40,
                borderRadius: 8,
                // backgroundColor: colors.disable,
                // alignItems: "center",
                // justifyContent: "center",
                marginLeft: 10,
                marginRight: 15,
              }}
            />
          </Pressable>
        ) : (
          <TouchableOpacity
            onPress={chooseFile}
            style={{
              height: 40,
              width: 40,
              borderRadius: 8,
              backgroundColor: colors.disable,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 10,
              marginRight: 15,
            }}
          >
            <Entypo name="camera" size={25} color={colors.color6} />
          </TouchableOpacity>
        )}
        <TextInput
          ref={inputRef}
          maxLength={80}
          onChangeText={(val) => {
            setGroupName(val);
          }}
          placeholder="Enter group name"
          style={{ maxWidth: wp(75) }}
          placeholderTextColor={colors.placeholderText}
        />
      </View>
      <FlatList
        data={members}
        renderItem={renderItem}
        keyExtractor={() => Helper.keyGenerator()}
      />
    </View>
  );
};

export { CreateGroup };

const styles = StyleSheet.create({});
