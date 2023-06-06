import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';

import { styles } from './styles';
import AppText from '../../../components/AppText';
import { MainHeader, EmptyList, ItemCard } from '../../../components';
import CustomDropDown from '../../../components/CustomDropDown';

import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Helper from '../../Helper';
import Env from '../../../api/Env';
import MindAxios from '../../../api/MindAxios';
import allActions from '../../../redux/actions';

export const StampFromAlbum = (props) => {
    const focused = useIsFocused();
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.ApiReducer.user);
    const [itemList, setItemList] = useState(null);
    const [albumList, setAlbumList] = useState([]);
    const [allAlbum, setAllAlbum] = useState(null)

    useEffect(() => {
        if (focused) {
            getStampList();
            fetchAlbum();
        }
    }, [focused])

    const getStampList = async (value) => {
        dispatch(allActions.DataAction.AppLoader(true));
        const response = await MindAxios.get(
            Env.paramUrl("stamp-items",
                `?user_id=${currentUser?.id}&status=FOR_SALE`)
        );
        dispatch(allActions.DataAction.AppLoader(false));
        if (response?.status == 200) {
            const _data = response?.data?.result?.paginated_items?.data;
            setItemList(_data)
        } else { alert("Sever Error.") }
    };

    const fetchAlbum = async () => {
        const response = await MindAxios.get(
            Env.paramUrl("albums",
                `?user_id=${currentUser?.id}&page_size=20`)
        );
        dispatch(allActions.DataAction.AppLoader(false));
        if (response?.status == 200) {
            const _data = response?.data?.result?.paginated_items?.data;
            setAllAlbum(_data)
            let newData = [{ value: 'Select Album' }]
            if (_data?.length) {
                for (let val of _data) {
                    newData.push({ value: val?.name });
                }
                setAlbumList(newData)
            } else {
                setAlbumList(newData)
            }
        } else { alert("Sever Error.") }
    }

    const getAlbumStamp = async (id) => {
        dispatch(allActions.DataAction.AppLoader(true));
        const response = await MindAxios.get(
            Env.paramUrl("stamp-items",
                `?user_id=${currentUser?.id}&album_id=${id}&status=FOR_SALE`)
        );
        dispatch(allActions.DataAction.AppLoader(false));
        if (response?.status == 200) {
            const _data = response?.data?.result?.paginated_items?.data;
            setItemList(_data)
        } else { alert("Sever Error.") }
    };

    const onPressDetail = async (item) => {
        dispatch(allActions.DetailAction.MyStamp(item));
        props.navigation.goBack();
    }

    const renderItem = ({ item, index }) => {
        const isEnd = index === itemList.length - 1;
        return (
            <View style={{
                marginRight: wp(3),
                marginTop: hp(1.5),
                marginBottom: isEnd ? hp(3) : 0,
                marginLeft: (index % 2) == 0 ? 2 : 0,
            }}>
                <ItemCard
                    Item={item}
                    showBtn={true}
                    onViewDetail={() => onPressDetail(item)}
                />
            </View>
        )
    }

    const positionCheck = () => {
        if (albumList?.length === 1) {
            return -2.2
        } else if (albumList?.length === 2) {
            return -3.2
        } else if (albumList?.length === 3) {
            return -4.2
        } else {
            return -5.2
        }
    }

    const apiChecker = (name) => {
        for (let item of allAlbum) {
            if (item?.name === name) {
                getAlbumStamp(item?.id)
            }
        }
    }

    return (
        <View style={styles.container}>
            <MainHeader
                title="Add Stamp from Album"
                onPressBack={() => props.navigation.goBack()}
            />
            <View style={styles.topSection}>
                <TouchableOpacity style={styles.leftBtn} onPress={getStampList}>
                    <AppText style={styles.btnText}>All For Sale Items</AppText>
                </TouchableOpacity>
                <View style={styles.albumDropdown}>
                    <CustomDropDown
                        left={wp(13)}
                        data={albumList}
                        dropdownOffset={-1}
                        value={"Select Album"}
                        style={styles.dropDown}
                        position={positionCheck()}
                        height={albumList?.length > 4 ? hp(25) : null}
                        onChangeText={(value) => apiChecker(value)}
                    />
                </View>
            </View>
            {itemList?.length ?
                <FlatList
                    data={itemList}
                    numColumns={2}
                    renderItem={renderItem}
                    style={styles.listStyle}
                    showsVerticalScrollIndicator={false}
                /> :
                <View style={styles.mainItem}>
                    <EmptyList description="You don't have any active Item." />
                </View>
            }
        </View>
    )
}
