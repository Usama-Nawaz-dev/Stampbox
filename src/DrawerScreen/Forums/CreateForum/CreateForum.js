import React, { useState, useRef, useContext } from "react";
import {
  View,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { styles } from "./styles";
import colors from "../../../../constant/colors";
import AppText from "../../../../components/AppText";
import { MainHeader, FloatingInput, GradBtn } from "../../../../components";

import { useDispatch, useSelector } from "react-redux";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import { MediaSheet } from "../../../Sheets";
import { BottomSheet } from "../../../../components";

import Helper from "../../../Helper";
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";
import allActions from "../../../../redux/actions";
import ErrorMessage from "../../../forms/ErrorMessage";

import Octicons from "react-native-vector-icons/Octicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import ThemeContext from "../../../Context/ThemeContext";
import AuthContext from "../../../Context/AuthContext";

export const CreateForum = (props) => {
  const Item = props.route.params;

  const dispatch = useDispatch();
  const mediaSheetRef = useRef();

  const [name, setName] = useState(Item ? Item?.title : null);
  const [description, setDescription] = useState(
    Item ? Item?.description : null
  );

  const { theme, mode } = useContext(ThemeContext);

  const [error, setError] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [commentErr, setCommentErr] = useState(false);

  const {
    myState: { language },
  } = useContext(AuthContext);

  const selectedImages = useSelector(
    (state) => state.DataReducer.selected_images
  );

  const renderSelectedImages = ({ item, index }) => {
    return (
      <View
        style={[
          styles.editStampCard,
          {
            marginRight: index == selectedImages?.length - 1 ? hp(10) : null,
            borderColor: theme.theme,
            backgroundColor: theme.white,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            let tempArray = [...selectedImages];
            tempArray.splice(index, 1);
            dispatch(allActions.DataAction.SelectedImg([...tempArray]));
          }}
        >
          <EvilIcons
            name="close"
            size={18}
            style={[styles.crossIcon, { color: theme.davyGrey }]}
          />
        </TouchableOpacity>
        <Image
          style={styles.stampImg}
          source={{ uri: item?.uri ? item?.uri : item?.media_url }}
        />
      </View>
    );
  };

  const checkValidation = async () => {
    let isValid = true;
    if (!name) {
      setError(`Article title is required.`);
      isValid = false;
    }
    if (!selectedImages?.length) {
      setImgError(`Forum photo is required.`);
      isValid = false;
    } else {
      setImgError(false);
    }
    if (!description) {
      setCommentErr("Description is required");
      isValid = false;
    } else {
      setCommentErr(false);
    }

    if (isValid) {
      const body = {
        title: name,
        description: description,
        media_ids: selectedImages?.map((item) => item?.id),
      };
      if (Item) {
        handleUpdate(body);
      } else {
        handleCreate(body);
      }
    }
  };

  const handleCreate = async (body) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.post(Env.createUrl("forums"), body);
    // console.log(response)
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      dispatch(allActions.DataAction.SelectedImg([]));
      Helper.showToastMessage("Forum created successfully", colors.green);
      props.navigation.goBack();
    } else {
      alert(language?.serverError);
    }
  };

  const handleUpdate = async (body) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.post(
      Env.createUrl(`forums/${Item?.id}`),
      body
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      Helper.showToastMessage("Forum updated successfully", colors.green);
      props.navigation.goBack();
    } else {
      alert(language?.serverError);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title={"Start a Conversation"}
        onPressBack={() => {
          dispatch(allActions.DataAction.SelectedImg([]));
          props.navigation.goBack();
        }}
      />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <View style={styles.mediaSection}>
          <AppText style={[styles.mediaText, { color: theme.darkGrey }]}>
            {language?.selectMedia}
          </AppText>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={[
                styles.addStampCard,
                {
                  backgroundColor: theme.cardColor,
                  shadowColor: theme.black,
                },
              ]}
              onPress={() => mediaSheetRef?.current?.open()}
            >
              <Octicons name="plus" size={44} color={theme.theme} />
            </TouchableOpacity>
            <View style={{ marginLeft: 5 }}>
              <FlatList
                data={selectedImages}
                showsHorizontalScrollIndicator={false}
                horizontal
                renderItem={renderSelectedImages}
              />
            </View>
          </View>
          <ErrorMessage visible={imgError ? true : false} error={imgError} />
        </View>
        {/* </View> */}
        <FloatingInput
          label={`Title*`}
          value={name}
          onChangeText={(text) => {
            setError(false);
            setName(text);
          }}
          error={error}
        />
        <AppText style={styles.inputText}>{`Description`}</AppText>
        <TextInput
          placeholder={`Description...`}
          style={styles.descriptionInput}
          placeholderTextColor={theme?.lightText}
          multiline
          color={theme?.lightText}
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
        <ErrorMessage visible={commentErr ? true : false} error={commentErr} />

        <GradBtn
          height={50}
          fontWeight={"500"}
          onPress={checkValidation}
          style={{ marginBottom: hp(2) }}
          label={Item ? "Update" : "Post Question "}
        />
      </KeyboardAwareScrollView>

      {/* Media Sheet */}
      <BottomSheet
        ref={mediaSheetRef}
        sheetHeight={hp(35)}
        ChildComponent={
          <MediaSheet
            onSelectPhone={() => {
              mediaSheetRef?.current?.close();
              setTimeout(() => {
                props.navigation.navigate("AddItem", { from: "myStamBox" });
              }, 300);
            }}
            onSelectStampbox={() => {
              mediaSheetRef?.current?.close();
              setTimeout(() => {
                props.navigation.navigate("StampboxMedia", {
                  from: "myStamBox",
                });
              }, 300);
            }}
            onPressCancel={() => {
              setTimeout(() => {
                mediaSheetRef?.current?.close();
              }, 300);
            }}
          />
        }
      />
    </View>
  );
};
