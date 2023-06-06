import React, { useContext } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { images } from "../../assets/images/Images";
import AuthContext from "../../src/Context/AuthContext";
import ThemeContext from "../../src/Context/ThemeContext";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export function DetailCard(props) {
  const {
    details: {
      user: { image_url, username, full_name },
      tradeables: [
        {
          tradeable: { medias: medias, name, year_issued, country },
        },
      ],
    },
  } = props;
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  //   console.log("medias", medias);
  return (
    <View style={[styles.cardView, { backgroundColor: theme?.cardColor }]}>
      {/* ***********Image********** */}
      {medias?.length ? (
        <Image style={styles.Image} source={{ uri: medias[0]?.media_url }} />
      ) : (
        <Image style={styles.Image} source={images.bigNoImg} />
      )}
      <View
        style={{
          height: hp(10),
          width: "100%",
          padding: hp(2),
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: theme?.black,
          }}
        >
          {name}
        </Text>
        <View
          style={{
            width: "100%",
            //height: 100,
            marginTop: hp(1),
          }}
        >
          <Text style={{ color: theme?.black }}>
            {language?.country}: {country}
          </Text>
          <Text style={{ color: theme?.black }}>
            {language?.year}: {year_issued}
          </Text>
        </View>

        <View
          style={{
            width: "100%",
            //height: 100,
            paddingTop: hp(2),
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: hp(5.5),
              height: hp(5.5),
              borderRadius: hp(10),
            }}
            source={{ uri: image_url }}
          />
          <View style={{ marginLeft: wp(3) }}>
            <Text style={{ color: theme?.black }}>{language?.owner}</Text>
            <Text
              style={{
                fontSize: 14,
                color: theme?.black,
                fontWeight: "700",
              }}
            >
              {username ? username : full_name}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    // flex: 1,
  },
  cardView: {
    width: "90%",
    height: hp(45),
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    marginTop: hp(2),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  Image: {
    width: "100%",
    height: hp(25),
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
});
