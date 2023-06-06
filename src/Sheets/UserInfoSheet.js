import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, ScrollView, View, FlatList } from 'react-native'

import colors from '../../constant/colors'
import Fonts from '../../assets/fonts/Fonts'

import AppText from '../../components/AppText'
import { InterestItem } from '../../components'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useSelector, useDispatch } from "react-redux";
import AuthContext from '../Context/AuthContext'
import ThemeContext from '../Context/ThemeContext'

export const UserInfoSheet = ({ Data, onValueChange, showImage }) => {
    const otherUser = useSelector((state) => state.DetailReducer.otherUser);
    // console.log(otherUser)

    const [info, setInfo] = useState(null);
    const { myState: { language }}= useContext(AuthContext);
    const { theme }= useContext(ThemeContext);


    useEffect(() => {
        setInfo(otherUser)
    }, [])

    const renderCategories = ({ item, index }) => {
        return (
            <View style={{ marginRight: wp(2), marginBottom: wp(2) }}>
                <InterestItem item={item.name} />
            </View>
        )
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme?.cardColor}]}>
            <View style={styles.header}>
                <AppText style={styles.title}>{language?.categoriesOfInterest}</AppText>
            </View>
            {info?.categories?.length ? <ScrollView contentContainerStyle={styles.list}
                showsHorizontalScrollIndicator={false}>
                {info?.categories?.map((item, index) => {
                    return (
                        <View style={{ marginRight: wp(2), marginBottom: wp(2) }}>
                            <InterestItem item={item?.name} maxWidth={wp(60)} />
                        </View>
                    );
                })}
            </ScrollView> :
                <AppText style={styles.emptyList}>You don't have any selected Categories.</AppText>}
            {/* <FlatList
                style={{ paddingHorizontal: wp(3) }}
                data={otherUser?.categories}
                numColumns={3}
                renderItem={renderCategories}
            /> */}
            <View style={styles.header}>
                <AppText style={styles.title}>Topics of Interest</AppText>
            </View>
            {info?.topics?.length ? <ScrollView contentContainerStyle={styles.list}
                showsHorizontalScrollIndicator={false}>
                {info?.topics?.map((item, index) => {
                    return (
                        <View style={{ marginRight: wp(2), marginBottom: wp(2) }}>
                            <InterestItem item={item?.name} maxWidth={wp(60)} />
                        </View>
                    );
                })}
            </ScrollView> :
                <AppText style={styles.emptyList}>You don't have any selected Topics.</AppText>}
            <View style={styles.header}>
                <AppText style={styles.title}>{language?.countriesOfInterest}</AppText>
            </View>
            {info?.interested_in_countries?.length ? <ScrollView contentContainerStyle={styles.list}
                showsHorizontalScrollIndicator={false}>
                {info?.interested_in_countries?.map((item, index) => {
                    return (
                        <View style={{ marginRight: wp(2), marginBottom: wp(2) }}>
                            <InterestItem item={item?.name} maxWidth={wp(60)} />
                        </View>
                    );
                })}
            </ScrollView> :
                <AppText style={styles.emptyList}>You don't have any selected Topics.</AppText>}
            <View style={[styles.header, { marginBottom: 0 }]}>
                <AppText style={styles.title}>My Wishlist Items</AppText>
            </View>
            <View style={styles.header1}>
                <AppText style={styles.title1}>{language?.myStamp}</AppText>
            </View>
            <View style={[styles.header1, { marginBottom: hp(4) }]}>
                <AppText style={styles.title1}>{language?.myAlbums}</AppText>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.cWhite,
    },
    header: {
        height: 45,
        backgroundColor: colors.borderColor,
        justifyContent: 'center',
        marginBottom: hp(1)
    },
    title: {
        fontSize: 16,
        fontFamily: Fonts.IBM_Regular,
        fontWeight: '600',
        color: colors.lightBlack,
        marginLeft: wp(3)
    },
    header1: {
        height: 45,
        backgroundColor: colors.background,
        justifyContent: 'center',
        marginBottom: hp(1)
    },
    title1: {
        fontSize: 14,
        fontFamily: Fonts.IBM_Regular,
        fontWeight: '500',
        color: colors.lightBlack,
        marginLeft: wp(3)
    },
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: wp(3)
    },
    emptyList: {
        textAlign: 'center',
        fontSize: 12,
        color: colors.theme,
        marginBottom: hp(1)
    }
})