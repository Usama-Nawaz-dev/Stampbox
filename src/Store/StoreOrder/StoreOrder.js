import React, { useState, useEffect, useContext } from "react";
import { View, FlatList } from "react-native";
import allActions from "../../../redux/actions";

import {
    SimpleHeader,
    OrderDetailCard,
    FeedbackCard,
} from "../../../components";

import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import colors from "../../../constant/colors";
import ThemeContext from "../../Context/ThemeContext";

export const StoreOrder = (props) => {
    const order = useSelector((state) => state.DetailReducer.orderDetail);
    const [orderDetail, setOrderDetail] = useState(null);
    const dispatch = useDispatch();
    const focused = useIsFocused();
    const { theme }= useContext(ThemeContext);

    useEffect(() => {
        setOrderDetail(order);
    }, [focused]);

    const renderItem = ({ item, index }) => {
        const isEnd = orderDetail?.store_orders?.length - 1;
        return (
            <View style={{ marginBottom: index === isEnd ? hp(3) : 0 }}>
                <OrderDetailCard
                    orderDetail={orderDetail}
                    storeItem={item}
                    index={index}
                />
            </View>
        );
    };

    const statusChecker = () => {
        return (
            <FeedbackCard
                id={orderDetail?.order_meta?.id}
                tradeId={orderDetail?.id}
                showBtn={false}
                time={orderDetail?.order_meta?.created_at}
            />
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme?.white }}>
            <SimpleHeader
                title="Order Details"
                onPressBack={() => {
                    dispatch(allActions.DetailAction.OrderDetail([]));
                    props.navigation.goBack();
                }}
            />
            {statusChecker()}
            <FlatList
                style={{ marginTop: hp(1) }}
                data={orderDetail?.store_orders}
                renderItem={renderItem}
                showsVerticalScrollIndicator={true}
            />
        </View>
    );
};
