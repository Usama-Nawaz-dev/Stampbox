import React, { useContext } from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import moment from "moment";

import { InfoText } from "./InfoText";
import { SimpleBtn } from "./SimpleBtn";
import ThemeContext from "../../../../Context/ThemeContext";

export const TicketCard = ({ item, index, navigation }) => {
  const { theme } = useContext(ThemeContext);
  console.log(item);

  return (
    <View
      style={[
        styles.shadow,
        {
          width: wp(92),
          borderRadius: 10,
          alignSelf: "center",
          marginTop: hp(1.5),
          backgroundColor: theme.cardColor,
        },
      ]}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <View style={{ height: 10 }} />
        <View
          style={{
            flex: 0.4,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 10,
          }}
        >
          <View>
            <Text style={{ color: "#a6a6a6" }}>
              Ticket id. <Text style={{ color: theme.black }}>{item?.uid}</Text>
            </Text>

            <Text style={{ color: "#a6a6a6", fontSize: 11, fontWeight: "300" }}>
              {moment(item?.created_at).format("YYYY-MM-DD [at] h:mm a")}
            </Text>
          </View>
          <SimpleBtn
            title={item?.status}
            bg={
              item?.status === "open"
                ? "rgba(178,84,58,0.3)"
                : "rgba(60,171,53,0.3)"
            }
            fontColor={item?.status === "open" ? "#B2543A" : "#3CAB35"}
            onPress={() =>
              navigation.navigate("TicketDetail", { ticket: item })
            }
          />
        </View>
        <View style={{ height: 10 }} />
        <View
          style={{
            flex: 0.6,
          }}
        >
          <InfoText title={item?.title} body={item?.message} top />
          <View style={{ height: 10 }} />
        </View>
      </View>
    </View>
  );
};
