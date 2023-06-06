import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import colors from '../../../constant/colors';
import AppText from '../../../components/AppText';
import ItemCard from '../StoreTabs/ShopTab/ItemCard';

import Helper from '../../Helper';
import Env from '../../../api/Env';
import MindAxios from '../../../api/MindAxios';
import allActions from '../../../redux/actions';
import AuthContext from '../../Context/AuthContext';
import ThemeContext from '../../Context/ThemeContext';
// import { dark as theme } from '../../../constant/colorsConfig';


export const SimilarTab = (props) => {
    const focused = useIsFocused();
    const dispatch = useDispatch();
    const productDetail = useSelector((state) =>
        state.DetailReducer.stampDetail);

    const [stampList, setStampList] = useState(null);
    const [loading, setLoading] = useState(false);
    const { myState: {language}}=useContext(AuthContext);
    const { theme }= useContext(ThemeContext);

    useEffect(() => {
        if (focused) {
            getSimilarList();
        }
    }, [focused])

    const getSimilarList = async () => {
        setLoading(true)
        const response = await MindAxios.get(
            Env.paramUrl("get-similar",
                `?similarable_type=stamp_item_product&similarable_id=${productDetail?.id}`)
        );
        setLoading(false)
        if (response?.status == 200) {
            const _data = response?.data?.result;
            setStampList(_data)
        } else {
            // alert("Sever Error.")
        }
    };

    const renderItem = ({ item, index }) => {
        const isEnd = index === stampList.length - 1;
        return (
            <View
                style={{
                    marginRight: wp(3),
                    marginTop: hp(1.5),
                    marginBottom: isEnd ? hp(3) : 0,
                }}
            >
                <ItemCard
                    item={item}
                    onPressDetail={() => {
                        dispatch(allActions.DetailAction.StampDetail(item));
                        props.navigation.replace("ProductDetail");
                    }}
                />
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme?.white}]}>
            {stampList?.length ?
                <FlatList
                    numColumns={2}
                    data={stampList}
                    renderItem={renderItem}
                    style={{ paddingHorizontal: wp(5) }}
                    showsVerticalScrollIndicator={false}
                /> :
                <View style={styles.mainItem}>
                    {loading ?
                        <ActivityIndicator size="large" color={theme?.theme} />
                        : <AppText style={[styles.itemText, { color: theme?.theme}]}>{language?.you_have_no_Item_listed}</AppText>}
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: hp(80),
        paddingTop: hp(1),
        backgroundColor: colors.cWhite
    },

    //Empty List
    mainItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: colors.cWhite,
    },
    itemText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.lightTheme
    },
})