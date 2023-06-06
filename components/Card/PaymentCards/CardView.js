import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import defaultIcons from "./Icons";
import colors from "../../../constant/colors";
import { images } from "../../../assets/images/Images";

const BASE_SIZE = { width: wp(85), height: wp(55) };

const s = StyleSheet.create({
  cardContainer: {},
  cardFace: {},
  icon: {
    // position: "absolute",
    // top: 15,
    // right: 15,
    width: 60,
    height: 40,
    resizeMode: "contain",
  },
  baseText: {
    color: "rgba(255, 255, 255, 0.8)",
    backgroundColor: "transparent",
  },
  placeholder: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  focused: {
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 1)",
  },
  number: {
    fontSize: 21,
    position: "absolute",
    top: 95,
    left: 28,
  },
  name: {
    fontSize: 16,
    position: "absolute",
    bottom: 20,
    left: 25,
    right: 100,
  },
  validStyle: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    height: 50,
  },
  header: {
    flex: 0.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  expiryLabel: {
    fontSize: 9,
    // position: "absolute",
    // bottom: 40,
    // left: 218,
  },
  uncheck: {
    height: 18,
    width: 18,
    borderRadius: 3,
    backgroundColor: "#fff",
    // borderWidth: 1.8,
    // borderColor: "grey",
    marginRight: 6,
  },
  primary: { flexDirection: "row", alignItems: "center" },
  expiry: {
    fontSize: 16,
    position: "absolute",
    bottom: 20,
    left: 220,
  },
  amexCVC: {
    fontSize: 16,
    position: "absolute",
    top: 73,
    right: 30,
  },
  cvc: {
    fontSize: 16,
    position: "absolute",
    top: 80,
    right: 30,
  },
  body: {
    flex: 0.6,
    marginHorizontal: 15,
    justifyContent: "space-around",
  },
  innerValid: {
    height: 40,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CardView extends Component {
  static propTypes = {
    focused: PropTypes.string,

    brand: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.string,
    expiry: PropTypes.string,
    cvc: PropTypes.string,
    placeholder: PropTypes.object,

    scale: PropTypes.number,
    fontFamily: PropTypes.string,
    imageFront: PropTypes.number,
    imageBack: PropTypes.number,
    customIcons: PropTypes.object,
  };

  static defaultProps = {
    name: "",
    placeholder: {
      number: "•••• •••• •••• ••••",
      name: "FULL NAME",
      expiry: "••/••",
      cvc: "•••",
    },

    scale: 1,
    fontFamily: Platform.select({ ios: "Courier", android: "monospace" }),
    imageFront: require("./images/card-front.png"),
    imageBack: require("./images/card-back.png"),
  };

  render() {
    const {
      focused,
      brand,
      name,
      number,
      expiry,
      cvc,
      customIcons,
      placeholder,
      imageFront,
      imageBack,
      scale,
      fontFamily,
      defaultCard,
      defaultFunc,
      del,
    } = this.props;

    const Icons = { ...defaultIcons, ...customIcons };
    const isAmex = brand === "amex";
    const shouldFlip = !isAmex && focused === "cvc";

    const containerSize = { ...BASE_SIZE, height: BASE_SIZE.height * scale };
    const transform = {
      transform: [
        { scale },
        { translateY: (BASE_SIZE.height * (scale - 1)) / 2 },
      ],
    };

    return (
      <View style={[s.cardContainer, containerSize]}>
        <ImageBackground
          style={[BASE_SIZE, s.cardFace, transform]}
          source={imageFront}
        >
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View style={s.header}>
              {defaultCard ? (
                <Text
                  style={[
                    s.baseText,
                    { fontFamily, color: "rgba(255, 255, 255, 1)" },
                  ]}
                  numberOfLines={1}
                >
                  Primary Card
                </Text>
              ) : (
                <Pressable onPress={defaultFunc} style={s.primary}>
                  <View style={s.uncheck} />
                  <Text style={[s.baseText, { fontFamily }]} numberOfLines={1}>
                    Make Primary
                  </Text>
                </Pressable>
              )}

              {/* <Icon onPress={del} name="delete" size={22} color="#fff" /> */}
              <TouchableOpacity onPress={del}>
                <Image
                  source={images.Remove}
                  style={{
                    width: hp(2.5),
                    height: hp(2.5),
                    tintColor: colors.cWhite,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={s.body}>
              <Text
                style={[s.baseText, { fontFamily, fontSize: 16 }]}
                numberOfLines={1}
              >
                {!name ? placeholder.name : name.toUpperCase()}
              </Text>
              <Text style={[s.baseText, { fontFamily, fontSize: 18 }]}>
                {!number ? placeholder.number : number}
              </Text>
              <View style={s.validStyle}>
                <View style={s.innerValid}>
                  <Text
                    style={[
                      s.baseText,
                      { fontFamily, fontSize: 12, marginRight: 12 },
                    ]}
                  >
                    VALID TILL
                  </Text>
                  <Text
                    style={[s.baseText, { fontFamily, fontSize: 18, left: -5 }]}
                  >
                    {!expiry ? placeholder.expiry : expiry}
                  </Text>
                </View>

                <Image style={[s.icon]} source={Icons[brand]} />
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
