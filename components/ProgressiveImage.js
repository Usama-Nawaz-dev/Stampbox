import React, { Component } from "react";
import { Image, Animated, View } from "react-native";

// Example
//   <ProgressiveImage
//     style={styles.progressiveImage}
//     defaultSource={Images.logo}
//     source='https://upload.wikimedia.org/wikipedia/commons/c/cc/ESC_large_ISS022_ISS022-E-11387-edit_01.JPG'/>

export class ProgressiveImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnailOpacity: new Animated.Value(0),
      load: false,
    };
  }

  mainImageLoad = () => {
    window.requestAnimationFrame((time) => {
      Animated.timing(this.state.thumbnailOpacity, {
        toValue: 0,
        duration: 250,
      }).start();
    });
  };

  onThumbnailLoad = () => {
    Animated.timing(this.state.thumbnailOpacity, {
      toValue: 1,
      duration: 250,
    }).start();
  };

  handleImage() {
    if (this.props.source || this.props.thumbnail) {
      return (
        <View>
          <Animated.Image
            resizeMode={"cover"}
            style={[{ position: "absolute" }, this.props.style]}
            source={this.props.source}
            onLoad={this.mainImageLoad}
          />
          <Animated.Image
            resizeMode={"cover"}
            style={[{ opacity: this.state.thumbnailOpacity }, this.props.style]}
            source={this.props.defaultSource}
            onLoad={this.onThumbnailLoad}
          />
        </View>
      );
    } else {
      return <Image style={this.props.style} resizeMode={"contain"} />;
    }
  }

  render() {
    return (
      <View
        width={this.props.style.width}
        height={this.props.style.height}
        backgroundColor={"#CCC"}
      >
        {this.handleImage()}
      </View>
    );
  }
}
