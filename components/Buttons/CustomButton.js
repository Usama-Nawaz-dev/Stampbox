import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import colors from '../../constant/colors'
import Fonts from '../../assets/fonts/Fonts'
import AppText from '../AppText'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";

export const CustomButton = (props) => {
    const {
        label, icon, height, width,
        onPress, fontSize, style,
        textColor, iconLeft, fontWeight, bg,
    } = props;
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                {
                    height: height ? height : 45,
                    width: width ? width : "100%",
                    borderRadius: 5,
                    backgroundColor: bg ? bg : colors.theme,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: iconLeft ? null : 'center',
                },
                style,
            ]}
        >
            {iconLeft}
            {label && (
                <AppText
                    style={{
                        fontSize: fontSize !== undefined ? fontSize : 18,
                        fontWeight: fontWeight ? fontWeight : '500',
                        color: textColor ? textColor : colors.cWhite,
                        marginHorizontal: iconLeft ? 5 : 10,
                        fontFamily: Fonts.Inter_Regular,
                    }}
                >
                    {label}
                </AppText>
            )}
            {icon}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({

})