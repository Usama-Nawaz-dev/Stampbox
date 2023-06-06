import React, { useContext } from "react";
import { View, ScrollView } from "react-native";

import { styles } from "./styles";
import AppText from "../../../../components/AppText";
import UserCard from "../../../../components/UserCard";

import moment from "moment";
import { useSelector } from "react-redux";

import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";

export const AboutTab = () => {
  const storeDetail = useSelector((state) => state.DetailReducer.storeDetail);
  const iUser = useSelector((state) => state.ApiReducer.user);

  let currentUser = null;
  if (iUser?.id === storeDetail?.user_id) {
    currentUser = iUser;
  } else {
    currentUser = storeDetail?.owner;
  }

  const { theme } = useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const joinDate = moment(currentUser?.created_at).format(
    "YYYY-MM-DD [at] h:mmA"
  );

  const openingTime = storeDetail.open_hours
    ? storeDetail.open_hours?.split("T")
    : false;
  const openAt = openingTime ? formatTime(openingTime[0]) : false;
  const closeAt = openingTime ? formatTime(openingTime[1]) : false;

  function formatTime(timeString) {
    const [hourString, minute] = timeString.split(":");
    const hour = +hourString % 24;
    return (hour % 12 || 12) + ":" + minute + (hour < 12 ? " AM" : " PM");
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme?.white }]}>
      <AppText style={styles.titleText}>About Store</AppText>
      <AppText style={styles.description}>{storeDetail?.description}</AppText>
      <AppText style={styles.locationText}>
        Address:{" "}
        <AppText style={[styles.infoText, { color: theme?.lightText }]}>
          {storeDetail?.address?.address}
        </AppText>
      </AppText>
      <AppText style={styles.text}>
        {language?.country}:{" "}
        <AppText style={[styles.infoText, { color: theme?.lightText }]}>
          {" "}
          {storeDetail?.address?.country}
        </AppText>
      </AppText>
      <AppText style={styles.text}>
        Items Sold:{" "}
        <AppText style={[styles.infoText, { color: theme?.lightText }]}>
          0
        </AppText>
      </AppText>
      <AppText style={styles.text}>
        Store Type:{" "}
        <AppText style={[styles.infoText, { color: theme?.lightText }]}>
          {storeDetail?.type}
        </AppText>
      </AppText>
      {openingTime ? (
        <AppText style={styles.text}>
          Opening Hours:{" "}
          <AppText style={[styles.infoText, { color: theme?.lightText }]}>
            {openAt}
            {" to "}
            {closeAt}
          </AppText>
        </AppText>
      ) : null}
      <View style={styles.userSection}>
        <AppText style={styles.sellerText}>{"Seller Information"}</AppText>
        <UserCard
          nameStyle={{ fontSize: 14 }}
          starSize={12}
          User={storeDetail?.owner}
        />
      </View>
      <AppText style={styles.locationText}>
        Address:{" "}
        <AppText style={[styles.infoText, { color: theme?.lightText }]}>
          {currentUser?.addresses?.length
            ? currentUser?.addresses[0]?.address
            : "N/A"}
        </AppText>
      </AppText>
      <AppText style={styles.text}>
        {language?.country}:{" "}
        <AppText style={[styles.infoText, { color: theme?.lightText }]}>
          {currentUser?.addresses?.length
            ? currentUser?.addresses[0]?.city
            : "N/A"}
        </AppText>
      </AppText>
      {currentUser?.user_detail ? (
        <AppText style={styles.text}>
          Member ID:{" "}
          <AppText style={[styles.infoText, { color: theme?.lightText }]}>
            {currentUser?.user_detail?.member_id}
          </AppText>
        </AppText>
      ) : null}
      <AppText style={styles.text}>
        Contact:{" "}
        <AppText style={[styles.infoText, { color: theme?.lightText }]}>
          {currentUser?.phone}
        </AppText>
      </AppText>
      <AppText style={styles.text}>
        Member Since:{" "}
        <AppText style={[styles.infoText, { color: theme?.lightText }]}>
          {joinDate}
        </AppText>
      </AppText>
      <AppText style={styles.text}>
        Email:{" "}
        <AppText style={[styles.infoText, { color: theme?.lightText }]}>
          {currentUser?.email}
        </AppText>
      </AppText>
      {currentUser?.followers_count >= 0 ? (
        <AppText style={styles.text}>
          Followers:{" "}
          <AppText style={[styles.infoText, { color: theme?.lightText }]}>
            {currentUser?.followers_count}
          </AppText>
        </AppText>
      ) : null}
    </ScrollView>
  );
};
