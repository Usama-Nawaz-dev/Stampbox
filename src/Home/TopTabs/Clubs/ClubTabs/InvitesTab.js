import React from 'react'
import { StyleSheet, View, FlatList, ScrollView } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from '../../../../../components/AppText'
import colors from '../../../../../constant/colors'

import {
    InviteCard, CustomButton, ExploreCard
} from '../../../../../components';

import { useDispatch } from 'react-redux';

import MindAxios from '../../../../../api/MindAxios';
import Env from '../../../../../api/Env';
import allActions from '../../../../../redux/actions';
import { useContext } from 'react';
import AuthContext from '../../../../Context/AuthContext';

const Data = [1, 2, 3, 4, 5, 6]
// const Data = []
export const InvitesTab = (props) => {
    const { inviteList, refreshClubInvitation } = props;
    const dispatch = useDispatch();
    const {myState: {language}} =useContext(AuthContext);

    const onClubInvite = async (memberId, status) => {
        const body = { status: status }
        dispatch(allActions.DataAction.ActivityModal(true));
        const response = await MindAxios.post(
            Env.paramUrl(`club-members`, memberId),
            body
        );
        dispatch(allActions.DataAction.ActivityModal(false));
        if (response?.status == 200) {
            refreshClubInvitation()
        } else { alert("Sever Error.") }
    };

    const renderItem = ({ item, index }) => {
        return (
            <View style={{
                marginTop: index == 0 ? hp(0.5) : 0,
                marginHorizontal: wp(1),
                marginBottom: hp(1)
            }}>
                <InviteCard Item={item?.club}
                    onJoin={() => onClubInvite(item?.id, 'Accepted')}
                    onDecline={() => onClubInvite(item?.id, 'Rejected')}
                />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <AppText style={styles.exploreText}>Review Your Invites</AppText>
            <AppText style={styles.text}>You've been invited to join these clubs</AppText>
            {inviteList?.length ? <FlatList
                style={{ marginBottom: hp(2) }}
                showsVerticalScrollIndicator={false}
                data={inviteList}
                renderItem={renderItem}
            /> :
                <View style={styles.emptyList}>
                    <AppText style={styles.emptyText}>{language?.you_dont_have_any_active_invitation}</AppText>
                </View>}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite,
        paddingHorizontal: wp(3)
    },
    emptyList: {
        paddingTop: hp(1),
        flex: 0.8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyText: {
        fontSize: 12,
        color: colors.theme
    },
    exploreText: {
        marginTop: hp(0.5),
        fontSize: 14,
        fontWeight: '500',
        color: colors.lightBlack
    },
    text: {
        marginTop: hp(0.5),
        fontSize: 12,
        color: colors.lightText,
        marginBottom: hp(1)
    }
})