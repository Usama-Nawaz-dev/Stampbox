import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useRef, useState } from "react";
import { CropView } from "react-native-image-crop-tools";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import allActions from "../../redux/actions";
import {
  brightness,
  Brightness,
  Contrast,
  Saturate,
  Sharpen,
  Temperature,
} from "react-native-image-filter-kit";
import { FILTERS } from "./FILTERS";

const Cropper = ({ onPress, imgUri, original }) => {
  const [afterCrop, setAfterCrop] = useState(false);
  const [filterView, setFilterView] = useState(false);
  const [brightness, setBrightness] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [saturation, setSaturation] = useState(false);
  const [sharp, setSharp] = useState(false);
  const [temp, setTemp] = useState(false);
  const [afterCropImg, setAfterCropImg] = useState(null);
  // const [loading, setLoading] = useState(true);
  const history = useSelector((state) => state.DataReducer.history);
  const recentIndex = useSelector((state) => state.DataReducer.filter_index);
  const dispatch = useDispatch();
  const uri =
    "https://www.hyundai.com/content/hyundai/ww/data/news/data/2021/0000016609/image/newsroom-0112-photo-1-2021elantranline-1120x745.jpg";
  // console.log("imgUri", imgUri);
  const cropViewRef = useRef();
  const filterApply = () => {
    // if (recentIndex > 0) {
    // console.log("save-photo--> filterComp");
    const FilterComponent = FILTERS[recentIndex].filterComponent;
    return (
      <FilterComponent
        onExtractImage={({ nativeEvent }) => {
          // console.log("save-photo--> filterComp", nativeEvent.uri);
          setAfterCropImg(nativeEvent.uri);
          setFilterView(false);
          setBrightness(true);
          // setBrightness(false);
          // setContrast(true);
          // setAfterCrop(false);
          // setCurrentImg(nativeEvent.uri);
          // dispatch(allActions.DataAction.recentFilter(nativeEvent.uri));
        }}
        //   clearCachesMaxRetries={5}
        extractImageEnabled={true}
        image={
          <Image
            style={styles.image}
            source={{ uri: afterCropImg }}
            resizeMode={"contain"}
          />
        }
      />
    );
  };
  return (
    <View>
      <CropView
        sourceUrl={original}
        style={styles.cropView}
        ref={cropViewRef}
        onImageCrop={(res) => {
          setAfterCropImg(res?.uri);
          setAfterCrop(true);
          setFilterView(true);
          // dispatch(allActions.DataAction.recentFilter(res?.uri));
          // dispatch(allActions.DataAction.ActivityModal(true));

          // setBrightness(true);
        }}
      // keepAspectRatio
      // aspectRatio={{ width: 16, height: 9 }}
      />
      <View
        style={{
          height: 60,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={onPress}>
          <Text style={{ fontSize: 18, marginHorizontal: 20, color: "red" }}>
            Cancel
          </Text>
        </TouchableOpacity>
        <Icon
          onPress={() => cropViewRef.current.rotateImage(true)}
          name="rotate-right"
          size={40}
          color="#000"
        // style={{ position: "absolute", zIndex: 1000, right: 20, bottom: 60 }}
        />
        <TouchableOpacity
          onPress={() => {
            // console.log("done");
            dispatch(allActions.DataAction.ActivityModal(true));
            cropViewRef.current.saveImage(true, 90);
            // onPress();
          }}
        >
          <Text
            style={{ fontSize: 18, marginHorizontal: 20, fontWeight: "500" }}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
      {/* <Button
        title="save"
        onPress={() => cropViewRef.current.saveImage(true, 90)}
      /> */}
      {afterCrop && (
        <View style={{ top: 100, opacity: 0 }}>
          {filterView && filterApply()}
          {brightness && (
            <Brightness
              amount={history?.bright ? history?.bright : 1}
              onFilteringError={({ nativeEvent }) => {
                // console.log("nativeEvent.message", nativeEvent.message)
              }
              }
              onExtractImage={({ nativeEvent }) => {
                // console.log("save-photo--> bright", nativeEvent.uri);
                setAfterCropImg(nativeEvent.uri);
                setBrightness(false);
                setContrast(true);
                // setAfterCrop(false);
                // setCurrentImg(nativeEvent.uri);
                // dispatch(allActions.DataAction.recentFilter(nativeEvent.uri));
              }}
              extractImageEnabled={true}
              image={
                <Image
                  style={styles.image}
                  source={{ uri: afterCropImg }}
                  resizeMode={"contain"}
                />
              }
            />
          )}
          {contrast && (
            <Contrast
              amount={history?.contrast ? history?.contrast : 1}
              onFilteringError={({ nativeEvent }) => {
                // console.log("nativeEvent.message", nativeEvent.message)
              }
              }
              onExtractImage={({ nativeEvent }) => {
                // console.log("save-photo--contrast", nativeEvent.uri);
                setAfterCropImg(nativeEvent.uri);
                setContrast(false);
                setSaturation(true);
                // setAfterCrop(false);
                // setCurrentImg(nativeEvent.uri);
                // dispatch(allActions.DataAction.recentFilter(nativeEvent.uri));
              }}
              extractImageEnabled={true}
              image={
                <Image
                  style={styles.image}
                  source={{ uri: afterCropImg }}
                  resizeMode={"contain"}
                />
              }
            />
          )}
          {saturation && (
            <Saturate
              amount={history?.saturation ? history?.saturation : 1}
              onFilteringError={({ nativeEvent }) => {
                // console.log("nativeEvent.message", nativeEvent.message)
              }
              }
              onExtractImage={({ nativeEvent }) => {
                // console.log("save-photo--saturate", nativeEvent.uri);
                setAfterCropImg(nativeEvent.uri);
                setSaturation(false);
                setSharp(true);
                // setAfterCrop(false);
                // setCurrentImg(nativeEvent.uri);
                // dispatch(allActions.DataAction.recentFilter(nativeEvent.uri));
              }}
              extractImageEnabled={true}
              image={
                <Image
                  style={styles.image}
                  source={{ uri: afterCropImg }}
                  resizeMode={"contain"}
                />
              }
            />
          )}
          {sharp && (
            <Sharpen
              amount={history?.sharp ? history?.sharp : 0}
              onFilteringError={({ nativeEvent }) => {
                // console.log("nativeEvent.message", nativeEvent.message)
              }
              }
              onExtractImage={({ nativeEvent }) => {
                // console.log("save-photo--sharp", nativeEvent.uri);
                setAfterCropImg(nativeEvent.uri);
                setSharp(false);
                setTemp(true);
                // setAfterCrop(false);
                // setCurrentImg(nativeEvent.uri);
                // dispatch(allActions.DataAction.recentFilter(nativeEvent.uri));
              }}
              extractImageEnabled={true}
              image={
                <Image
                  style={styles.image}
                  source={{ uri: afterCropImg }}
                  resizeMode={"contain"}
                />
              }
            />
          )}
          {temp && (
            <Temperature
              amount={history?.temp ? history?.temp : 0}
              onFilteringError={({ nativeEvent }) => {
                // console.log("nativeEvent.message", nativeEvent.message)
              }
              }
              onExtractImage={({ nativeEvent }) => {
                // console.log("save-photo--temp", nativeEvent.uri);
                // setAfterCropImg(nativeEvent.uri);
                dispatch(allActions.DataAction.recentFilter(nativeEvent.uri));
                dispatch(allActions.DataAction.ActivityModal(false));
                setTemp(false);
                setAfterCrop(false);
                onPress();
                // setCurrentImg(nativeEvent.uri);
                // dispatch(allActions.DataAction.recentFilter(nativeEvent.uri));
              }}
              extractImageEnabled={true}
              image={
                <Image
                  style={styles.image}
                  source={{ uri: afterCropImg }}
                  resizeMode={"contain"}
                />
              }
            />
          )}
        </View>
      )}
    </View>
  );
};

export default Cropper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cropView: {
    width: "100%",
    height: heightPercentageToDP(75),
    // backgroundColor: '#fff'
  },
  image: {
    width: "100%",
    height: heightPercentageToDP(50),
    marginVertical: 10,
    alignSelf: "center",
  },
});
