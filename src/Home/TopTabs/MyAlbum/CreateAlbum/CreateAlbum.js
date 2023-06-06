import React, { useContext, useState } from "react";
import { View, TouchableOpacity, Modal, TextInput, Switch } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { styles } from "./styles";
import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";
import ErrorMessage from "../../../../forms/ErrorMessage";
import CoverPhoto from "../../../../../components/CoverPhoto";
import { MainHeader, FloatingInput, GradBtn } from "../../../../../components";

import { useDispatch } from "react-redux";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";

import AuthContext from "../../../../Context/AuthContext";
import ThemeContext from "../../../../Context/ThemeContext";

export const CreateAlbum = (props) => {
  const { type, ItemDetail } = props.route.params;
  const dispatch = useDispatch();

  const [imgModal, setImgModal] = useState(false);
  const [coverImage, setCoverImage] = useState({
    uri: ItemDetail ? ItemDetail?.image_url : null,
  });

  const [name, setName] = useState(ItemDetail ? ItemDetail?.name : null);
  const [description, setDescription] = useState(
    ItemDetail ? ItemDetail?.description : null
  );
  const [isPrivate, setIsPrivat] = useState(
    ItemDetail?.is_private ? true : false
  );

  const [error, setError] = useState(false);
  const [imgError, setImgError] = useState(false);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Stampbox App Camera Permission",
          message:
            "Stambox needs access to your camera " +
            "so you can take pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log("You can use the camera");
        captureImage();
      } else {
        // console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const chooseFile = async () => {
    launchImageLibrary({
      maxWidth: 600,
      maxHeight: 600,
      quality: 1,
    })
      .then((images) => {
        if (images.assets) {
          setCoverImage(images.assets[0]);
          setImgError(false);
        } else {
          // console.log("Cancled", images);
        }
      })
      .catch((err) => {
        // console.log(err)
      });
  };

  const captureImage = async (type) => {
    // console.log("Take Picture Function");
    launchCamera({
      multiple: false,
      maxWidth: 600,
      maxHeight: 600,
      quality: 1,
    })
      .then((images) => {
        if (images.assets) {
          setCoverImage(images.assets[0]);
          setImgError(false);
        } else {
          // console.log("Cancelled");
        }
      })
      .catch((err) => {
        // console.log(err)
      });
  };

  const checkValidation = async () => {
    let isValid = true;
    if (!name) {
      setError(`${type} name is required.`);
      isValid = false;
    }
    if (!coverImage?.uri) {
      setImgError(`${type} photo is required.`);
      isValid = false;
    }

    if (isValid) {
      let { headers } = await MindAxios.formdataConfig();
      let fd = new FormData();

      const newFile = {
        uri: coverImage.uri,
        type: "image/png",
        name: "photo.png",
        filename: "imageName.png",
      };
      fd.append("name", name);
      fd.append("description", description);
      fd.append("image", newFile);
      fd.append("is_private", isPrivate ? 1 : 0);
      // console.log('form', fd)
      if (ItemDetail) {
        handleUpdate(headers, fd);
      } else {
        handleCreate(headers, fd);
      }
    }
  };

  const handleCreate = (headers, fd) => {
    fd.append("type", type);
    dispatch(allActions.DataAction.AppLoader(true));
    fetch(Env.createUrl("albums"), {
      method: "POST",
      headers: headers,
      body: fd,
    })
      .then((response) => response.json())
      .then((res) => {
        if (res?.success) {
          dispatch(allActions.DataAction.AppLoader(false));
          Helper.showToastMessage(`${type} Create Successfully.`, colors.green);
          props.navigation.goBack();
        }
      })
      .catch((e) => {
        dispatch(allActions.DataAction.AppLoader(false));
        alert(e);
      });
  };

  const handleUpdate = (headers, fd) => {
    fd.append("type", ItemDetail?.type);
    fd.append("id", ItemDetail?.id);
    dispatch(allActions.DataAction.AppLoader(true));
    fetch(Env.createUrl("albums/update"), {
      method: "POST",
      headers: headers,
      body: fd,
    })
      .then((response) => response.json())
      .then((res) => {
        if (res?.success) {
          dispatch(allActions.DataAction.AppLoader(false));
          Helper.showToastMessage(
            `${type} Updated Successfully.`,
            colors.green
          );
          props.navigation.goBack();
        }
      })
      .catch((e) => {
        dispatch(allActions.DataAction.AppLoader(false));
        // console.log('e', e);
      });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title={`${ItemDetail ? "Update" : "Create"} ${type}`}
        onPressBack={() => props.navigation.goBack()}
      />
      <KeyboardAwareScrollView>
        <View style={styles.coverSection}>
          <CoverPhoto
            showEdit={true}
            btnText={`Upload ${type} Photo`}
            uri={coverImage ? coverImage.uri : null}
            onPress={() => setImgModal(!imgModal)}
          />
          <ErrorMessage visible={imgError ? true : false} error={imgError} />
        </View>
        <View style={styles.inputSection}>
          <FloatingInput
            label={`${type} Name*`}
            value={name}
            onChangeText={(text) => {
              setError(false);
              setName(text);
            }}
            error={error}
          />
          <AppText style={styles.inputText}>{`${type} Description`}</AppText>
          <TextInput
            multiline
            value={description}
            style={styles.descriptionInput}
            placeholder={`${type} Description...`}
            placeholderTextColor={theme?.chalice}
            color={theme?.davyGrey}
            onChangeText={(text) => setDescription(text)}
          />
          <View style={styles.checkSection}>
            <Switch
              trackColor={{ false: "#767577", true: `${colors.theme}50` }}
              thumbColor={isPrivate ? colors.theme : "#f4f3f4"}
              ios_backgroundColor="lightgrey"
              onValueChange={() => {
                setIsPrivat(!isPrivate);
              }}
              value={isPrivate}
            />
            <AppText style={styles.buyText}>Make as private</AppText>
          </View>
          <GradBtn
            height={hp(6)}
            onPress={checkValidation}
            label={ItemDetail ? "Update" : `Create ${type}`}
          />
        </View>
      </KeyboardAwareScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={imgModal}
        onRequestClose={() => {
          setImgModal(!imgModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <AppText style={styles.headingText}>Select Image</AppText>
            <TouchableOpacity
              onPress={() => {
                setImgModal(!imgModal);
                setTimeout(() => {
                  if (Platform.OS == "android") {
                    requestCameraPermission();
                  } else {
                    captureImage();
                  }
                }, 100);
              }}
            >
              <AppText style={styles.modalText}>{language?.takePhoto}</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setImgModal(!imgModal);
                setTimeout(() => {
                  chooseFile();
                }, 100);
              }}
            >
              <AppText style={styles.modalText}>
                {language?.chooseFromAlbums}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setImgModal(false)}>
              <AppText style={styles.cancelButton}>Cancel</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
