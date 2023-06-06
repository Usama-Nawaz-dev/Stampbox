import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../constant/colors";
import { CustomButton } from "../../components";
import Feather from "react-native-vector-icons/Feather";
import Fonts from "../../assets/fonts/Fonts";

import { images } from "../../assets/images/Images";
import ThemeContext from "../Context/ThemeContext";

export const FilterSheet = (props) => {
    const {
        onPressItem, range, country,
        category, catalogue, onReset,
        onApplyFilter
    } = props;
    const { theme }= useContext(ThemeContext);
    return (
        <View style={styles.container}>
            <Text style={[styles.heading, {color: theme?.darkGrey}]}>Filter Item For</Text>
            <View style={styles.contentSection}>
                <TouchableOpacity style={styles.itemSection}
                    onPress={() => onPressItem("Years")}>
                    <Text style={styles.text}>
                        {range ? range : "Filter By Year Range"}
                    </Text>
                    <Feather name="chevron-down" size={24} color={colors.btnText} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemSection}
                    onPress={() => onPressItem("Country")}>
                    <Text style={styles.text}>
                        {country ? country : "Item Location (Country)"}
                    </Text>
                    <Feather name="chevron-down" size={24} color={colors.btnText} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemSection}
                    onPress={() => onPressItem("Category")}>
                    <Text style={styles.text}>
                        {category ? category?.name : "Filter By Categories"}
                    </Text>
                    <Feather name="chevron-down" size={24} color={colors.btnText} />

                </TouchableOpacity>
                <TouchableOpacity style={styles.itemSection}
                    onPress={() => onPressItem("Catalogue")}>
                    <Text style={styles.text}>
                        {catalogue ? catalogue : "Filter By Catalogue"}
                    </Text>
                    <Feather name="chevron-down" size={24} color={colors.btnText} />

                </TouchableOpacity>
            </View>
            <View style={styles.btnSection}>
                <CustomButton bg={colors.background}
                    label="Reset" textColor={colors.placeholderText}
                    width={wp(43)} height={40} fontSize={14}
                    onPress={onReset}
                />
                <CustomButton bg={colors.color8}
                    label="Filter" textColor={colors.cWhite}
                    width={wp(43)} height={40} fontSize={14}
                    onPress={onApplyFilter}
                />

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 20,
        // backgroundColor: "#fff",
    },
    heading: {
        fontSize: 18,
        marginTop: 5,
        marginLeft: wp(5),
        color: colors.btnText,
        fontFamily: Fonts.IBM_Medium,
    },
    contentSection: {
        flex: 1,
        marginTop: hp(1.5),
        alignItems: "center",
    },
    itemSection: {
        height: 45,
        width: "90%",
        borderRadius: 5,
        marginBottom: hp(2),
        paddingHorizontal: wp(3),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        backgroundColor: colors.background,
    },
    text: {
        fontSize: 14,
        color: colors.btnText,
        fontFamily: Fonts.IBM_Regular,
        marginLeft: 5,
    },
    btnSection: {
        width: '100%',
        bottom: hp(2.5),
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(5),
    },
});
