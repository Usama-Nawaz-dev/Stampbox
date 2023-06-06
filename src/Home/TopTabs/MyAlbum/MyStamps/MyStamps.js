import React, { useContext, useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { styles } from "./styles";

import AppText from "../../../../../components/AppText";
import IconsHeader from "../../../../../components/IconsHeader";

import HeaderTabs from "../../../../../components/HeaderTabs";
import Btn from "../../../../../components/Btn";

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import {
  AlbumHeader,
  ItemCard,
} from "../../../../../components/Headers/AlbumHeader/AlbumHeader";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { AllTab } from "../AlbumTabs";

import colors from "../../../../../constant/colors";
import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";
// import { dark as theme } from "../../../../../constant/colorsConfig";

export const MyStamps = (props) => {
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const headers = [
    "All",
    "For Trade",
    "For Auction",
    "For Exhibition",
    "For Sell",
    language?.forSale,
  ];
  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <AlbumHeader
        title="Stamps"
        multiple={false}
        onPressBack={() =>
          props.navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          })
        }
        onPressAdd={() => props.navigation.navigate("SelectStamps")}
      />
      {/* <IconsHeader search={true} title="Stamps" multiple={true}
                filter={true}
                onPressBack={() => props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                })}
                rightIconPress={() => console.log("Menu Icon Pressed")}
                onPressAdd={() => props.navigation.navigate("SelectStamps")}
                onPressCart={() => props.navigation.navigate("MyCart")}
            /> */}
      <HeaderTabs
        headers={headers}
        renderList={({ item, index }) => {
          switch (index) {
            case 0:
              return <AllTab status={0} navigation={props.navigation} />;
            case 1:
              return (
                <AllTab status={"FOR_TRADE"} navigation={props.navigation} />
              );
            case 2:
              return (
                <AllTab status={"FOR_AUCTION"} navigation={props.navigation} />
              );
            case 3:
              return (
                <AllTab
                  status={"AT_AN_EXHIBITION"}
                  navigation={props.navigation}
                />
              );
            case 4:
              return <AllTab status={null} navigation={props.navigation} />;
            case 5:
              return (
                <AllTab status={"FOR_SALE"} navigation={props.navigation} />
              );
            default:
              return (
                <View key={item} style={styles.mainItem}>
                  <AppText style={styles.item}>
                    You have no item listed at this time
                  </AppText>
                  <Btn
                    label="Add Stamps"
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
                  />
                </View>
              );
          }
        }}
      />
    </View>
  );
};
