import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList } from 'react-native';

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import colors from '../../../../../constant/colors';
import AppText from '../../../../../components/AppText';
import TradeCard from '../../../../../components/TradeCard';

import Helper from '../../../../Helper';
import Env from '../../../../../api/Env';
import MindAxios from '../../../../../api/MindAxios';
import allActions from '../../../../../redux/actions';
import AuthContext from '../../../../Context/AuthContext';
import ThemeContext from '../../../../Context/ThemeContext';
// import { dark as theme } from '../../../../../constant/colorsConfig';

export const RelatedTab = (props) => {
    const dispatch = useDispatch();
    const focused = useIsFocused();
    const currentUser = useSelector((state) => state.ApiReducer.user);
    const tradeData = useSelector((state) => state.DetailReducer.tradeDetail)

    const [itemList, setItemList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [listChanged, setListChanged] = useState(true);
    const {myState:{language}}=useContext(AuthContext);
    const { theme }= useContext(ThemeContext);

    useEffect(() => {
        if (focused) {
            getRelated()
        }
    }, [focused])

    const getRelated = async () => {
        setLoading(true);
        const response = await MindAxios.get(
            Env.paramUrl(
                `get-similar`,
                `?similarable_type=trade&similarable_id=${tradeData?.id}`
            )
        );
        setLoading(false);
        if (response?.status == 200) {
            setItemList(response?.data?.result);
        } else {
            alert(language?.serverError);
        }
    };

    const toggleFav = async (item) => {
        let body = {
            wishable_type: 'Trade',
            wishable_id: item?.id,
        };
        const response = await MindAxios.post(
            Env.createUrl("wishlists"), body);
        if (response?.status == 200) {
            if (item.is_wishable) {
                item.is_wishable = false;
                setListChanged(!listChanged)
                Helper.showToastMessage('Trade removed from wishlist.', colors.green)
            } else {
                item.is_wishable = true;
                setListChanged(!listChanged)
                Helper.showToastMessage('Trade added to wishlist.', colors.green)
            }
        } else { alert(language?.serverError) }
    }

    const toggleBookmark = async (item) => {
        let body = {
            book_markable_type: 'Trade',
            book_markable_id: item?.id,
        };
        const response = await MindAxios.post(
            Env.createUrl("bookmarks"), body);
        if (response?.status == 200) {
            if (item.is_book_marked) {
                item.is_book_marked = false;
                setListChanged(!listChanged)
                Helper.showToastMessage('Trade book mark removed.', colors.green)
            } else {
                item.is_book_marked = true;
                setListChanged(!listChanged)
                Helper.showToastMessage('Trade book mark added.', colors.green)
            }
        } else { alert(language?.serverError) }
    }


    const renderItem = ({ item, index }) => {
        const isEnd = itemList?.length - 1 === index;
        return (
            <View
                style={{
                    marginRight: wp(3),
                    paddingTop: hp(1.5),
                    marginBottom: isEnd ? hp(2) : 0
                }}
            >
                <TradeCard
                    ItemDetail={item}
                    onToggleFav={() => toggleFav(item)}
                    onToggleBookmark={() => toggleBookmark(item)}
                    onPressUser={() => props.navigation.navigate("OtherUser",
                        { user: item?.user })}
                    onPressDetail={() => {
                        dispatch(allActions.DetailAction.TradeDetail(item));
                        props.navigation.replace("TradeDetail");
                    }}
                    onPressFlag={() => {
                        props.navigation.navigate("Flagging", {
                            id: item?.tradeables[0]?.tradeable_id,
                        });
                    }}
                />
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme?.white}]}>
            {itemList?.length ?
                <FlatList
                    numColumns={2}
                    data={itemList}
                    extraData={listChanged}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    style={{ paddingHorizontal: wp(3) }}
                /> :
                <View style={styles.mainItem}>
                    {loading ? <ActivityIndicator color={theme?.theme} size="large" /> :
                        <AppText style={[styles.itemText, { color: theme?.theme}]}>Related items not found.</AppText>}
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite
    },
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
})