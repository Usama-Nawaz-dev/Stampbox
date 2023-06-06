import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'

import { styles } from './styles'
import AppText from '../../../../../components/AppText'
import colors from '../../../../../constant/colors'

import Octicons from 'react-native-vector-icons/Octicons';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
    SimpleHeader, CustomButton
} from '../../../../../components'

import {
    ForYou, ClubsTab, InvitesTab,
    JoinTab
} from '../ClubTabs'

import { useIsFocused } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'

import allActions from '../../../../../redux/actions'
import MindAxios from '../../../../../api/MindAxios'
import Env from '../../../../../api/Env'

export const StampboxClubs = (props) => {
    const { navigation } = props
    const [forYou, setForYou] = useState(true);
    const [isYourClub, setIsYourClub] = useState(false);
    const [isInvites, setIsInvites] = useState(false);
    const [isJoin, setIsJoin] = useState(false);

    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.ApiReducer.user);

    const [clubList, setClubList] = useState(null);
    const [inviteList, setInviteList] = useState(null);
    const [joinedList, setJoinedList] = useState(null);

    useEffect(() => {
        if (isFocused) {
            getClubs();
            getClubInvitation();
            getJoinedClubs();
        }
    }, [isFocused])

    const getJoinedClubs = async () => {
        const response = await MindAxios.get(
            Env.paramUrl(`clubs`, `?joined_club=${currentUser?.id}`)
        );
        if (response?.status == 200) {
            let {
                data: {
                    result: {
                        paginated_items: { data: _data },
                    },
                },
            } = response;
            setJoinedList(_data);
        } else { alert("Sever Error.") }
    };

    const getClubs = async () => {
        dispatch(allActions.DataAction.ActivityModal(true));
        const response = await MindAxios.get(
            Env.paramUrl(`clubs`, `?user_id=${currentUser?.id}`)
        );
        dispatch(allActions.DataAction.ActivityModal(false));
        if (response?.status == 200) {
            let {
                data: {
                    result: {
                        paginated_items: { data: _data },
                    },
                },
            } = response;
            setClubList(_data);
        } else { alert("Sever Error.") }
    };

    const getClubInvitation = async () => {
        const response = await MindAxios.get(
            Env.paramUrl(`club-members`, `?user_id=${currentUser?.id}&status=Invited`)
        );
        if (response?.status == 200) {
            let {
                data: {
                    result: {
                        paginated_items: { data: _data },
                    },
                },
            } = response;
            setInviteList(_data);
        } else { alert("Sever Error.") }
    };

    const onForYouPress = () => {
        setForYou(true);
        setIsYourClub(false);
        setIsInvites(false);
        setIsJoin(false);
    }

    const onYourClubsPress = () => {
        setForYou(false);
        setIsYourClub(true);
        setIsInvites(false);
        setIsJoin(false);
    }

    const onInvitesPress = () => {
        setForYou(false);
        setIsYourClub(false);
        setIsInvites(true);
        setIsJoin(false);
    }

    const onJoinPress = () => {
        setForYou(false);
        setIsYourClub(false);
        setIsInvites(false);
        setIsJoin(true);
    }

    return (
        <View style={styles.container}>
            <SimpleHeader title="Stampbox Clubs"
                showSearch={true} showFilter={false}
                onPressBack={() => props.navigation.goBack()} />
            <TouchableOpacity style={styles.addButton}
                onPress={() => props.navigation.navigate('CreateClub', { Item: false })}>
                <Octicons name='plus' size={22} color="#fff" />
            </TouchableOpacity>
            <View style={styles.btnSection}>
                <CustomButton bg={!forYou ? colors.background : colors.color8}
                    label="For You" textColor={!forYou && colors.placeholderText}
                    width={wp(22)} height={30} fontSize={12}
                    onPress={onForYouPress}
                />
                <CustomButton bg={!isYourClub ? colors.background : colors.color8}
                    label="Your Clubs" textColor={!isYourClub && colors.placeholderText}
                    width={wp(22)} height={30} fontSize={12}
                    onPress={onYourClubsPress}
                />
                <CustomButton bg={!isInvites ? colors.background : colors.color8}
                    label="Invites" textColor={!isInvites && colors.placeholderText}
                    width={wp(22)} height={30} fontSize={12}
                    onPress={onInvitesPress}
                />
                <CustomButton bg={!isJoin ? colors.background : colors.color8}
                    label="Join Clubs" textColor={!isJoin && colors.placeholderText}
                    width={wp(22)} height={30} fontSize={12}
                    onPress={onJoinPress}
                />
            </View>
            {forYou && <ForYou onSeeAll={onInvitesPress}
                refreshClubInvitation={getClubInvitation}
                dataList={clubList} inviteList={inviteList} />}
            {isYourClub && <ClubsTab dataList={clubList} navigation={navigation} />}
            {isInvites && <InvitesTab inviteList={inviteList}
                refreshClubInvitation={getClubInvitation} />}
            {isJoin && <JoinTab joinedList={joinedList} />}
        </View>
    )
}
