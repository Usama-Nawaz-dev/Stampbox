import { StyleSheet } from 'react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Fonts from '../../../assets/fonts/Fonts';
import colors from '../../../constant/colors'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        color: colors.theme,
        fontWeight: '500'
    },


    //Request Modal Styles
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignSelf: 'center',
        width: wp(80)
    },
    modalView: {
        margin: 20,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        paddingTop: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.25,
        shadowRadius: 1.84,
    },
    button: {
        width: '100%',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: colors.borderColor
    },
    btnText: {
        fontSize: 12,
        color: "#2196F3",
        fontWeight: '500',
        paddingVertical: hp(1)
    },
    userImg: {
        height: 80,
        width: 80,
        borderWidth: 1,
        borderRadius: 100,
        borderColor: colors.borderColor
    },
    infoText: {
        fontSize: 11,
        maxWidth: wp(65),
        textAlign: 'center',
        color: colors.heading,
        marginTop: hp(2),
        marginBottom: hp(1.5),
        paddingHorizontal: wp(2)
    },
    nameText: {
        fontSize: 11,
        fontWeight: '500',
        color: colors.heading,
    },
})