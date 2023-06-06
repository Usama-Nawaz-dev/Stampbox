import React, { useRef, useEffect, useState, useContext } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

const { width } = Dimensions.get("window");

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../constant/colors";
import ThemeContext from "../src/Context/ThemeContext";
// import { dark as theme } from "../constant/colorsConfig";

const HeaderTabs = (props) => {
  const { headers, renderList } = props;
  const [active, setActive] = useState(0);
  const headerScrollView = useRef();
  const itemScrollView = useRef();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (props?.setShow) {
      props?.setShow(active);
    }
    headerScrollView.current.scrollToIndex({
      index: active,
      viewPosition: 0.5,
    });
  }, [active]);
  const onPressHeader = (index) => {
    itemScrollView.current.scrollToIndex({ index });
    setActive(index);
  };
  const onMomentumScrollEnd = (e) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (active != newIndex) {
      setActive(newIndex);
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: theme?.white}]}>
      <FlatList
        data={headers ? headers : null}
        ref={headerScrollView}
        keyExtractor={(item) => item}
        horizontal
        style={styles.headerScroll}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View >
            <TouchableOpacity
              onPress={() => onPressHeader(index)}
              key={item}
              style={[
                styles.headerItem,
                {
                  backgroundColor: active == index ? theme?.white : theme?.white,
                  height: 50,
                },
              ]}
            >
              <Text
                style={{
                  color: active == index ? theme?.theme : theme?.lightText,
                  padding: 4,
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
            {active == index && <View style={[styles.headerBar, { backgroundColor: theme?.theme}]} />}
          </View>
        )}
      />
      <View style={[styles.line, { backgroundColor: theme?.borderColor}]} />
      <FlatList
        data={headers ? headers : null}
        ref={itemScrollView}
        keyExtractor={(item) => item}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={renderList ? renderList : null}
      />
    </View>
  );
};

export default HeaderTabs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: wp(100)
    // backgroundColor: 'red'
  },
  headerScroll: {
    flexGrow: 0,
  },
  headerItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
    // backgroundColor: 'orange'
  },
  headerBar: {
    height: 2,
    width: "100%",
    alignSelf: "center",
    backgroundColor: Colors.theme,
    position: "absolute",
    bottom: 0,
    // backgroundColor: 'orange'
  },
  line: { height: 1, width: wp(100), backgroundColor: "lightgrey" },
  mainItem: {
    width: width,
    // borderWidth: 5,
    // borderColor: 'red',
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
