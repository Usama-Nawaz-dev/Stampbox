import React, { useState, useEffect, useContext } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { styles } from "./styles";
import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { ClubInviteCard } from "./ClubInviteCard";
import { MainHeader } from "../../../../../components";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";
import AuthContext from "../../../../Context/AuthContext";

export const ClubInvites = (props) => {
  const { navigation } = props;

  const dispatch = useDispatch();
  const focused = useIsFocused();
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [inviteList, setInviteList] = useState(null);
  const [currentData, setCurrentData] = useState(null);

  //Pagination states
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpLoading, setIsUpLoading] = useState(false);


  const {
    myState: { language },
  } = useContext(AuthContext);

  useEffect(() => {
    if (focused) {
      fetchClubInvitations();
    }
  }, [focused]);

  const fetchClubInvitations = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(`club-members`, `?user_id=${currentUser?.id}&status=Invited`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      let {
        data: {
          result: {
            paginated_items: { data: _data },
          },
        },
      } = response;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      setInviteList(_data);
      setCurrentData(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert("Sever Error.");
    }
  };
  const getNextInvitationApi = async () => {
    console.log(nextApiUrl);
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&user_id=${currentUser?.id}&status=Invited`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        setInviteList([...inviteList, ..._data]);
        setCurrentData([...currentData, ..._data]);
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

  const onRefresh = async () => {
    setIsUpLoading(true);
    await fetchClubInvitations();
    setTimeout(() => {
      setIsUpLoading(false);
    }, 1000);
  };

  const fetchSingleClub = async (id) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.paramUrl(`clubs`, id));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result?.item;
      dispatch(allActions.DetailAction.ClubDetail(_data));
      navigation.navigate("ClubDetails");
    } else {
      alert("Sever Error.");
    }
  };

  const onClubInvite = async (memberId, status) => {
    const body = { status: status };
    const response = await MindAxios.post(
      Env.paramUrl(`club-members`, memberId),
      body
    );
    if (response?.status == 200) {
      Helper.showToastMessage(
        `Invitation ${status} Successfully.`,
        colors.green
      );
      const filterList = inviteList?.filter((item) => item?.id !== memberId);
      setInviteList(filterList);
    } else {
      alert("Sever Error.");
    }
  };

  const searchClub = (x) => {
    let text = x.toLowerCase();
    if (x) {
      let filteredName = inviteList?.filter((item) => {
        return item.club.name.toLowerCase().match(text);
      });
      setInviteList(filteredName);
    } else {
      setInviteList(currentData);
    }
  };

  const renderClubInvites = ({ item, index }) => {
    return (
      <ClubInviteCard
        Item={item?.club}
        onAccept={() => onClubInvite(item?.id, "Accepted")}
        onDecline={() => onClubInvite(item?.id, "Rejected")}
        onPress={() => fetchSingleClub(item?.club_id)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <MainHeader
        showSearch={true}
        title={language?.clubInvitation}
        onPressBack={() => navigation.goBack()}
        onChangeValue={(text) => searchClub(text)}
      />
      {inviteList?.length ? (
        <FlatList
          data={inviteList}
          style={styles.listStyle}
          renderItem={renderClubInvites}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          onEndReached={getNextInvitationApi}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={isUpLoading}
              tintColor={colors.lightTheme}
            />
          }
        />
      ) : (
        <View style={styles.emptyList}>
          <AppText style={styles.emptyText}>
            {language?.you_dont_have_any_active_invitation}
          </AppText>
        </View>
      )}
    </View>
  );
};
