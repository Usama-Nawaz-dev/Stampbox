import React, { useContext } from 'react'
import { StyleSheet, View, FlatList, ScrollView } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from '../../../../../components/AppText'
import colors from '../../../../../constant/colors'

import {
    ClubCard
} from '../../../../../components';
import AuthContext from '../../../../Context/AuthContext';

const Data = [1, 2, 3, 4, 5, 6]
// const Data = []
export const JoinTab = (props) => {
    const { onSeeAll, joinedList } = props;
    const {myState: {language}}=useContext(AuthContext);

    const renderJoinedClubs = ({ item, index }) => {
        const isEnd = joinedList?.length - 1;

        return (
            <View style={{
                marginTop: index == 0 ? hp(1) : 0,
                marginBottom: index == isEnd ? hp(3) : hp(1),
                marginHorizontal: wp(1),
            }}>
                <ClubCard Item={item} showEdit={false} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <AppText style={styles.exploreText}>Recomendation For You</AppText>
            <AppText style={styles.text}>Check Recomended Clubs</AppText>
            {joinedList?.length ? <FlatList
                style={{ marginBottom: hp(2) }}
                showsVerticalScrollIndicator={false}
                data={joinedList}
                renderItem={renderJoinedClubs}
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