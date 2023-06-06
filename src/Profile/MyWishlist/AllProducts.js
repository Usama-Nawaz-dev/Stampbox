import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from '../../../constant/colors'
import Fonts from '../../../assets/fonts/Fonts';

import AppText from '../../../components/AppText'
import { MainHeader, FavProduct } from '../../../components'

import { useIsFocused } from '@react-navigation/native';

import MindAxios from '../../../api/MindAxios';
import Env from '../../../api/Env';
import Helper from '../../Helper';
import allActions from '../../../redux/actions';

import { useDispatch } from 'react-redux';
import AuthContext from '../../Context/AuthContext';
import ThemeContext from '../../Context/ThemeContext';

export const AllProducts = (props) => {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const [data, setData] = useState(null);
    const [productList, setProductList] = useState(null);
    const [loading, setLoading] = useState(false);
    const { myState: {language}}=useContext(AuthContext);
    // Pagination States
    const [nextApiUrl, setNextApiUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { theme }= useContext(ThemeContext);

    useEffect(() => {
        if (isFocused) {
            (async () => {
                await getStamps();
            })();
        }
    }, [isFocused]);

    const getStamps = async () => {
        setLoading(true);
        const response = await MindAxios.get(Env.createUrl(`products`));
        setLoading(false);
        if (response?.status == 200) {
            setProductList(response?.data?.result?.paginated_items?.data);
            setData(response?.data?.result?.paginated_items?.data);
            setNextApiUrl(response?.data?.result?.paginated_items?.next_page_url)
        } else {
            alert(language?.serverError)
        }
    }

    const getNextStamps = async () => {
        if(nextApiUrl !== null){
            setIsLoading(true);
            const response = await MindAxios.get(nextApiUrl);
            setIsLoading(false);
            if (response?.status == 200) {
                let _data = response?.data?.result?.paginated_items?.data;
                setProductList([...productList, ..._data]);
                setData([...data, ..._data]);
                setNextApiUrl(response?.data?.result?.paginated_items?.next_page_url)
            } else {
                setNextApiUrl(null)
                alert(language?.serverError)
            } 
        }
    }

    const renderFooter = () => {
        return isLoading ? (
          <View>
            <ActivityIndicator
              // animation={loder}
              size={"large"}
              color={theme?.theme}
              style={{ marginBottom: 20 }}
            />
          </View>
        ) : null;
      };

    const toggleFav = async (id) => {
        // setLoading(true);
        let body = {
            wishable_type: 'Product',
            wishable_id: id,
        };
        const response = await MindAxios.post(
            Env.createUrl("wishlists"),
            body
        );
        // console.log("res-->", response);
        if (response?.status == 200) {
            let favList = productList.map((item) => {
                if (item.id === id) {
                    if (item.is_wishable === 1) {
                        item.is_wishable = 0;
                        Helper.showToastMessage("Product removed from Wishlist", colors.green);
                    } else {
                        item.is_wishable = 1;
                        Helper.showToastMessage("Product added to Wishlist", colors.green);
                    }
                }
                return item;
            });
            setProductList(favList);
            setData(favList)
        } else { alert(language?.serverError) }
    }

    const renderItem = ({ item, index }) => {
        const isEnd = index === productList.length - 1;
        return (<View style={{
            marginRight: wp(3),
            marginLeft: (index % 2) == 0 ? 2 : 0,
            marginTop: hp(1.5),
            marginBottom: isEnd ? hp(3) : 0
        }}>
            <FavProduct Item={item} onToggleFav={() => toggleFav(item?.id)}
                onPress={() => {
                    dispatch(allActions.DetailAction.StampDetail(item));
                    props.navigation.navigate("ProductDetail");
                }} />
        </View>
        )
    }

    return (
        <View style={styles.container}>
            <MainHeader title="All Products"
                onPressBack={() => props.navigation.goBack()} />
            {productList?.length ?
                <FlatList
                    data={productList}
                    style={styles.listStyle}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    numColumns={2}
                    onEndReached={getNextStamps}
                    ListFooterComponent={renderFooter}
                /> :
                <View style={styles.emptyList}>
                    {loading ? <ActivityIndicator size="large" color={colors.theme} />
                        : <AppText style={styles.emptyText}>No Product Found.</AppText>}
                </View>}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite
    },
    listStyle: {
        paddingHorizontal: wp(5)
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        fontWeight: '500',
        color: colors.color8,
    },
})