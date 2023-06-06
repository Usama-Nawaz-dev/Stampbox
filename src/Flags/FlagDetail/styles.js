import { StyleSheet } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from '../../../constant/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    titleStyle: {
        fontSize: 22,
        fontWeight: '600',
        left: hp(2),
        bottom: hp(0.5),
        color: colors.cBlack,
        fontFamily: 'Roboto-Regular',
        textShadowColor: '#fff',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 2,
        // textShadowRadius: 10,
    },
    blurSection: {
        height: 230,
        width: wp(100),
        backgroundColor: "rgba(0,0,0, 0.3)"
    },
    detailsSection: {
        marginTop: hp(1),
        paddingHorizontal: wp(2)
    },
    uidText: {
        textAlign: 'center',
        marginBottom: hp(1),
        color: colors.theme,
        fontWeight: '500'
    },
    description: {
        fontSize: 16,
        color: colors.lightBlack,
        fontWeight: '600'
    },
    infoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(0.5),
    },
    infoContainer: {
        // width: wp(22),
        marginRight: 15
    },
    text: {
        fontSize: 14,
        color: colors.lightBlack,
        marginBottom: 5,
        fontWeight: '500'
    },
    infoText: {
        fontSize: 14,
        color: colors.lightText,
        marginBottom: 5,
    },
    offerText: {
        fontSize: 16,
        color: colors.lightBlack,
        fontWeight: '600',
        paddingHorizontal: wp(3),
        marginTop: 10
    },
    sellerInfo: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: hp(1),
    },
    offerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
        paddingHorizontal: wp(3)
    },
    priceText: {
        color: colors.theme
    },
    userSection: {
        marginTop: hp(1),
        paddingBottom: hp(1.5),
        borderBottomWidth: 1.2,
        borderColor: colors.borderColor,
        marginHorizontal: wp(3)
    },
    myOffer: {
        marginTop: hp(1.5),
        marginBottom: hp(5)
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.heading,
        marginBottom: hp(1.5),
        paddingHorizontal: wp(3)
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    commentText:{
        textAlign: 'right',
         marginHorizontal: wp(2)
    },
})