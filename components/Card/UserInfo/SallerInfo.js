import React, { useContext } from "react";
import { TouchableOpacity, View, Image } from "react-native";

import { styles } from "./styles";
import { images } from "../../../assets/images/Images";

import Feather from "react-native-vector-icons/Feather";
import AppText from "../../AppText";

import AuthContext from "../../../src/Context/AuthContext";
import ThemeContext from "../../../src/Context/ThemeContext";

export const SellerInfo = (props) => {
  const { onPress } = props;
  const { theme, mode } = useContext(ThemeContext);

  const {
    myState: { language },
  } = useContext(AuthContext);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, { backgroundColor: theme?.cardColor }]}
    >
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={images.User} style={styles.userIcon} />
          <AppText style={[styles.heading, { color: theme?.black }]}>
            Saved Sellers
          </AppText>
        </View>
        <Feather
          size={20}
          name={"chevron-right"}
          style={{ marginTop: 5, color: theme?.black }}
        />
      </View>
    </TouchableOpacity>
  );
};
