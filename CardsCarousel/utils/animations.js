import { getInputRangeFromIndexes } from "react-native-snap-carousel";

export function scrollInterpolator(index, carouselProps) {
  const range = [2, 1, 0, -1];
  const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
  const outputRange = range;

  return { inputRange, outputRange };
}
export function animatedStyles(index, animatedValue, carouselProps) {
  const sizeRef = carouselProps.vertical
    ? carouselProps.itemHeight
    : carouselProps.itemWidth;
  const translateProp = carouselProps.vertical ? "translateY" : "translateX";

  return {
    zIndex: carouselProps.data.length - index,
    opacity: animatedValue.interpolate({
      inputRange: [-1, 0, 1, 2],
      outputRange: [0.75, 1, 0.6, 0.4],
    }),
    transform: [
      {
        rotate: animatedValue.interpolate({
          inputRange: [-1, 0, 1, 2],
          outputRange: ["0deg", "0deg", "5deg", "8deg"],
          extrapolate: "clamp",
        }),
      },
      {
        scale: animatedValue.interpolate({
          inputRange: [-1, 0, 1, 2],
          outputRange: [0.96, 1, 0.85, 0.7],
        }),
      },
      {
        [translateProp]: animatedValue.interpolate({
          inputRange: [-1, 0, 1, 2],
          outputRange: [0, 0, -sizeRef + 30, -sizeRef * 2 + 45],
          extrapolate: "clamp",
        }),
      },
    ],
  };
}
