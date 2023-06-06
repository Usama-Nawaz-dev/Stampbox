import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Image from "react-native-fast-image";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from "../../components/AppText";
import UserCard from "../../components/UserCard";
import colors from "../../constant/colors";
import { images } from "../../assets/images/Images";

import { useSelector } from "react-redux";
import AuthContext from "../Context/AuthContext";

export const FlagCard = (props) => {
  const { flagData, onPressOpen } = props;
  console.log(flagData, "flagData");
  let chkMediaLen = flagData?.flaggable?.medias?.length;
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const media_uri = chkMediaLen
    ? flagData?.flaggable?.medias[0]?.media_url
    : null;
  const title = flagData?.flaggable?.name;
  const owner = flagData?.flaggable?.user?.id == currentUser?.id;
  const {
    myState: { language },
  } = useContext(AuthContext);

  return (
    <View style={styles.card}>
      <View style={{ marginTop: 5 }}>
        <Image
          style={styles.stampImg}
          source={{
            uri: media_uri ? media_uri : "https://picsum.photos/600/600",
          }}
        />
      </View>
      <View style={styles.infoSection}>
        {/* <AppText style={styles.stampId}>asdlk</AppText> */}
        <AppText style={styles.ticketId}>{flagData?.flaggable?.uuid}</AppText>
        <AppText style={styles.nameText} numberOfLines={1}>
          {title ? title : "Deutsche Bundespost Rare Stamp 1931"}
        </AppText>
        <View>
          <AppText style={styles.text} numberOfLines={1}>
            Condition:{" "}
            {flagData?.flaggable?.condition
              ? flagData?.flaggable?.condition
              : "N/A"}
          </AppText>
          <AppText style={styles.text}>
            {language?.country}:{" "}
            {flagData?.flaggable?.country
              ? flagData?.flaggable?.country
              : "N/A"}
          </AppText>
        </View>
        <View style={styles.offerSection}>
          <AppText style={styles.offerText}>
            {language?.coins}{" "}
            {flagData?.flaggable?.coins_value
              ? flagData?.flaggable?.coins_value
              : "N/A"}
            {/* {kFormatter(ItemDetail?.offered_coins)} */}
          </AppText>
        </View>
      </View>
      <View style={{ paddingHorizontal: wp(2) }}>
        <UserCard starColor={colors.theme} User={flagData?.flaggable?.user} />
      </View>
      {/*       
      {owner ? (
        <View style={styles.bottomSection}>
          <AppText style={{ fontWeight: "500", color: colors.green }}>
            Owner
          </AppText>
        </View>
      ) : (
        <View style={styles.bottomSection}>
          <TouchableOpacity style={{marginRight: 5}}>
            <Image
              style={styles.icon}
              resizeMode="contain"
              source={images.Flag}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressOpen}>
            <AppText>Open Flag</AppText>
          </TouchableOpacity>
        </View>
      )}
 */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={{ marginRight: 5 }}>
          <Image
            style={styles.icon}
            resizeMode="contain"
            source={images.Flag}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressOpen}>
          <AppText>Open Flag</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cWhite,
    width: wp(45),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
    borderRadius: 10,
    margin: 1,
    marginTop: 10,
  },
  stampId: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.theme,
    alignSelf: "center",
  },
  stampImg: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoSection: {
    marginTop: -10,
    backgroundColor: colors.cWhite,
    paddingHorizontal: wp(2),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  nameText: {
    fontFamily: "IBMPlexSans-Regular",
    fontWeight: "500",
    color: colors.heading,
    marginBottom: 5,
  },
  ticketId: {
    fontSize: 12,
    // fontWeight: '500',
    color: colors.theme,
    marginBottom: 2,
    textAlign: "center",
  },
  text: {
    fontSize: 12,
    // fontWeight: '500',
    color: colors.lightText,
    marginBottom: 2,
  },
  infoText: {
    fontWeight: "400",
    color: colors.lightText,
    alignSelf: "center",
  },
  offerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItemDetails: "center",
    marginTop: 3,
  },
  offerText: {
    fontWeight: "700",
    color: colors.theme,
  },
  coinText: {
    fontSize: 10,
    color: colors.heading,
    fontWeight: "400",
  },
  bidBtn: {
    padding: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItemDetails: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 5,
  },
  btnImg: {
    height: 10,
    width: 10,
    resizeMode: "contain",
    marginRight: 5,
  },
  tradeText: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.btnText,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    height: 35,
    borderColor: colors.borderColor,
    paddingHorizontal: wp(2),
    marginTop: 10,
  },
  icon: {
    width: 15,
    height: 15,
  },
});
