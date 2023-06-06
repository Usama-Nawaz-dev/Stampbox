import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import HeaderWithIcons from "../../components/HeaderWithIcons";
// import {baseImg} from "./baseimg"
import DocumentScanner from "react-native-document-scanner-plugin";
import { SimpleHeader } from "../../components";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
// const { width } = Dimensions.get("window");
const Scan = ({ navigation }) => {
  const [scannedImage, setScannedImage] = useState();

  const scanDocument = async () => {
    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument();
    console.log("scannedImages", scannedImages);
    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      // set the img src, so we can view the first scanned image
      setScannedImage(scannedImages[0]);
    }
  };

  useEffect(() => {
    // call scanDocument on load
    scanDocument();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <SimpleHeader title="Scan" onPressBack={() => navigation.goBack()} />
      {/* <ScrollView contentContainerStyle={{ height: hp(100), width: wp(100) }}> */}
        <Image
          resizeMode="contain"
          style={{ width: wp(90), height: hp(80), bottom: 50, alignSelf: 'center' }}
          source={{ uri: scannedImage }}
        />
      {/* </ScrollView> */}
    </View>
  );
};

export default Scan;

const styles = StyleSheet.create({});
