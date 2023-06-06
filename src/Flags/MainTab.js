import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { data } from "./local";
import { BountyCard } from "../Market/BountiesTab/BountyCard";
import moment from "moment";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FlagCard } from "./FlagCard";
import { useFocusEffect } from "@react-navigation/native";
import MindAxios from "../../api/MindAxios";
import Env from "../../api/Env";
import Empty from "../../components/Empty";
import allActions from "../../redux/actions";
import Helper from "../Helper";
import { languages } from "../../constant/staticData";
const { width } = Dimensions.get("window");

// const Data = [...Array(5).keys()];
const MainTab = (props) => {
  const dispatch = useDispatch();
  const [flagData, setFlagData] = useState(null);

  // if(props.type == "receive"){
  //   console.log(props.type, 'type');
  // }
  const user = useSelector((state) => state.ApiReducer.user);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const res = await MindAxios.get(
          Env.createUrl(`flag-tickets?user_id=${user?.id}&type=${props?.type}`)
        );
        if (res?.status === 200) {
          const _data = res?.data?.result?.paginated_items?.data;
          console.log("props?.type", props?.type);
          console.log("_data===>", _data);
          if (_data?.length) {
            let compare = (item, current) =>
              item.flaggable.uuid === current.flaggable.uuid;
            let filtered = Helper.filteredArr(_data, compare);
            //  console.log('filtered', filtered)
            setFlagData(filtered);
          }
        } else {
          alert(languages?.serverError);
        }
      })();

      return () => {
        // alert('Screen was unfocused');
      };
    }, [])
  );

  // console.log(filteredArr(arr))
  const isEnd = (index) => {
    if (flagData.length % 2 == 0) {
      return index === flagData.length - 1 || index === flagData.length - 2;
    } else {
      return index === flagData.length - 1;
    }
  };
  return (
    <View
      style={{
        width: width,
        // backgroundColor: name == "All" ? "orange" : "skyblue",
      }}
    >
      {/* <Text>This is {props.type}</Text> */}

      {flagData?.length ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {flagData?.map((item, index) => {
              // let isEnd = index == data.length - 1 ? hp(5) : null;
              let createdAt = moment(item?.created_at).format(
                "YYYY-MM-DD [at] h:mmA"
              );
              return (
                <>
                  <View
                    style={{
                      marginBottom: isEnd(index) ? hp(5) : 5,
                      width: "50%",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: index == 0 || index == 1 ? 20 : 0,
                    }}
                  >
                    <FlagCard
                      flagData={item}
                      navigation={props.navigation}
                      onPressOpen={() => {
                        console.log("item", item);
                        item.type = props?.type;
                        dispatch(
                          allActions.DetailAction.StampDetail(item?.flaggable)
                        );
                        dispatch(allActions.SheetAction.FlagType(props?.type));
                        props.navigation.navigate("StampDetail");
                      }}
                    />
                  </View>
                </>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <Empty />
      )}
    </View>
  );
};

export { MainTab };

const styles = StyleSheet.create({});
