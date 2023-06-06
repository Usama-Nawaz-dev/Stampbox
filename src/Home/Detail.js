import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import {
  Image,
  PermissionsAndroid,
  FlatList,
  Keyboard,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Fontisto from "react-native-vector-icons/Fontisto";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import colors from "../../constant/colors";
import Header from "../../components/Header";
import AuthContext from "../Context/AuthContext";

const data = [
  {
    name: "Some Name",
    text: "Some Text Some Text Some Text Some Text Some Text Some Text",
    img: require("../../assets/icons/user.png"),
  },
];

const Detail = (props) => {
  const [arr, setarr] = useState(data);
  const [text, settext] = useState("");

  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const { myState: { language } } = useContext(AuthContext);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={{ marginLeft: 25, flexDirection: "row", margin: 5 }}>
      <Image
        style={[styles.userImg, { width: 30, height: 30 }]}
        source={item.img}
      />
      <View
        style={{
          marginLeft: 8,
          width: "85%",
          padding: 15,
          borderRadius: 10,
          backgroundColor: "#DCDCDC",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold", width: "95%" }}>{item.name}</Text>
          <TouchableOpacity
            onPress={() => edit(index)}
            style={{
              width: 30,
              height: 30,
              alignItems: "center",
              justifyContent: "center",
              top: -8,
            }}
          >
            <Entypo name="edit" size={18} />
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 12 }}>{item.text}</Text>
      </View>
    </View>
    // </View>
  );

  const updateArr = () => {
    var newOne = {
      name: "Some New Name",
      text: text,
      img: require("../../assets/icons/user.png"),
    };
    // console.log([...arr,newOne]);
    setarr([...arr, newOne]);
    settext("");
  };

  const edit = (i) => {
    arr.map((item, index) => {
      if (index === i) {
        settext(item.text);
      }
    });
  };

  
  const { userName, showBid, onPlaceBid, onTrade, item } = props;
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header
        left={10}
        title={language?.feedsDetail}
        onPress={() => props.navigation.goBack()}
      />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1, top: 5 }}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.upperSection}>
              <Image
                style={styles.userImg}
                source={require("../../assets/icons/user.png")}
              />
              <View style={styles.nameSection}>
                <Text
                  style={{
                    fontSize: 12,
                  }}
                >
                  {userName ? userName : "Edie brown"}
                </Text>
                <View style={styles.timeSection}>
                  <Text style={styles.timeText}>1h ago</Text>
                  <Entypo name="dot-single" size={14} color="grey" />
                  <Fontisto name="world" size={12} color={"orange"} />
                </View>
              </View>
            </View>
            <Entypo name="dots-three-horizontal" size={18} />
          </View>
          {item?.feedable_type !== "Auction" && (
            <Text style={styles.descriptionText}>
              {item?.feedable?.description || item?.feedable?.desc}
            </Text>
          )}
          <Image
            style={styles.postImage}
            source={{ uri: "https://picsum.photos/600/600" }}
          />
          <Text style={styles.dateText}>2022-07-21 at 17:31 PM</Text>
          <Text style={styles.stampInfoText}>Berlin's Stam 5 Cent</Text>
          {/* {showBid ? (
          <Btn
            label="Place Bid"
            fontSize={12}
            height={hp(3.5)}
            width={wp(22)}
            style={styles.button}
            onPress={onPlaceBid}
          />
        ) : (
          <Btn
            label="Trade"
            fontSize={12}
            height={hp(3.5)}
            width={wp(25)}
            style={styles.button}
            iconLeft={<AntDesign name="swap" color={"#fff"} size={18} />}
            onPress={onTrade}
          />
        )} */}
          <View style={styles.countSection}>
            <View style={styles.rowSection}>
              <Feather name="thumbs-up" color={"orange"} size={12} />
              <Text style={styles.likeCounter}>0</Text>
              <Text style={{ fontSize: 10 }}>{language?.likes}</Text>
            </View>
            <Text style={styles.commentCounter}>0 {language?.comment}</Text>
          </View>
          <View style={styles.horizontalLine}></View>
          <View style={styles.bottomSection}>
            <View style={styles.rowSection}>
              <Feather name="thumbs-up" size={16} />
              <Text style={styles.publicText}>{language?.like}</Text>
            </View>
            <View style={styles.rowSection}>
              <MaterialCommunityIcons name="comment-text-outline" size={16} />
              <Text style={styles.publicText}>{language?.comment}</Text>
            </View>
            <View style={styles.rowSection}>
              <MaterialCommunityIcons name="share-outline" size={16} />
              <Text style={styles.publicText}>{language?.share}</Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 4, marginTop: 20 }}>
          <FlatList
            // style={{}}
            showsVerticalScrollIndicator={false}
            initialNumToRender={4}
            data={arr}
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
          //   keyExtractor={(item) => `${item.cuisine_id}`}
          />
        </View>
      </KeyboardAwareScrollView>
      <View
        style={{
          justifyContent: "flex-end",
          padding: 8,
          alignItems: "center",
          marginBottom: keyboardStatus ? "65%" : 0,
        }}
      >
        <View
          style={{
            width: "97%",
            minHeight: 50,
            maxHeight: "50%",
            alignItems: "center",
            flexDirection: "row",
            borderRadius: 25,
            backgroundColor: "#DCDCDC",
          }}
        >
          <TextInput
            value={text}
            onChangeText={(val) => settext(val)}
            multiline={true}
            style={{ width: "85%", marginLeft: 15, padding: 8, fontSize: 12 }}
            placeholder={language?.write_a_comment+"..."}
          />
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.theme,
              borderRadius: 25,
            }}
            onPress={() => updateArr()}
          >
            {/* replace it woth icon */}
            <FontAwesome name="send" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default Detail;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    // paddingTop: wp(2),
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(3),
  },
  upperSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userImg: {
    width: hp(4.2),
    height: hp(4.2),
    borderRadius: hp(10),
  },
  nameSection: {
    // marginTop: hp(-0.5),
    marginLeft: hp(1),
  },
  timeSection: {
    // marginTop: hp(0.3),
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 8,
    color: "grey",
    // marginRight: hp(0.3)
  },
  descriptionText: {
    marginTop: hp(0.5),
    fontSize: 12,
    marginLeft: wp(2),
  },
  postImage: {
    width: wp(100),
    height: hp(25),
    marginTop: hp(0.5),
    resizeMode: "contain",
  },
  dateText: {
    fontSize: 10,
    color: colors.theme,
    marginTop: hp(0.5),
    marginLeft: wp(2),
  },
  stampInfoText: {
    marginTop: hp(0.5),
    marginLeft: wp(2),
    fontSize: 16,
  },
  button: {
    marginTop: hp(1),
    marginLeft: wp(1.5),
  },
  countSection: {
    marginTop: hp(0.5),
    paddingHorizontal: wp(2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCounter: {
    marginHorizontal: hp(0.3),
    fontSize: 10,
  },
  commentCounter: {
    fontSize: 10,
    color: "grey",
  },
  horizontalLine: {
    flexDirection: "row",
    marginHorizontal: wp(3),
    borderBottomWidth: 0.5,
    marginVertical: hp(1),
    borderColor: "grey",
  },
  bottomSection: {
    paddingHorizontal: wp(2),
    paddingBottom: hp(1),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  publicText: {
    marginLeft: hp(0.5),
    fontSize: 12,
  },
});
