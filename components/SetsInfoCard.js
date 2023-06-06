import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Pressable,
  View
} from "react-native";
import Image from "react-native-fast-image";

import { 
        widthPercentageToDP as wp, 
        heightPercentageToDP as hp, 
    } from "react-native-responsive-screen";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import BorderBtn from './BorderBtn';

import colors from '../constant/colors';
import AppText from './AppText';

const AlbumCard = (props) => {
  const { onPress, number } = props
  
    return (
      <Pressable style={styles.container} onPress={onPress}>
        <View style={styles.upperView}>
            <Image style={styles.stampImg} source={{ uri: "https://picsum.photos/600/600" }} />
        </View>
        <AppText style={styles.title} numberOfLines={1}>Set Number {number}</AppText>
        <AppText style={styles.text}>0 Collections</AppText>
      </Pressable>
    );
  }

export default AlbumCard;

const  styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        width: wp(43),
    },
    stampImg: {
        height: 115,
        margin: 10,
        resizeMode: "contain",
    },
    upperView: {
        width: wp(35),
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderRadius: 7
    },
    title: {
        fontWeight: '500',
        maxWidth: wp(35),
        marginTop: 5
    },
    text: {
        fontSize: 12,
        marginTop: 2,
        color: colors.lightText
    }
})