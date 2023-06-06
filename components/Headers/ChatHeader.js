import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import UserComp from "../../src/Chat/UserComp";
import { images } from "../../assets/images/Images";
import Helper from "../../src/Helper";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import colors from "../../constant/colors";
import { useSelector } from "react-redux";

const ChatHeader = ({ item, label, label2, onPressBack, online, icon }) => {
  const usersOnline = useSelector((state) => state.DataReducer.users_list);
  if (usersOnline?.length) {
    let userObj = usersOnline?.find((obj) => obj.id === item?.type);
    var onlineStatus = userObj?.onlineStatus;
  }

  return (
    <ImageBackground style={styles.bgImage} source={images.Header}>
      <View style={styles.topSection}>
        <View style={styles.titleSection}>
          <TouchableOpacity onPress={onPressBack}>
            <Image
              source={images.ArrowLeft}
              resizeMode="contain"
              style={{ height: 18, width: 8, marginRight: wp(3) }}
            />
          </TouchableOpacity>
          <UserComp
            label={label}
            label2={label2}
            online={online}
            item={item}
            fontColor="#fff"
            active={onlineStatus}
          />
        </View>
        {icon ? icon : null}
      </View>
    </ImageBackground>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgImage: {
    height: 100,
    width: wp(100),
    top: -20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "500",
    fontFamily: "IBMPlexSans-Regular",
    color: colors.cWhite,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 35,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp(3),
  },
});
