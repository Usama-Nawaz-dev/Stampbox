import { StyleSheet, Text, View, Modal, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Entypo from "react-native-vector-icons/Entypo";


const MultiPickerModal = ({ visible, setVisible, Data, renderItem}) => {
  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={() => {
      setVisible(false);
    }}
  >
    <View style={{ height: "50%", top: hp(40) }}>
      <TouchableOpacity
        onPress={() => {
          setVisible(false);
        }}
        style={{ height: "16%" }}
      ></TouchableOpacity>
      <View style={styles.modal}>
        <View style={{ flex: 1 }}>
          <FlatList
            // contentContainerStyle={{bottom:150}}
            // style={{height:'89%'}}
            data={Data}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        </View>
        <View style={{ flex: 0.1 }}>
          <TouchableOpacity
            onPress={() => setVisible(false)}
            style={{
              alignSelf: "center",
              marginTop: 10,
              width: 30,
              height: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Entypo
              name="cross"
              style={{ marginRight: 5 }}
              size={25}
              //   color="grey"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
  )
}

export default MultiPickerModal

const styles = StyleSheet.create({
    modal: {
        // marginTop:'34.5%',
        // bottom: -120,
        // height: "auto",
        // top: 50,
        alignSelf: "center",
        width: "100%",
        backgroundColor: "#DCDCDC",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        // padding:10,
        flexDirection: "row",
      },
})