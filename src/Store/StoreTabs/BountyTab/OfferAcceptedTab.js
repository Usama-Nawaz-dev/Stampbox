import React, { useContext } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'

import colors from '../../../../constant/colors'
import { MyBountyCard } from '../../../../components'
import AppText from '../../../../components/AppText'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import AuthContext from '../../../Context/AuthContext'
import ThemeContext from '../../../Context/ThemeContext'
// import { dark as theme } from '../../../../constant/colorsConfig'

const Data = [1, 2, 3, 4, 5]
export const OfferAcceptedTab = (props) => {
    const { myState: {language}}= useContext(AuthContext);
    const { theme }= useContext(ThemeContext);
    const renderItem = ({ item, index }) => {
        const isEnd = index === Data.length - 1;
        
        return (
            <View style={{ marginBottom: hp(1.5), paddingRight: wp(3) }}>
                <MyBountyCard />
            </View>
        )
    }
    return (
        <View style={[styles.container, { backgroundColor: theme?.white}]}>
            {false ? <FlatList
                data={Data}
                numColumns={2}
                style={styles.listStyle}
                renderItem={renderItem}
            // showsVerticalScrollIndicator={false}
            /> : <AppText style={styles.emptyList}>
                {language?.you_have_no_listed_item}</AppText>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite
    },
    listStyle: {
        paddingHorizontal: wp(3),
        marginTop: hp(1)
    },
    emptyList: {
        alignSelf: 'center',
        marginTop: hp(20),
        // color: colors.lightText,
        fontWeight: '500',
        fontSize: 12,
    }
})