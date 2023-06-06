import React, { useContext } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import colors from '../../constant/colors'
import { GradBtn } from '../../components'
import Fonts from '../../assets/fonts/Fonts'
import AppText from '../../components/AppText'
import { images } from '../../assets/images/Images'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import FastImage from 'react-native-fast-image'
import { navigationRef } from '../../App'
import { useSelector } from 'react-redux'
import AuthContext from '../Context/AuthContext'

export const PermissionSheet = () => {
    const { closeSheet, openPermissionSheet } = useContext(AuthContext);
    const currentUser = useSelector((state) => state.ApiReducer.user);

    const pmStr = `You do not have permission for this feature. Please 
    update your plan to perform the action.`

    const subscription = currentUser?.subscriptions ?
        currentUser?.subscriptions[0]?.subscription_plan_id : null;

    let planPath;
    if (subscription == 2) {
        planPath = images.Bronze;
    } else if (subscription == 3) {
        planPath = images.Silver
    } else if (subscription == 4) {
        planPath = images.Gold
    } else if (subscription == 5) {
        planPath = images.Platinum
    } else if (subscription == 6) {
        planPath = images.Diamond
    } else {
        planPath = images.None
    }

    return (
        <View style={styles.container}>
            <FastImage style={styles.planImage} source={planPath} />
            <AppText style={styles.heading}>Upgrade Membership</AppText>
            <AppText style={styles.pmText}>{pmStr}</AppText>
            <GradBtn
                fontSize={14}
                height={hp(5)}
                width={wp(60)}
                fontWeight={'500'}
                style={styles.button}
                label="Upgrade your Membership"
                onPress={() => {
                    closeSheet();
                    setTimeout(() => {
                        navigationRef.navigate("Subscriptions")
                    }, 300)
                }}
            />
            <TouchableOpacity style={styles.cancelBtn} onPress={closeSheet}>
                <AppText style={styles.btnText}>Cancel</AppText>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp(3),
    },
    planImage: {
        width: 183,
        height: 164,
        alignSelf: 'center',
        resizeMode: 'contain',
        marginVertical: hp(6.5)
    },
    heading: {
        fontSize: 18,
        alignSelf: 'center',
        fontFamily: Fonts.IBM_Medium,
    },
    icon: {
        width: 28,
        height: 24,
        tintColor: colors.lightBlack
    },
    button: {
        marginTop: 0,
        marginBottom: 0
    },
    cancelBtn: {
        marginTop: hp(2),
        alignSelf: 'center',
    },
    btnText: {
        fontWeight: '500',
    },
    pmText: {
        textAlign: 'center',
        marginTop: hp(1),
        marginBottom: hp(2.5)
    }
})