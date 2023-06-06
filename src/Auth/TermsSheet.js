import React, { useContext, useState } from 'react'
import { StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from '../../constant/colors';
import { GradBtn } from '../../components';
import ThemeContext from '../Context/ThemeContext';

export const TermsSheet = ({ onPressTerms, onPressClose, onPressContinue, onPressPolicy }) => {
    const [terms, setTerms] = useState(false)
    const [policy, setPolicy] = useState(false)
    const { theme }= useContext(ThemeContext);

    return (
        <View style={[styles.container, { backgroundColor: theme?.white}]}>
            {/* <Pressable style={styles.header} onPress={Press}>
                <View style={styles.panelHeader}>
                    <View style={styles.panelHandle} />
                </View>
            </Pressable> */}
            <Text style={[styles.heading, { color: theme?.darkGrey}]}>Additional Step Required</Text>
            <Text style={[styles.privacyText, { color: theme?.darkGrey}]}>Based on your country legal restrictions we are required to ask for additional consent. You can find more information in our Terms & Conditions and in our Privacy Policy.</Text>
            <View style={styles.termsSection}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={[styles.radio, {
                        borderColor: terms ? colors.theme : '#707070',
                    }]} onPress={() => setTerms(!terms)}>
                        {terms ? <View style={styles.innerRedio} /> : null}
                    </TouchableOpacity>
                    <Text style={[styles.text, { color: theme?.darkGrey}]}>I have read and accept the </Text>
                    <TouchableOpacity onPress={onPressTerms}>
                        <Text style={{ color: colors.theme }}>Terms & Conditions.</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <TouchableOpacity style={[styles.radio, {
                        borderColor: policy ? colors.theme : '#707070',
                    }]} onPress={() => setPolicy(!policy)}>
                        {policy ? <View style={styles.innerRedio} /> : null}
                    </TouchableOpacity>
                    <Text style={[styles.text, { color: theme?.darkGrey}]}>I have read and accept the </Text>
                    <TouchableOpacity onPress={onPressPolicy}>
                        <Text style={{ color: colors.theme }}>Privacy Policy.</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.bottomButton}>
                <GradBtn width={'80%'} borderRadius={7} height={hp(6)}
                    label={"Continue"} fontSize={16} bold={true}
                    onPress={!terms || !policy ?
                        () => { alert("Please check terms and conditions") }
                        : onPressContinue} />
                <TouchableOpacity style={styles.cancelBtn} onPress={onPressClose}>
                    <Text style={[styles.cancelText, { color: theme?.lightText}]}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // height: '100%',
        flex: 1,
        borderRadius: 20,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#fff',
        shadowColor: '#333333',
        shadowOffset: { width: -1, height: -3 },
        shadowRadius: 2,
        shadowOpacity: 0.4,
        // elevation: 5,
        paddingTop: hp(1.5),
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 0.5,
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
        marginBottom: hp(1),
    },
    heading: {
        fontSize: 20,
        fontFamily: 'IBMPlexSans-Bold',
        textAlign: 'center',
        color: colors.lightBlack,
        marginTop: hp(1.5)
    },
    privacyText: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        paddingHorizontal: wp(3),
        marginTop: hp(1.5),
        color: colors.btnText
    },
    termsSection: {
        marginTop: hp(1.5),
        paddingHorizontal: wp(3),
    },
    text: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        color: colors.btnText,
        marginLeft: wp(3)
    },
    radio: {
        width: hp(3.5),
        height: hp(3.5),
        borderRadius: 15,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerRedio: {
        height: hp(2),
        width: hp(2),
        borderRadius: 10,
        backgroundColor: colors.theme,
    },
    bottomButton: {
        position: 'absolute',
        bottom: hp(1),
        justifyContent: 'flex-end',
        width: '100%',
        alignItems: 'center'
    },
    cancelBtn: {
        marginVertical: hp(2.5)
    },
    cancelText: {
        fontSize: 16,
        color: colors.btnText
    }
})