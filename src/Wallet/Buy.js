import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { ListBox, MainHeader } from "../../components";
import { light as theme } from "../../constant/colorsConfig";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import MindAxios from "../../api/MindAxios";
import Env from "../../api/Env";
import Btn from "../../components/Btn";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../constant/colors";
import { useDispatch } from "react-redux";
import allActions from "../../redux/actions";
import ThemeContext from "../Context/ThemeContext";

const Buy = (props) => {
  const [method, setMethod] = useState(null);
  const [campaigns, setCampaigns] = useState(null);
  const { theme }= useContext(ThemeContext);
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      (async () => {
        dispatch(allActions.DataAction.ActivityModal(true));
        const response = await MindAxios.get(
          Env.createUrl("coins/buyable-campaigns")
        );
        dispatch(allActions.DataAction.ActivityModal(false));
        // console.log("response", response);
        if (response?.status == 200) {
          let _data = response?.data?.result?.paginated_items?.data;
        //   console.log("response", _data);
          setCampaigns(_data);

        } else {
          alert("Can't get data");
        }
      })();
      return () => {
        // alert('Screen was unfocused');
      };
    }, [])
  );
  const renderItem = ({ item, index }) => {
    let isEnd = index == campaigns?.length - 1;
    return (
      <>
        <ListBox
          onPress={() => {
            // console.log("method", method);
            if (method?.id == item?.id) {
              setMethod(null);
            } else {
              setMethod(item);
            }
          }}
          selected={method?.id == item?.id}
          labels={{ label2: item?.coins, label3: item?.amount }}
        />
        {!isEnd && (
          <View
            style={{
              height: 0.5,
              backgroundColor: "rgba(0,0,0,.3)",
              width: "95%",
              alignSelf: "center",
            }}
          />
        )}
      </>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: theme?.white }}>
      <MainHeader
        title="Buy Coins"
        onPressBack={() => props.navigation.goBack()}
      />
      {campaigns?.length ? (
        <>
          <FlatList
            data={campaigns}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={() => (
              <ListBox
                labels={{
                  label1: "Select",
                  label2: "Coins",
                  label3: "Price ($)",
                }}
                headerColor="#585755"
                style={{ marginTop: 10 }}
              />
            )}
          />
          <View
            style={{
              height: hp(8),
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              position: "absolute",
              bottom: hp(5),
              width: "100%",
            }}
          >
            <Btn
              onPress={() => props.navigation.goBack()}
              label="Back"
              height={40}
              width="40%"
              bg={theme.theme}
              textColor={theme?.white}
              fontSize={12}
            />
            <Btn
              onPress={() => {
                if (method) {
                  props.navigation.navigate("CoinsBilling", { package: method });
                } else {
                  alert("please select any package");
                }
              }}
              label="Purchase"
              height={40}
              width="40%"
              bg={theme.theme}
              textColor={theme?.white}
              fontSize={12}
            />
          </View>
        </>
      ) : null}
    </View>
  );
};

export { Buy };

const styles = StyleSheet.create({});
