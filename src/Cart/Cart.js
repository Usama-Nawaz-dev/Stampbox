import React, { useContext, useState } from "react";
import { View, FlatList, Text, ScrollView } from "react-native";
import { styles } from "./styles";

import AppText from "../../components/AppText";
import Header from "../../components/Header";
import colors from "../../constant/colors";
import Btn from "../../components/Btn";

import AntDesign from "react-native-vector-icons/AntDesign";

import CartCard from "../../components/CartCard";
import Helper from "../Helper";
import { light } from "../../constant/colorsConfig";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import allActions from "../../redux/actions";
import AuthContext from "../Context/AuthContext";
import ThemeContext from "../Context/ThemeContext";

export const Cart = (props) => {
  console.log("props", props);
  const [list, setList] = useState([]);
  let [count, setCount] = useState(1);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.DataReducer.cart);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  let total = 0;
  cart?.forEach((item) => {
    total += item?.sale_price;
  });
  const renderItem = (item, index, key) => (
    <CartCard
      item={item}
      count={count}
      onIncrement={() => setCount(count++)}
      onDecrement={() => setCount(count--)}
      onDel={async () => {
        let filtered = cart.filter(
          (obj) => obj.product_id !== item?.product_id
        );
        console.log("remove", filtered);
        if (filtered?.length > 0) {
          await Helper.setObj("cart", filtered);
          dispatch(allActions.DataAction.cart_products(filtered));
          // props.setCart_items(filtered);
        } else {
          Helper.removeLocal("cart");
          Helper.cancelScheduled(1);
          dispatch(allActions.DataAction.cart_products([]));
          // props.setCart_items(null);
        }
      }}
    />
  );
  function splitFunc(str, id) {
    //Original string
    var array = str.split("_");
    // console.log(array);
    return id ? array[1] : array[0];
  }

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <View style={styles.mainSection}>
        {_.isEmpty(props?.cartData) ? (
          <AppText style={styles.emptyListText}>No item added</AppText>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {Object.keys(props?.cartData).map((key, index) => {
              console.log("key", props?.cartData[key]);
              return (
                <View style={{ marginTop: 0 }}>
                  <View
                    style={{
                      height: 30,
                      width: "95%",
                      alignSelf: "center",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      // backgroundColor: "lightgrey",
                      alignItems: "flex-end",
                    }}
                  >
                    <AppText
                      style={{
                        fontWeight: "600",
                        fontSize: 17,
                      }}
                    >
                      {language?.STORE}: {splitFunc(key, false)}
                    </AppText>
                    <AppText
                      style={{
                        fontWeight: "600",
                        fontSize: 17,
                        right: 7,
                      }}
                    >
                      {language?.storeId}: {splitFunc(key, true)}
                    </AppText>
                  </View>

                  <FlatList
                    data={props?.cartData[key]}
                    style={styles.list}
                    renderItem={({ item, index }) =>
                      renderItem(item, index, key)
                    }
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={() => (
                      <View
                        style={{
                          height: 10,
                          width: "100%",
                          backgroundColor: "transparent",
                        }}
                      />
                    )}
                    ListFooterComponent={() => (
                      <View
                        style={{
                          height: props?.cartKey == index + 1 ? 30 : 1,
                          width: "100%",
                          backgroundColor: "transparent",
                        }}
                      />
                    )}
                  />
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
      {cart?.length ? (
        <View style={styles.bottomSection}>
          <View style={styles.amountSection}>
            <AppText>
              Sub Total{" "}
              <AppText style={styles.itemText}>
                {cart?.length > 1
                  ? `${cart?.length} items`
                  : `${cart?.length ? cart?.length : 0} item`}
              </AppText>
            </AppText>
            <AppText>${total}.0</AppText>
          </View>
          <Btn
            label="Check Out"
            style={styles.btnStyle}
            //   onPress={() => props.navigation.goBack()}
            onPress={() => {
              // console.log('props', props)

              props.setScreen(1);
            }}
            fontSize={14}
            height={45}
            icon={<AntDesign name="arrowright" color={"#fff"} size={20} />}
          />
        </View>
      ) : null}
    </View>
  );
};
