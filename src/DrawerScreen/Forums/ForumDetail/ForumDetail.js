import React, { useState, useEffect } from "react";
import { View, Pressable, ScrollView, Alert } from "react-native";
import FastImage from "react-native-fast-image";

import { styles } from "./styles";
import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";

import {
  GradBtn,
  HtmlTag,
  MenuSheet,
  MainHeader,
} from "../../../../components";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Entypo from "react-native-vector-icons/Entypo";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";
import Helper from "../../../Helper";

export const ForumDetail = (props) => {
  const { Item } = props?.route?.params;
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [itemDetail, setItemDetail] = useState(null);

  useEffect(() => {
    if (focused) {
      fetchForumDetail();
    }
  }, [focused]);

  const fetchForumDetail = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.createUrl(`forums/${Item?.id}`));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result?.item;
      setItemDetail(_data);
    }
  };

  const optionIcon = (
    <Entypo size={hp(2.6)} color={colors.cWhite} name="dots-three-vertical" />
  );

  const removeForumAlert = (id) =>
    Alert.alert(
      "Delete Forum ?",
      "Are you sure you want to delete this Forum ?",
      [{ text: "Cancel" }, { text: "OK", onPress: () => deleteForum(id) }]
    );

  const deleteForum = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.delete(
      Env.createUrl(`forums/${Item?.id}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status === 200) {
      props.navigation.goBack();
      Helper.showToastMessage("Forum deleted Successfully", colors.green);
    } else {
      alert(language?.serverError);
    }
  };

  return (
    <View style={styles.container}>
      <MainHeader
        title="Question"
        onPressBack={() => props.navigation.goBack()}
        rightIcon={
          <MenuSheet
            destructiveIndex={1}
            customButton={optionIcon}
            options={["Update Forum", "Delete Forum", "Cancel"]}
            actions={[
              () => {
                dispatch(allActions.DataAction.SelectedImg(itemDetail?.medias));
                props.navigation.navigate("CreateForum", itemDetail);
              },
              removeForumAlert,
            ]}
          />
        }
      />
      <View style={styles.CCard}>
        <FastImage
          source={{ uri: itemDetail?.user?.image_url }}
          style={styles.CCImage}
        />
        <View style={styles.infoSection}>
          <AppText style={styles.commentUser}>
            {itemDetail?.user?.full_name}
          </AppText>
          <AppText style={styles.commentText}>
            {moment(itemDetail?.created_at).format("YYYY-MM-DD [at] h:mm A")}
          </AppText>
        </View>
      </View>
      <AppText style={styles.hText}>{itemDetail?.title}</AppText>
      <ScrollView>
        {/* <AppText style={styles.dText}>{itemDetail?.description}</AppText> */}
        <HtmlTag style={styles.dText} description={itemDetail?.description} />
        <GradBtn
          height={hp(3.5)}
          fontSize={12}
          label={"Reply"}
          fontWeight={"500"}
          style={styles.button}
          width={wp(20)}
          onPress={() =>
            props.navigation.navigate("PostComment", {
              data: Item,
              type: "Forum",
            })
          }
        />
        <QuestionCard />
      </ScrollView>
    </View>
  );
};

const QuestionCard = ({ item, onPress }) => {
  return (
    <Pressable style={styles.qCard} onPress={onPress}>
      <AppText style={styles.qText}>Community Stats</AppText>
      <View style={styles.qInfoSection}>
        <View style={styles.borderView}>
          <AppText style={styles.viewText}>534</AppText>
          <AppText>Last Month Views</AppText>
        </View>
        <View style={styles.borderView}>
          <AppText style={styles.viewText}>10</AppText>
          <AppText>Conversation</AppText>
        </View>
      </View>
    </Pressable>
  );
};
