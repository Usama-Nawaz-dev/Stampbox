import { SafeAreaView, StyleSheet, View } from "react-native";
import React, { useContext, useState } from "react";
import PagerButtons from "../PagerButtons";
import ImageFilters from "./ImageFilters";
import Edits from "./Edits";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicon from "react-native-vector-icons/Ionicons";
import colors from "../../constant/colors";
import { useDispatch, useSelector } from "react-redux";
import allActions from "../../redux/actions";
import MindAxios from "../../api/MindAxios";
import Env from "../../api/Env";
import AuthContext from "../../src/Context/AuthContext";

const Editor = ({ navigation, route }) => {
  const { item, isStamp, type } = route.params;
  const mediaUrl = item?.media_url;
  // console.log("media-->", mediaUrl)
  const dispatch = useDispatch();
  const recentImg = useSelector((state) => state.DataReducer.filter_img);
  const [active, setActive] = useState(0);
  const [showFooter, setShowFooter] = useState(false);
  const [filter, setFilter] = useState(null);
  const [imgUri, setImgUri] = useState(mediaUrl);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const apply = async () => {
    // console.log("on Apply editing");
    if (recentImg) {
      // setLoading(true);
      dispatch(allActions.DataAction.ActivityModal(true));
      let { headers } = await MindAxios.formdataConfig();
      let formdata = new FormData();
      isStamp != undefined && formdata.append("is_stamp", isStamp);
      if (type === "other") {
        formdata.append("linked_with", "other");
      } else if (type) {
        formdata.append("type", type);
      }
      const newFile = {
        uri: recentImg,
        type: "image/png",
        name: "photo.png",
        filename: "imageName.png",
      };
      formdata.append("media[]", newFile);

      fetch(Env.createUrl("medias"), {
        method: "POST",
        headers: headers,
        body: formdata,
      })
        .then((response) => response.json())
        .then((result) => {
          dispatch(allActions.DataAction.ActivityModal(false));
          // setLoading(false);
          if (result?.success) {
            // console.log("result-->", result);
            let selectedMedia = result?.result?.media;
            dispatch(allActions.DataAction.recentFilterHistory({}));
            dispatch(allActions.DataAction.recentFilterIndex(0));
            dispatch(allActions.DataAction.recentFilter(null));
            navigation.goBack();
          } else {
            dispatch(allActions.DataAction.ActivityModal(false));
            alert(language?.serverError);
          }
        })
        .catch((error) => {
          // dispatch(allActions.DataAction.ActivityModal(false));
          alert(error);
        });
    } else {
      dispatch(allActions.DataAction.ActivityModal(false));
      alert("No Filter added");
    }
  };

  // console.log('config', headers)
  // };
  // const apply = () => {
  //   console.log("on Apply editing");
  //   dispatch(allActions.DataAction.ActivityModal(true));
  //   dispatch(allActions.DataAction.recentFilterHistory({}));
  //   dispatch(allActions.DataAction.recentFilterIndex(0));
  //   dispatch(allActions.DataAction.recentFilter(null));
  // };
  const back = () => {
    // console.log("on Cancel");
    dispatch(allActions.DataAction.recentFilterHistory({}));
    dispatch(allActions.DataAction.recentFilterIndex(0));
    dispatch(allActions.DataAction.recentFilter(null));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <Ionicon onPress={back} name="arrow-back" size={30} />
        <Icon name="image-edit-outline" size={30} color={colors.theme} />
        <Ionicon onPress={apply} name="arrow-forward" size={30} />
        {/* <Entypo name="cross" size={30} />
      <Image tintColor="#000" source={require('../../assets/images/greenTick.png')} style={{ height: 22, width: 22}}/> */}
      </SafeAreaView>
      <View style={styles.body}>
        {active == 0 ? (
          <ImageFilters imgUri={imgUri} setImgUri={setImgUri} />
        ) : (
          <Edits
            setShowFooter={setShowFooter}
            setFilter={setFilter}
            filter={filter}
            show={showFooter}
            img={imgUri}
            original={mediaUrl}
          />
        )}
      </View>
      <View style={styles.footer}>
        <PagerButtons
          active={active}
          setActive={setActive}
          setImgUri={setImgUri}
          imgUri={imgUri}
        />
      </View>
    </View>
  );
};

export default Editor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F8F6F0"
  },
  header: {
    flex: 0.1 / 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
  },
  body: {
    flex: 0.85,
    backgroundColor: "#F8F6F0",
  },
  footer: {
    flex: 0.1,
    // backgroundColor: "pink"
  },
});
