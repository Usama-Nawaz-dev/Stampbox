import React, { useContext } from 'react'
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
import AuthContext from '../../../../Context/AuthContext';

const Data = [1, 2, 3, 4, 5, 6]
// const Data = []
export const ForYou = (props) => {
    const {
        onSeeAll, dataList, inviteList,
        refreshClubInvitation
    } = props;

    const dispatch = useDispatch();
    const {myState: {language}}=useContext(AuthContext);

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
                marginLeft: index == 0 ? wp(0.5) : 0,
                marginVertical: hp(0.5),
            }}>
                <InviteCard Item={item?.club}
                    onJoin={() => onClubInvite(item?.id, 'Accepted')}
                    onDecline={() => onClubInvite(item?.id, 'Rejected')}
                />
            </View>
        )
    }
    const renderExploreItem = ({ item, index }) => {
        return (
            <View style={{
                marginTop: index == 0 ? hp(1) : 0,
                marginBottom: hp(1),
                marginHorizontal: wp(1),
            }}>
                <ExploreCard Item={item} />
            </View>
        )
    }
    return (
        <ScrollView style={styles.container}>
            {inviteList?.length ? <FlatList
                horizontal
                data={inviteList}
                renderItem={renderItem}
            /> : <View style={styles.emptyList}>
                <AppText style={styles.emptyText}>{language?.you_dont_have_any_active_invitation}</AppText>
            </View>
            }
            <CustomButton bg={colors.background}
                style={{ alignSelf: 'center', marginTop: hp(1.5) }}
                label="See All Invitation" textColor={colors.btnText}
                width={wp(46)} height={38} fontSize={14}
                onPress={onSeeAll}
            />
            <AppText style={styles.exploreText}>Explore or Join Other Clubs</AppText>
            {dataList?.length ? <FlatList
                style={{ marginBottom: hp(4) }}
                data={dataList}
                renderItem={renderExploreItem}
            /> :
                <View style={styles.emptyList}>
                    <AppText style={styles.emptyText}>{language?.you_dont_have_any_active_club}</AppText>
                </View>}
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: colors.cWhite,
        paddingHorizontal: wp(3)
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
        marginTop: hp(2),
        fontSize: 16,
        fontWeight: '500',
        color: colors.lightBlack
    }
})