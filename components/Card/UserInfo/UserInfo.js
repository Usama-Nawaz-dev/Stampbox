import React, { useState, useRef, useContext } from "react";
import { TouchableOpacity, View, Image, Text, ScrollView } from "react-native";

import { styles } from "./styles";
import { images } from "../../../assets/images/Images";

import Feather from "react-native-vector-icons/Feather";
import AppText from "../../AppText";

import colors from "../../../constant/colors";
import moment from "moment";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { InterestItem } from "../InterestItem";
import { Transition, Transitioning } from "react-native-reanimated";
import AuthContext from "../../../src/Context/AuthContext";
import ThemeContext from "../../../src/Context/ThemeContext";
// import { dark as theme } from "../../../constant/colorsConfig";

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={200} />
    <Transition.Change />
    <Transition.Out type="fade" durationMs={200} />
  </Transition.Together>
);

export const UserInfo = (props) => {
  const [showDetail, setShowDetail] = useState(false);
  const ref = useRef();

  const { userData } = props;
  const { theme, mode } = useContext(ThemeContext);

  const address = userData?.addresses?.length ? userData?.addresses[0] : null;
  const member = moment(userData?.created_at).format("YYYY-MM-DD [at] h:mmA");

  const categoriesData = userData?.categories;
  const topicsData = userData?.topics;
  const countriesData = userData?.interested_in_countries;
  const {
    myState: { language },
  } = useContext(AuthContext);

  return (
    <Transitioning.View
      ref={ref}
      transition={transition}
      style={[styles.card, { backgroundColor: theme?.cardColor }]}
    >
      <TouchableOpacity
        style={styles.header}
        onPress={() => {
          ref.current.animateNextTransition();
          setShowDetail(!showDetail);
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={images.User} style={styles.userIcon} />
          <Text style={[styles.heading, { color: theme?.black }]}>
            User Info
          </Text>
        </View>
        <Feather
          name={showDetail ? "chevron-up" : "chevron-down"}
          size={20}
          style={{ marginTop: 5, color: theme?.black }}
        />
      </TouchableOpacity>
      {showDetail && (
        <View style={styles.infoSection}>
          <Text style={[styles.about, { color: theme?.black }]}>
            About {userData?.first_name}
          </Text>
          <AppText style={styles.aboutDetail}>{userData?.description}</AppText>
          <View style={styles.detailSection}>
            <AppText style={styles.about}>{language?.details}</AppText>
            <View style={styles.userDetail}>
              <View style={{ width: wp(30) }}>
                <AppText style={styles.infoText}>Phone:</AppText>
                <AppText style={styles.infoText}>Address:</AppText>
                <AppText style={styles.infoText}>City:</AppText>
                <AppText style={styles.infoText}>Language:</AppText>
                <AppText style={styles.infoText}>{language?.country}:</AppText>
                <AppText style={styles.infoText}>Member Since:</AppText>
                <AppText style={styles.infoText}>Account Type:</AppText>
                <AppText style={styles.infoText}>Total Transaction:</AppText>
              </View>
              <View>
                <AppText style={styles.infoText1}>
                  {userData?.phone ? userData?.phone : "N/A"}
                </AppText>
                <AppText
                  style={[styles.infoText1, { maxWidth: wp(60) }]}
                  numberOfLines={1}
                >
                  {address?.address ? address?.address : "N/A"}
                </AppText>
                <AppText style={styles.infoText1}>
                  {address?.city ? address?.city : "N/A"}
                </AppText>
                <AppText style={styles.infoText1}>
                  {userData?.language ? userData?.language : "N/A"}
                </AppText>
                <AppText style={styles.infoText1}>
                  {address?.country ? address?.country : "N/A"}
                </AppText>
                <AppText style={styles.infoText1}>{member}</AppText>
                <AppText style={styles.infoText1}>
                  {userData?.mrs_badge ? userData?.mrs_badge : "N/A"}
                </AppText>
                <AppText style={styles.infoText1}>0</AppText>
              </View>
            </View>
          </View>
          <View style={styles.detailSection}>
            <AppText style={styles.about}>{language?.categories}</AppText>
            {categoriesData ? (
              <ScrollView
                contentContainerStyle={styles.list}
                showsHorizontalScrollIndicator={false}
              >
                {categoriesData.map((item, index) => {
                  return (
                    <View style={{ marginTop: 10, marginRight: wp(3) }}>
                      <InterestItem item={item?.name} />
                    </View>
                  );
                })}
              </ScrollView>
            ) : (
              <AppText style={styles.emptyList}>
                User don't have any selected Category.
              </AppText>
            )}
          </View>
          <View style={styles.detailSection}>
            <AppText style={styles.about}>Topics of Interest</AppText>
            {topicsData ? (
              <ScrollView
                contentContainerStyle={styles.list}
                showsHorizontalScrollIndicator={false}
              >
                {topicsData.map((item, index) => {
                  return (
                    <View style={{ marginTop: 10, marginRight: wp(3) }}>
                      <InterestItem item={item?.name} />
                    </View>
                  );
                })}
              </ScrollView>
            ) : (
              <AppText style={styles.emptyList}>
                User don't have any selected Topic.
              </AppText>
            )}
          </View>
          <View style={[styles.detailSection, { marginBottom: 20 }]}>
            <AppText style={styles.about}>
              {language?.countriesOfInterest}
            </AppText>
            {countriesData ? (
              <ScrollView
                contentContainerStyle={styles.list}
                showsHorizontalScrollIndicator={false}
              >
                {countriesData.map((item, index) => {
                  return (
                    <View style={{ marginTop: 10, marginRight: wp(3) }}>
                      <InterestItem item={item?.name} />
                    </View>
                  );
                })}
              </ScrollView>
            ) : (
              <AppText style={styles.emptyList}>
                User don't have any selected Country.
              </AppText>
            )}
          </View>
        </View>
      )}
    </Transitioning.View>
  );
};
