import { StyleSheet } from 'react-native'

import colors from '../../../constant/colors'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
    container: {
        width: wp(100),
        // backgroundColor: colors.cWhite,
    },
    bgImage: {
        height: 90
    },
    topSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        marginTop: 15
    },
    titleSection: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: wp(3)
    },
    titleText: {
        fontSize: 20,
        fontWeight: "500",
        fontFamily: "IBMPlexSans-Regular",
        color: colors.cWhite,
    },
    rightSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginRight: 15,
    },
    counterSection: {
        height: 15,
        width: 15,
        borderRadius: 10,
        backgroundColor: colors.cWhite,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: -7,
        right: -7,
        zIndex: 999
    },
    counterText: {
        color: '#181818',
        fontSize: 9
    },
    locationSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15
    },
    locationText: {
        marginHorizontal: 3,
        color: colors.disable
    },
    searchContainer: {
        width: wp(100),
        marginTop: -25,
        flexDirection: 'row',
        paddingHorizontal: wp(3),
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: 0.95,
    },
    searchSection: {
        height: 45,
        width: wp(65),
        backgroundColor: colors.cWhite,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 15,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: colors.borderColor,
    },
    filterSection: {
        width: 45,
        height: 45,
        backgroundColor: colors.cWhite,
        alignItems: "center",
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 7,
        borderColor: colors.borderColor,
    },
    addSection: {
        width: 45,
        height: 45,
        backgroundColor: colors.color8,
        alignItems: "center",
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 7,
        borderColor: colors.color8,
    },
    input: {
        fontFamily: "Inter-Regular",
        marginLeft: 10,
    }
})