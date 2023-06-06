import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import colors from "../../../../../constant/colors";

const { height, width } = Dimensions.get("window");

import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import Helper from "../../../../Helper";
import allActions from "../../../../../redux/actions";

import Btn from "../../../../../components/Btn";
import { useSelector, useDispatch } from "react-redux";

import { ItemCard, GradTab } from "../../../../../components";
import AppText from "../../../../../components/AppText";

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Fonts from "../../../../../assets/fonts/Fonts";
import { images } from "../../../../../assets/images/Images";
import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";
// import { dark as theme } from "../../../../../constant/colorsConfig";

export const AllTab = (props) => {
  const { status, navigation } = props;
  const dispatch = useDispatch();
  const [stampList, setStampList] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusCheck, setStatusCheck] = useState(null);
  const [itemData, setItemData] = useState(null);
  // pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      const userId = await Helper.getData("userId");
      dispatch(allActions.DataAction.ActivityModal(true));
      const response = await MindAxios.get(
        Env.paramUrl("stamp-items", `?user_id=${userId}&status=${status}`)
      );
      dispatch(allActions.DataAction.ActivityModal(false));
      // console.log('response', response)
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setStampList(_data);
        setNextApiUrl(nextPageUrl);
      }
    })();
  }, []);

  const getNextApiUrl = async () => {
    const userId = await Helper.getData("userId");
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${userId}&status=${status}`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.paginated_items?.data;
        const nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setStampList([...stampList, ..._data]);
        setNextApiUrl(nextPageUrl);
      } else {
        setNextApiUrl(null);
        setIsLoading(false);
        alert("Sever Error..");
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
        <ItemCard
          Item={item}
          onListPress={() => {
            setStatusCheck(item?.status);
            setItemData(item);
            setModalVisible(true);
          }}
        />
      </View>
    );
  };
  return (
    <View style={[styles.container, {backgroundColor: theme?.white}]}>
      {stampList?.length ? (
        <FlatList
          data={stampList}
          style={{ paddingHorizontal: wp(5) }}
          renderItem={renderItem}
          numColumns={2}
          onEndReachedThreshold={0.4}
          onEndReached={getNextApiUrl}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.mainItem}>
          <AppText style={styles.itemText}>
            You have no Item listed at this time
          </AppText>
          <Btn
            label={language?.addStamp}
            fontSize={12}
            height={40}
            width={wp(36)}
            style={{ marginTop: hp(1.5) }}
            iconLeft={
              <SimpleLineIcons
                name="plus"
                size={22}
                color="#fff"
                style={{ marginRight: 5 }}
              />
            }
            onPress={() => navigation.navigate("AddStamps", { item: false })}
          />
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert(language?.modal_has_been_closed);
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.topSection}>
            <Text style={styles.modalText}>{language?.chooseTheListing}</Text>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <EvilIcons name="close" size={26} color={colors.btnText} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoSection}>
            <View style={styles.shortcutTab}>
              <GradTab
                image={images.N_Auction}
                title={language?.AUCTION}
                color={["#99B4A4", "#BAD2C4"]}
                onPress={() => {
                  if (statusCheck.includes("FOR_AUCTION")) {
                    navigation.navigate("CreateAuction", { item: itemData });
                    setModalVisible(false);
                  } else {
                    Helper.showToastMessage(
                      "This Stamp is not available for Auction."
                    );
                  }
                }}
              />
              <GradTab
                image={images.N_Exhibition}
                title={language?.exhibition}
                color={["#8098B0", "#A0BAD5"]}
              />
              <GradTab
                onPress={() => {
                  if (statusCheck.includes("FOR_TRADE")) {
                    navigation.navigate("CreateTrade", { item: itemData });
                    setModalVisible(false);
                  } else {
                    Helper.showToastMessage(
                      "This Stamp is not available for Trade."
                    );
                  }
                }}
                image={images.N_Trade}
                title={language?.TRADE}
                color={["#918770", "#B2A890"]}
              />
            </View>
            <View style={styles.shortcutTab}>
              <GradTab
                image={images.N_Exhibition}
                title="Sale"
                color={["#99B4A4", "#035852"]}
              />
              <GradTab
                image={images.N_Clubs}
                title="e"
                color={["#5C7388", "#7E92A5"]}
              />
              <GradTab
                image={images.N_Community}
                title={language?.private}
                color={["#035852", "#698D80"]}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
    width: width,
    paddingTop: hp(2),
  },
  mainItem: {
    width: width,
    flex: 1,
    // backgroundColor: colors.cWhite,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    // color: colors.lightText,
  },

  //List Modal
  modalView: {
    margin: 10,
    backgroundColor: colors.cWhite,
    borderRadius: 5,
    padding: 5,
    marginTop: hp(35),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  modalText: {
    fontSize: 16,
    fontFamily: Fonts.IBM_SemiBold,
    color: colors.heading,
  },
  infoSection: {
    paddingHorizontal: wp(2),
    paddingBottom: hp(1),
  },
  shortcutTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: hp(2),
  },
});
