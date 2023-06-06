import React, { useContext } from 'react'
import { View, TouchableOpacity, Pressable } from 'react-native'
import { styles } from './styles'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from '../../../../components/AppText';

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import ThemeContext from '../../../Context/ThemeContext';

export const PickerSheet = (props) => {
    const {
        onAddPhoto, onTakePhoto,
        onSelectVideo, onRecordVideo
    } = props
    const { theme }= useContext(ThemeContext);
    return (
        <View style={[styles.bottomSheet, { backgroundColor: theme?.white}]}>
            <View>
                <TouchableOpacity style={styles.picker} onPress={onAddPhoto}>
                    <Ionicons name="md-images" size={22} color={theme?.black} />
                    <AppText style={styles.pickerText}>Add a photo</AppText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.picker} onPress={onTakePhoto}>
                    <MaterialCommunityIcons name="camera" size={25} color={theme?.black} />
                    <AppText style={styles.pickerText}>Take a photo</AppText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.picker}
                    onPress={onSelectVideo}>
                    <MaterialIcons name="video-library" size={25} color={theme?.black} />
                    <AppText style={styles.pickerText}>Add a video</AppText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.picker}
                    onPress={onRecordVideo}>
                    <MaterialCommunityIcons name="video" size={28} color={theme?.black} />
                    <AppText style={styles.pickerText}>Take a Video</AppText>
                </TouchableOpacity>
            </View>
        </View>
    )
}

