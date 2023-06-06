import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BottomSheet, MainHeader } from "../../../../components";
import colors from "../../../../constant/colors";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import AppText from "../../../../components/AppText";
import { useDispatch } from "react-redux";
import allActions from "../../../../redux/actions";
import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";
import AntDesign from "react-native-vector-icons/AntDesign";
import { color } from "react-native-reanimated";
import Helper from "../../../Helper";
import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";

export const ChangePrimaryEmail = (props) => {
  const { type } = props.route.params;
  const [userData, setUserData] = useState();
  const [selectedItem, setSelectedItem] = useState(null);

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme }= useContext(ThemeContext);

  const dispatch = useDispatch();
  const selectionSheetRef = useRef();
  const phoneSheetRef = useRef();
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.createUrl("users/me"));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response.status == 200) {
      let userData = response?.data?.user?.user_contacts;
      console.log(" >>>data<<<<", userData);
      setUserData(userData);
    } else {
      alert(language?.serverError);
    }
  };
  const setPrimaryEmail = async (id) => {
    if (selectedItem?.verified_at == null && type == "email") {
      Helper.showToastMessage(
        "Please first varifid your email!",
        colors.blueTheme
      );
    } else {
      let body = {
        user_contacts_id: id ? id : selectedItem?.id,
      };
      dispatch(allActions.DataAction.AppLoader(true));
      const response = await MindAxios.post(
        Env.createUrl("users/create-primary"),
        body
      );
      dispatch(allActions.DataAction.AppLoader(false));
      // console.log("Email adresses", response);
      if (response.status === 200) {
        props.navigation.goBack();
      } else {
        alert("Server Error.");
      }
    }
  };

  const removeEmail = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.delete(
      Env.createUrl(`users/delete-secondary-contact/${selectedItem?.id}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response.status === 200) {
      selectionSheetRef?.current?.close();
      await getData();
    } else {
      alert(language?.serverError);
    }
  };

  const sendVarificationLink = async () => {
    let body = {
      user_contact_id: Number(selectedItem?.id),
    };
    // console.log("selectedIdem.....", selectedItem?.id);
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.post(
      Env.createUrl("emails/verification-link"),
      body
    );
    dispatch(allActions.DataAction.AppLoader(false));
    // console.log(response);
    if (response.status === 200) {
      selectionSheetRef?.current?.close();
      Helper.showToastMessage(
        "A link has been sent to your email, Please check your email",
        colors.green
      );
    } else {
      alert(language?.serverError);
    }
  };

  // EMAIL CARD
  const DataSelectionCard = (item) => {
    return (
      <View style={[styles.cardView, { backgroundColor: theme?.cardColor}]}>
        <View>
          <AppText style={styles.cardText}>{item?.email}</AppText>
          <AppText
            style={[
              styles.cardText,
              { fontSize: 14, marginTop: 7, color: colors.blueTheme },
            ]}
          >
            {item?.verified_at ? "verified" : "pending"}
          </AppText>
        </View>
        <TouchableOpacity
          onPress={() => {
            selectionSheetRef?.current?.open();
            setSelectedItem(item);
            // console.log("sheet item", item);
          }}
        >
          <AppText style={[styles.cardText, { fontWeight: "bold" }]}>
            Select
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };
  const PhoneSelectionCard = (item) => {
    return (
      <View style={styles.cardView}>
        <View>
          <AppText style={styles.cardText}>{item?.phone}</AppText>
        </View>
        <TouchableOpacity onPress={() => setPrimaryEmail(item?.id)}>
          <AppText style={[styles.cardText, { fontWeight: "bold" }]}>
            Select
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };

  const BottomSheetCard = ({ icon, title, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.BottomCartView}>
          <View style={styles.iconView}>{icon}</View>
          <AppText style={styles.bottomText}>{title}</AppText>
        </View>
      </TouchableOpacity>
    );
  };

  // Main View
  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <MainHeader
        title="Change primary email"
        onPressBack={() => props.navigation.goBack()}
      />
      <View style={styles.content}>
        {userData?.map((item) => {
          if (type == "email") {
            if (item.key == "email") {
              return DataSelectionCard(item);
            }
          } else if (type == "phone") {
            if (item.key == "phone") {
              return PhoneSelectionCard(item);
            }
          }
        })}
      </View>
      <BottomSheet
        ref={selectionSheetRef}
        sheetHeight={hp(37)}
        ChildComponent={
          <View style={styles.bottomSteehView}>
            <BottomSheetCard
              title={"Make as primary"}
              icon={<AntDesign name="select1" size={23} color={colors.white} />}
              onPress={() => {
                setPrimaryEmail();
                selectionSheetRef?.current?.close();
              }}
            />
            <BottomSheetCard
              title={"Send varification link"}
              icon={<AntDesign name="link" size={23} color={colors.white} />}
              onPress={sendVarificationLink}
            />
            <BottomSheetCard
              title={"Remove email from list"}
              icon={<AntDesign name="delete" size={23} color={colors.white} />}
              onPress={() =>
                Alert.alert(
                  "Delete Email",
                  "Are you sure you want to delete this email.",
                  [
                    {
                      text: "Yes",
                      onPress: () => {
                        removeEmail();
                        selectionSheetRef?.current?.close();
                      },
                    },
                    {
                      text: "No",
                      onPress: () => selectionSheetRef?.current?.close(),
                    },
                  ]
                )
              }
            />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  cardView: {
    width: wp(95),
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    backgroundColor: colors.white,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "400",
  },
  BottomCartView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
    marginLeft: 10,
  },
  bottomText: {
    fontSize: 16,
    fontWeight: "600",
    // color: colors.lightBlack,
  },
  iconView: {
    height: 40,
    width: 40,
    backgroundColor: colors.darkTheme,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginRight: 15,
  },
  bottomSteehView: {
    padding: 20,
  },
});
