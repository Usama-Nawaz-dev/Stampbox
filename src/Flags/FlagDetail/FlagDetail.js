import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Modal,
} from "react-native";

import { styles } from "./styles";
import colors from "../../../constant/colors";
import AppText from "../../../components/AppText";
import BorderBtn from "../../../components/BorderBtn";
import { EventHeader, InterestItem } from "../../../components";
import { FlaggingDetailCard } from "../../../components/FlaggingDetailCard";
import Feather from "react-native-vector-icons/Feather";
import { ImageBackground } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { images } from "../../../assets/images/Images";
import { LineSaperator } from "../../../components/LineSaperator";
import { sort_by } from "../../utils/constant";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import OnlyDropDown from "../../../components/OnlyDropDown";
import MindAxios from "../../../api/MindAxios";
import Env from "../../../api/Env";
import AuthContext from "../../Context/AuthContext";

const InternetTopics = ["100 Years Stamps", "50 Years Stamps"];
const DATA = [1, 2, 3, 4];
export const FlagDetail = (props) => {
  const { data } = props.route.params;
  console.log(data, "flag data->>>>>");
  const [sort_value, setSortValue] = useState("Flags");
  const [sort_items, setSortItems] = useState(sort_by);
  const [modalVisible, setModalVisible] = useState(false);
  const [flagData, setFlagData] = useState(null);
  const user = useSelector((state) => state.ApiReducer.user);
  const dispatch = useDispatch();
  const {
    myState: { language },
  } = useContext(AuthContext);

  const media_uri = data?.flaggable?.medias[0]?.media_url;
  useFocusEffect(
    useCallback(() => {
      (async () => {
        // alert('Screen was focused');
        const res = await MindAxios.get(
          Env.createUrl(
            `flag-tickets?user_id=${user?.id}&type=${data?.type}&flaggable_type=StampItem`
          )
        );
        // console.log('res', res)
        if (res?.status === 200) {
          const _data = res?.data?.result?.paginated_items?.data;
          console.log("res", _data);
          setFlagData(_data);
        } else {
          alert(language?.serverError);
        }
      })();

      return () => {
        // alert('Screen was unfocused');
      };
    }, [])
  );

  const onFilterPress = () => {
    setModalVisible(!modalVisible);
  };
  const flaggingDetailData = [
    {
      name: "Dev Test",
      email: "jiwiwi1283@gmail.com",
      title: "Inaccurate Image quality",
      subTitle: "Some",
      date: "202212-05 at 17:57",
    },
    {
      name: "Dev Test",
      email: "jiwiwi1283@gmail.com",
      title: "Inaccurate Image quality",
      subTitle: "Some",
      date: "202212-05 at 17:57",
    },
    {
      name: "Dev Test",
      email: "jiwiwi1283@gmail.com",
      title: "Inaccurate Image quality",
      subTitle: "Some",
      date: "202212-05 at 17:57",
    },
  ];
  return (
    <View style={styles.container}>
      <EventHeader
        title="Flag Detail"
        pickerIcon={
          <OnlyDropDown
            data={sort_by}
            value={sort_value}
            onChangeText={(value) => setSortValue(value)}
            position={-4}
            width="40%"
            left={wp(14)}
            iconRight={5}
            icon={() => <Feather name="filter" size={20} color="#fff" />}
          />
        }
        onFilterPress={onFilterPress}
        // onEdit={() => {
        //   dispatch(allActions.DataAction.SelectedImg(medias));
        //   props.navigation.replace("EditEvent", { detail: detail });
        // }}
        onPressBack={() => props.navigation.goBack()}
        // onDelete={removeEventAlert}
      />
      <ScrollView>
        <ImageBackground
          style={styles.stampImg}
          resizeMode="stretch"
          source={{
            uri: media_uri ? media_uri : "https://picsum.photos/600/600",
          }}
        >
          <View style={styles.blurSection} />
        </ImageBackground>
        <ScrollView>
          <View style={styles.detailsSection}>
            <AppText style={styles.description}>Item Description:</AppText>
            <View style={styles.infoSection}>
              <View style={styles.infoContainer}>
                <AppText style={styles.text}>{language?.country}:</AppText>
                <AppText style={styles.text}>{language?.year}:</AppText>
                <AppText style={styles.text}>{language?.scott}:</AppText>
                <AppText style={styles.text}>Qty:</AppText>
                <AppText style={styles.text}>Shape:</AppText>
                <AppText style={styles.text}>Denimination:</AppText>
                <AppText style={styles.text}>{language?.perforation}:</AppText>
                <AppText style={styles.text}>Color:</AppText>
                <AppText style={styles.text}>Condition:</AppText>
                <AppText style={styles.text}>Grade:</AppText>
                <AppText style={styles.text}>Format:</AppText>
                <AppText
                  style={[styles.text, { marginTop: 5, marginBottom: 25 }]}
                >
                  Status:
                </AppText>
                <AppText style={styles.text}>Totol Stamps:</AppText>
                <AppText style={styles.text}>Coin value:</AppText>
                <AppText style={styles.text}>{language?.typeOfIssue}:</AppText>
                <AppText style={styles.text}>Description:</AppText>
              </View>
              <View>
                <AppText style={styles.infoText}>
                  {data?.flaggable?.country ? data?.flaggable?.country : "N/A"}
                </AppText>
                <AppText style={styles.infoText}>
                  {data?.flaggable?.year_issued}
                </AppText>
                <AppText style={styles.infoText}>
                  {data?.flaggable?.catalogue_number[0]?.number}
                </AppText>
                <AppText style={styles.infoText}>
                  {data?.flaggable?.quality[0]}
                </AppText>
                <AppText style={styles.infoText}>
                  {data?.flaggable?.shape}
                </AppText>
                <AppText style={styles.infoText}>
                  {data?.flaggable?.denomination}
                </AppText>
                <AppText
                  style={[styles.infoText, { maxWidth: wp(70) }]}
                  numberOfLines={1}
                >
                  {data?.flaggable?.perforation}
                </AppText>
                <AppText style={styles.infoText}>
                  {data?.flaggable?.color}
                </AppText>
                <AppText style={styles.infoText}>
                  {data?.flaggable?.condition}
                </AppText>
                <AppText
                  style={[styles.infoText, { maxWidth: wp(70) }]}
                  numberOfLines={1}
                >
                  {data?.flaggable?.grade}
                </AppText>
                <AppText style={styles.infoText}>
                  {data?.flaggable?.format}
                </AppText>
                <AppText
                  style={[styles.infoText, { marginTop: 5, marginBottom: 5 }]}
                >
                  {data?.flaggable?.status.toString()}
                </AppText>
                <AppText
                  style={[styles.infoText, { maxWidth: wp(70) }]}
                  numberOfLines={1}
                >
                  {data?.flaggable?.total_stamps_issued}
                </AppText>
                <AppText style={styles.infoText}>
                  {data?.flaggable?.coins_value}
                </AppText>
                <AppText style={styles.infoText}>
                  {data?.flaggable?.issue_type}
                </AppText>
                <AppText
                  style={[styles.infoText, { maxWidth: wp(70) }]}
                  numberOfLines={1}
                >
                  {data?.flaggable?.description}
                </AppText>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 50, marginBottom: 30 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: wp(2),
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <AppText style={{ marginRight: 10 }}>Price</AppText>
                <AppText>$10</AppText>
              </View>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity>
                  <Image
                    style={styles.icon}
                    resizeMode="contain"
                    source={images.Heart}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    style={styles.icon}
                    resizeMode="contain"
                    source={images.Flag}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <AppText style={styles.commentText}>
              24 {language?.comments}
            </AppText>
          </View>
          <View style={{ marginHorizontal: wp(2) }}>
            <AppText>Topics of internet</AppText>
            <View style={{ flexDirection: "row" }}>
              {InternetTopics.map((item, index) => {
                return (
                  <View
                    keys={index}
                    style={{ marginTop: 10, marginRight: wp(3) }}
                  >
                    <InterestItem item={item} />
                  </View>
                );
              })}
            </View>
          </View>
          <LineSaperator />
          <View
            style={{
              paddingHorizontal: wp(5),
              marginTop: 10,
              marginBottom: 30,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 5,
                marginBottom: 10,
              }}
            >
              <AppText>Flagging Detail</AppText>
              <AppText>
                Filter:{sort_value?.value ? sort_value?.value : sort_value}
              </AppText>
            </View>
            <FlatList
              horizontal
              data={flagData}
              showsHorizontalScrollIndicator={false}
              style={{ paddingHorizontal: wp(0.2), paddingVertical: hp(0.5) }}
              renderItem={({ item }) => (
                <FlaggingDetailCard item={item} navigation={props.navigation} />
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};
