import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from '../../../constant/colors'
import AppText from '../../../components/AppText'
import { MainHeader, FavStamp } from '../../../components'

import { useIsFocused } from '@react-navigation/native';

import MindAxios from '../../../api/MindAxios';
import Env from '../../../api/Env';
import Helper from '../../Helper';
import allActions from '../../../redux/actions';

import { useDispatch } from 'react-redux';
import AuthContext from '../../Context/AuthContext';
import ThemeContext from '../../Context/ThemeContext';

export const AllStamps = (props) => {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const [data, setData] = useState(null);
    const [stampList, setStampList] = useState(null);
    const [loading, setLoading] = useState(false);
    const { myState:{ language }}= useContext(AuthContext);

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
        const response = await MindAxios.get(Env.createUrl(`stamp-items`));
        setLoading(false);
        if (response?.status == 200) {
            setStampList(response?.data?.result?.paginated_items?.data);
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
            setStampList([...stampList, ..._data]);
            setData([...data, ..._data]);
            setNextApiUrl(response?.data?.result?.paginated_items?.next_page_url)
        } else {
            setNextApiUrl(null);
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
        let body = {
            wishable_type: 'StampItem',
            wishable_id: id,
        };
        const response = await MindAxios.post(
            Env.createUrl("wishlists"),
            body
        );
        // console.log("res-->", response);
        if (response?.status == 200) {
            let favList = stampList.map((item) => {
                if (item.id === id) {
                    if (item.is_wishable === 1) {
                        item.is_wishable = 0;
                        Helper.showToastMessage("Stamp removed from Wishlist", colors.green)
                    } else {
                        item.is_wishable = 1;
                        Helper.showToastMessage("Stamp Added to Wishlist", colors.green)
                    }
                }
                return item;
            });
            setStampList(favList);
            setData(favList)
        } else { alert(language?.serverError) }
    }

    const onPressDetail = async (stampId) => {
        dispatch(allActions.DataAction.AppLoader(true));
        const response = await MindAxios.get(
            Env.paramUrl("stamp-items", stampId)
        );
        dispatch(allActions.DataAction.AppLoader(false));
        if (response?.status == 200) {
            const data = response?.data?.result?.stamp_item;
            dispatch(allActions.DetailAction.StampDetail(data));
            props.navigation.navigate("StampDetail");
        } else { alert(language?.serverError) }
    }

    const renderItem = ({ item, index }) => {
        const isEnd = index === stampList.length - 1;
        return (<View style={{
            marginRight: wp(3),
            marginLeft: (index % 2) == 0 ? 2 : 0,
            marginTop: hp(1.5),
            marginBottom: isEnd ? hp(3) : 0
        }}>
            <FavStamp Item={item} onToggleFav={() => toggleFav(item?.id)}
                onPress={() => onPressDetail(item?.id)} />
        </View>
        )
    }

    return (
        <View style={styles.container}>
            <MainHeader title={language?.allStamps}
                onPressBack={() => props.navigation.goBack()} />
            {stampList?.length ?
                <FlatList
                    data={stampList}
                    style={styles.listStyle}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    numColumns={2}
                    ListFooterComponent={renderFooter}
                    onEndReached={getNextStamps}
                /> :
                <View style={styles.emptyList}>
                    {loading ? <ActivityIndicator size="large" color={colors.theme} />
                        : <AppText style={styles.emptyText}>No Stamps Found.</AppText>}
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