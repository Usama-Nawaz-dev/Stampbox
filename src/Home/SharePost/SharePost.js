import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { styles } from "./styles";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AppText from "../../../components/AppText";
import Image from "react-native-fast-image";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";

import CustomDropDown from "../../../components/CustomDropDown";
import colors from "../../../constant/colors";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";

import VideoPlayer from "../../../components/VideoPlayer";
import MindAxios from "../../../api/MindAxios";
import Env from "../../../api/Env";
import allActions from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import Helper from "../../Helper";

import { BottomSheet } from "../../../components";
import { PickerSheet } from "./PickerSheet/PickerSheet";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

export const SharePost = (props) => {
  const { params } = props.route;
  // console.log(params?.club)
  const pickerSheetRef = useRef();
  const {
    myState: { language },
  } = useContext(AuthContext);

  const dispatch = useDispatch();
  const [privacy, setPrivacy] = useState("Anyone");
  const [description, setDescription] = useState("");
  const [postImg, setPostImage] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const user = useSelector((state) => state.ApiReducer.user);
  const { theme } = useContext(ThemeContext);

  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener("focus", async () => {
  //     pickerSheetRef?.current?.open();
  //   });
  //   return unsubscribe;
  // }, [props.navigation]);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
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
        isVideo ? recordVideo() : captureImage();
      } else {
        // console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const captureImage = async (type) => {
    launchCamera({
      multiple: false,
      maxWidth: 600,
      maxHeight: 600,
      quality: 1,
    })
      .then((images) => {
        if (images.assets) {
          setPostImage(images.assets[0]);
        } else {
          // console.log("Cancelled");
        }
      })
      .catch((err) => {
        // console.log(err)
      });
  };

  const recordVideo = async (type) => {
    launchCamera({
      mediaType: "video",
      includeBase64: true,
      videoQuality: "high",
      // saveToPhotos: true
    })
      .then((video) => {
        if (video.assets) {
          setPostImage(video.assets[0]);
        } else {
          setIsVideo(false);
          console.log("Cancelled");
        }
      })
      .catch((err) => console.log(err));
  };

  const chooseFile = async () => {
    launchImageLibrary({
      maxWidth: 600,
      maxHeight: 600,
      quality: 1,
    })
      .then((images) => {
        if (images.assets) {
          //   console.log("selected-->", images.assets[0]);
          setPostImage(images.assets[0]);
        } else {
          // console.log("Cancled", images);
        }
      })
      .catch((err) => {
        // console.log(err)
      });
  };

  const selectVideo = async () => {
    launchImageLibrary({
      mediaType: "video",
      includeBase64: true,
    })
      .then((video) => {
        if (video.assets) {
          setPostImage(video.assets[0]);
        } else {
          // console.log("Cancelled");
        }
      })
      .catch((err) => {
        // console.log(err)
      });
  };

  const hitPost = async () => {
    if (postImg?.uri || description) {
      dispatch(allActions.DataAction.AppLoader(true));
      // setLoading(true);
      let { headers } = await MindAxios.formdataConfig();
      let formdata = new FormData();
      formdata.append("privacy_type", privacy);
      formdata.append("content", description);
      formdata.append("type", params?.club ? "club" : "home_feed");
      params?.club && formdata.append("club_ids", params?.club?.id);
      const newFile = {
        uri: postImg?.uri,
        type: postImg?.type,
        name: isVideo ? "vid.mp4" : "photo21.png",
        filename: postImg?.fileName,
      };
      if (postImg?.uri) {
        formdata.append("media_type", isVideo ? "Video" : "Image");
        formdata.append("media", newFile);
      }
      // console.log('formData-->', formdata)
      fetch(Env.createUrl("posts"), {
        method: "POST",
        headers: headers,
        body: formdata,
      })
        .then((response) => response.json())
        .then((result) => {
          dispatch(allActions.ApiAction.getFeeds());
          dispatch(allActions.DataAction.AppLoader(false));
          // console.log("result-->", result);
          setDescription("");
          setPostImage(null);
          setPrivacy("Anyone");
          setIsVideo(false);
          props.navigation.goBack();
        })
        .catch((error) => {
          // setLoading(false);
          dispatch(allActions.DataAction.ActivityModal(false));
          alert(error);
        });
    } else {
      await Helper.showToastMessage("Please add file or description!", "red");
    }

    // console.log('config', headers)
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <View style={styles.bottomSection}>
        <TouchableOpacity
          onPress={() => {
            setIsVideo(false);
            setTimeout(() => {
              if (Platform.OS == "android") {
                requestCameraPermission();
              } else {
                captureImage();
              }
            }, 100);
          }}
        >
          <MaterialCommunityIcons name="camera" size={25} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsVideo(true);
            setTimeout(() => {
              recordVideo();
            }, 100);
          }}
        >
          <MaterialCommunityIcons name="video" size={28} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="md-images"
            size={22}
            onPress={() => {
              setIsVideo(false);
              setTimeout(() => {
                chooseFile();
              }, 100);
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => pickerSheetRef?.current?.open()}>
          <Entypo name="dots-three-horizontal" size={25} />
        </TouchableOpacity>
      </View>
      <View style={styles.modalHeader}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            onPress={() => {
              setDescription("");
              setPostImage(null);
              setPrivacy("Anyone");
              setIsVideo(false);
              props.navigation.goBack();
              // console.log('here')
            }}
          >
            <Image
              style={styles.cross}
              tintColor={theme?.lightText}
              source={require("../../../assets/icons/cross.png")}
            />
          </TouchableOpacity>
          <AppText style={styles.heading}>Create Post</AppText>
        </View>
        <TouchableOpacity onPress={hitPost}>
          <AppText style={styles.postText}>{language?.post}</AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.userSection}>
        <Image source={{ uri: user?.image_url }} style={styles.userImg} />
        <View style={{ marginLeft: 15 }}>
          <AppText style={styles.nameText}>{user?.full_name}</AppText>
          <View style={styles.privacySection}>
            <Image
              style={styles.earthIcon}
              tintColor={colors.theme}
              source={require("../../../assets/icons/earth.png")}
            />
            <CustomDropDown
              data={[{ value: "Anyone" }, { value: "Connections" }]}
              value={privacy}
              onChangeText={(value) => {
                setPrivacy(value);
              }}
              dropdownOffset={-1}
              position={-3.2}
              style={styles.dropDown}
            />
          </View>
        </View>
      </View>
      <ScrollView style={{ paddingHorizontal: wp(3), marginBottom: 55 }}>
        <TextInput
          multiline
          numberOfLines={5}
          style={[styles.input, { color: theme?.lightText }]}
          placeholder={"What do you want to talk about?"}
          placeholderTextColor={theme?.darkGrey}
          onChangeText={(text) => {
            setDescription(text);
          }}
          value={description}
        />
        <View style={styles.mediaSection}>
          {isVideo ? (
            <VideoPlayer uri={postImg ? postImg.uri : null} />
          ) : (
            <>
              {postImg ? (
                <Image
                  source={{
                    uri: postImg.uri,
                  }}
                  resizeMode="cover"
                  style={styles.pickerImage}
                />
              ) : (
                <View style={styles.pickerImage} />
              )}
            </>
          )}
        </View>
      </ScrollView>
      <BottomSheet
        ref={pickerSheetRef}
        sheetHeight={hp(35)}
        ChildComponent={
          <PickerSheet
            onAddPhoto={() => {
              pickerSheetRef?.current?.close();
              setIsVideo(false);
              setTimeout(() => {
                chooseFile();
              }, 300);
            }}
            onTakePhoto={() => {
              pickerSheetRef?.current?.close();
              setIsVideo(false);
              setTimeout(() => {
                if (Platform.OS == "android") {
                  requestCameraPermission();
                } else {
                  captureImage();
                }
              }, 300);
            }}
            onSelectVideo={() => {
              pickerSheetRef?.current?.close();
              setIsVideo(true);
              setTimeout(() => {
                selectVideo();
              }, 300);
            }}
            onRecordVideo={() => {
              pickerSheetRef?.current?.close();
              setIsVideo(true);
              setTimeout(() => {
                recordVideo();
              }, 300);
            }}
          />
        }
      />
    </View>
  );
};
