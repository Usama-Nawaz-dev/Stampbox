import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { StoryContainer } from "react-native-stories-view";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { images } from "../../assets/images/Images";
import Helper from "../Helper";
import database from "@react-native-firebase/database";

const images_uris = [
  "https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/10821284/pexels-photo-10821284.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];
const Story = ({
  showStatus,
  setShowStatus,
  progressIndex,
  setProgressIndex,
  setModalVisible,
  currentItem,
  userId,
}) => {
  const updateSeenList = ()=>{
    let imgIds = currentItem?.statusList;
    let seenIds = currentItem?.seenList;
    console.log("progressIndex", progressIndex);

    for (let i = 0; i < progressIndex + 1; i++) {
    let arr;
    let lastImg = currentItem?.statusImages[i];
    let timeId = 0;
    Object.keys(imgIds)?.every((key, index) => {
      arr = seenIds[key];

      if (!arr?.includes(userId.toString())) {
        if (imgIds[key] == lastImg) {
          timeId = key;
          return false;
        }
      }
      return true;
    });
    console.log("timeId->", timeId);
    if (timeId) {
      let newArr = Helper.deepCopy(seenIds[timeId]);
      if (!newArr?.includes(userId.toString())) {
        newArr.push(userId.toString());
      }
      let newIds = {...newArr};
      console.log("arr", newIds);
      // timeId = 0;
      database()
      .ref(`/status/${currentItem?.userId}/statusList/${timeId}/seenUsersList`)
      .update(newIds)
      .then(() => console.log("Data updated."))
      .catch((e) => console.log("error", e));
    }
  }
  }
  return (
    <StoryContainer
      visible={showStatus}
      enableProgress={true}
      images={currentItem?.statusImages}
      // duration={5}
      onComplete={() => {
        // alert("onComplete")
        updateSeenList();
        console.log("complete");
        setShowStatus(false);
        setModalVisible(false);
      }}
      imageStyle={{
        width: Dimensions.get("window").width,
        height: 300,
        alignSelf: "center",
        resizeMode: "contain",
      }}
      // imageStyle={{ height: hp(50), width: wp(100)}}
      progressIndex={progressIndex}
      setProgressIndex={setProgressIndex}
      userProfile={{
        userImage: { uri: currentItem?.userImg },
        userName: currentItem?.full_name
          ? currentItem?.full_name
          : currentItem?.username,
        userMessage: "Work hard & success will follow !!",
        imageArrow: images.cross,
        onImageClick: () => {
          updateSeenList();
          setShowStatus(false);
          setModalVisible(false);
          //  Alert.alert('User profile image tapped');
        },
      }}
      containerStyle={{
        width: "100%",
        height: "95%",
        // top: hp(20)
        marginTop: 40,
      }}
    />
  );
};

export { Story };

const styles = StyleSheet.create({});
