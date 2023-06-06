import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Modal,
  Platform,
  FlatList,
} from "react-native";

import { styles } from "./styles";

// REDUX
import { useSelector, useDispatch } from "react-redux";
import allActions from "../../../redux/actions";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import StampImage from "../../../components/StampImage";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import MindAxios from "../../../api/MindAxios";
import Env from "../../../api/Env";

import { GradBtn, MainHeader } from "../../../components";
import colors from "../../../constant/colors";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";
// import { dark as theme } from "../../../constant/colorsConfig";

export const AddItem = (props) => {
  const {
    route: {
      params: { isStamp, type },
    },
  } = props;

  const dispatch = useDispatch();
  const [imageLocal, setImageLocal] = useState(null);
  const [imgModal, setImgModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selected_img, setSelected_img] = useState([]);
  const selectedImages = useSelector(
    (state) => state.DataReducer.selected_images
  );
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme }= useContext(ThemeContext)
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
      multiple: true,
      maxWidth: 600,
      maxHeight: 600,
      quality: 1,
      selectionLimit: 10,
    })
      .then((images) => {
        if (images.assets) {
          let tempImage = [];
          for (let i = 0; i < images.assets.length; i++) {
            tempImage.push(images.assets[i]);
          }
          setSelected_img([...selected_img, ...tempImage]);
        } else {
          // console.log("Cancled", images);
        }
      })
      .catch((err) => console.log(err));
  };
  const captureImage = async (type) => {
    console.log("Take Picture Function");
    launchCamera({
      multiple: false,
      maxWidth: 600,
      maxHeight: 600,
      quality: 1,
    })
      .then((images) => {
        if (images.assets) {
          setSelected_img([...selected_img, images.assets[0]]);
        } else {
          console.log("Cancelled");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderSelectedImages = ({ item, index }) => {
    return (
      <View style={{ marginLeft: hp(1) }}>
        <StampImage
          uri={item.uri ? item.uri : null}
          onDelete={() => {
            let tempArray = [...selected_img];
            let uploadedTemp = [...uploadedImages];
            tempArray.splice(index, 1), uploadedTemp.splice(index, 1);
            setSelected_img([...tempArray]);
            setUploadedImages([...uploadedTemp]);
          }}
        />
      </View>
    );
  };
  const uploadApi = async () => {
    if (selected_img?.length) {
      setLoading(true);
      let { headers } = await MindAxios.formdataConfig();
      let formdata = new FormData();
      isStamp != undefined && formdata.append("is_stamp", isStamp);
      if (type === "other") {
        formdata.append("linked_with", "other");
      } else if (type) {
        formdata.append("type", type);
      }
      selected_img.forEach((item, i) => {
        const newFile = {
          uri: item.uri,
          type: "image/png",
          name: "photo.png",
          filename: "imageName.png",
        };
        formdata.append("media[]", newFile);
      });

      fetch(Env.createUrl("medias"), {
        method: "POST",
        headers: headers,
        body: formdata,
      })
        .then((response) => response.json())
        .then((result) => {
          // dispatch(allActions.DataAction.ActivityModal(false));
          setLoading(false);
          if (result?.success) {
            // console.log("result-->", result);
            let selectedMedia = result?.result?.media;
            dispatch(allActions.DetailAction.MyStamp(null));
            dispatch(
              allActions.DataAction.SelectedImg([
                ...selectedImages,
                ...selectedMedia,
              ])
            );
            // if (from == 'store') {
            //   if (isStamp == 1) {
            //     {
            //       screen == 'edit' ? props.navigation.reset({
            //         index: 0,
            //         routes: [{ name: "EditStoreStamp" }],
            //       }) : props.navigation.reset({
            //         index: 0,
            //         routes: [{ name: "StoreStamp" }],
            //       })
            //     }
            //   } else {
            //     {
            //       screen == 'edit' ? props.navigation.reset({
            //         index: 0,
            //         routes: [{ name: "EditSupply" }],
            //       }) : props.navigation.reset({
            //         index: 0,
            //         routes: [{ name: "StoreSupply" }],
            //       })
            //     }
            //   }
            // } else {
            props.navigation.goBack();
            // }
          } else {
            alert(language?.serverError);
          }
        })
        .catch((error) => {
          setLoading(false);
          alert(error);
        });
    } else {
      alert("No media to add");
    }

    // console.log('config', headers)
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <MainHeader
        title="Add Item"
        onPressBack={() => props.navigation.goBack()}
      />
      <Text style={[styles.uploadText, { color: theme?.darkGrey}]}>Upload Stamp Photos</Text>
      <View style={{ marginHorizontal: wp(3), marginTop: hp(4) }}>
        {selected_img?.length != 0 && (
          <FlatList
            data={selected_img}
            showsHorizontalScrollIndicator={false}
            horizontal
            renderItem={renderSelectedImages}
            ListFooterComponent={() => {
              return <View style={{ width: 10 }} />;
            }}
          />
        )}
      </View>
      <View style={styles.btnSection}>
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => setImgModal(true)}
        >
          <MaterialCommunityIcons
            name="image-multiple"
            size={hp(2.4)}
            color={theme?.darkGrey}
          />
          <Text style={[styles.uploadBtnText, { color: theme?. darkGrey}]}>Upload Stamp Photo</Text>
        </TouchableOpacity>
        <GradBtn
          label="Add to Stampbox"
          height={50}
          width="90%"
          onPress={uploadApi}
          loading={loading}
        />
      </View>

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
            <Text style={styles.headingText}>Select Image</Text>
            <TouchableOpacity
              onPress={() => {
                setImgModal(!imgModal);
                setTimeout(() => {
                  if (Platform.OS == "android") {
                    requestCameraPermission();
                  } else {
                    // console.log("Take Picture clicked");
                    captureImage();
                  }
                }, 100);
              }}
            >
              <Text style={styles.modalText}>{language?.takePhoto}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setImgModal(!imgModal);
                setTimeout(() => {
                  chooseFile();
                }, 100);
              }}
            >
              <Text style={styles.modalText}>{language?.chooseFromAlbums}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setImgModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
