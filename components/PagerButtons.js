import React, { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

export default function PagerButtons({ active, setActive, setImgUri, imgUri }) {
  return (
    <View style={styles.container}>
      {/* <Text style={{ marginBottom: 20 }}>{active}</Text> */}
      <Button
        buttons={["FILTER", "EDIT"]}
        onClick={setActive}
        active={active}
        setImgUri={setImgUri}
        imgUri={imgUri}
      />
    </View>
  );
}

function Button({ buttons, onClick, active, setImgUri, imgUri }) {
  const recentImg = useSelector((state) => state.DataReducer.filter_img);
  const [btnContainerWidth, setWidth] = useState(0);
  const btnWidth = btnContainerWidth / buttons.length;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateXOpposit = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const onPress = (i) => {
    console.log("i am pressed", i);
    if (i == 0 && recentImg) {
        console.log("recent", recentImg);
        console.log("imgUri", imgUri)
      if (imgUri !== recentImg) {
          console.log("not equal")
        setImgUri(recentImg);
      }
    }

    onClick(i);
    Animated.spring(translateX, {
      toValue: i * btnWidth,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  };
  return (
    <View
      style={styles.btnContainer}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {buttons.map((btn, i) => (
        <TouchableOpacity
          key={btn}
          style={styles.btn}
          onPress={() => onPress(i)}
        >
          <Text style={{ color: active == i ? "#000" : "grey" }}>{btn}</Text>
        </TouchableOpacity>
      ))}
      <Animated.View
        style={[
          styles.animatedBtnContainer,
          { width: btnWidth, transform: [{ translateX }] },
        ]}
      >
        {buttons.map((btn) => (
          <Animated.View
            key={btn}
            style={[
              styles.animatedBtn,
              {
                width: btnWidth,
                transform: [{ translateX: translateXOpposit }],
              },
            ]}
          >
            <Text style={styles.btnTextActive}>{btn}</Text>
          </Animated.View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // paddingHorizontal: 10,
  },
  btnContainer: {
    height: 40,
    borderRadius: 5,
    overflow: "hidden",
    flexDirection: "row",
    // backgroundColor: '#00000011',
    width: "100%",
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animatedBtnContainer: {
    height: 2,
    top: 38,
    flexDirection: "row",
    position: "absolute",
    overflow: "hidden",
    backgroundColor: "#444",
  },
  animatedBtn: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
});
