import {
  StyleSheet,
  TouchableOpacity,
  View,
  Switch
} from "react-native";
import React, { useContext, useState } from "react";
import { FloatingInput } from "../../../components";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { styles } from "./styles";
import AppText from "../../../components/AppText";
import Feather from "react-native-vector-icons/Feather";
import colors from "../../../constant/colors";
import AuthContext from "../../Context/AuthContext";

const InputsRow = (props) => {
  const { theme, keyboardType } = props;
  const [show, setShow] = useState({
    price: true,
    inventory: true,
    parcel: true,
  });
  const {myState: {language}}= useContext(AuthContext);
  function checkIcon() {
    if (props.title == "Pricing") {
      return show.price;
    } else if (props.title == "Inventory") {
      return show.inventory;
    } else {
      return show.parcel;
    }
  }
  function showHide() {
    if (props.title == "Pricing") {
      setShow({ ...show, price: !show.price });
    } else if (props.title == "Inventory") {
      setShow({ ...show, inventory: !show.inventory });
    } else {
      setShow({ ...show, parcel: !show.parcel });
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={showHide}
        style={{
          height: 35,
          width: "100%",
          //   flex: 0.4,
          borderRadius: 2,
          backgroundColor: "rgba(191, 191, 191, .2)",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 5,
          marginTop: 20,
        }}
      >
        <AppText
          style={[
            styles.inputText,
            {
              color: theme.davyGrey,
              top: 5,
              fontWeight: checkIcon() ? "500" : "normal",
            },
          ]}
        >
          {props.title}
        </AppText>
        <Feather
          name={checkIcon() ? "chevron-up" : "chevron-down"}
          size={20}
          style={{ marginTop: 3 }}
          color={theme.dovGray}
        />
      </TouchableOpacity>
      {checkIcon() ? (
        <>
          {props.title === "Pricing*" &&
            <View style={[styles.checkSection, { alignSelf: 'flex-start' }]}>
              <Switch
                trackColor={{ false: "#767577", true: `${colors.theme}50` }}
                thumbColor={false ? colors.theme : "#f4f3f4"}
                ios_backgroundColor="lightgrey"
                onValueChange={() => props.onToggle()}
                value={props.acceptOffer}
              />
              <AppText style={styles.buyText}>Accepting Best Offers</AppText>
            </View>}
          <View style={[styles.inputContainer, { top: -5 }]}>
            <FloatingInput
              keyboardType={keyboardType ? keyboardType : "numeric"}
              label={props.label1}
              width={wp(40)}
              value={props.value1}
              onChangeText={(text) => props.onChange1(text)}
              editable={props.acceptOffer ? !props.acceptOffer : true}
            />
            <FloatingInput
              keyboardType="numeric"
              label={props.label2}
              width={wp(40)}
              value={props.value2}
              onChangeText={(text) => props.onChange2(text)}
              editable={props.acceptOffer ? !props.acceptOffer : true}
            />
          </View>
          {props.title == language?.parcelDetails+"*" && (
            <View style={[styles.inputContainer, { top: -5 }]}>
              <FloatingInput
                keyboardType="numeric"
                label={props.label3}
                width={wp(40)}
                value={props.value3}
                onChangeText={(text) => props.onChange3(text)}
              //   error={
              //     props.errMsgs.firstNameErrMessage ? props.errMsgs.firstNameErrMessage : false
              //   }
              />
              <FloatingInput
                keyboardType="numeric"
                label={props.label4}
                width={wp(40)}
                value={props.value4}
                onChangeText={(text) => props.onChange4(text)}
              />
            </View>
          )}
        </>
      ) : null}
    </View>
  );
};

export default InputsRow;
