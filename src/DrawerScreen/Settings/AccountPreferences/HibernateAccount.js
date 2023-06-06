import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useState } from "react";
import { MainHeader, GradBtn } from "../../../../components";
import ThemeContext from "../../../Context/ThemeContext";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import UserCard from "../../../../components/UserCard";
import { useSelector } from "react-redux";
import AppText from "../../../../components/AppText";
import moment from "moment";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "../../../../constant/colors";
import { Image } from "react-native";
import AuthContext from "../../../Context/AuthContext";
import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";
import Helper from "../../../Helper";

export function HibernateAccount(props) {

  const { theme } = useContext(ThemeContext);
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const [modalVisible, setModalVisible] = useState(false);
  const {
    myState: { language },
  signOut} = useContext(AuthContext);
  console.log("cu", currentUser);

  const hibernateAccount = async () => {
    const body = { action: "Hibernated" };
    const response = await MindAxios.post(
      Env.createUrl(`users/update-account-status`),
      body
    );
    if (response?.status == 200) {
      Helper.showToastMessage(
        "User account hibernated successfully",
        colors.green
      );
      logOut();
    } else {
      alert(language?.serverError);
    }
  };

  const logOut = async () => {
    await MindAxios.post(Env.createUrl("logout"));
    signOut();
  };

  const Card = () => {
    return (
      <View style={[styles.cardView, { backgroundColor: "#ffffff" }]}>
        <View style={{ marginLeft: 10, marginTop: 12 }}>
          <UserCard
            imgSize={90}
            User={currentUser}
            nameStyle={{ fontSize: 17 }}
            starSize={17}
          />
          <AppText style={styles.email}>{currentUser?.email}</AppText>
        </View>
        <View
          style={{
            marginTop: 15,
            padding: 10,
            backgroundColor: "#999999" + 10,
          }}
        >
          <Items
            name={"Member ID"}
            value={currentUser?.user_detail?.member_id}
          />
          <Items
            name={"Member Since"}
            value={moment(currentUser?.created_at).format(
              "YYYY-MM-DD [at] h:mm:ssA"
            )}
          />
          <Items name={"Membership"} value={currentUser?.mrs_badge} />
          <Items
            name={"Membership Plan"}
            value={currentUser?.subscriptions[0]?.subscription_plan?.name}
          />
        </View>
      </View>
    );
  };

  const Items = (props) => {
    return (
      <View style={styles.itemView}>
        <View style={{ width: wp(35) }}>
          <AppText style={[styles.keyText, { color: theme?.darkGrey }]}>
            {props.name}
          </AppText>
        </View>
        <View style={{}}>
          <AppText style={[styles.valueText, { color: theme?.lightText }]}>
            {props.value}
          </AppText>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title="Account Setting"
        onPressBack={() => props.navigation.goBack()}
      />
      <View style={{ alignItems: "center" }}>
        <Card />
        <GradBtn
          onPress={() => setModalVisible(true)}
          width={wp(80)}
          height={50}
          label={"Hibernate Account"}
          icon={<Ionicons name="ios-power" size={25} color={"#FFFFFF"} />}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert(language?.modal_has_been_closed);
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image style={styles.userImg} source={{ uri : currentUser?.image_url}} />
            <AppText style={styles.infoText}>
              After account hibernation you
              <AppText style={styles.nameText}>
                {" ("}
                {currentUser?.full_name}{") "}
              </AppText>
              will not be pard of our site until you login again. Also you will not be able to login next 24 hours.
            </AppText>
            <TouchableOpacity style={styles.button} onPress={hibernateAccount}>
              <AppText style={styles.btnText}>
                Hibernate
              </AppText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <AppText style={[styles.btnText, { color: colors.btnText }]}>
                {language?.cancel}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardView: {
    width: wp(95),
    marginTop: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.22,
  },
  itemView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    // justifyContent: "space-between",
  },
  keyText: {
    fontSize: 14,
    fontWeight: "500",
  },
  valueText: {
    fontSize: 14,
    fontWeight: "400",
    marginLeft: wp(12),
  },
  email: {
    fontSize: 17,
    fontWeight: "400",
    position: "absolute",
    marginTop: hp(7.5),
    marginLeft: wp(23),
  },

  //Request Modal Styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: wp(80),
  },
  modalView: {
    margin: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
  },
  button: {
    width: "100%",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: colors.borderColor,
  },
  btnText: {
    fontSize: 12,
    color: "#2196F3",
    fontWeight: "500",
    paddingVertical: hp(1),
  },
  userImg: {
    height: 80,
    width: 80,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: colors.borderColor,
  },
  infoText: {
    fontSize: 11,
    maxWidth: wp(65),
    textAlign: "center",
    color: colors.heading,
    marginTop: hp(2),
    marginBottom: hp(1.5),
    paddingHorizontal: wp(2),
  },
  nameText: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.heading,
  },
});
