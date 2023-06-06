import React, { useContext, useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import FastImage from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../../constant/colors";
import Fonts from "../../../../assets/fonts/Fonts";
import AppText from "../../../../components/AppText";
import ThemeContext from "../../../Context/ThemeContext";

import Helper from "../../../Helper";
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";

import { useIsFocused } from "@react-navigation/native";

export const ExpertSheet = (props) => {
  const { onSelectExpert } = props;
  const focused = useIsFocused();

  const { theme } = useContext(ThemeContext);

  const [userList, setUserList] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    if (focused) {
      getUsers();
    }
  }, [focused]);

  //Fetch All Users Api
  const getUsers = async () => {
    setLoading(true);
    const response = await MindAxios.get(Env.createUrl(`users?page_size=30`));
    setLoading(false);
    if (response?.status == 200) {
      setUserList(response?.data?.result?.users?.data);
    } else {
      alert("Server Error");
    }
  };

  const renderItem = ({ item, index }) => {
    return <ExpertCard user={item} onPress={() => onSelectExpert(item?.id)} />;
  };

  return (
    <View style={styles.container}>
      <AppText style={[styles.heading, { color: theme?.darkGrey }]}>
        Select Expert to Submit Stamp
      </AppText>
      {userList?.length ? (
        <View style={styles.contentSection}>
          <FlatList
            data={userList}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={[styles.mainItem, { backgroundColor: theme?.white }]}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.theme} />
          ) : (
            <AppText style={styles.itemText}>No expert Found.</AppText>
          )}
        </View>
      )}
    </View>
  );
};

const ExpertCard = ({ onPress, user }) => {
  return (
    <TouchableOpacity style={styles.upperSection} onPress={onPress}>
      <FastImage style={[styles.userImg]} source={{ uri: user?.image_url }} />
      <View style={styles.nameSection}>
        <AppText style={styles.userName} numberOfLines={1}>
          {Helper.capitalizeFirstLetter(user?.full_name)}
        </AppText>
        <AppText>{user?.mrs_badge}</AppText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 16,
    marginLeft: wp(5),
    color: colors.btnText,
    fontFamily: Fonts.IBM_Medium,
  },
  contentSection: {
    flex: 1,
    marginTop: hp(1),
    alignItems: "center",
  },
  upperSection: {
    width: wp(100),
    marginTop: hp(1),
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: wp(5),
  },
  userImg: {
    width: hp(6),
    height: hp(6),
    borderRadius: 100,
  },
  nameSection: {
    marginLeft: wp(2),
  },
  userName: {
    fontSize: 14,
    color: "#3B3B3B",
    maxWidth: wp(60),
    fontFamily: Fonts.IBM_Medium,
  },

  //Empty List
  mainItem: {
    flex: 1,
    width: wp(100),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cWhite,
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightTheme,
  },
});
