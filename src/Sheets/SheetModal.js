import React, { useContext, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Env from "../../api/Env";
import MindAxios from "../../api/MindAxios";
import { RadioBtn } from "../../components";
import AppText from "../../components/AppText";
import colors from "../../constant/colors";
import AuthContext from "../Context/AuthContext";

const SheetModal = ({
  item,
  modalVisible,
  setModalVisible,
  selected,
  setSelected,
  description,
  setDescription,
  onClose,
  refresh,
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoad] = useState(false);
  const {
    myState: { language },
  } = useContext(AuthContext);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert(language?.modal_has_been_closed);
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Rescind Proposal</Text>
            <Text
              style={[styles.modalText, { fontSize: 14, fontWeight: "normal" }]}
            >
              Please provide reason for offer removal.
            </Text>
            <View
              style={{
                // height: 200,
                // backgroundColor: "orange",
                // flex: 1,
                marginTop: 20,
                width: "100%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 10,
                  marginBottom: 10,
                }}
              >
                <RadioBtn
                  selected={selected.item1}
                  onPress={() => {
                    setError(false);
                    if (selected.item1) {
                      setSelected({ item1: false, item2: false });
                      setDescription("");
                    } else {
                      setSelected({ item1: true, item2: false });
                      setDescription("Found same item, better price");
                    }
                  }}
                  size={20}
                />
                <Text
                  style={[
                    styles.modalText,
                    { fontSize: 14, fontWeight: "normal", marginLeft: 10 },
                  ]}
                >
                  Found same item, better price
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 10,
                }}
              >
                <RadioBtn
                  selected={selected.item2}
                  onPress={() => {
                    setError(false);
                    if (selected.item2) {
                      setSelected({ item1: false, item2: false });
                      setDescription("");
                    } else {
                      setSelected({ item1: false, item2: true });
                      setDescription("Found same item, better quality");
                    }
                  }}
                  size={20}
                />
                <Text
                  style={[
                    styles.modalText,
                    { fontSize: 14, fontWeight: "normal", marginLeft: 10 },
                  ]}
                >
                  Found same item, better quality
                </Text>
              </View>
              <View style={{ width: "92%", alignSelf: "center" }}>
                {/* <AppText style={styles.inputText}>Description</AppText> */}
                <TextInput
                  multiline
                  value={description}
                  style={[
                    styles.descriptionInput,
                    { borderColor: error ? colors.red : colors.borderColor },
                  ]}
                  placeholder={`Enter your message...`}
                  onChangeText={(text) => {
                    setSelected({ item1: false, item2: false });
                    setError(false);
                    setDescription(text);
                  }}
                />
              </View>
              {error ? (
                <Text
                  style={{ textAlign: "right", right: 15, color: colors.red }}
                >
                  please add reason
                </Text>
              ) : (
                <View style={{ height: 18 }} />
              )}

              {/* <View
                style={{
                  width: "100%",
                  height: 1,
                  backgroundColor: "lightgrey",
                }}
              /> */}
            </View>
            <View
              style={{
                height: 60,
                width: "100%",
                // backgroundColor: 'red',
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "space-evenly",
              }}
            >
              <Pressable
                onPress={() => setModalVisible(false)}
                style={[styles.btn, { backgroundColor: colors.label }]}
              >
                <Text style={{ color: "#fff" }}>Close</Text>
              </Pressable>

              <Pressable
                onPress={async () => {
                  if (description) {
                    let newDes = description.replace(/ /g, "+");
                    console.log(newDes);
                    setLoad(true);
                    let res = await MindAxios.delete(
                      Env.createUrl(
                        `trade-offers/${item?.id}?action_reason=${newDes}`
                      )
                    );
                    console.log("item", res);
                    // if(res?.status)
                    setLoad(false);
                    setModalVisible(false);
                    setTimeout(() => {
                      onClose();
                      refresh();
                    }, 1000);
                  } else {
                    setError(true);
                    console.log("add description");
                  }
                }}
                style={[styles.btn, { backgroundColor: colors.lightTheme }]}
              >
                {!loading ? (
                  <Text style={{ color: "#fff" }}>Confirm</Text>
                ) : (
                  <ActivityIndicator size="small" color={"#fff"} />
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    height: 310,
    width: "80%",
    // padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    // marginBottom: 15,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  btn: {
    height: 30,
    width: 80,
    backgroundColor: colors.lightTheme,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  descriptionInput: {
    height: 100,
    fontSize: 14,
    padding: 10,
    paddingTop: 10,
    borderRadius: 7,
    borderWidth: 1,
    color: colors.btnText,
    borderColor: colors.borderColor,
    marginTop: 10,
    // fontFamily: Fonts.IBM_Regular,
  },
  inputText: {
    fontSize: 12,
    marginBottom: 5,
    marginTop: 15,
    color: colors.btnText,
  },
});

export default SheetModal;
