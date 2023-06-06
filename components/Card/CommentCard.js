import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import moment from 'moment';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

import AppText from '../AppText';
import colors from '../../constant/colors';

export const CommentCard = (props) => {
    const { item, onPressOption } = props;
    const currentUser = useSelector((state) => state.ApiReducer.user);

    return (
        <View style={styles.CCard}>
            <FastImage
                source={{ uri: item?.user?.image_url }}
                style={styles.CCImage}
            />
            <View style={styles.commentBlock}>
                <View>
                    <AppText style={styles.heading}>
                        {item?.user?.full_name}
                    </AppText>
                    <AppText style={styles.commentText}>{item?.message}</AppText>
                    <AppText style={[styles.commentText, { fontSize: 9 }]}>
                        {moment(item?.created_at).format(
                            "YYYY-MM-DD [at] h:mm A"
                        )}
                    </AppText>
                </View>
                {item?.user_id === currentUser?.id ? (
                    <TouchableOpacity style={styles.dotIcon}
                        onPress={onPressOption}>
                        <Icon
                            size={22}
                            name="dots-vertical"
                            color={colors.btnText}
                        />
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    CCard: {
        marginBottom: 7,
        flexDirection: 'row',
        alignSelf: 'center'
    },
    CCImage: {
        height: 45,
        width: 45,
        borderRadius: 25,
        paddingLeft: wp(3),
        backgroundColor: colors.background,
    },
    commentBlock: {
        padding: 10,
        width: wp(81),
        marginLeft: 5,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.background,
    },
    heading: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.heading,
    },
    commentText: {
        fontSize: 12,
        maxWidth: wp(80),
        marginTop: hp(0.5),
        color: colors.lightText
    },
    dotIcon: {
        top: wp(1),
        right: wp(0.5),
        paddingHorizontal: wp(1.5),
        position: 'absolute'
    },
})