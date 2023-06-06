import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, View, TouchableOpacity } from 'react-native';
const { width } = Dimensions.get('window');

import { styles } from "./styles";

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import CoverPhoto from '../../../../../components/CoverPhoto'
import { SimpleHeader } from '../../../../../components';
import AuthContext from '../../../../Context/AuthContext';

export const UploadPhoto = ({ navigation }) => {
    const { myState: {language}}=useContext(AuthContext);

    return (
        <View style={styles.container}>
            <SimpleHeader title={language?.uploadPhoto}
                onPressBack={() => navigation.goBack()}
            />
            <View style={styles.phoneSection}>
                <CoverPhoto btnText="Upload From Phone" />
            </View>
            <View style={styles.stampboxSection}>
                <CoverPhoto btnText="Choose My Stampbox"
                    onPress={() => navigation.navigate("AuctionStamps")} />
            </View>
        </View>
    );
};


