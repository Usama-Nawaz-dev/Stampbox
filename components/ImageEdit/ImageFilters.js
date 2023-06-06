import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  View,
  ActivityIndicator,
} from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
// import Image from "react-native-fast-image";

import { useDispatch, useSelector } from "react-redux";
import colors from "../../constant/colors";
import allActions from "../../redux/actions";
import { FILTERS } from "./FILTERS";

const ImageFilters = ({ imgUri, setImgUri }) => {
  const dispatch = useDispatch();
  // console.log("imgUri-->", imgUri)
  const recentImg = useSelector((state) => state.DataReducer.filter_img);
  const recentIndex = useSelector((state) => state.DataReducer.filter_index);
  const extractedUri = useRef(imgUri);
  const [selectedFilterIndex, setIndex] = useState(recentIndex);
  const [saturation, setSaturation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);

  const [img, setImg] = useState(imgUri);
  const onExtractImage = ({ nativeEvent }) => {
    extractedUri.current = nativeEvent.uri;
    // setImg(nativeEvent.uri);
    dispatch(allActions.DataAction.recentFilter(nativeEvent.uri));
    // console.log("nativeEvent.uri", nativeEvent.uri)
  };
  const [current, setCurrent] = useState(null);

  const onSelectFilter = (selectedIndex) => {
    // console.log(selectedIndex);
    setIndex(selectedIndex);
    dispatch(allActions.DataAction.recentFilterIndex(selectedIndex));
  };
  useEffect(() => {
    // function creation
    function cancelLoading() {
      setLoading(false);
      setLoading2(false);
    }
    let id = setTimeout(cancelLoading, 5000);

    // clearTimeout
    // clearTimeout(id);
  }, []);
  // const image = (
  //   <Image
  //     onLoadStart={() => setLoading(true)}
  //     onLoadEnd={() => setLoading(false)}
  //     style={styles.filterSelector}
  //     source={{ uri: imgUri }}
  //     resizeMode={"contain"}
  //   />
  // );
  const renderFilterComponent = ({ item, index }) => {
    // console.log(index)
    const FilterComponent = item.filterComponent;

    return (
      <>
        {loading ? (
          <View>
            <Text style={{ fontSize: 14, textAlign: "center" }}>
              {item.title}
            </Text>
            <View
              style={[
                styles.filterSelector,
                {
                  backgroundColor: "lightgrey",
                  alignItems: "center",
                  justifyContent: "center",
                  // height: 150,
                },
              ]}
            >
              <ActivityIndicator color={colors.theme} />
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={() => onSelectFilter(index)}>
            <Text
              style={[
                styles.filterTitle,
                {
                  fontWeight: selectedFilterIndex === index ? "bold" : "normal",
                },
              ]}
            >
              {item.title}
            </Text>
            <FilterComponent
              image={
                <Image
                  // onLoadStart={() => console.log(item.IsLoaded)}
                  // onLoadEnd={() => { console.log(item.IsLoaded)}}
                  style={styles.filterSelector}
                  source={{ uri: imgUri }}
                  resizeMode={"contain"}
                />
              }
            />
          </TouchableOpacity>
        )}
      </>
    );
  };

  const SelectedFilterComponent = FILTERS[selectedFilterIndex].filterComponent;

  return (
    <>
      {selectedFilterIndex === 0 ? (
        <View
          style={{
            flex: 0.7,
            backgroundColor: "#00000011",
            justifyContent: "center",
          }}
        >
          {loading2 ? (
            <View
              style={[
                styles.image,
                {
                  backgroundColor: "lightgrey",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 350,
                },
              ]}
            >
              <ActivityIndicator size="large" color={colors.theme} />
            </View>
          ) : (
            <Image
              style={styles.image}
              source={{ uri: imgUri }}
              resizeMode={"contain"}
            />
          )}
        </View>
      ) : (
        <View
          style={{
            flex: 0.7,
            backgroundColor: "#00000011",
            justifyContent: "center",
          }}
        >
          {loading2 ? (
            <View
              style={[
                styles.image,
                {
                  backgroundColor: "lightgrey",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 350,
                },
              ]}
            >
              <ActivityIndicator size="large" color={colors.theme} />
            </View>
          ) : (
            <SelectedFilterComponent
              onExtractImage={onExtractImage}
              //   clearCachesMaxRetries={5}
              extractImageEnabled={true}
              image={
                <Image
                  style={styles.image}
                  // onLoadStart={() => setLoading2(true)}
                  // onLoadEnd={() => setLoading2(false)}
                  source={{ uri: imgUri }}
                  resizeMode={"contain"}
                />
              }
            />
          )}
        </View>
      )}
      <View style={{ flex: 0.3 }}>
        <FlatList
          data={FILTERS}
          keyExtractor={(item) => item.title}
          horizontal={true}
          renderItem={renderFilterComponent}
        />
      </View>
    </>
  );
};
export default ImageFilters;
const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: heightPercentageToDP(50),
    // marginVertical: 10,
    alignSelf: "center",
  },
  filterSelector: {
    width: 150,
    height: 150,
    margin: 10,
  },
  filterTitle: {
    fontSize: 14,
    textAlign: "center",
    top: 10,
  },
});

// <Temperature
// amount={saturation}
// onFilteringError={({ nativeEvent }) =>
//   console.log("nativeEvent.message", nativeEvent.message)
// }
// onExtractImage={({ nativeEvent }) =>
//   //   console.log("save-photo", nativeEvent.uri)
//   setTempImg(nativeEvent.uri)
// }
// extractImageEnabled={true}
// image={image}
// />
// <Slider
// style={{ width: "95%" }}
// minimumValue={-10}
// maximumValue={10}
// value={saturation}
// onSlidingComplete={setSaturation}
// />
