import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, ScrollView } from 'react-native';

import { styles } from './styles'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
    MainHeader, MarketCard, GradBtn
} from '../../../../components';

import AppText from '../../../../components/AppText';
import MindAxios from '../../../../api/MindAxios';
import Env from '../../../../api/Env';

import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";
import allActions from '../../../../redux/actions';
import AuthContext from '../../../Context/AuthContext';
import ThemeContext from '../../../Context/ThemeContext';


export const UserMarket = (props) => {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const otherUser = useSelector((state) => state.DetailReducer.otherUser);

    const [selectedItem, setSelectedItem] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [suppliesList, setSuppliesList] = useState(null);
    const [salesList, setSalesList] = useState(null);
    const [bountiesList, setBountiesList] = useState(null);
    const [auctionList, setAuctionList] = useState(null);
    const [tradesList, setTradesList] = useState(null);
    const { myState: { language } } = useContext(AuthContext);
    const { theme }= useContext(ThemeContext);

    const [type, setType] = useState(null)

    useEffect(() => {
        if (isFocused) {
            (async () => {
                dispatch(allActions.DataAction.ActivityModal(true));
                await getSupplies();
                await getSales();
                dispatch(allActions.DataAction.ActivityModal(false));
                await getBounties();
                await getAuctions();
                await getTrades();
            })();
        }
    }, [])


    const getSupplies = async () => {
        const response = await MindAxios.get(
            Env.paramUrl(`products`, `?user_id=${otherUser?.id}&is_published=1&productable_type=Supply`)
        );
        // console.log("response", response);
        if (response?.status == 200) {
            setSuppliesList(response?.data?.result?.paginated_items?.data);
        }
    };
    const getSales = async () => {
        const response = await MindAxios.get(
            Env.paramUrl(`products`, `?user_id=${otherUser?.id}&productable_type=StampItem`)
        );
        // console.log("response", response);
        if (response?.status == 200) {
            setSalesList(response?.data?.result?.paginated_items?.data);
        }
    }
    const getBounties = async () => {
        const response = await MindAxios.get(
            Env.paramUrl(`bounties`, `?user_id=${otherUser?.id}&status=Active`)
        );
        // console.log("response", response);
        if (response?.status == 200) {
            setBountiesList(response?.data?.result?.paginated_items?.data);
        }
    }
    const getAuctions = async () => {
        const response = await MindAxios.get(
            Env.paramUrl(`auctions`, `?user_id=${otherUser?.id}&type=active`)
        );
        // console.log("response", response);
        if (response?.status == 200) {
            setAuctionList(response?.data?.result?.paginated_items?.data);
        }
    }
    const getTrades = async () => {
        const response = await MindAxios.get(
            Env.paramUrl(`trades`, `?user_id=${otherUser?.id}&type=active`)
        );
        // console.log("response", response);
        if (response?.status == 200) {
            setTradesList(response?.data?.result?.paginated_items?.data);
        }
    }


    const renderItem = ({ item, index }) => {
        // const isEnd = index === stampList.length - 1;
        return (
            <View style={{ margin: 1 }}>
                <MarketCard ItemDetail={item?.productable} />
            </View>
        );
    };

    const renderTrades = ({ item, index }) => {
        return (
            <View style={{ margin: 1 }}>
                <MarketCard ItemDetail={item?.tradeables[0]?.tradeable} />
            </View>
        );
    };

    const renderAuction = ({ item, index }) => {
        return (
            <View style={{ margin: 1 }}>
                <MarketCard ItemDetail={item?.auctionable} />
            </View>
        );
    };
    

    return (
        <View style={[styles.container, { backgroundColor: theme?.white}]}>
            <MainHeader title="User Market"
                onPressBack={() => {
                    props.navigation.goBack()
                }} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.itemSection}>
                    <AppText style={styles.heading}>Supplies</AppText>
                    <View style={styles.lowerSection}>
                        {!suppliesList?.length ? (<AppText style={[styles.inActiveText, { color: theme?.theme}]}>{language?.YouDontHhaveAanyActiveItem}</AppText>) : (
                            <FlatList
                                horizontal
                                data={suppliesList}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id}
                                extraData={selectedId}
                            />
                        )}
                    </View>
                </View>
                <View style={styles.itemSection}>
                    <AppText style={styles.heading}>{language?.forSale}</AppText>
                    <View style={styles.lowerSection}>
                        {!salesList?.length ? (<AppText style={[styles.inActiveText, { color: theme?.theme}]}>{language?.YouDontHhaveAanyActiveItem}</AppText>) : (
                            <FlatList
                                horizontal
                                data={salesList}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id}
                                extraData={selectedId}
                            />
                        )}
                    </View>
                </View>
                <View style={styles.itemSection}>
                    <AppText style={styles.heading}>Bounties</AppText>
                    <View style={styles.lowerSection}>
                        {!bountiesList?.length ? (<AppText style={[styles.inActiveText, { color: theme?.theme}]}>{language?.YouDontHhaveAanyActiveItem}</AppText>) : (
                            <FlatList
                                horizontal
                                data={bountiesList}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id}
                                extraData={selectedId}
                            />
                        )}
                    </View>
                </View>
                <View style={styles.itemSection}>
                    <AppText style={styles.heading}>{language?.onAuction}</AppText>
                    <View style={styles.lowerSection}>
                        {!auctionList?.length ? (<AppText style={[styles.inActiveText, { color: theme?.theme}]}>{language?.YouDontHhaveAanyActiveItem}</AppText>) : (
                            <FlatList
                                horizontal
                                data={auctionList}
                                renderItem={renderAuction}
                                keyExtractor={(item) => item.id}
                                extraData={selectedId}
                            />
                        )}
                    </View>
                    <View style={[styles.itemSection, { marginBottom: hp(5) }]}>
                        <AppText style={styles.heading}>For Trade</AppText>
                        <View style={styles.lowerSection}>
                            {!tradesList?.length ? (<AppText style={[styles.inActiveText, { color: theme?.theme}]}>{language?.YouDontHhaveAanyActiveItem}</AppText>) : (
                                <FlatList
                                    horizontal
                                    data={tradesList}
                                    renderItem={renderTrades}
                                    keyExtractor={(item) => item.id}
                                    extraData={selectedId}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}