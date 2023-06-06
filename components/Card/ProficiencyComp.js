import React, { useContext, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

import AppText from '../AppText';
import colors from '../../constant/colors';
import { images } from '../../assets/images/Images';
import { CustomButton } from '../Buttons/CustomButton';

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import ThemeContext from '../../src/Context/ThemeContext';
// import { dark as theme } from '../../constant/colorsConfig';

export const ProficiencyComp = (props) => {
    const { selLevel, cocaLeve } = props;
    const [showDetail, setShowDetail] = useState(false);
  const { theme, mode } = useContext(ThemeContext);

    let selBage;
    if (selLevel === 'Intermediate') {
        selBage = images.Intermediate;
    } else if (selLevel === "Proficient") {
        planPath = images.Proficient
    } else if (selLevel === "Advanced") {
        selBage = images.Advanced
    } else if (selLevel === 'Master') {
        selBage = images.Master
    } else {
        selBage = images.Beginner
    }

    let cocaBadge;
    if (selLevel === 'Supporter') {
        cocaBadge = images.Supporter;
    } else if (selLevel === "Sustainer") {
        cocaBadge = images.Sustainer
    } else if (selLevel === "Builder") {
        cocaBadge = images.Builder
    } else if (selLevel === 'Partner') {
        cocaBadge = images.Partner
    } else {
        cocaBadge = images.Enthusiast
    }

    return (
        <View style={[styles.card, { backgroundColor: theme?.cardColor}]}>
            <TouchableOpacity style={styles.header}
                onPress={() => setShowDetail(!showDetail)}>
                <AppText style={[styles.heading, { color: theme?.black}]}>Proficiency Level</AppText>
                <Feather name={showDetail ? 'chevron-up' : 'chevron-down'}
                    size={20} style={{ marginTop: 5, color: theme?.black }} />
            </TouchableOpacity >
            {showDetail && <View style={styles.infoSection}>
                <View style={styles.badgeSection}>
                    <View style={{ alignItems: 'center' }}>
                        <FastImage style={styles.planImage} source={selBage} />
                        <AppText style={{color: theme?.black}}>SEL Level</AppText>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <FastImage style={styles.planImage} source={cocaBadge} />
                        <AppText style={{color: theme?.black}}>Coca Level</AppText>
                    </View>
                </View>
            </View>}
        </View >
    )
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.cWhite,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 1.84,
        borderRadius: 5,
    },
    header: {
        flexDirection: 'row',
        height: 55,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(3),
    },
    userIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    heading: {
        fontSize: 16,
        color: colors.lightBlack,
        fontFamily: Fonts.IBM_Medium,
    },
    infoSection: {
        paddingBottom: hp(2),
    },

    //Detail Styles
    badgeSection: {
        marginTop: hp(1),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(5),
    },
    planImage: {
        width: 145,
        height: 130,
        marginBottom: hp(1),
        resizeMode: 'contain',
    }
})