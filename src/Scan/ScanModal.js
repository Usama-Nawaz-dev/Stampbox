import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  Button,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import HeaderWithIcons from "../../components/HeaderWithIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
// import {baseImg} from "./baseimg"
import DocumentScanner from "react-native-document-scanner-plugin";
import { MenuSheet, SimpleHeader } from "../../components";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import colors from "../../constant/colors";
import MindAxios from "../../api/MindAxios";
import Env from "../../api/Env";
import { Scanner } from "./Scanner";
import { images } from "../../assets/images/Images";
import { baseImg } from "./baseimg";
import RNFetchBlob from "react-native-fetch-blob";
import Helper from "../Helper";
import _ from "lodash";
import { useDispatch } from "react-redux";
import allActions from "../../redux/actions";
import { useIsFocused } from "@react-navigation/native";
// const { width } = Dimensions.get("window");
const ScanModal = ({ navigation }) => {
  const focused = useIsFocused();
  const [scannedImage, setScannedImage] = useState();
  const [quality, setQuality] = useState(null);
  const [bgImage, setBgImage] = useState();
  const [load, setLoad] = useState(false);
  const [reset, setReset] = useState(false);
  const [lod, setLod] = useState(false);
  const dispatch = useDispatch();
  const scanDocument = async () => {
    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument();
    console.log("scannedImages", scannedImages);
    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      // set the img src, so we can view the first scanned image
      setScannedImage(scannedImages[0]);
      setBgImage(null);
      removeBg("QUALITY_CHECK", scannedImages[0]);
    }
  };
  const removeBg = async (type, img) => {
    console.log("image", type);

    let fd = new FormData();
    fd.append("image_action_type", `${type ? type : "BACKGROUND_REMOVAL"}`);
    const newFile = {
      uri: img ? img : scannedImage,
      type: "image/png",
      name: "photo.png",
      filename: "imageName11.png",
    };
    fd.append("media_file", newFile);
    console.log("fd", fd);
    setLoad(true);
    let { headers } = await MindAxios.formdataConfig();
    fetch(Env.createUrl("ocr"), {
      method: "POST",
      headers: headers,
      body: fd,
    })
      .then((response) => response.json())
      .then(async (res) => {
        console.log("res-->", res);
        if (res?.success) {
          if (type) {
            setLoad(false);
            let img_quality = res?.result?.score;
            if (img_quality > 0) {
              img_quality = 100 - img_quality;
              setQuality(img_quality?.toFixed(1));
            } else {
              setQuality(100);
            }
          } else {
            setLoad(false);
            setQuality(null);
            setReset(false);
            setBgImage(`data:image/png;base64,${res?.result?.updated_image}`);
          }
        } else {
          setLoad(false);
          Helper.showToastMessage("Something went wrong", "red");
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoad(false);
      });
  };

  useEffect(() => {
    if (focused) {
      scanDocument();
    }
  }, [focused]);
  const upload = async (val) => {
    if (bgImage && !reset) {
      var Base64Code = bgImage.split("data:image/png;base64,"); //base64Image is my image base64 string
      console.log("image", Base64Code);
      const dirs = RNFetchBlob.fs.dirs;

      var path = dirs.DocumentDir + "/image.png";
      console.log("dirs", path);
      await RNFetchBlob.fs.writeFile(path, Base64Code[1], "base64");
      let check = await RNFetchBlob.fs.exists(path);
      console.log("stored image", check);
      if (check) {
        await hitApi(path, val);
        await RNFetchBlob.fs.unlink(path);
        clear();
        navigation.navigate("StamBox");
      }
    } else {
      await hitApi(scannedImage, val);
      clear();
      navigation.navigate("StamBox");
    }
  };
  // const upload = async()=>{
  //   const dirs = RNFetchBlob.fs.dirs;
  //   var path = dirs.DocumentDir + "/image.png";
  //   await RNFetchBlob.fs.unlink(path);
  // }
  const hitApi = async (path, val) => {
    dispatch(allActions.DataAction.ActivityModal(true));
    let { headers } = await MindAxios.formdataConfig();
    let formdata = new FormData();
    const file = {
      uri: path,
      type: "image/png",
      name: "photo.png",
      filename: "imageName11.png",
    };
    formdata.append("media[]", file);
    formdata.append("is_stamp", val);
    formdata.append("type", "actual");
    let response = await fetch(Env.createUrl("medias"), {
      method: "POST",
      headers: headers,
      body: formdata,
    });
    dispatch(allActions.DataAction.ActivityModal(false));
    let result = await response.json();
    console.log("res", result);
  };

  const stampAction = async () => {
    console.log("stamp");
    await upload(1);
  };
  const supplyAction = async () => {
    console.log("supply");
    await upload(0);
  };
  const clear = () => {
    setScannedImage(null);
    setBgImage(false);
    setLoad(false);
    setReset(false);
    setLod(false);
    setQuality(null);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "lightgrey",
      }}
    >
      {quality ? (
        <Text
          style={{
            textAlign: "center",
            bottom: 20,
            color: quality > 50 ? colors.green : colors.red,
          }}
        >
          Image quality is: {quality}%
        </Text>
      ) : null}
      <View
        style={{
          height: 40,
          width: "100%",
          backgroundColor: "#fff",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          // marginHorizontal: 10,
          alignSelf: "center",
          position: "absolute",
          top: 0,
        }}
      >
        <AntDesign
          onPress={() => {
            clear();
            navigation.goBack();
          }}
          name="closecircle"
          size={30}
          color={colors.color6}
          style={{ left: 10 }}
        />
        {bgImage ? (
          <Pressable
            onPress={() => {
              setLod(true);
              setReset(!reset);
            }}
          >
            {!lod ? (
              <Text style={{ fontSize: 16 }}>Reset</Text>
            ) : (
              <ActivityIndicator
                // style={{position: 'absolute', left: wp(50), top: hp(25) }}
                size="small"
                color={colors.theme}
              />
            )}
          </Pressable>
        ) : null}
        {scannedImage ? (
          <MenuSheet
            customButton={
              <AntDesign
                name="checkcircle"
                size={30}
                color={colors.color6}
                style={{ right: 10 }}
              />
            }
            // destructiveIndex={5}
            options={["Upoad as a Stamp", "Upload as a Supply", "Cancel"]}
            actions={[stampAction, supplyAction]}
          />
        ) : (
          <AntDesign
            name="checkcircle"
            size={30}
            color={colors.color6}
            style={{ right: 10 }}
          />
        )}
      </View>
      <View style={{ flex: 0.6 }}>
        {scannedImage ? (
          <Image
            // onLoadStart={() => setLod(true)}
            onLoadEnd={() => setLod(false)}
            resizeMode="contain"
            style={{ width: wp(100), height: hp(60), alignSelf: "center" }}
            source={{
              uri: reset ? scannedImage : bgImage ? bgImage : scannedImage,
            }}
          />
        ) : (
          <Image
            // resizeMode="contain"
            style={{ width: wp(100), height: hp(50), alignSelf: "center" }}
            source={images.bigNoImg}
          />
        )}
      </View>

      <Scanner loading={load} />
      {scannedImage ? (
        <View style={styles.bottomView}>
          <Button
            title="Remove Background"
            onPress={() => removeBg(null, null)}
          />
          <Button title="Scan" onPress={scanDocument} />
        </View>
      ) : (
        <View style={styles.bottomView}>
          {/* <Button title="Remove Background" onPress={removeBg} /> */}
          <Button title="Scan" onPress={scanDocument} />
        </View>
      )}

      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default ScanModal;

const styles = StyleSheet.create({
  bottomView: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute", //Here is the trick
    bottom: 5, //Here is the trick
  },
});
