import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const { width } = Dimensions.get("window");

interface OnboardingPaginationProps {
  data: any[];
  scrollX: SharedValue<number>;
}

const OnboardingPagination = ({ data, scrollX }: OnboardingPaginationProps) => {
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const animatedDotStyle = useAnimatedStyle(() => {
          const dotWidth = interpolate(
            scrollX.value,
            inputRange,
            [10, 20, 10],
            Extrapolation.CLAMP,
          );
          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.3, 1, 0.3],
            Extrapolation.CLAMP,
          );
          return {
            width: dotWidth,
            opacity: opacity,
          };
        });

        return (
          <Animated.View
            style={[styles.dot, animatedDotStyle]}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    height: verticalScale(20),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  dot: {
    height: verticalScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: "#4A75F0",
    marginHorizontal: scale(5),
  },
});

export default OnboardingPagination;
