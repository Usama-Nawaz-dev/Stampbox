import { StyleSheet, Text, View, Modal, ActivityIndicator } from "react-native";
import React, { useContext, useState } from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import colors from "../constant/colors";
import allActions from "../redux/actions";
import AuthContext from '../src/Context/AuthContext'
import { useSelector, useDispatch } from "react-redux";

const ActivityModal = () => {
  //   const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const modalVisible = useSelector((state) => state.DataReducer.activity);
  const{ myState:{ language }}=useContext(AuthContext);
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert(language?.modal_has_been_closed);
        // setModalVisible(!modalVisible);
        dispatch(allActions.DataAction.ActivityModal(!modalVisible));
      }}
    >
      <View style={styles.centeredView}>
        <View
          style={{
            height: 140,
            width: 140,
            backgroundColor: "#fff",
            borderRadius: hp(1),
            alignSelf: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 0.5,
                // backgroundColor: "skyblue",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <ActivityIndicator
                size="large"
                color={colors.theme}
                // style={{ margin: 10 }}
              />
            </View>
            <View
              style={{
                flex: 0.5,
                // backgroundColor: "orange",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.textStyle}>{language?.pleaseWait}...</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ActivityModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  textStyle: {
    color: colors.theme,
    fontSize: 16,
    fontWeight: "bold",
  },
});
