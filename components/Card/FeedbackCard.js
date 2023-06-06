import React, { useContext } from 'react'
import { StyleSheet, View, Image } from 'react-native'

import AppText from '../AppText'
import colors from '../../constant/colors'
import Fonts from '../../assets/fonts/Fonts'
import { images } from '../../assets/images/Images'

import moment from 'moment'
import Btn from '../Btn'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import ThemeContext from '../../src/Context/ThemeContext'

export const FeedbackCard = (props) => {
    const { id, time, onPress, title, showBtn = true } = props;
    const agoTime = moment(time).fromNow();
    const { theme }= useContext(ThemeContext);
    return (
        <View style={[styles.card, { backgroundColor: theme?.cardColor}]}>
            <View style={styles.section}>
                <AppText style={styles.orderText}>{title ? title : 'Order'} #{id}</AppText>
                {showBtn && <AppText style={[styles.feedbackText, { color: theme?.lightText}]}>Your package has been delivered. Please provide your valueable feedback</AppText>}
            </View>
            <View style={[styles.section, { marginTop: 5 }]}>
                <AppText style={[styles.timeText, { color: theme?.lightText}]}>Placed on {agoTime}</AppText>
                {showBtn && <Btn label="Feedback" fontSize={12} textColor={colors.cWhite}
                    style={styles.bidButton} onPress={onPress}
                    iconLeft={<Image source={images.Comments}
                        style={styles.btnImg} />}
                />}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.cWhite,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 2.84,
        borderRadius: 10,
        padding: wp(3),
        marginHorizontal: wp(3),
        marginTop: hp(1.5)
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    orderText: {
        fontSize: 16,
        // color: colors.heading,
        fontFamily: Fonts.IBM_Medium
    },
    feedbackText: {
        fontSize: 12,
        maxWidth: wp(65),
        textAlign: 'center',
        color: colors.lightText,
        fontFamily: Fonts.IBM_Regular
    },
    timeText: {
        color: colors.lightText,
        fontFamily: Fonts.IBM_Regular
    },
    bidButton: {
        borderRadius: 20,
        height: 28,
        width: wp(30),
        backgroundColor: colors.color8
    },
    btnImg: {
        height: 15,
        width: 15,
        resizeMode: 'contain',
        marginRight: 3,
        tintColor: colors.cWhite
    },
})