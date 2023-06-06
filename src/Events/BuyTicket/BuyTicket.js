import React, { useContext, useState } from 'react'
import { View, TextInput } from 'react-native'

import { styles } from './styles'
import colors from '../../../constant/colors'
import AppText from '../../../components/AppText'
import { MainHeader, BillingComp } from '../../../components'

import { useDispatch } from 'react-redux'
import allActions from '../../../redux/actions'
import MindAxios from '../../../api/MindAxios'
import Env from '../../../api/Env'
import Helper from '../../Helper'
import AuthContext from '../../Context/AuthContext'

export const BuyTicket = (props) => {
    const dispatch = useDispatch();
    const { EventDetail } = props.route.params;
    const [description, setDescription] = useState(null);
    const{myState: { language }}= useContext(AuthContext);

    const onPurchase = async (method_id) => {
        dispatch(allActions.DataAction.AppLoader(true));
        const res = await MindAxios.post(Env.createUrl("participants/buy-ticket"), {
            payment_method: "stripe",
            event_id: EventDetail?.id,
            message: description,
            payment_method_id: method_id,
        });
        // console.log("res-->", res);
        dispatch(allActions.DataAction.AppLoader(false));
        if (res?.status == 200) {
            Helper.showToastMessage("Ticket Purchased successfully", "skyblue");
            props.navigation.goBack();
        } else {
            Helper.showToastMessage("Couldn't purchased the ticket!", "red");
        }
    };

    return (
        <View style={styles.mainConatiner}>
            <MainHeader
                title={language?.buyTicket}
                onPressBack={() => props.navigation.goBack()}
            />
            <View style={styles.infoSection}>
                <AppText style={styles.heading}>{language?.write_description}</AppText>
                <TextInput multiline
                    value={description}
                    placeholder={`${language?.write_description}...`}
                    style={styles.input}
                    onChangeText={(text) => setDescription(text)} />
                <AppText style={styles.heading}>{language?.card_Details}</AppText>
                <BillingComp onProceed={onPurchase} />
            </View>
        </View>
    )
}
