import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { FloatingInput, GradBtn, SimpleHeader } from "../../components";
import CustomDropDown from "../../components/CustomDropDown";
import { flagReasons } from "../../constant/staticData";
import MindAxios from "../../api/MindAxios";
import Env from "../../api/Env";
import Helper from "../Helper";
import { useDispatch } from "react-redux";
import allActions from "../../redux/actions";
import AuthContext from "../Context/AuthContext";
import ThemeContext from "../Context/ThemeContext";
import { widthPercentageToDP } from "react-native-responsive-screen";
import colors from "../../constant/colors";
// import { dark as theme } from "../../constant/colorsConfig";

const Flagging = (props) => {
  const {
    route: {
      params: { id },
    },
  } = props;
  // console.log("props", id);
  const [reason, setReason] = useState(null);
  const [description, setDescription] = useState(null);
  const dispatch = useDispatch();
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const submit = async () => {
    // props.navigation.navigate("FlagConversation");
    if (!description) {
      Helper.showToastMessage("description required", colors.danger);
    } else {
      dispatch(allActions.DataAction.AppLoader(true));
      let body = {
        reason: reason,
        current_activity_message: description,
      };
      // console.log("body", body);
      const res = await MindAxios.post(
        Env.createUrl(`stamp-items/${id}/create-flag`),
        body
      );
      dispatch(allActions.DataAction.AppLoader(false));
      console.log("res", res);
      if (res?.status == 200) {
        Helper.showToastMessage("Flag Created Successfully", "green");
        props.navigation.goBack();
        setReason("");
        setDescription(null);
      } else {
        const {
          e: { response },
        } = res;
        console.log("error->", response);
      }
    }
  };
  console.log(reason);
  return (
    <View style={{ flex: 1, backgroundColor: theme?.white }}>
      <SimpleHeader
        title="Flagging"
        onPressBack={() => {
          setReason("");
          setDescription(null);
          props.navigation.goBack();
        }}
      />
      <View style={{ width: "90%", alignSelf: "center" }}>
        <CustomDropDown
          data={flagReasons}
          label={"Flagging Reason"}
          value={reason}
          width={widthPercentageToDP(53)}
          position={-4}
          onChangeText={(value) => {
            setReason(value);
          }}
        />
        <FloatingInput
          label="Write Detail.."
          value={description}
          description={true}
          multiline
          onChangeText={(text) => {
            setDescription(text);
          }}
        />
        <GradBtn label={language?.submit} height={50} onPress={submit} />
      </View>
    </View>
  );
};

export { Flagging };

const styles = StyleSheet.create({});
