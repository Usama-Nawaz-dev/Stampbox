import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image
} from "react-native";
import React, { useState, useRef } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import AppText from "../components/AppText";
//   import { rawText } from "../Constants";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// import Entypo from 're'
import Entypo from "react-native-vector-icons/Entypo";


import { images } from '../assets/images/Images'
import colors from "../constant/colors";
const { width, height } = Dimensions.get("window");

const Data = [
  {id: 1, heading: 'Manage Your Collection', img: images.OnBoard1,
    description: `Manage your collection digitally, scan your stamps, create albums, edit information, show them to the world, access inventory reports, and more importantly, share their status on the marketplace.`},
  {id: 2, heading: 'Worldwide Marketplace', img: images.OnBoard2,
    description: `Worldwide Marketplace, where you can trade, sell, buy, make offers, create bounties, participate in Auctions, Exhibitions and so much more`},
  {id: 3, heading: 'Earn Coins', img: images.OnBoard3,
    description: `Earn Trade Coins in addition to the monthly coin allowance you can earn additional coins by participating in virtual events, contributing to Community Database, helping other members with the information in their collections, and rating your transaction experience with other members. Use your Coins to trade, buy, bid on Auctions and so much more.`},
  {id: 4, heading: 'Connect with others', img: images.OnBoard4,
    description: `Find, and connect with other collectors locally  or internationally and stay tuned on their activities and needs. Build your own network of people with the same interests and specialties.`},
  {id: 5, heading: 'Search for Community', img: images.OnBoard5,
    description: `Search our community Stampbox Catalogue which is maintained and updated by members with filtering capabilities to help you find exactly what you are looking for.`},
]

const OnBoarding = ({ done }) => {
  const [sliderState, setSliderState] = useState({ currentPage: 0 });
  const scrollViewRef = useRef(null);

  const toNextPage = () => {
    let { currentPage } = sliderState;
    currentPage += 1;
    scrollViewRef.current?.scrollTo({x: width * currentPage, animated: true});
 };

  const setSliderPage = (event: any) => {
    const { currentPage } = sliderState;
    const { x } = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.floor(x / width);
    if (indexOfNextScreen !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      });
    }
  };

  const { currentPage: pageIndex } = sliderState;

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View
        style={{ 
          flex: 1, 
          backgroundColor: colors.cWhite, 
          // backgroundColor: "rgba(242, 237, 217, .5)", 
        }}
      >
        <ScrollView
          style={{ flex: 1 }}
          horizontal={true}
          ref={scrollViewRef}
          scrollEventThrottle={16}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={(event: any) => {
            setSliderPage(event);
          }}
        >
         {Data.map((item, index) => (<View style={{ width, height, }} key={item.id}>
            <Image source={item.img} style={styles.imageStyle}/>
            <View style={styles.wrapper}>
              <Pressable onPress={() => done()} style={{alignSelf: "flex-end",}}>
                <Text style={styles.skipText}>SKIP</Text>
              </Pressable>
                <Text style={styles.heading}>{item.heading}</Text>
                <Text style={styles.textStyling}>{item.description}</Text>
            </View>
          </View>))}
        </ScrollView>
        <View style={styles.paginationWrapper}>
          {Array.from(Array(5).keys()).map((key, index) => (
            <View
              style={[
                styles.paginationDots,
                { opacity: pageIndex === index ? 1 : 0.2 },
              ]}
              key={index}
            />
          ))}
        </View>
        <Pressable onPress={Data?.length - 1 == sliderState.currentPage ? 
          () => done() : toNextPage} 
          style={styles.nextBtn}>
          <Text style={styles.skipText}>NEXT</Text>
          <Entypo name='chevron-right' size={14} color={'#585755'}/>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    // height: PixelRatio.getPixelSizeForLayoutSize(100),
    height: height/2,
    width: width,
    alignSelf: "center",
    // resizeMode: "contain",
  },
  wrapper: {
    width: "100%",
    marginTop: -20,
    alignSelf: "center",
      // backgroundColor: "rgba(242, 237, 217, 1)",
    backgroundColor: colors.cWhite,
    borderRadius: 20,
    padding: 15
  },
  textStyling: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    color: '#585755',
    textAlign: "left",
    letterSpacing: .5,
    lineHeight: 22,
    fontWeight: "400",
    marginTop: 15,
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: "#585755",
  },
  heading: {
    fontSize: 18,
    maxWidth: 140,
    fontFamily: 'IBMPlexSans-Bold',
    color: '#3B3B3B',
    marginTop: 80
  },
  paginationWrapper: {
    position: "absolute",
    bottom: 35,
    left: wp(3),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  paginationDots: {
    height: 8,
    width: 8,
    borderRadius: 8 / 2,
    backgroundColor: "#BA4D3E",
    marginLeft: wp(3),
  },
  nextBtn: {
    alignSelf: "flex-end", 
    flexDirection: 'row',
    alignItems: 'center',
    right: wp(3),
    bottom: 30
  }
});
export default OnBoarding;
