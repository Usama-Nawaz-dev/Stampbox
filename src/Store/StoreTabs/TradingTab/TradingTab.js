import React, { useRef, useEffect, useState, useContext } from "react";
import { View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { styles } from "./styles";

import AppText from "../../../../components/AppText";
import colors from "../../../../constant/colors";
import Helper from "../../../Helper";
import { useIsFocused } from "@react-navigation/native";
import AuthContext from "../../../Context/AuthContext";

const { width } = Dimensions.get("window");

export const TradingTab = () => {
  const [isActive, setIsActive] = useState(0);
  let scrollViewRef = useRef();
  let itemViewRef = useRef();
  const { myState: {language}}=useContext(AuthContext);

  const headers = [
    "Active",
    "Drafts",
    "Expired",
    "Offer Accetpted",
    "Processing",
    "Completed",
    // language?.COMPLETED,
    "My Placed Proposals",
  ];

  const focused = useIsFocused();
  useEffect(() => {
    if (focused) {
      Helper.showToastMessage("Coming Soon.", colors.blueTheme);
    }
  }, [focused]);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({
      x: isActive < 3 ? isActive * -150 : isActive * 50,
    });
  }, [isActive]);

  const onHeaderPress = (index) => {
    itemViewRef.current?.scrollTo({ x: width * index });
    setIsActive(index);
  };
  const onMomentumEnd = (e) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (isActive != newIndex) {
      setIsActive(newIndex);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          ref={scrollViewRef}
        >
          {headers.map((item, index) => {
            return (
              <View>
                <TouchableOpacity
                  onPress={() => onHeaderPress(index)}
                  key={item}
                  style={[
                    styles.headerItem,
                    { backgroundColor: isActive == index ? "#fff" : "#fff" },
                  ]}
                >
                  <AppText
                    style={{
                      color:
                        isActive == index ? colors.theme : colors.lightText,
                      padding: 3,
                      // fontSize: 13
                    }}
                  >
                    {item}
                  </AppText>
                </TouchableOpacity>
                {isActive == index && <View style={styles.headerBar} />}
              </View>
            );
          })}
        </ScrollView>
        <ScrollView
          horizontal
          ref={itemViewRef}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          decelerationRate="fast"
          onMomentumScrollEnd={onMomentumEnd}
        >
          {headers.map((item, index) => {
            switch (index) {
              default:
                return (
                  <View style={{ width: width, height: 600 }}>
                    <AppText
                      style={{
                        alignSelf: "center",
                        marginTop: 200,
                        color: colors.lightText,
                        fontWeight: "500",
                        fontSize: 12,
                      }}
                    >
                      {language?.you_have_no_listed_item}
                    </AppText>
                  </View>
                );
            }
          })}
        </ScrollView>
      </View>
    </View>
  );
};
