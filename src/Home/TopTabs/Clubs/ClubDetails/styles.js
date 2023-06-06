import { StyleSheet } from 'react-native'

import colors from '../../../../../constant/colors';
import Fonts from '../../../../../assets/fonts/Fonts';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite
    },
    edit: {
        padding: hp(1),
        borderRadius: hp(10),
        backgroundColor: `${colors.cWhite}20`
    },
    clubImg: {
        height: 230,
        width: wp(100),
        backgroundColor: colors.background
    },
    heading: {
        fontSize: 18,
        fontWeight: '600',
        // color: colors.cBlack
    },
    infoSection: {
        paddingTop: hp(0.5),
        borderBottomWidth: 1,
        paddingHorizontal: wp(3),
        borderColor: colors.borderColor
    },
    infoText: {
        fontSize: 12,
        marginTop: hp(0.5),
        color: colors.lightText
    },
    subHeading: {
        fontSize: 15,
        fontWeight: '500',
        // color: colors.cBlack,
        marginBottom: hp(0.5)
    },
    infoSection1: {
        paddingTop: hp(0.5),
        paddingHorizontal: wp(3),
    },
    detail: {
        fontSize: 14,
        marginBottom: hp(0.5),
        color: colors.lightText
    },
    emptyList: {
        fontSize: 12,
        fontWeight: '500',
        alignSelf: 'center',
        color: colors.color8,
        marginBottom: hp(0.5)
    },
    btnSection: {
        width: wp(55),
        marginVertical: hp(1),
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    button: {
        width: wp(25),
        marginTop: 0
    },
    memberText: {
        fontWeight: '500',
        color: colors.color8,
        textDecorationLine: 'underline',
    },
    htmlText: {
        marginBottom: hp(0.5),
        color: colors.lightText,
        fontFamily: Fonts.IBM_Regular
    },

    //Club Feeds
    addPost: {
        padding: wp(3),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.cWhite,
    },
    postImg: {
        width: 45,
        height: 45,
        borderRadius: 100,
        resizeMode: 'cover'
    },
    postAdd: {
        height: 40,
        width: '80%',
        borderWidth: 1,
        borderRadius: 5,
        marginLeft: wp(3),
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: wp(4),
        justifyContent: 'space-between',
        borderColor: colors.borderColor,
    },
    addPostText: {
        fontSize: 12,
        color: colors.placeholderText
    },
    noPost: {
        flex: 1,
        marginVertical: hp(5),
        alignItems: "center",
        justifyContent: "center"
    },
    postText: {
        fontSize: 18,
        fontWeight: "500"
    }
})