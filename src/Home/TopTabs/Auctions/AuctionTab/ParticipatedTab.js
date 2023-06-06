import React, { useState, useEffect, useContext } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { AuctionTab } from "./AuctionTab";
import colors from "../../../../../constant/colors";
import { CustomButton } from "../../../../../components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";
import Env from "../../../../../api/Env";
import Helper from "../../../../Helper";
import ThemeContext from "../../../../Context/ThemeContext";
// import { dark as theme } from "../../../../../constant/colorsConfig";

export const ParticipatedTab = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const focused = useIsFocused();

  const currentUser = useSelector((state) => state.ApiReducer.user);
  const auctionCrud = currentUser?.user_permissions?.includes("auctions.crud");

  const [isWon, setIsWon] = useState(false);
  const [isLoss, setIsLoss] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [dataList, setDataList] = useState(null);

  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme }= useContext(ThemeContext);

  let type;
  if (isActive) {
    type = "active";
  } else if (isWon) {
    type = "won";
  } else if (isLoss) {
    type = "loss";
  } else if (isExpired) {
    type = "expired";
  }

  useEffect(() => {
    if (focused) {
      getParticipated(type);
    }
  }, [focused]);

  const getParticipated = async (type) => {
    // console.log("type", type)
    if (auctionCrud) {
      const userId = await Helper.getData("userId");
      dispatch(allActions.DataAction.AppLoader(true));
      const response = await MindAxios.get(
        Env.paramUrl(`auctions/participated`, `?user_id=${userId}&type=${type}`)
      );
      // console.log(response);
      dispatch(allActions.DataAction.AppLoader(false));
      const { status } = response;
      if (status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setNextApiUrl(nextPageUrl);
        setDataList(_data);
      } else {
        alert("Something went wrong");
      }
    }
  };

  const getNextParticipated = async (type) => {
    const userId = await Helper.getData("userId");
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${userId}&type=${type}`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setDataList([...dataList, ..._data])
        setNextApiUrl(nextPageUrl);
      } else {
        setNextApiUrl(null);
        setIsLoading(false);
        alert("Sever Error.");
      }
    }
  };

  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator
          // animation={loder}
          size={"large"}
          color={colors.lightTheme}
          style={{ marginBottom: 20 }}
        />
      </View>
    ) : null;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <View style={styles.btnSection}>
        <CustomButton
          bg={!isActive ? colors.background : colors.color8}
          label="Active"
          textColor={!isActive && colors.placeholderText}
          width={wp(22)}
          height={30}
          fontSize={12}
          onPress={() => {
            setIsActive(true);
            setIsWon(false);
            setIsLoss(false);
            setIsExpired(false);
            getParticipated("active");
          }}
        />
        <CustomButton
          bg={!isWon ? colors.background : colors.color8}
          label="Won"
          textColor={!isWon && colors.placeholderText}
          width={wp(22)}
          height={30}
          fontSize={12}
          onPress={() => {
            setIsActive(false);
            setIsWon(true);
            setIsLoss(false);
            setIsExpired(false);
            getParticipated("won");
          }}
        />
        <CustomButton
          bg={!isLoss ? colors.background : colors.color8}
          label="Loss"
          textColor={!isLoss && colors.placeholderText}
          width={wp(22)}
          height={30}
          fontSize={12}
          onPress={() => {
            setIsActive(false);
            setIsWon(false);
            setIsLoss(true);
            setIsExpired(false);
            getParticipated("loss");
          }}
        />
        <CustomButton
          bg={!isExpired ? colors.background : colors.color8}
          label="Expired"
          textColor={!isExpired && colors.placeholderText}
          width={wp(22)}
          height={30}
          fontSize={12}
          onPress={() => {
            setIsActive(false);
            setIsWon(false);
            setIsLoss(false);
            setIsExpired(true);
            getParticipated("expired");
          }}
        />
      </View>
      <AuctionTab
        type={type}
        hideBtn={true}
        dataList={dataList}
        navigation={navigation}
        onEndReached={() => getNextParticipated(type)}
        listFooter={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  btnSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(3),
    marginBottom: hp(1),
    marginTop: hp(1.5),
  },
});
