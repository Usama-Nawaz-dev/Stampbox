import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import UserCard from "../../../../../components/UserCard";
import { light as theme } from "../../../../../constant/colorsConfig";
import AppText from "../../../../../components/AppText";
import Helper from "../../../../Helper";
import moment from "moment";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";

const Info = ({ labelKey, label }) => {
  const { theme }= useContext(ThemeContext);
  return (
    <View style={{ flexDirection: "row" }}>
      <AppText
        style={{
          fontSize: 14,
          color: theme?.black,
          fontWeight: "600",
          marginRight: 5,
        }}
      >
        {labelKey}:
      </AppText>
      <AppText
        style={{
          fontSize: 14,
          color: theme.chalice,
          maxWidth: wp(70),
          //   fontWeight: "600",
          //   marginRight: 5,
        }}
      >
        {label}
      </AppText>
    </View>
  );
};
const PlacementCard = (props) => {
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { details } = props;
  const order_address = details?.order_meta?.shipping_address;
  const { theme }= useContext(ThemeContext);

  if (props?.details?.shipment) {
    var {
      details: {
        created_at,
        shipment: { amount, tracking_code, tracking_status },
        order_meta: {
          shipping_address: { address, city, country, state, zipcode, phone },
        },
        sender,
        receiver,
      },
      atEnd,
    } = props;
  }

  // console.log("at end", atEnd);
  return (
    <View
      style={{
        width: "90%",
        marginTop: 10,
        marginBottom: atEnd ? hp(5) : 0,
        backgroundColor: theme?.cardColor,
        alignSelf: "center",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
      }}
    >
      <View style={styles.innerContainer}>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <AppText style={{ color: theme?.black, fontWeight: "500" }}>
            Placed at:
          </AppText>
          <AppText style={{ marginLeft: 5, color: theme.chalice }}>
            {moment(details?.created_at).fromNow()}
          </AppText>
        </View>
        {tracking_code ? (
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <AppText style={{ color: theme?.black, fontWeight: "500" }}>
              Tracking id:{" "}
            </AppText>
            <AppText style={{ marginLeft: 5, color: theme.chalice }}>
              {tracking_code}
            </AppText>
          </View>
        ) : (
          <AppText style={{ color: theme?.black, fontWeight: "500" }}>
            Local Delivery
          </AppText>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <AppText style={{ color: theme.theme }}>Sender</AppText>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AppText style={{ color: theme.theme, fontWeight: "500" }}>
              {tracking_status
                ? Helper.capitalizeFirstLetter(tracking_status)
                : ""}
            </AppText>
            <AntDesign
              name="caretdown"
              style={{ color: "grey", alignSelf: "flex-start" }}
              size={10}
            />
          </View>
        </View>
        <UserCard User={details?.sender} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <AppText style={{ color: theme.theme }}>Receiver</AppText>
          {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AppText style={{ color: theme.theme }}>Processing</AppText>
            <AntDesign name="caretdown" style={{ color: "grey" }} />
          </View> */}
        </View>
        <UserCard User={details?.receiver} />
        {amount && (
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              alignItems: "center",
            }}
          >
            <AppText
              style={{ fontSize: 16, color: theme?.black, fontWeight: "500" }}
            >
              Shipping fee:{" "}
            </AppText>

            <AppText style={{ color: theme.theme, fontWeight: "700" }}>
              ${amount}
            </AppText>
          </View>
        )}
        <Text
          style={{
            fontSize: 20,
            color: theme?.black,
            fontWeight: "bold",
            // marginLeft: 10,
            marginTop: 15,
            paddingBottom: 10,
          }}
        >
          {language?.shippingDetails}
        </Text>

        <View
          style={{
            color: "black",
            fontWeight: "bold",
            // marginLeft: 10,
            paddingBottom: 15,
          }}
        >
          <Info labelKey="Address" label={order_address?.address} />
          <Info labelKey="City" label={order_address?.city} />
          <Info labelKey="State" label={order_address?.state} />
          <Info labelKey={language?.country} label={order_address?.country} />
          <Info labelKey="Zipcode" label={order_address?.zipcode} />
          <Info labelKey="Phone" label={order_address?.phone} />
        </View>
      </View>
    </View>
  );
};

export default PlacementCard;

const styles = StyleSheet.create({
  sender: {
    height: 40,
    width: "90%",
  },
  innerContainer: {
    width: "95%",
    // height: '95%',
    alignSelf: "flex-end",
    marginTop: 10,
  },
});
