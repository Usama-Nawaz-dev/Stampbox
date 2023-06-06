import React from 'react'
import { StyleSheet, View, FlatList } from 'react-native';

import colors from '../../../../../constant/colors';
import { TradeTabCard } from '../TradeDetail/TradeTabCard';
import { useDispatch } from 'react-redux';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import allActions from '../../../../../redux/actions';

const data = [1, 2, 3, 4, 5, 6, 7]
export const DataTab = (props) => {
    const { DataList, navigation, ListFooterComponent, onEndReached } = props;
    const dispatch = useDispatch();

    const renderItem = ({ item, index }) => {
        const isEnd = index === DataList.length - 1;
        // console.log("item ------>",item);
        return (
            <View
                style={{
                    marginRight: wp(3),
                    marginBottom: hp(1.5)
                }}
            >
                <TradeTabCard
                    ItemDetail={item}
                    type="tab"
                    onPressDetail={() => {
                        // console.log('item ==>', item)
                        dispatch(allActions.DetailAction.TradeDetail(item));
                        navigation.navigate("TradeDetail");
                    }}
                />
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <FlatList
                numColumns={2}
                data={DataList}
                renderItem={renderItem}
                onEndReachedThreshold={0.5}
                ListFooterComponent={ListFooterComponent}
                onEndReached={onEndReached}
                showsVerticalScrollIndicator={false}
                style={{ paddingHorizontal: wp(3), paddingTop: hp(1) }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainItem: {
        flex: 1,
        backgroundColor: colors.cWhite,
        alignItems: "center",
        justifyContent: "center",
    },
    itemText: {
        fontSize: 12,
        fontWeight: "500",
        color: colors.lightText,
    },
})