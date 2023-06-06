import { StyleSheet } from 'react-native'

import colors from '../../../constant/colors'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
    container: {
        height: 210,
        width: '100%',
        // width: wp(90),
        borderRadius: 10
    },
    bgImage: {
        flex: 1,
        height: '100%',
        borderRadius: 10,
        // opacity: 0.8
    },
    infoSection: {
        marginLeft: 20,
        marginTop: 15
    },
    userCard: {
        position: 'absolute',
        bottom: 15,
        left: 20
    },
    buttonSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    buyButton: {
        borderRadius: 5,
        height: 30,
        width: wp(22),
        backgroundColor: '#F2F2F2'
    },
    nameText: {
        fontFamily: 'IBMPlexSans-Regular',
        fontWeight: '500',
        fontSize: 18,
        maxWidth: wp(60),
        marginBottom: 5,
        color: colors.cWhite,
        textShadowColor: '#000',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 2,
    },
    userName: {
        fontSize: 14,
        color: colors.cWhite,
        textShadowColor: '#000',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 2,
    },
})