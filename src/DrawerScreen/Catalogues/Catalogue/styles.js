import { StyleSheet } from 'react-native'

import colors from '../../../../constant/colors'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite
    },
    mainItem: {
        flex: 1,
        backgroundColor: colors.cWhite,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.lightTheme
    },
})