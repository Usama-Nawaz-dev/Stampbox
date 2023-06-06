import { StyleSheet, Dimensions } from 'react-native'

import { 
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp, 
} from "react-native-responsive-screen";
import Fonts from '../../../assets/fonts/Fonts';

import colors from '../../../constant/colors';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(3),
        height: 55,
        // backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 1.84
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    heading: {
        fontSize: 22,
        marginLeft: 30,
        // color: colors.cBlack,
    },
    postText: {
        fontSize: 16,
        fontWeight: '600',
        // color: colors.cBlack
    },
    cross: {
        width: 18,
        height: 18,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp(2),
        paddingHorizontal: wp(3)
    },
    userImg: {
        width: hp(6),
        height: hp(6),
        borderRadius: 100,
        resizeMode: 'cover'
    },
    nameText: {
        fontSize: 16,
        fontWeight: '500',
        // color: colors.btnText
    },
    privacySection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: wp(40),
        borderWidth: 1,
        borderColor: colors.placeholderText,
        borderRadius: 40,
        marginTop: 2
    },
    earthIcon: {
        width: 15,
        height: 15,
    },
    dropDown: { 
        width:wp(30),
        height: 23,
        borderBottomWidth: 0,
    },
    input: {
        fontSize: 14,
        maxHeight: 80,
        color: colors.btnText,
        fontFamily: Fonts.IBM_Regular,
      },
      mediaSection: {
        height: height/3.5,
        marginTop: 25,
      },
      pickerImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
      },
      bottomSection: {
        flexDirection: 'row',
        position: 'absolute', 
        bottom:20, 
        width: '50%',
        paddingHorizontal: wp(3), 
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    // Bottom Sheet
    bottomSheet: { 
        height: 250, 
        borderRadius: 20, 
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#fff',
        shadowColor: '#333333',
        shadowOffset: {width: -1, height: -3},
        shadowRadius: 2,
        shadowOpacity: 0.4,
        // elevation: 5,
        paddingTop: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 1,
        borderColor: 'lightgrey'
    },
    panelHeader: {
        alignItems: 'center',
        // backgroundColor: '#000'
    },
    panelHandle: {
        width: wp(18),
        height: 3,
        borderRadius: 4,
        backgroundColor: '#00000060',
        marginBottom: 10,
    },
    picker: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: wp(3.5),
        marginHorizontal: wp(6)
    },
    pickerText: {
        fontSize: 12,
        marginLeft: wp(5)
    } 
})