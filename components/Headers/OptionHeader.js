import React, { useContext } from "react";
import {
    View, Image, ImageBackground,
    TouchableOpacity, StyleSheet, TextInput
} from "react-native";


import colors from "../../constant/colors";
import { images } from "../../assets/images/Images";

import AppText from "../AppText";
import Ionicons from "react-native-vector-icons/Ionicons";

import ThemeContext from "../../src/Context/ThemeContext";

import { MenuSheet } from "../MenuSheet";

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const OptionHeader = (props) => {
    const { theme, mode } = useContext(ThemeContext);
    const {
        title, onPressBack, addStamp,
        addMedia
    } = props
    const myIcon = <Ionicons name="md-add-circle-outline" color={colors.cWhite} size={26} />

    return (
        <View style={[styles.container, { backgroundColor: theme.white }]}>
            <ImageBackground style={styles.bgImage} source={images.Header}>
                <View style={styles.topSection}>
                    <View style={styles.titleSection}>
                        <TouchableOpacity onPress={onPressBack} >
                            <Image source={images.ArrowLeft} resizeMode="contain"
                                style={{ height: 18, width: 8, marginRight: wp(3) }} />
                        </TouchableOpacity>
                        <AppText style={styles.titleText}>{title}</AppText>
                    </View>
                    <View style={styles.rightSection}>
                        <MenuSheet
                            customButton={myIcon}
                            // destructiveIndex={1}
                            options={["Add Stamp Media", "Add Other Media", "Cancel"]}
                            actions={[addStamp, addMedia]}
                        />
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: wp(100),
    },
    bgImage: {
        height: 110,
        width: wp(100),
    },
    topSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        marginTop: 20
    },
    titleSection: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: wp(3)
    },
    titleText: {
        fontSize: 20,
        fontWeight: "500",
        fontFamily: "IBMPlexSans-Regular",
        color: colors.cWhite
    },
    rightSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginRight: wp(3),
    },
    counterSection: {
        height: 15,
        width: 15,
        borderRadius: 10,
        backgroundColor: colors.cWhite,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: -7,
        right: -7,
        zIndex: 999
    },
    counterText: {
        color: '#181818',
        fontSize: 9
    },
})