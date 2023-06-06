import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import FastImage from "react-native-fast-image";

import { styles } from "./styles";
import AppText from "../../../../../components/AppText";
import colors from "../../../../../constant/colors";

import Entypo from "react-native-vector-icons/Entypo";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
  MainHeader,
  InviteCard,
  SuggestedClubs,
  ClubCard,
} from "../../../../../components";

import { MenuSheet } from "../../../../../components";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import allActions from "../../../../../redux/actions";
import MindAxios from "../../../../../api/MindAxios";
import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";
// import { dark as theme } from "../../../../../constant/colorsConfig";

// For Step by Step Walkthrough
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";

const StampboxClubs = (props) => {
  const { navigation } = props;

  const dispatch = useDispatch();
  const focused = useIsFocused();
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [clubList, setClubList] = useState(null);
  const [inviteList, setInviteList] = useState(null);
  const [categoryList, setCategoryList] = useState(null);
  const [suggestedList, setSuggestedList] = useState(null);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    showClubGuide();
  }, []);

  const showClubGuide = async () => {
    let clubsGuide = await Helper.getData("clubsGuide");
    if (!clubsGuide) {
      props.start();
      await Helper.storeData("clubsGuide", "false");
    }
  };

  //Making a WalkthroughableTouchableOpacity
  const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

  useEffect(() => {
    if (focused) {
      fetchClubs();
      getSuggested();
      fetchCategories();
      getClubInvitation();
    }
  }, [focused]);

  const fetchCategories = async () => {
    const response = await MindAxios.get(
      Env.createUrl("categories/?type=stamp_items")
    );
    if (response?.status == 200) {
      let data = response?.data?.result?.categories;
      setCategoryList(data);
    }
  };

  const getClubInvitation = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`club-members`, `?user_id=${currentUser?.id}&status=Invited`)
    );
    if (response?.status == 200) {
      let {
        data: {
          result: {
            paginated_items: { data: _data },
          },
        },
      } = response;
      setInviteList(_data);
    } else {
      alert("Sever Error.");
    }
  };

  const getSuggested = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(`clubs`, `?order_by=featured`)
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
      setSuggestedList(_data);
    } else {
      alert("Sever Error.");
    }
  };

  const fetchClubs = async () => {
    const response = await MindAxios.get(Env.createUrl(`clubs`));
    if (response?.status == 200) {
      let {
        data: {
          result: {
            paginated_items: { data: _data },
          },
        },
      } = response;
      setClubList(_data);
    } else {
      alert("Sever Error.");
    }
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
      Helper.showToastMessage("Invitation Accepted Successfully", colors.green);
      const filterList = inviteList?.filter((item) => item?.id !== memberId);
      setInviteList(filterList);
    } else {
      alert("Sever Error.");
    }
  };

  const renderCategories = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.listComp}
        onPress={() => {
          navigation.navigate("SearchClub", { id: item?.id });
        }}
      >
        <FastImage
          source={{ uri: item.image_url }}
          style={styles.categImg}
          resizeMode="contain"
        />
        <AppText style={styles.nameText} numberOfLines={1}>
          {item?.name}
        </AppText>
      </TouchableOpacity>
    );
  };

  const renderList = ({ item, index }) => {
    return (
      <SkeletonPlaceholder>
        <View style={{ width: 50, marginRight: 5 }}>
          <View style={styles.emptyImg} />
          <View style={styles.emptyItem} />
        </View>
      </SkeletonPlaceholder>
    );
  };

  const renderInvites = ({ item, index }) => {
    return (
      <InviteCard
        Item={item?.club}
        onPress={() => fetchSingleClub(item?.club_id)}
        onAccept={() => onClubInvite(item?.id, "Accepted")}
      />
    );
  };
  const renderSuggested = ({ item, index }) => {
    return (
      <SuggestedClubs
        Item={item}
        onPress={() => {
          dispatch(allActions.DetailAction.ClubDetail(item));
          navigation.navigate("ClubDetails");
        }}
      />
    );
  };

  const renderMyClubs = ({ item, index }) => {
    return (
      <ClubCard
        Item={item}
        onViewClub={() => {
          dispatch(allActions.DetailAction.ClubDetail(item));
          navigation.navigate("ClubDetails");
        }}
      />
    );
  };

  const optionIcon = (
    <Entypo size={22} color={colors.cWhite} name="dots-three-vertical" />
  );

  const searchClub = () => navigation.navigate("SearchClub");
  const addClub = () => navigation.navigate("CreateClub", { Item: false });
  const myClubs = () =>
    navigation.navigate("SearchClub", { userId: currentUser?.id });
  const clubInvitation = () => navigation.navigate("ClubInvites");

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title={language?.clubs}
        onPressBack={() => {
          dispatch(allActions.DetailAction.ClubDetail(null));
          navigation.goBack();
        }}
        rightIcon={
          <MenuSheet
            customButton={optionIcon}
            options={[
              language?.searchClub,
              language?.addClub,
              language?.myClubs,
              language?.clubInvitation,
              language?.cancel,
            ]}
            actions={[searchClub, addClub, myClubs, clubInvitation]}
          />
        }
      />
      <CopilotStep
        text="You see clubs option by clicking here."
        order={1}
        name="firstUniqueKey"
      >
        <WalkthroughableTouchableOpacity style={styles.guideIcon} />
      </CopilotStep>
      <ScrollView>
        <CopilotStep
          text="You can filter club by category here."
          order={2}
          name="secondUniqueKey"
        >
          <WalkthroughableTouchableOpacity>
            <AppText style={styles.headingText}>
              {language?.findClubByCategory}
            </AppText>
            {categoryList?.length ? (
              <FlatList
                horizontal
                data={categoryList}
                style={styles.listStyle}
                renderItem={renderCategories}
              />
            ) : (
              <FlatList
                horizontal
                data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                style={styles.listStyle}
                renderItem={renderList}
              />
            )}
          </WalkthroughableTouchableOpacity>
        </CopilotStep>

        <AppText style={styles.headingText}>
          {language?.clubsInvitations}
        </AppText>
        {inviteList?.length ? (
          <FlatList
            horizontal
            data={inviteList}
            style={styles.listStyle}
            renderItem={renderInvites}
          />
        ) : (
          <View style={styles.emptyList}>
            <AppText style={[styles.emptyText, { color: theme?.theme }]}>
              {language?.you_dont_have_any_active_invitation}
            </AppText>
          </View>
        )}
        <View style={styles.rowSection}>
          <AppText style={styles.headingText}>
            {language?.suggestedForYou}
          </AppText>
          <TouchableOpacity onPress={searchClub}>
            <AppText style={styles.subHeading}>{language?.viewAll}</AppText>
          </TouchableOpacity>
        </View>
        {suggestedList?.length ? (
          <FlatList
            horizontal
            data={suggestedList}
            style={styles.listStyle}
            renderItem={renderSuggested}
          />
        ) : (
          <View style={styles.emptyList}>
            <AppText style={[styles.emptyText, { color: theme?.theme }]}>
              {language?.you_dont_have_any_suggested_club}
            </AppText>
          </View>
        )}
        <View style={styles.rowSection}>
          <AppText style={styles.headingText}>{language?.otherClubs}</AppText>
          <TouchableOpacity onPress={searchClub}>
            <AppText style={styles.subHeading}>{language?.viewAll}</AppText>
          </TouchableOpacity>
        </View>
        {clubList?.length ? (
          <FlatList
            numColumns={2}
            data={clubList}
            style={[styles.listStyle, { paddingHorizontal: wp(4) }]}
            renderItem={renderMyClubs}
          />
        ) : (
          <View style={styles.emptyList}>
            <AppText style={[styles.emptyText, { color: theme?.theme }]}>
              {language?.you_dont_have_any_active_club}
            </AppText>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default copilot({
  animated: true, // Can be true or false
  overlay: "svg", // Can be either view or svg
})(StampboxClubs);
