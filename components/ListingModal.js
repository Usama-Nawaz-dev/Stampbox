import React, { useContext } from "react";
import { StyleSheet, View, Modal, TouchableOpacity } from "react-native";

import AppText from "./AppText";
import colors from "../constant/colors";
import { GradTab } from "./Card/GradTab";
import { images } from "../assets/images/Images";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import AuthContext from "../src/Context/AuthContext";
import ThemeContext from "../src/Context/ThemeContext";

export const ListingModal = (props) => {
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme }= useContext(ThemeContext);

  const { modalVisible, setModalVisible, onListItem } = props;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert(language?.modal_has_been_closed);
        setModalVisible(!modalVisible);
      }}
    >
      <View style={[styles.modalView, { backgroundColor: theme?.cardColor}]}>
        <View style={styles.topSection}>
          <AppText style={styles.modalText}>
            {language?.chooseTheListing}
          </AppText>
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
            <EvilIcons name="close" size={26} color={theme?.black} />
          </TouchableOpacity>
        </View>
        <View style={styles.infoSection}>
          <View style={styles.shortcutTab}>
            <GradTab
              image={images.N_Auction}
              title={language?.auction}
              color={["#99B4A4", "#BAD2C4"]}
              onPress={() => onListItem("Auction")}
            />
            <GradTab
              image={images.N_Exhibition}
              title={language?.exhibition}
              color={["#8098B0", "#A0BAD5"]}
              onPress={() => onListItem("Exhibition")}
            />
            <GradTab
              image={images.N_Trade}
              title={language?.TRADE}
              color={["#918770", "#B2A890"]}
              onPress={() => onListItem("Trade")}
            />
          </View>
          <View style={styles.shortcutTab}>
            <GradTab
              image={images.N_Exhibition}
              title={language?.sale}
              color={["#99B4A4", "#035852"]}
              onPress={() => onListItem("Sale")}
            />
            <GradTab
              image={images.N_Clubs}
              title={language?.openToOffers}
              color={["#5C7388", "#7E92A5"]}
              onPress={() => onListItem("Offers")}
            />
            <GradTab
              image={images.N_Community}
              title={language?.private}
              color={["#035852", "#698D80"]}
              onPress={() => onListItem("Private")}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  //List Modal
  modalView: {
    margin: 10,
    backgroundColor: colors.cWhite,
    borderRadius: 5,
    padding: 5,
    marginTop: hp(35),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  topSection: {
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalText: {
    fontSize: 16,
    fontWeight: "500",
    // color: colors.heading,
  },
  infoSection: {
    paddingBottom: hp(1),
    paddingHorizontal: wp(2),
  },
  shortcutTab: {
    marginTop: hp(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
