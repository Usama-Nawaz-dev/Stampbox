import React, { useContext, useRef, useState } from 'react'
import { StyleSheet, View, FlatList, ScrollView } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from '../../../../../components/AppText'
import colors from '../../../../../constant/colors'

import { ClubCard } from '../../../../../components';

import { BottomSheet } from '../../../../../components';
import { ClubInviteSheet } from '../../../../Sheets';

import { useDispatch, useSelector } from 'react-redux';
import allActions from '../../../../../redux/actions';
import MindAxios from '../../../../../api/MindAxios';
import Env from '../../../../../api/Env';
import AuthContext from '../../../../Context/AuthContext';

const Data = [1, 2, 3, 4, 5, 6]
// const Data = []
export const ClubsTab = (props) => {
    const { dataList, navigation } = props;
    const currentUser = useSelector((state) => state.ApiReducer.user);
    const {myState: {language}}= useContext(AuthContext);

    const dispatch = useDispatch();
    const inviteUserSheet = useRef();

    const [userList, setUserList] = useState(null);
    const [invitedList, setInvitedList] = useState(null);
    const [currentClub, setCurrentClub] = useState(null)

    const getNetworks = async (clubId) => {
        dispatch(allActions.DataAction.ActivityModal(true));
        const response = await MindAxios.get(
            Env.paramUrl(`users/${currentUser?.id}`, `user-networks?club_id=${clubId}`)
        );
        dispatch(allActions.DataAction.ActivityModal(false));
        if (response?.status == 200) {
            let {
                data: {
                    result: {
                        users: { data: _data },
                    },
                },
            } = response;
            setUserList(_data);
            inviteUserSheet.current.open();
        } else { alert("Sever Error.") }
    };

    const fetchInvited = async (clubId) => {
        const response = await MindAxios.get(
            Env.paramUrl(`club-members`, `?status=Invited&club_id=${clubId}`)
        );
        if (response?.status == 200) {
            let {
                data: {
                    result: {
                        paginated_items: { data: _data },
                    },
                },
            } = response;
            setInvitedList(_data);
        } else { alert("Sever Error.") }
    };

    const renderMyClubs = ({ item, index }) => {
        const isEnd = dataList?.length - 1;

        return (
            <View style={{
                marginTop: index == 0 ? hp(1) : 0,
                marginBottom: index == isEnd ? hp(3) : hp(1),
                marginHorizontal: wp(1),
            }}>
                <ClubCard Item={item}
                    onEdit={() => navigation.navigate("CreateClub", { Item: item })}
                    onInvite={() => {
                        getNetworks(item?.id);
                        fetchInvited(item?.id);
                        setCurrentClub(item);
                    }}
                />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <AppText style={styles.exploreText}>My Clubs List</AppText>
            {dataList?.length ? <FlatList
                style={{ paddingHorizontal: wp(3) }}
                data={dataList}
                renderItem={renderMyClubs}
            /> :
                <View style={styles.emptyList}>
                    <AppText style={styles.emptyText}>{language?.you_dont_have_any_active_club}</AppText>
                </View>}

            <BottomSheet
                ref={inviteUserSheet}
                title={"Invite Friends"}
                onPressClose={() => inviteUserSheet?.current?.close()}
                dropDown={false}
                sheetHeight={hp(80)}
                ChildComponent={
                    <ClubInviteSheet
                        CurrentClub={currentClub}
                        Data={userList}
                        InvitedList={invitedList}
                        updateInviteList={(clubId) => fetchInvited(clubId)}
                        updateNetworks={(clubId) => getNetworks(clubId)}
                    />
                }
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite,
        // paddingHorizontal: wp(3)
    },
    emptyList: {
        paddingTop: hp(1),
        alignItems: 'center'
    },
    emptyText: {
        fontSize: 12,
        color: colors.theme
    },
    exploreText: {
        marginTop: hp(0.5),
        paddingHorizontal: wp(3),
        marginBottom: hp(1),
        fontSize: 16,
        fontWeight: '500',
        color: colors.lightBlack
    }
})