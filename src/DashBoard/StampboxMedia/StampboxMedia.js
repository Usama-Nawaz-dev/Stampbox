import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { styles } from "./styles";

import { MainHeader, GradBtn, EmptyList } from "../../../components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../constant/colors";

import Helper from "../../Helper";
import MindAxios from "../../../api/MindAxios";
import Env from "../../../api/Env";
import allActions from "../../../redux/actions";
import ThemeContext from "../../Context/ThemeContext";

export const StampboxMedia = (props) => {
  const {
    route: {
      params: { isStamp },
    },
  } = props;
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);

  const [mediaData, setMediaData] = useState([]);
  const [listChang, setListChang] = useState(false);
  const selectedImages = useSelector(
    (state) => state.DataReducer.selected_images
  );

  // Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const userId = await Helper.getData("userId");
      dispatch(allActions.DataAction.AppLoader(true));
      const response = await MindAxios.get(
        Env.paramUrl(
          "medias/user",
          `${userId}?is_stamp=${
            isStamp == 0 ? 0 : 1
          }&is_meta_attached=0&page_size=${20}`
        )
      );
      dispatch(allActions.DataAction.AppLoader(false));
      // console.log("response....", response);
      if (response?.status == 200) {
        let _data = response?.data?.result?.media?.data;
        let nextPageUrl = response?.data?.result?.media?.next_page_url;

        var newData = _data.map((item) => {
          item.isSelected = false;
          return item;
        });
        let filteredResult = Helper.removeCommon(newData, selectedImages);
        setMediaData(filteredResult);
        setNextApiUrl(nextPageUrl);
        // setMediaData(newData);
      }
    })();
  }, []);

  const getNextMedia = async () => {
    if (nextApiUrl !== null) {
      const userId = await Helper.getData("userId");
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl +
          `&is_stamp=${isStamp == 0 ? 0 : 1}&is_meta_attached=0&page_size=${20}`
      );
      setIsLoading(false);
      // console.log("response....", response);
      if (response?.status == 200) {
        let _data = response?.data?.result?.media?.data;
        let nextPageUrl = response?.data?.result?.media?.next_page_url;

        var newData = _data.map((item) => {
          item.isSelected = false;
          return item;
        });
        let filteredResult = Helper.removeCommon(newData, selectedImages);
        setMediaData([...mediaData, ...filteredResult]);
        setNextApiUrl(nextPageUrl);
      } else {
        setNextApiUrl(null);
        alert("Server error.");
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

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.mediaSection}>
        <TouchableOpacity
          style={[
            styles.editStampCard,
            { borderWidth: item.isSelected ? 2 : 0 },
          ]}
          onPress={(item) => {
            mediaData[index].isSelected = !mediaData[index].isSelected;
            setMediaData(mediaData);
            setListChang(!listChang);
          }}
        >
          <Image
            style={styles.stampImg}
            resizeMode="contain"
            source={{ uri: item.media_url }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const onSelect = () => {
    const selected = mediaData.filter((el) => el.isSelected == true);
    // console.log("mediaData", selected);
    if (selected?.length) {
      dispatch(allActions.DetailAction.MyStamp(null));
      dispatch(
        allActions.DataAction.SelectedImg([...selectedImages, ...selected])
      );
      props.navigation.goBack();
    } else {
      Helper.showToastMessage(
        "Please select at least one Item.",
        colors.blueTheme
      );
    }
  };

  return (
    <View style={styles.container}>
      <MainHeader
        title="Stampbox Media"
        onPressBack={() => {
          // if (from == 'store') {
          //   if (isStamp == 1) {
          //     {
          //       screen == 'edit' ? props.navigation.reset({
          //         index: 0,
          //         routes: [{ name: "EditStoreStamp" }],
          //       }) : props.navigation.reset({
          //         index: 0,
          //         routes: [{ name: "StoreStamp" }],
          //       })
          //     }
          //   } else {
          //     {
          //       screen == 'edit' ? props.navigation.reset({
          //         index: 0,
          //         routes: [{ name: "EditSupply" }],
          //       }) : props.navigation.reset({
          //         index: 0,
          //         routes: [{ name: "StoreSupply" }],
          //       })
          //     }
          //   }
          // } else {
          props.navigation.goBack();
          // }
        }}
      />
      {mediaData?.length ? (
        <FlatList
          data={mediaData}
          style={{ paddingTop: 20, paddingHorizontal: wp(5) }}
          numColumns={3}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={listChang}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.emptySection}>
          <EmptyList description="You don't have any active Media." />
        </View>
      )}
      <GradBtn
        label="Select"
        height={50}
        width="90%"
        style={styles.bottomButton}
        onPress={onSelect}
      />
    </View>
  );
};
