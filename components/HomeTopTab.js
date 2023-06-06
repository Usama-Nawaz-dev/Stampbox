import React, { useContext } from 'react'
import { Text, Pressable, Image, StyleSheet } from 'react-native'

import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from "react-native-responsive-screen";

import { network } from '../assets/icons/homeTabIcon/homeTabIcon';

import AppText from '../components/AppText'
import AuthContext from '../src/Context/AuthContext';


const HomeTopTab = (props) => {
    const { image, onPress, title, bottomWidth } = props;
    const {  myState: { language }}= useContext(AuthContext);
    return (
        <Pressable style={[styles.mainSection, { borderBottomWidth: bottomWidth ? 0 : 0.5 }]} onPress={onPress}>
            <Image style={styles.img} source={image ? image : network} resizeMode='contain' />
            <AppText style={styles.text}>{title ? title : language?.myAlbums}</AppText>
        </Pressable>
    )
}

export default HomeTopTab;

const styles = StyleSheet.create({
    mainSection: {
        flexDirection: 'row',
        padding: wp(2),
        borderColor: 'grey',
        alignItems: 'center',
    },
    img: {
        width: hp(2),
        height: hp(2),
    },
    text: {
        fontSize: 12,
        marginLeft: hp(1)
    }
})