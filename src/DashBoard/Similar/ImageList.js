import React, { useRef, useState } from "react";
import { Pressable } from "react-native";
import { View, FlatList, Dimensions, Text } from "react-native";
import FastImage from "react-native-fast-image";
import colors from "../../../constant/colors";

const ImageList = ({ similars, selectedImage, setSelectedImage, reset }) => {
  const flatListRef = useRef(null);
  // const [selectedImage, setSelectedImage] = useState(null);
  // console.log("mySimilars", similars);
  // Function to scroll to the middle of the list
  const scrollToMiddle = () => {
    flatListRef.current.scrollToIndex({
      index: Math.floor(similars?.length / 2),
      animated: true,
    });
  };
  // Function to handle image selection
  const handleImageSelection = (index, item) => {
    setSelectedImage(item);
    reset();
    if (index > 2) {
      scrollToMiddle();
    }
  };

  return (
    <View style={{ marginTop: 15 }}>
      <Text style={{ marginBottom: 15, fontSize: 13, fontWeight: "500" }}>
        Select any Item from the following Similar Stamps to compare side by
        side with your Stamp
      </Text>
      <FlatList
        ref={flatListRef}
        data={similars}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const media = item?.medias;
          const uri = media?.length ? media[0]?.media_url : null;
          return (
            <Pressable onPress={() => handleImageSelection(index, item)}>
              <FastImage
                source={{ uri: uri }}
                style={[
                  selectedImage?.id === item?.id
                    ? {
                        width: 75,
                        height: 55,
                        borderWidth: 2,
                        borderColor: colors.lightTheme,
                        marginHorizontal: 5,
                        // marginBottom: 3,
                      }
                    : { width: 70, height: 50, marginHorizontal: 5, opacity: 0.6 },
                ]}
                resizeMode="cover"
              />
            </Pressable>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={{ height: 20 }} />
    </View>
  );
};

export { ImageList };
