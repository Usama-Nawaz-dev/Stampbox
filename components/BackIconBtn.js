import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { 
    widthPercentageToDP as wp,
     heightPercentageToDP as hp, 
    } from "react-native-responsive-screen";

import AntDesign from 'react-native-vector-icons/AntDesign'

const BackIconBtn = (props) => {
    const { 
        onPress,
        showShadow
    } = props;
    return(
        <TouchableOpacity style={[styles.backIcon, showShadow && styles.shadow]} onPress={onPress}>
            <AntDesign name="arrowleft" size={25}/>
        </TouchableOpacity>
    )}

export default BackIconBtn;

const  styles = StyleSheet.create({
    backIcon: {
        width: 36,
        height: 36,
        backgroundColor: '#fff',
        // padding: wp(1),
        borderRadius: hp(5),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 5,
        left: 10,
        zIndex: 999,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
})