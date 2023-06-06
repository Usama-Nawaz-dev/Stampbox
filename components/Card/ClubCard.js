import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from "../AppText";
import { GradBtn } from "../GradBtn";
import Helper from "../../src/Helper";
import colors from "../../constant/colors";
import Fonts from "../../assets/fonts/Fonts";
import { images } from "../../assets/images/Images";
import { ImageBackground } from "react-native";
import AuthContext from "../../src/Context/AuthContext";
import ThemeContext from "../../src/Context/ThemeContext";
// import { dark as theme } from "../../constant/colorsConfig";

export const ClubCard = (props) => {
    const { Item, onViewClub } = props;
    const {myState:{language}}=useContext(AuthContext);
    const { theme }= useContext(ThemeContext);

    return (
        <View style={[styles.card, { backgroundColor: theme?.cardColor}]}>
            <View>
                {Item?.image_url ? (
                    <ImageBackground
                        imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                        style={[styles.stampImg]}
                        source={{ uri: Item?.image_url }}
                    >
                        <View
                            style={[styles.stampImg, { backgroundColor: "rgba(0,0,0, 0.3)" }]}
                        />
                    </ImageBackground>
                ) : (
                    <ImageBackground
                        style={[styles.stampImg]}
                        imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                        source={images.noImg}>
                        <View
                            style={[styles.stampImg, { backgroundColor: "rgba(0,0,0, 0.3)" }]}
                        />
                    </ImageBackground>
                )}
            </View>
            <View style={[styles.infoSection, { backgroundColor: theme?.cardColor}]}>
                <AppText style={styles.nameText} numberOfLines={1}>
                    {Helper.capitalizeFirstLetter(Item?.name)}
                </AppText>
                <View style={styles.memberSection}>
                    <AppText style={[styles.text, { color: theme?.lightText}]}>{Item?.club_members_count}{" "}{language?.members}</AppText>
                </View>
                <AppText style={[styles.text, { color: theme?.lightText}]} numberOfLines={2}>{language?.privacyType}: {Item?.privacy_type}</AppText>
                <AppText style={[styles.text, { color: theme?.lightText}]} numberOfLines={1}>{Item?.description ? Item?.description : 'N/A'}</AppText>
            </View>
            <GradBtn
                height={28}
                fontSize={14}
                width={wp(36)}
                fontWeight={'500'}
                label={language?.viewClub}
                onPress={onViewClub}
                style={styles.button}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: wp(45),
        borderRadius: 10,
        marginRight: wp(3),
        marginBottom: hp(1.5),
        shadowRadius: 2.84,
        shadowOpacity: 0.25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        backgroundColor: colors.cWhite,
    },
    stampImg: {
        width: "100%",
        height: 150,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    infoSection: {
        marginTop: -10,
        backgroundColor: colors.cWhite,
        paddingHorizontal: wp(2),
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    nameText: {
        marginTop: 5,
        // color: colors.heading,
        fontFamily: Fonts.Inter_Medium,
    },
    text: {
        fontSize: 12,
        marginTop: 5,
        color: colors.lightText,
    },
    button: {
        marginTop: 10,
        marginBottom: 10
    },
    memberSection: {
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderColor: colors.borderColor
    },
});
