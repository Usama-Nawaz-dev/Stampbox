import React, { useContext } from "react";
import {
    View, Pressable, Image,
    ImageBackground, TouchableOpacity, TextInput
} from "react-native";


import colors from "../../../constant/colors";
import { styles } from "./styles";

import AppText from "../../AppText";
import { images } from '../../../assets/images/Images'

import UserCard from "../../UserCard";
import Btn from "../../Btn";
import AuthContext from "../../../src/Context/AuthContext";

export const SwiperCard = (props) => {

    const { myState: { language } }= useContext(AuthContext);

    const { title, onPressMenu, placeholder,
        onChangeValue
    } = props
    return (
        <View style={styles.container}>
            <ImageBackground style={styles.bgImage} imageStyle={{ borderRadius: 10 }} source={images.hd}>
                <View style={styles.userCard}>
                    <UserCard starColor={colors.cWhite} nameStyle={styles.userName} imgSize={40} />
                </View>
                <View style={styles.infoSection}>
                    <AppText style={styles.nameText} numberOfLines={2}>
                        Deutsche Bundespost Rare Stamp 1931</AppText>
                    <View style={styles.buttonSection}>
                        <Btn label={language?.buy+" "+language?.now} fontSize={12} textColor={colors.btnText}
                            style={styles.buyButton} fontWeight={'500'}
                        />
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

