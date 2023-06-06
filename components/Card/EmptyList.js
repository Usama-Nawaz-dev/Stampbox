import React from 'react';
import { StyleSheet, View } from 'react-native';

import AppText from '../AppText';
import colors from '../../constant/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const EmptyList = (props) => {
    const { description, size } = props;

    return (
        <View style={styles.container}>
            <Ionicons name='ios-information-circle' color={colors.lightTheme} size={size ? size : 16} />
            <AppText style={styles.text}>{description}</AppText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    text: {
        fontSize: 12,
        marginLeft: 5,
        fontWeight: '500',
        color: colors.lightTheme
    }

})