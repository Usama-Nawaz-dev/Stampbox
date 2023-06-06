import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import { EDITICONS } from "./IconPaths";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Slider from "@react-native-community/slider";
import {
  Brightness,
  Contrast,
  Temperature,
  Saturate,
  Sharpen,
} from "react-native-image-filter-kit";
import Cropper from "./Cropper";
import { useDispatch, useSelector } from "react-redux";
import allActions from "../../redux/actions";
// import Image from "react-native-fast-image";
const Edits = ({ setShowFooter, setFilter, filter, show, img, original }) => {
  // const cropViewRef = useRef();
  const dispatch = useDispatch();
  const recentImg = useSelector((state) => state.DataReducer.filter_img);
  const history = useSelector((state) => state.DataReducer.history);
  const imgUri = recentImg ? recentImg : img;
  const [bright, setBright] = useState(1);
  const [brightnessUpdated, setBrightnessUpdated] = useState(false);
  const [contrast, setContrast] = useState(1);
  const [contrastUpdated, setContrastUpdated] = useState(false);
  const [saturation, setSaturation] = useState(1);
  const [saturationtUpdated, setSaturationUpdated] = useState(false);
  const [sharp, setSharp] = useState(0);
  const [sharpUpdated, setSharpUpdated] = useState(false);
  const [temp, setTemp] = useState(0);
  const [tempUpdated, setTempUpdated] = useState(false);
  const [filterVal, setFilterVal] = useState(0);
  const [currentImg, setCurrentImg] = useState(null);
  const [cropView, setCropView] = useState(false);
  const renderFilterComponent = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{ marginTop: 10 }}
        onPress={() => {
          setFilter(item);
          currentImg &&
            dispatch(allActions.DataAction.recentFilter(currentImg));
          if (index !== 0) {
            setShowFooter(true);
          } else {
            setCropView(true);
          }
        }}
      >
        <Text style={styles.filterTitle}>{item.icon}</Text>
        <View
          style={{
            height: 100,
            width: 100,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: "lightgrey",
            alignItems: "center",
            justifyContent: "center",
            margin: 10,
          }}
        >
          <Image
            style={{ height: 60, width: 60 }}
            source={item.path}
            resizeMode={"contain"}
          />
        </View>
      </TouchableOpacity>
    );
  };
  const image = (
    <Image
      style={styles.image}
      source={{ uri: imgUri }}
      resizeMode={"contain"}
    />
  );
  const onDoneUpdated = () => {
    if (!filter) {
      // console.log("do nothing");
    } else if (filter?.id == 1) {
      // console.log("cropper");
    } else if (filter?.id == 2) {
      dispatch(allActions.DataAction.recentFilterHistory({ ...history, bright: bright }));
    } else if (filter?.id == 3) {

      // dispatch(allActions.DataAction.recentFilterHistory(contrast));
      dispatch(allActions.DataAction.recentFilterHistory({ ...history, contrast: contrast }));
    } else if (filter?.id == 4) {
      // if (saturation > 1) {
      //   setSaturationUpdated(true);

      // }
      // dispatch(allActions.DataAction.recentFilterHistory(saturation));
      dispatch(allActions.DataAction.recentFilterHistory({ ...history, saturation: saturation }));
    } else if (filter?.id == 6) {
      // if (sharp > 0) {
      //   setSharpUpdated(true);
      // }
      // dispatch(allActions.DataAction.recentFilterHistory(sharp));
      dispatch(allActions.DataAction.recentFilterHistory({ ...history, sharp: sharp }));
    } else if (filter?.id == 7) {
      // if (temp > 0) {
      //   setTempUpdated(true);
      // }
      // dispatch(allActions.DataAction.recentFilterHistory(temp));
      dispatch(allActions.DataAction.recentFilterHistory({ ...history, temp: temp }));
    }
  };
  const cancelCrop = () => {
    setCropView(false);
    setFilter(null)
  }
  const onDone = () => {
    // console.log("val", val);
    dispatch(allActions.DataAction.recentFilter(currentImg));
    onDoneUpdated();
    onCancel();
    // onDoneUpdated();
    setShowFooter(false);
  };
  const onCancel = () => {
    if (!filter) {
      // console.log("do nothing");
    } else if (filter?.id == 1) {
      // console.log("cropper");
    } else if (filter?.id == 2) {
      setBright(1);
    } else if (filter?.id == 3) {
      setContrast(1);
    } else if (filter?.id == 4) {
      setSaturation(1);
    } else if (filter?.id == 6) {
      setSharp(0);
    } else if (filter?.id == 7) {
      setTemp(0);
    }
  };
  const filterChecker = () => {
    if (!filter) {
      return image;
    } else if (filter?.id == 1) {
      return <Cropper onPress={() => cancelCrop()} imgUri={imgUri} original={original} />;
    } else if (filter?.id == 2) {
      return (
        <Brightness
          amount={bright}
          onFilteringError={({ nativeEvent }) => {
            // console.log("nativeEvent.message", nativeEvent.message)
          }
          }
          onExtractImage={({ nativeEvent }) => {
            // console.log("save-photo", nativeEvent.uri);
            setCurrentImg(nativeEvent.uri);
            // dispatch(allActions.DataAction.recentFilter(nativeEvent.uri));
          }}
          extractImageEnabled={true}
          image={
            <Image
              style={styles.image}
              source={{ uri: imgUri }}
              resizeMode={"contain"}
            />
          }
        />
      );
    } else if (filter?.id == 3) {
      return (
        <Contrast
          amount={contrast}
          onFilteringError={({ nativeEvent }) => {
            // console.log("nativeEvent.message", nativeEvent.message)
          }
          }
          onExtractImage={({ nativeEvent }) => {
            // console.log("save-photo", nativeEvent.uri);
            setCurrentImg(nativeEvent.uri);
            // dispatch(allActions.DataAction.recentFilter(nativeEvent.uri));
          }}
          extractImageEnabled={true}
          image={image}
        />
      );
    } else if (filter?.id == 4) {
      return (
        <Saturate
          amount={saturation}
          onFilteringError={({ nativeEvent }) => {
            // console.log("nativeEvent.message", nativeEvent.message)
          }
          }
          onExtractImage={({ nativeEvent }) => {
            // console.log("save-photo", nativeEvent.uri);
            setCurrentImg(nativeEvent.uri);
            // dispatch(allActions.DataAction.recentFilter(nativeEvent.uri));
          }}
          extractImageEnabled={true}
          image={image}
        />
      );
    } else if (filter?.id == 6) {
      return (
        <Sharpen
          amount={sharp}
          onFilteringError={({ nativeEvent }) => {
            // console.log("nativeEvent.message", nativeEvent.message)
          }
          }
          onExtractImage={({ nativeEvent }) => {
            // console.log("save-photo", nativeEvent.uri);
            setCurrentImg(nativeEvent.uri);
            // dispatch(allActions.DataAction.recentFilter(nativeEvent.uri));
          }}
          extractImageEnabled={true}
          image={image}
        />
      );
    } else if (filter?.id == 7) {
      return (
        <Temperature
          amount={temp}
          onFilteringError={({ nativeEvent }) => {
            // console.log("nativeEvent.message", nativeEvent.message)
          }
          }
          onExtractImage={({ nativeEvent }) => {
            // console.log("save-photo", nativeEvent.uri);
            setCurrentImg(nativeEvent.uri);
            // dispatch(allActions.DataAction.recentFilter(nativeEvent.uri));
          }}
          extractImageEnabled={true}
          image={image}
        />
      );
    }
  };
  const SliderCheck = () => {
    if (filter?.id == 2) {
      return (
        <Slider
          style={{ width: "90%", alignSelf: "center" }}
          minimumValue={1}
          maximumValue={2}
          value={bright}
          onSlidingComplete={setBright}
        />
      );
    } else if (filter?.id == 3) {
      return (
        <Slider
          style={{ width: "90%", alignSelf: "center" }}
          minimumValue={1}
          maximumValue={2}
          value={contrast}
          onSlidingComplete={setContrast}
        />
      );
    } else if (filter?.id == 4) {
      return (
        <Slider
          style={{ width: "90%", alignSelf: "center" }}
          minimumValue={1}
          maximumValue={5}
          value={saturation}
          onSlidingComplete={setSaturation}
        />
      );
    } else if (filter?.id == 6) {
      return (
        <Slider
          style={{ width: "90%", alignSelf: "center" }}
          minimumValue={0}
          maximumValue={5}
          value={sharp}
          onSlidingComplete={setSharp}
        />
      );
    } else if (filter?.id == 7) {
      return (
        <Slider
          style={{ width: "90%", alignSelf: "center" }}
          minimumValue={-10}
          maximumValue={10}
          value={temp}
          onSlidingComplete={setTemp}
        />
      );
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.7, backgroundColor: "#00000011" }}>
        {filterChecker()}
      </View>
      {!cropView && (
        <>
          {!show ? (
            <View style={{ flex: 0.3 }}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={EDITICONS}
                keyExtractor={(item) => item.icon}
                horizontal={true}
                renderItem={renderFilterComponent}
              />
            </View>
          ) : (
            <View style={{ flex: 0.3, justifyContent: "space-between" }}>
              <Text
                style={[
                  styles.filterTitle,
                  { fontSize: 16, fontWeight: "bold" },
                ]}
              >
                {filter.icon}
              </Text>
              {SliderCheck()}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  backgroundColor: "#fff",
                  // marginHorizontal: 10,
                  height: 50,
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    onCancel();
                    setShowFooter(false);
                  }}
                >
                  <Text style={{ fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onDone}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default Edits;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: heightPercentageToDP(50),
    marginVertical: 10,
    alignSelf: "center",
  },
  filterTitle: {
    fontSize: 14,
    textAlign: "center",
    // top: 10,
  },
});
