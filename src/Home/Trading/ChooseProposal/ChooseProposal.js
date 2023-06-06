import React, { useCallback, useContext, useState } from "react";
import { View, FlatList } from "react-native";

import { styles } from "./styles";

import {
  MainHeader,
  ChoosePropCard,
  CustomButton,
  GradBtn,
} from "../../../../components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from "../../../../components/AppText";
import colors from "../../../../constant/colors";

import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import allActions from "../../../../redux/actions";
import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";
import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";

const Data = [1, 2, 3, 4, 5];
export const ChooseProposal = (props) => {
  const ItemDetail = useSelector((state) => state.DetailReducer.tradeDetail);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  // console.log(ItemDetail)

  const itemId = ItemDetail?.feedable
    ? ItemDetail?.feedable?.id
    : ItemDetail?.id;

  const dispatch = useDispatch();
  const [proposalList, setProposalLis] = useState(null);
  const {myState:{language}}=useContext(AuthContext);
  const { theme }= useContext(ThemeContext);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await getProposals(itemId);
      })();
    }, [ItemDetail?.id])
  );

  const getProposals = async (id) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(
        `trade-proposals`,
        `?trade_id=${id}&user_id=${currentUser?.id}`
      )
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      let _data = response?.data?.result?.paginated_items?.data;
      if (_data?.length) {
        let filterRemoved = _data.filter((item) => item?.status !== "Removed");
        setProposalLis(filterRemoved);
      }
    } else {
      alert(language?.serverError);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          marginBottom: hp(1),
          marginTop: index == 0 ? hp(0.5) : null,
        }}
      >
        <ChoosePropCard
          ItemDetail={item}
          onPress={() =>
            props.navigation.navigate("SendProposal", {
              ProposalId: item?.trade_offers[0]?.proposal_id,
            })
          }
        />
      </View>
    );
  };
  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <MainHeader
        title="Choose Proposal"
        onPressBack={() => props.navigation.goBack()}
      />
      {proposalList?.length ? (
        <FlatList
          style={{ marginTop: hp(2), paddingHorizontal: wp(3) }}
          data={proposalList}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.emptyList}>
          <AppText style={styles.emptyText}>
            You don't have any proposal for this trade.
          </AppText>
        </View>
      )}
      <View style={styles.bottomBtn}>
        <CustomButton
          bg={colors.cWhite}
          style={{ borderWidth: 1, borderColor: colors.borderColor }}
          label="Cancel"
          textColor={colors.placeholderText}
          fontWeight="600"
          width={wp(45)}
          height={45}
          fontSize={16}
          onPress={() => props.navigation.goBack()}
        />
        <GradBtn
          label="Create Proposal"
          height={45}
          width={wp(45)}
          style={{ marginTop: 0 }}
          fontWeight="600"
          onPress={() =>
            props.navigation.navigate("SendProposal", { ProposalId: null })
          }
        />
      </View>
    </View>
  );
};
