import { StyleSheet } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from '../../../../../constant/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: colors.cWhite,
    },
    topSection: {
        marginTop: hp(2),
        paddingVertical: hp(2),
        paddingHorizontal: wp(6),

    },
    cardSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: wp(6),
    },
    nameText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.lightBlack
    },
    itemText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.lightBlack,
        paddingHorizontal: wp(6)
    },
    card: {
        backgroundColor: colors.cWhite,
        height: 140,
        width: wp(36),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 2.84,
        borderRadius: 10,
    },
    stampIcon: {
        height: 120,
        width: '80%',
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    coinIcon: {
        height: 120,
        width: '70%',
        resizeMode: 'contain',
        alignSelf: 'center'
    },
});