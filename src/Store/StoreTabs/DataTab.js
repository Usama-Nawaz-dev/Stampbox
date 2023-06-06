import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, Dimensions } from 'react-native'

import colors from '../../../constant/colors';

const { height, width } = Dimensions.get('window');

import Env from '../../../api/Env';
import MindAxios from '../../../api/MindAxios';
import Helper from '../../Helper';
import allActions from '../../../redux/actions';

import Btn from '../../../components/Btn';
import { useSelector, useDispatch } from "react-redux";

import AppText from '../../../components/AppText';
import TradeCard from '../../../components/TradeCard';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AuthContext from '../../Context/AuthContext';


export const DataTab = (props) => {
    const { storeId, published } = props;
    const dispatch = useDispatch();
    const { myState: { language } } = useContext(AuthContext);

    const [productList, setProductList] = useState(null)

    useEffect(() => {
        (async () => {
            dispatch(allActions.DataAction.ActivityModal(true));
            const response = await MindAxios.get(
                Env.paramUrl(`products`, `?store_id=${storeId}&is_published=${published}`)
            );
            if (response?.status == 200) {
                let _data = response?.data?.result?.paginated_items?.data;
                setProductList(_data);
                dispatch(allActions.DataAction.ActivityModal(false));
            }
        })();
    }, []);

    const renderItem = ({ item, index }) => {
        const isEnd = index === productList.length - 1;
        return (<View style={{
            marginRight: wp(3),
            marginTop: hp(1.5),
            marginBottom: isEnd ? hp(3) : 0
        }}>
            <TradeCard Item={item} trade={false} />
        </View>
        )
    }
    return (
        <View style={styles.container}>
            {productList?.length ? <FlatList
                data={productList}
                style={{ paddingHorizontal: wp(3) }}
                renderItem={renderItem}
                numColumns={2}
                showsVerticalScrollIndicator={false}
            /> :
                <View style={styles.mainItem}>
                    <AppText style={styles.itemText}>You have no Item listed at this time</AppText>
                    <Btn label={language?.addStamp} fontSize={12} height={40} width={wp(36)}
                        style={{ marginTop: hp(1.5) }}
                        iconLeft={<SimpleLineIcons name='plus'
                            size={22} color="#fff" style={{ marginRight: 5 }} />}
                    />
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cWhite,
        width: width,
        paddingTop: hp(2),
    },
    mainItem: {
        width: width,
        flex: 1,
        backgroundColor: colors.cWhite,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.lightText
    },

})