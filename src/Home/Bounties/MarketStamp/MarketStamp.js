import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, ScrollView, TouchableOpacity } from 'react-native';

import { styles } from './styles'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
    SimpleHeader, MarketCard, GradBtn
} from '../../../../components';

import colors from '../../../../constant/colors';
import AppText from '../../../../components/AppText';
import MindAxios from '../../../../api/MindAxios';
import Env from '../../../../api/Env';

import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";
import allActions from '../../../../redux/actions';
import AuthContext from '../../../Context/AuthContext';
import ThemeContext from '../../../Context/ThemeContext';
// import { dark as theme } from '../../../../constant/colorsConfig';


export const MarketStamp = (props) => {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const [selectedItem, setSelectedItem] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [productList, setProductList] = useState(null);
    const [tradeList, setTradeList] = useState(null);
    const [auctionList, setAuctionList] = useState(null);
    const [currentData, setCurrentData] = useState(null);

    const [isProduct, setIsProduct] = useState(true);
    const [isTrade, setIsTrade] = useState(false);
    const [isAuction, setIsAuction] = useState(false);

    const [type, setType] = useState(null);
    const{ myState: { language }}= useContext(AuthContext);
    const { theme }= useContext(ThemeContext)

    useEffect(() => {
        if (isFocused) {
            (async () => {
                dispatch(allActions.DataAction.AppLoader(true));
                await getProducts();
                await getTrades();
                await getAuctions();
                dispatch(allActions.DataAction.AppLoader(false));
            })();
        }
    }, [])

    const getProducts = async () => {
        const response = await MindAxios.get(
            Env.paramUrl(`products`, `?productable_type=StampItem`)
        );
        // console.log("response", response);
        if (response?.status == 200) {
            const _data = response?.data?.result?.paginated_items?.data
            setProductList(_data);
            setCurrentData(_data);
        }
    }

    const getAuctions = async () => {
        const response = await MindAxios.get(
            Env.paramUrl(`auctions`, `?type=active`)
        );
        // console.log("response", response);
        if (response?.status == 200) {
            setAuctionList(response?.data?.result?.paginated_items?.data);
        }
    }

    const getTrades = async () => {
        const response = await MindAxios.get(
            Env.paramUrl(`trades`, `?type=active`)
        );
        // console.log("response", response);
        if (response?.status == 200) {
            setTradeList(response?.data?.result?.paginated_items?.data);
        }
    }

    const searchData = (x) => {
        let text = x.toLowerCase();
        if (isProduct) {
            if (x) {
                let filteredData = productList.filter((item) => {
                    return item.name.toLowerCase().match(text);
                });
                setProductList(filteredData);
            } else {
                setProductList(currentData)
            }
        } else if (isAuction) {
            if (x) {
                let filteredData = auctionList.filter((item) => {
                    return item?.auctionable?.name?.toLowerCase()?.match(text);
                });
                setAuctionList(filteredData);
            } else {
                setAuctionList(currentData)
            }
        } else if (isTrade) {
            if (x) {
                let filteredData = tradeList.filter((item) => {
                    return item?.tradeables[0]?.tradeable?.name?.toLowerCase()?.match(text);
                });
                setTradeList(filteredData);
            } else {
                setTradeList(currentData)
            }
        }
    };

    const renderItem = ({ item, index }) => {
        const isEnd = index === productList.length - 1;
        return (
            <View style={{ marginBottom: isEnd ? hp(25) : 0 }}>
                <MarketCard name={item?.name}
                    ItemDetail={item?.productable}
                    borderWidth={selectedId === item?.id ? 2 : 0}
                    onPress={() => {
                        setSelectedItem(item?.productable);
                        setSelectedId(item?.id);
                        setType("Product");
                    }} />
            </View>
        );
    };

    const renderTrades = ({ item, index }) => {
        const isEnd = index === tradeList?.length - 1;
        return (
            <View style={{ marginBottom: isEnd ? hp(25) : 0 }}>
                <MarketCard user={item?.user}
                    ItemDetail={item?.tradeables[0]?.tradeable}
                    borderWidth={selectedId === item.id ? 2 : 0}
                    onPress={() => {
                        setSelectedItem(item?.tradeables[0]?.tradeable);
                        setSelectedId(item?.id);
                        setType("Trade");
                    }} />
            </View>
        );
    };

    const renderAuction = ({ item, index }) => {
        return (
            <View style={{ margin: 1 }}>
                <MarketCard user={item?.user}
                    ItemDetail={item?.auctionable}
                    borderWidth={selectedId === item?.id ? 2 : 0}
                    onPress={() => {
                        setSelectedItem(item?.auctionable);
                        setSelectedId(item?.id);
                        setType("Auction");
                    }} />
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme?.white}]}>
            <SimpleHeader
                showSearch={true}
                showFilter={false}
                title="Select Market Stamp"
                onChangeValue={(text) => searchData(text)}
                onPressBack={() => {
                    dispatch(allActions.DetailAction.StampDetail(selectedItem));
                    props.navigation.goBack()
                }} />
            <View style={styles.tabSection}>
                <TouchableOpacity
                    style={isProduct ? styles.selectedTab : styles.defaultTab}
                    onPress={() => {
                        setIsProduct(true);
                        setIsTrade(false);
                        setIsAuction(false);
                        setCurrentData(productList);
                        setSelectedItem(null);
                        setSelectedId(null);
                    }}
                >
                    <AppText
                        style={[
                            styles.tabText,
                            isProduct && { color: colors.cWhite },
                        ]}
                    >
                        On Sale
                    </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={isTrade ? styles.selectedTab : styles.defaultTab}
                    onPress={() => {
                        setIsProduct(false);
                        setIsTrade(true);
                        setIsAuction(false);
                        setCurrentData(tradeList);
                        setSelectedItem(null);
                        setSelectedId(null);
                    }}
                >
                    <AppText
                        style={[styles.tabText, isTrade && { color: colors.cWhite }]}
                    >
                        For Trade
                    </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={isAuction ? styles.selectedTab : styles.defaultTab}
                    onPress={() => {
                        setIsProduct(false);
                        setIsTrade(false);
                        setIsAuction(true);
                        setCurrentData(auctionList);
                        setSelectedItem(null);
                        setSelectedId(null);
                    }}
                >
                    <AppText
                        style={[
                            styles.tabText,
                            isAuction && { color: colors.cWhite },
                        ]}
                    >
                        {language?.onAuction}
                    </AppText>
                </TouchableOpacity>
            </View>
            {isProduct && <View>
                {!productList?.length ? (<AppText style={styles.inActiveText}>{language?.YouDontHhaveAanyActiveItem}</AppText>) : (
                    <FlatList
                        numColumns={2}
                        data={productList}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        extraData={selectedId}
                        style={{ paddingHorizontal: wp(3) }}
                    />
                )}
            </View>}

            {isTrade && <View >
                {!tradeList?.length ? (<AppText style={styles.inActiveText}>{language?.YouDontHhaveAanyActiveItem}</AppText>) : (
                    <FlatList
                        numColumns={2}
                        data={tradeList}
                        renderItem={renderTrades}
                        keyExtractor={(item) => item.id}
                        extraData={selectedId}
                        style={{ paddingHorizontal: wp(3) }}
                    />
                )}
            </View>}

            {isAuction && <View>
                {!auctionList?.length ? (<AppText style={styles.inActiveText}>{language?.YouDontHhaveAanyActiveItem}</AppText>) : (
                    <FlatList
                        numColumns={2}
                        data={auctionList}
                        renderItem={renderAuction}
                        keyExtractor={(item) => item.id}
                        extraData={selectedId}
                        style={{ paddingHorizontal: wp(3) }}
                    />
                )}
            </View>}
            {selectedItem && <View style={styles.bottomBtn}>
                <GradBtn label={language?.next} height={50} width={'90%'}
                    style={{ marginTop: 0 }}
                    onPress={() => {
                        selectedItem["type"] = type;
                        selectedItem["id"] = selectedId;
                        dispatch(allActions.DetailAction.StampDetail(selectedItem));
                        props.navigation.goBack();
                    }} />
            </View>}
        </View>
    )
}