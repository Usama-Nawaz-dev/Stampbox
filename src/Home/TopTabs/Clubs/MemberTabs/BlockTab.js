import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from '../../../../../constant/colors';
import { UserInviteCard } from '../../../../../components';
import AppText from '../../../../../components/AppText';
import SearchBar from '../../../../../components/SearchBar';

import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import Helper from '../../../../Helper';
import Env from '../../../../../api/Env';
import MindAxios from '../../../../../api/MindAxios';
import AuthContext from '../../../../Context/AuthContext';

export const BlockTab = () => {
    const dispatch = useDispatch();
    const focused = useIsFocused();
    const currentUser = useSelector((state) =>
        state.ApiReducer.user);
    const clubDetail = useSelector((state) =>
        state.DetailReducer.clubDetail);

    const [userList, setUserList] = useState(null);
    const [currentData, setCurrentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [listChanged, setListChanged] = useState(true);
    const{myState:{ language }}= useContext(AuthContext);

    useEffect(() => {
        if (focused) {
            fetchClubMembers();
        }
    }, [focused]);


    const fetchClubMembers = async () => {
        setLoading(true);
        const response = await MindAxios.get(
            Env.createUrl(`club-members?club_id=${clubDetail?.id}&status=Blocked&page_size=20`)
        );
        setLoading(false);
        if (response?.status == 200) {
            const _data = response?.data?.result?.paginated_items?.data;
            setUserList(_data);
            setCurrentData(_data);
        } else { alert("Sever Error.") }
    };

    const searchData = (x) => {
        let text = x.toLowerCase();
        if (x) {
            let filteredName = userList?.filter((item) => {
                return item.user.full_name.toLowerCase().match(text);
            });
            setUserList(filteredName);
        } else {
            setUserList(currentData)
        }
    };

    const requestAction = async (memberId) => {
        const body = { status: "Accepted" }
        const response = await MindAxios.post(
            Env.paramUrl(`club-members`, memberId), body
        );
        if (response?.status === 200) {
            const filterList = userList?.filter(item => item?.id !== memberId);
            setUserList(filterList);
        } else { alert(language?.serverError) }
    }

    const renderItem = ({ item, index }) => {
        // console.log('item-->', item)
        return (
            <UserInviteCard
                User={item?.user}
                invited={false}
                btnTitle="Unblock"
                showBorder={true}
                onPress={() => requestAction(item?.id)}
            />
        );
    };
    
    return (
        <View style={styles.container}>
            <SearchBar placeholder={language?.searchForPeople+"..."}
                borderRadius={5} border={1} top={15}
                onTermChange={(text) => {
                    searchData(text);
                }}
                onTermSubmit={(text) => {
                    searchData(text);
                }}
            />
            {userList?.length ?
                <FlatList
                    data={userList}
                    renderItem={renderItem}
                    extraData={listChanged}
                    style={styles.listStyle}
                    keyExtractor={(item) => item.id}
                /> : <View style={styles.emptyList}>
                    {loading ? <ActivityIndicator size="large" color={colors.theme} />
                        : <AppText style={styles.emptyText}>{language?.noUserFound}</AppText>}
                </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        color: colors.theme,
        fontWeight: '500'
    },
    listStyle: {
        marginTop: hp(1.5),
        paddingHorizontal: wp(3)
    }
})