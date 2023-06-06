import React, { useContext, useState } from 'react'
import { TouchableOpacity, View, Image, Text, ScrollView } from 'react-native'

import { styles } from './styles'
import { images } from '../../../assets/images/Images'

import Feather from 'react-native-vector-icons/Feather'
import AppText from '../../AppText'

import colors from '../../../constant/colors'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import ShortcutTab from '../../ShortcutTab'
import AuthContext from '../../../src/Context/AuthContext'

export const Shortcuts = (props) => {
    const [showDetail, setShowDetail] = useState(false);
    const { myState: { language }}= useContext(AuthContext);

    const { categoriesData, countriesData, topicsData } = props
   

    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.header} onPress={() => setShowDetail(!showDetail)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={images.User} style={styles.userIcon} />
                    <Text style={styles.heading}>Shortcuts</Text>
                </View>
                <Feather name={showDetail ? 'chevron-up' : 'chevron-down'}
                    size={20} style={{ marginTop: 5 }} />
            </TouchableOpacity>
            {showDetail && <View style={styles.infoSection}>
                <View style={styles.shortcutTab}>
                    <ShortcutTab image={images.N_Album} title={language?.myAlbums} />
                    <ShortcutTab image={images.N_Auction} title={language?.myAuctions} />
                    <ShortcutTab image={images.N_Trade} title="Trade " />
                </View>
                <View style={styles.shortcutTab}>
                    <ShortcutTab image={images.N_Exhibition} title="Exibition " />
                    <ShortcutTab image={images.N_Clubs} title={language?.myClubs} />
                    <ShortcutTab image={images.N_Community} title="Community " />
                </View>
                <View style={styles.shortcutTab}>
                    <ShortcutTab image={images.N_List} title="My Listed " />
                    <ShortcutTab image={images.N_Store} title={language?.myStore+" "} />
                    <ShortcutTab image={images.Membership} title="Membership " />
                </View>
                <View style={styles.shortcutTab}>
                    <ShortcutTab image={images.N_Events} title="Events " />
                    <ShortcutTab image={images.N_Network} title="My Networks " />
                    <ShortcutTab image={images.N_Reports} title="My Reports " />
                </View>
            </View>}
        </View>
    )
}