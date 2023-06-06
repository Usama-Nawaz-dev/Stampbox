import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import { useDispatch } from "react-redux";
import { pushNavigation } from "../../../../constant/navigationMethods";

import { styles } from "./styles";
import ItemCard from "./ItemCard";
import Btn from "../../../../components/Btn";
import allActions from "../../../../redux/actions";
import AppText from "../../../../components/AppText";
import { light as theme } from "../../../../constant/colorsConfig";

const ShopSubtab = (props) => {
  const dispatch = useDispatch();
  const {
    data,
    showAdd,
    language,
    onPressAdd,
    onEndReached,
    ListFooterComponent,
  } = props;

  const renderList = () => {
    if (data?.length) {
      // render list
      return (
        <FlatList
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={data}
          ListFooterComponent={ListFooterComponent}
          onEndReached={onEndReached}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      );
    } else if (data?.length === 0) {
      // console.log("Published Stamps", data);
      return (
        <View style={styles.mainItem}>
          <AppText style={styles.itemText}>
            You have no Item listed at this time.
          </AppText>
          {showAdd && (
            <Btn
              label={language?.addStamp}
              fontSize={12}
              height={40}
              width={wp(36)}
              style={{ marginTop: hp(1.5) }}
              onPress={onPressAdd}
              iconLeft={
                <SimpleLineIcons
                  name="plus"
                  size={22}
                  color="#fff"
                  style={{ marginRight: 5 }}
                />
              }
            />
          )}
        </View>
      );
    } else {
      return (
        <View style={styles.mainItem}>
          <ActivityIndicator color={theme.theme} size="large" />
        </View>
      );
    }
  };

  const isEnd = (index) => {
    if (data?.length % 2 == 0) {
      return index === data?.length - 1 || index === data?.length - 2;
    } else {
      return index === data?.length - 1;
    }
  };
  const renderItem = ({ item, index }) => {
    // console.log("index", index);
    // console.log("isEnd(index)", isEnd(index));
    return (
      <ItemCard
        marginBottom={isEnd(index) ? hp(6) : 10}
        item={item}
        onPressDetail={() => {
          dispatch(allActions.DetailAction.StampDetail(item));
          pushNavigation("ProductDetail");
        }}
      />
    );
  };
  return <View style={{ width: wp(100) }}>{renderList()}</View>;
};

export { ShopSubtab };
