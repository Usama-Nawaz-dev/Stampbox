import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native'

import colors from '../../constant/colors';
import AppText from '../../components/AppText';
import { UserInviteCard } from '../../components';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import SearchBar from '../../components/SearchBar';
import { createMaterialTopTabNavigator } from '../../CustomPackages/material-top-tabs';

import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import Helper from '../Helper';
import Env from '../../api/Env';
import allActions from '../../redux/actions';
import MindAxios from '../../api/MindAxios';
import AuthContext from '../Context/AuthContext';
import ThemeContext from '../Context/ThemeContext';
const Tab = createMaterialTopTabNavigator();

export const ClubInviteSheet = () => {
    const{myState:{ language }}= useContext(AuthContext);
    const { theme }= useContext(ThemeContext);


    return (
        <View style={styles.container}>
            <Tab.Navigator
                initialRouteName={"Invite"}
                tabBarOptions={{
                    activeTintColor: theme?.theme,
                    inactiveTintColor: theme?.lightText,
                    labelStyle: styles.labelStyle,
                }}
                screenOptions={{ //use this config
                    tabBarIndicatorStyle: { backgroundColor: theme?.theme },
                    tabBarStyle: { backgroundColor: theme?.cardColor}
                }}
            >
                <Tab.Screen
                    name="Invite"
                    component={InviteTab}
                    options={{ tabBarLabel: 'Not Invited' }}
                />
                <Tab.Screen
                    name="Invited"
                    component={InvitedTab}
                    options={{ tabBarLabel: 'Invited Users' }}
                />
            </Tab.Navigator>
        </View>
    )
}

const InviteTab = () => {
    const dispatch = useDispatch();
    const focused = useIsFocused();
    const currentUser = useSelector((state) =>
        state.ApiReducer.user);
    const clubDetail = useSelector((state) =>
        state.DetailReducer.clubDetail);

    const [userList, setUserList] = useState(null);
    const [currentData, setCurrentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const{myState:{ language }}= useContext(AuthContext);
    const { theme }= useContext(ThemeContext);

    useEffect(() => {
        if (focused) {
            getNetworks();
        }
    }, [focused]);

    const getNetworks = async () => {
        setLoading(true);
        const response = await MindAxios.get(
            Env.paramUrl(`users/${currentUser?.id}`,
                `user-networks?club_id=${clubDetail?.id}`)
        );
        setLoading(false);
        if (response?.status == 200) {
            let {
                data: {
                    result: {
                        users: { data: _data },
                    },
                },
            } = response;
            setUserList(_data);
            setCurrentData(_data)
        } else { alert("Sever Error.") }
    };

    const inviteUser = async (userId) => {
        const body = {
            club_id: clubDetail?.id,
            user_id: userId,
            invited_by_id: currentUser?.user_id,
            status: "Invited"
        }
        const response = await MindAxios.post(
            // Clubs -> Invite-User
            Env.createUrl("club-members"), body);
        if (response.status == 200) {
            const filterUsers = userList.filter((item) => item?.id !== userId);
            setUserList(filterUsers);
            setCurrentData(filterUsers)
        } else {
            alert(language?.serverError)
        }
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
        return (
            <UserInviteCard
                User={item}
                invited={false}
                btnTitle={language?.Invite}
                showBorder={true}
                onPress={() => inviteUser(item?.id)}
            />
        );
    };

    return (
        <View style={[styles.infoConatiner, { backgroundColor: theme?.cardColor }]}>
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
                    paddingTop={hp(1)}
                    keyExtractor={(item) => item.id}
                /> :
                <View style={styles.emptySection}>
                    {loading ? <ActivityIndicator size="large" color={colors.theme} />
                        : <AppText style={styles.text}>{language?.noUserFound}</AppText>}
                </View>
            }
        </View>
    )
}
const InvitedTab = () => {
    const dispatch = useDispatch();
    const focused = useIsFocused();
    const currentUser = useSelector((state) =>
        state.ApiReducer.user);
    const clubDetail = useSelector((state) =>
        state.DetailReducer.clubDetail);

    const [invitedList, setInvitedList] = useState(null);
    const [currentData, setCurrentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const{myState:{ language }}= useContext(AuthContext);
    const { theme }= useContext(ThemeContext);

    useEffect(() => {
        if (focused) {
            fetchInvited();
        }
    }, [focused]);

    const fetchInvited = async () => {
        setLoading(true);
        const response = await MindAxios.get(
            Env.paramUrl(`club-members`, `?status=Invited&club_id=${clubDetail?.id}`)
        );
        setLoading(false);
        if (response?.status == 200) {
            let {
                data: {
                    result: {
                        paginated_items: { data: _data },
                    },
                },
            } = response;
            setInvitedList(_data);
            setCurrentData(_data);
        } else { alert("Sever Error.") }
    };

    const onCancelInvite = async (memberId) => {
        let { headers } = await MindAxios.formdataConfig();
        fetch(Env.paramUrl("club-members", `${memberId}`), {
            method: "DELETE",
            headers: headers,
        })
            .then((response) => response.json())
            .then((result) => {
                if (result?.success) {
                    const filterData = invitedList.filter((item) => item?.id !== memberId);
                    setInvitedList(filterData);
                    setCurrentData(filterData);
                }
            })
            .catch((error) => {
                alert(error)
            })
    }

    const searchData = (x) => {
        let text = x.toLowerCase();
        if (x) {
            let filteredName = invitedList.filter((item) => {
                return item?.user?.full_name?.toLowerCase().match(text);
            });
            setInvitedList(filteredName);
        } else {
            setInvitedList(currentData)
        }
    };

    const renderItem = ({ item, index }) => {
        return (
            <UserInviteCard
                User={item?.user}
                invited={false}
                btnTitle="Cancel"
                showBorder={true}
                onPress={() => onCancelInvite(item?.id)}
            />
        );
    };

    return (
        <View style={[styles.infoConatiner, { backgroundColor: theme?.cardColor}]}>
            <SearchBar placeholder={language?.searchForPeople+"..."}
                borderRadius={5} border={1} top={15}
                onTermChange={(text) => {
                    searchData(text);
                }}
                onTermSubmit={(text) => {
                    searchData(text);
                }}
            />
            {invitedList?.length ?
                <FlatList
                    data={invitedList}
                    renderItem={renderItem}
                    paddingTop={hp(1)}
                    keyExtractor={(item) => item.id}
                /> :
                <View style={styles.emptySection}>
                    {loading ? <ActivityIndicator size="large" color={colors.theme} />
                        : <AppText style={styles.text}>{language?.noUserFound}</AppText>}
                </View>}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    infoConatiner: {
        flex: 1,
        paddingHorizontal: wp(3),
        backgroundColor: colors.cWhite
    },
    emptySection: {
        height: '70%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: '500',
        color: colors.color8,
    },
    labelStyle: {
        textAlign: "center",
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        paddingHorizontal: 5,
        textTransform: "none"
    },
})