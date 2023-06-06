import React, { useRef, useState } from "react";
import { View, Text } from "react-native";

import Carousel from "react-native-snap-carousel";
import { sliderWidth, itemWidth } from "./styles/SliderEntry.style";
import { SliderEntry } from "./components/SliderEntry";
import styles, { colors } from "./styles/index.style";
import { scrollInterpolator, animatedStyles } from "./utils/animations";

export function CardsCarousel({ cards, defaultCard, refresh }) {
  const [current, setCurrent] = useState(0);
  function renderLightItem({ item, index }) {
    return (
      <SliderEntry
        data={item}
        index={index}
        current={current}
        cus_id={defaultCard?.id}
        refresh={refresh}
      />
    );
  }

  return (
    <View style={[styles.exampleContainerLight]}>
      <Carousel
        data={cards}
        onSnapToItem={(val) => setCurrent(val)}
        renderItem={renderLightItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        containerCustomStyle={styles.slider}
        contentContainerCustomStyle={styles.sliderContentContainer}
        scrollInterpolator={scrollInterpolator}
        slideInterpolatedStyle={animatedStyles}
        useScrollView={true}
      />
    </View>
  );
}
