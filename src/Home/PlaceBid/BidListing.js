import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import moment from "moment";

import AppText from "../../../components/AppText";
import UserCard from "../../../components/UserCard";

import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

const BidListing = (props) => {
  const { item, lastIndex } = props;

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  return (
    <View
      style={[styles.mainContainer, { marginBottom: lastIndex ? hp(2) : 0 }]}
    >
      <View style={[styles.container, { backgroundColor: theme?.cardColor }]}>
        <AppText style={[styles.timeText, { color: theme.theme }]}>
          {" "}
          {moment(item?.created_at).format("YYYY-MM-DD [at] h:mmA")}
        </AppText>
        <View style={styles.infoSection}>
          <View>
            <UserCard imgSize={hp(4)} User={item?.bidder} />
          </View>
          <View>
            <AppText style={[styles.bitText, { color: theme.dovGray }]}>
              {language?.bid}
            </AppText>
            <AppText style={[styles.amountText, { color: theme.theme }]}>
              ${item?.max_amount}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BidListing;

const styles = StyleSheet.create({
  mainContainer: {
    width: "90%",
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  container: {
    width: "100%",
    backgroundColor: "#fff",
    alignSelf: "center",
    shadowColor: "#000",
    marginTop: hp(1),
    borderRadius: 5,
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
    shadowOffset: { width: 0, height: 0 },
  },
  timeText: {
    marginLeft: hp(1),
    marginTop: hp(1),
    fontSize: 12,
  },
  infoSection: {
    margin: hp(1),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bitText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  amountText: {
    fontWeight: "600",
    fontSize: 12,
  },
});
