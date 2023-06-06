import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, TouchableOpacity, Image } from 'react-native';

import { styles } from './styles';
import AppText from '../../../../../components/AppText';
import { MainHeader, GradBtn } from '../../../../../components';

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

import colors from '../../../../../constant/colors';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import MindAxios from '../../../../../api/MindAxios';
import allActions from '../../../../../redux/actions';
import Env from '../../../../../api/Env';
import Helper from '../../../../Helper';
import AuthContext from '../../../../Context/AuthContext';
import ThemeContext from '../../../../Context/ThemeContext';

export const AddToAlbum = (props) => {
    const focused = useIsFocused();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.ApiReducer.user);
    const stampDetail = useSelector((state) =>
        state.DetailReducer.stampDetail);

    const [albumList, setAlbumList] = useState(null);
    const [listChang, setListChang] = useState(false);
    const { myState:{language}}=useContext(AuthContext);
    const { theme }= useContext(ThemeContext);


    useEffect(() => {
        if (focused) {
            getAlbums();
        }
    }, [focused])

    useEffect(() => {
        albumList?.forEach((el) => {
            if (stampDetail?.albums?.length) {
                stampDetail?.albums?.forEach((el2) => {
                    if (el.id == el2.id) {
                        el.isSelected = true;
                    }
                });
            }
        });
        setListChang(!listChang);
    }, [albumList?.length]);

    const getAlbums = async () => {
        dispatch(allActions.DataAction.AppLoader(true));
        const response = await MindAxios.get(
            Env.paramUrl(
                `albums`,
                `?type=Album&user_id=${currentUser?.id}`
            )
        );
        dispatch(allActions.DataAction.AppLoader(false));
        if (response?.status == 200) {
            let {
                data: {
                    result: {
                        paginated_items: { data: _data },
                    },
                },
            } = response;
            const newData = _data.map((item) => {
                item.isSelected = false;
                return item;
            });
            setAlbumList(newData);
        } else { alert("Sever Error.") }
    };

    const onAddToAlbum = async () => {
        const selected = albumList.filter(el => el.isSelected == true);
        const body = {
            id: stampDetail?.id,
            album_ids: JSON.stringify(selected.map(item => item?.id))
        }
        if (selected?.length) {
            dispatch(allActions.DataAction.AppLoader(true));
            const response = await MindAxios.post(
                Env.createUrl(`stamp-items/sync-albums`),
                body
            );
            dispatch(allActions.DataAction.AppLoader(false));
            if (response?.status === 200) {
                Helper.showToastMessage("Stamp successfully synced with albums", colors.green);
                props.navigation.goBack();
            } else { alert(language?.serverError) }
        } else { alert("Please select at leat one album.") }
    }

    const renderAlbums = ({ item, index }) => {
        return (
            <View style={styles.mediaSection}>
                <TouchableOpacity
                    style={[
                        styles.editStampCard,
                        { borderWidth: item.isSelected ? 2 : 0, backgroundColor: theme?.cardColor },
                    ]}
                    onPress={(item) => {
                        albumList[index].isSelected = !albumList[index].isSelected;
                        setListChang(!listChang);
                    }}
                >
                    <Image
                        style={styles.stampImg}
                        resizeMode="contain"
                        source={{ uri: item.image_url }}
                    />
                </TouchableOpacity>
                <AppText style={[styles.itemText, {color: theme?.black}]} numberOfLines={1}>{item?.name}</AppText>
            </View>
        );
    };

    return (
        <View style={[styles.container, {backgroundColor: theme?.white}]}>
            <MainHeader
                title="Add To Albums"
                onPressBack={() => props.navigation.goBack()}
            />
            <View style={[styles.infoCard, { backgroundColor: theme?.cardColor}]}>
                <AppText style={styles.stampName}>{stampDetail?.name}</AppText>
                <AppText style={styles.text}>Year: <AppText style={[styles.infoText, { color: theme?.lightText}]}>
                    {stampDetail?.year_issued}</AppText></AppText>
                {stampDetail?.catalogue_number?.length &&
                    <AppText style={styles.text}>{stampDetail?.catalogue_number[0]?.type}: <AppText style={[styles.infoText, { color: theme?.lightText}]}>
                        {stampDetail?.catalogue_number[0]?.number}</AppText></AppText>}
                {stampDetail?.description && <AppText style={styles.text}>Detail: <AppText style={[styles.infoText, { color: theme?.lightText}]}>
                    {stampDetail?.description}</AppText></AppText>}
            </View>
            {albumList?.length ?
                <FlatList
                    numColumns={2}
                    data={albumList}
                    renderItem={renderAlbums}
                    style={{ paddingHorizontal: wp(10) }}
                    showsVerticalScrollIndicator={false}
                /> :
                <View style={styles.emptyList}>
                    <AppText style={[styles.emptyText, { color: theme?.theme}]}>You don't have any active Album.</AppText>
                </View>
            }
            <GradBtn label="Add To Albums" height={45}
                width="90%" fontSize={15} fontWeight={'500'}
                style={styles.bottomButton} onPress={onAddToAlbum} />
        </View>
    )
}
