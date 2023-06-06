import React, { useContext, useEffect, useState } from 'react'
import { View, FlatList } from 'react-native'

import { styles } from './styles'
import colors from '../../../constant/colors'
import AppText from '../../../components/AppText'

import { SimpleHeader, UserInviteCard } from '../../../components'

import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import MindAxios from '../../../api/MindAxios'
import Env from '../../../api/Env'
import AuthContext from '../../Context/AuthContext'

export const InviteMember = (props) => {
    const { EventDetail } = props.route.params;
    const focused = useIsFocused();
    const dispatch = useDispatch();
    const currentUser = useSelector(
        (state) => state.ApiReducer.user);

    const [userList, setUserList] = useState(null);
    const [listChnaged, setListChanged] = useState(true);
    const [currentData, setCurrentData] = useState(null);
    const{ myState: {language}}= useContext(AuthContext);

    useEffect(() => {
        if (focused) {
            (async () => {
                await getInviteList();
            })();
        }
    }, [focused])
    const getInviteList = async () => {
        const response = await MindAxios.get(
            Env.paramUrl(`users`,
                `${currentUser?.id}/user-networks?page_size=50&event_id=${EventDetail?.id}`)
        );
        console.log("response", response?.data?.result?.users?.data);
        if (response?.status == 200) {
            const _data = response?.data?.result?.users?.data;
            const newData = _data?.map(item => {
                item.invited = false;
                return item;
            })
            setUserList(newData);
            setCurrentData(newData);
        }
    };

    const onInviteUser = async (user) => {
        user.invited = !user.invited;
        setListChanged(!listChnaged)
        const body = {
            event_id: EventDetail?.id,
            user_id: user?.id,
            status: "Invited"
        }
        // console.log(body)
        const response = await MindAxios.post(
            Env.createUrl(`participants`), body
        );
    }

    const searchData = (x) => {
        let text = x.toLowerCase();
        if (x) {
            let filteredName = userList.filter((item) => {
                return item.full_name.toLowerCase().match(text);
            });
            setUserList(filteredName);
        } else {
            setUserList(currentData)
        }
    };

    const renderItem = ({ item, index }) => {
        // console.log('item-->', item)
        return (
            <UserInviteCard
                invited={false}
                User={item}
                btnDisable={item.invited}
                showBorder={!item.invited}
                btnTitle={item.invited ? language?.invited : language?.Invite}
                onPress={() => onInviteUser(item)}
            />
        );
    };


    return (
        <View style={styles.mainConatiner}>
            <SimpleHeader
                title="Invite Members"
                showSearch={true}
                showFilter={false}
                onChangeValue={(text) => searchData(text)}
                onPressBack={() => props.navigation.goBack()}
            />
            {userList?.length ? < FlatList
                data={userList}
                renderItem={renderItem}
                extraData={listChnaged}
                style={styles.listStyle}
                keyExtractor={(item) => item.id}
            /> : <View style={styles.emptyList}>
                <AppText style={styles.emptyText}>{language?.noUserFound}</AppText>
            </View>}
        </View>
    )
}
