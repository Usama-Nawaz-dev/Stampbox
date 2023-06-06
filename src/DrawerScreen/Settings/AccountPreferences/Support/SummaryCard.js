import React, { useContext } from "react";
import { Text, View } from "react-native";

import moment from "moment";
import { styles } from "./styles";
import ThemeContext from "../../../../Context/ThemeContext";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export const SummaryCard = ({ detail }) => {
  const { theme } = useContext(ThemeContext);

  // console.log(detail);

  const Info = ({ infoKey, title }) => {
    return (
      <Text numberOfLines={2} style={styles.txtColor}>
        {infoKey ? `${infoKey}:` : ""}{" "}
        <Text style={{ color: "#000" }}>{title}</Text>
      </Text>
    );
  };

  return (
    <View style={styles.summaryContainer}>
      <View style={styles.summary}>
        <Info infoKey={"Ticket Status"} title={detail?.status} />
        <Info infoKey={"Priority"} title={detail?.priority} />
        <Info infoKey={"Email"} title={detail?.user?.email} />
        {/* <Info infoKey={"Closed by"} title={"Admin"} />
        <Info infoKey={"Help Topic"} title={"Access User"} />
        <Info infoKey={"SLA Plan"} title={"Default SLA"} /> */}
      </View>
      {/* ---------------- other-half -------------- */}
      <View style={styles.summary}>
        <Info infoKey={"User"} title={detail?.user?.name} />
        {/* <Info infoKey={"Department"} title={"Maintenance"} /> */}
        <Info infoKey={"Created at"} title={moment(detail?.created_at).format("YYYY-MM-DD [at] h:mm a")} />
        {/* <Info infoKey={"Closed at"} title={"Jan 25, 2023 11:00 PM"} /> */}
        <Info infoKey={"Last Response"} title={moment(detail?.updated_at).format("YYYY-MM-DD [at] h:mm a")} />
        {/* <Info infoKey={""} title={""} /> */}
      </View>
    </View>
  );
};
