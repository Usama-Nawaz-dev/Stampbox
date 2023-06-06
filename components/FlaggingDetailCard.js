import React, { useContext } from "react";
import {
  Text,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from "./AppText";

import { placeHolder } from "../constant/Paths";
import colors from "../constant/colors";
import UserProfileIImage from "../components/UserProfileIImage";
import moment from "moment";
import ThemeContext from "../src/Context/ThemeContext";

const FlaggingDetailCard = ({ item, navigation, width, onPress }) => {
  const { flagger } = item;
  const { theme } = useContext(ThemeContext);
  let createdAt = moment(item?.created_at).format("DD-MM-YYYY [at] h:mm a");
  return (
    <Pressable
      style={[
        styles.cardHeader,
        { width: width ? width : wp(80), backgroundColor: theme?.cardColor },
      ]}
      onPress={
        onPress
          ? onPress
          : () => {
              navigation.navigate("Flag-Conversation");
            }
      }
    >
      <View style={{ flexDirection: "row" }}>
        <UserProfileIImage User={flagger} />
        <View style={{ marginLeft: 10 }}>
          <AppText style={{ fontSize: 17 }}>{flagger?.full_name}</AppText>
          <AppText>{flagger?.email}</AppText>
        </View>
        <View style={{ position: "absolute", right: 5 }}>
          <AppText
            style={{
              textAlign: "right",
              color:
                item?.current_activity == "resolved"
                  ? colors.green
                  : colors.theme,
            }}
          >
            {item?.current_activity}
          </AppText>
        </View>
      </View>
      <View style={{ marginTop: 20, marginBottom: 25 }}>
        <AppText style={{ fontSize: 16, fontWeight: "600" }}>
          {item?.reason}
        </AppText>
        <AppText>{item?.current_activity_message}</AppText>
      </View>
      <AppText>{createdAt}</AppText>
    </Pressable>
  );
};

export { FlaggingDetailCard };

const styles = StyleSheet.create({
  cardHeader: {
    backgroundColor: colors.white,
    width: wp(80),
    paddingLeft: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    padding: 5,
    marginRight: 10,
  },
});
