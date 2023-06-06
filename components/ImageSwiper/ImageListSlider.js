import React, { Component, createRef } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
  Text,
} from "react-native";

import { ChildItem } from "./ChildItem";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import Fonts from "../../assets/fonts/Fonts";
import colors from "../../constant/colors";

export class ImageListSlider extends Component {
  slider = createRef();

  static defaultProps = {
    data: [],
    imageKey: "image",
    local: false,
    width: Math.round(Dimensions.get("window").width),
    height: 230,
    separatorWidth: 0,
    loop: true,
    indicator: true,
    indicatorStyle: {},
    indicatorContainerStyle: {},
    indicatorActiveColor: "#3498db",
    indicatorInActiveColor: "#bdc3c7",
    indicatorActiveWidth: 6,
    animation: true,
    autoscroll: true,
    timer: 3000,
    onPress: {},
    contentContainerStyle: {},
    component: <ChildItem />,
  };

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      data: this.props.data,
    };
    this.refresh = this.refresh.bind(this);
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    if (this.props.autoscroll) {
      this.startAutoPlay();
    }
  }

  componentWillUnmount() {
    if (this.props.autoscroll) {
      this.stopAutoPlay();
    }
  }
  refresh = (val) => {
    // console.log("val", val)
    if (val) {
      this.setState({
        index: 0,
        data: val,
      });
    }
  };

  render() {
    const itemWidth = this.props.width;
    const separatorWidth = this.props.separatorWidth;
    const totalItemWidth = itemWidth + separatorWidth;
    // console.log('this==>', this.slider.current?._getItem)
    return (
      <View>
        {this.state.data.length > 1 && (
          <View style={styles.count}>
            <Text style={styles.text}>
              {this.state.index + 1}/{this.state.data.length}
            </Text>
          </View>
        )}
        <FlatList
          ref={this.slider}
          horizontal
          pagingEnabled={true}
          snapToInterval={totalItemWidth}
          decelerationRate="fast"
          bounces={false}
          contentContainerStyle={this.props.contentContainerStyle}
          data={this.state.data}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) =>
            React.cloneElement(this.props.component, {
              style: {
                width: this.props.width,
                borderRadius: this.props.borderRadius,
              },
              item: item,
              imageKey: this.props.imageKey,
              onPress: this.props.onPress,
              index: this.state.index % this.props.data.length,
              active: index === this.state.index,
              local: this.props.local,
              height: this.props.height,
              resizeMode: this.props.resizeMode
            })
          }
          ItemSeparatorComponent={() => (
            <View style={{ width: this.props.separatorWidth }} />
          )}
          keyExtractor={(item, index) => item.toString() + index}
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={this.viewabilityConfig}
          getItemLayout={(data, index) => ({
            length: totalItemWidth,
            offset: totalItemWidth * index,
            index,
          })}
          windowSize={1}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          removeClippedSubviews={true}
        />
      </View>
    );
  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    if (viewableItems.length > 0) {
      let currentIndex = viewableItems[0].index;
      if (
        currentIndex % this.props.data.length === this.props.data.length - 1 &&
        this.props.loop
      ) {
        this.setState({
          index: currentIndex,
          data: [...this.state.data, ...this.props.data],
        });
      } else {
        this.setState({ index: currentIndex });
      }

      if (this.props.currentIndexCallback) {
        this.props.currentIndexCallback(currentIndex);
      }
    }
  };

  viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  changeSliderListIndex = () => {
    if (this.props.animation) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeIn);
    }
    this.setState({ index: this.state.index + 1 });
    this.slider.current.scrollToIndex({
      index: this.state.index,
      animated: true,
    });
  };

  startAutoPlay = () => {
    this.sliderTimer = setInterval(
      this.changeSliderListIndex,
      this.props.timer
    );
  };

  stopAutoPlay = () => {
    if (this.sliderTimer) {
      clearInterval(this.sliderTimer);
      this.sliderTimer = null;
    }
  };
}

const styles = StyleSheet.create({
  image: {
    height: 230,
    resizeMode: "stretch",
  },
  indicatorContainerStyle: {
    marginTop: 18,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  count: {
    position: "absolute",
    top: wp(3),
    right: wp(3),
    backgroundColor: `${colors.cBlack}99`,
    zIndex: 999,
    padding: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 0.84,
  },
  text: {
    fontSize: 12,
    color: colors.cWhite,
    fontFamily: Fonts.IBM_Regular,
  },
});
