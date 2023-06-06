import React, { useContext } from "react";
import { StyleSheet, View, FlatList } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../../constant/colors";
import { ItemCard } from "../../../components";
import AppText from "../../../components/AppText";

import { useDispatch } from "react-redux";
import allActions from "../../../redux/actions";

import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

export const StampSheet = (props) => {
  const { stampSheetRef, stampList, navigation } = props;
  const dispatch = useDispatch();

  const { theme } = useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const renderSimilar = ({ item, index }) => {
    const isEnd = index === stampList.length - 1;
    return (
      <View
        style={{
          marginRight: wp(3),
          marginTop: hp(1.5),
          marginBottom: isEnd ? hp(3) : 0,
          marginLeft: index % 2 == 0 ? 2 : 0,
        }}
      >
        <ItemCard
          Item={item}
          showBtn={true}
          onViewDetail={() => {
            dispatch(allActions.DetailAction.StampDetail(item));
            stampSheetRef?.current?.close();
            setTimeout(() => {
              navigation.navigate("StampDetail");
            }, 350);
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {stampList?.length ? (
        <FlatList
          numColumns={2}
          data={stampList}
          renderItem={renderSimilar}
          style={{ paddingHorizontal: wp(5) }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.mainItem}>
          <AppText style={[styles.itemText, { color: theme?.theme }]}>
            User don't have any similar items.
          </AppText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cWhite,
  },
  //Empty List
  mainItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: colors.cWhite,
  },
  itemText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.lightTheme,
  },
});
