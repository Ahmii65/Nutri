import { WaterBottleProps } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";



const WaterBottle = ({ intake, goal, glassSize }: WaterBottleProps) => {
  const progressAnim = useSharedValue(0);

  // Calculate percentage
  const percentage = Math.min(intake / goal, 1);
  const displayPercentage = Math.round(percentage * 100);

  useEffect(() => {
    progressAnim.value = withTiming(percentage, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [percentage]);

  // Interpolate height for liquid fill
  const liquidStyle = useAnimatedStyle(() => {
    return {
      height: `${progressAnim.value * 100}%`,
    };
  });

  return (
    <View style={styles.visualizerContainer}>
      <View style={styles.bottleContainer}>
        <View style={styles.bottleGlass}>
          {/* Liquid */}
          <View style={styles.liquidContainer}>
            <Animated.View style={[styles.liquid, liquidStyle]}>
              <LinearGradient
                colors={["#4facfe", "#00f2fe"]}
                style={{ flex: 1 }}
              />
            </Animated.View>
          </View>

          {/* Markers */}
          <View style={styles.markerContainer}>
            <View style={styles.marker} />
            <View style={styles.marker} />
            <View style={styles.marker} />
          </View>

          {/* Text Overlay */}
          <View style={styles.bottleTextContainer}>
            <Text style={styles.percentageText}>{displayPercentage}%</Text>
            <Text style={styles.volumeText}>{intake * glassSize}ml</Text>
          </View>
        </View>
      </View>

      <Text style={styles.goalText}>
        Target: {goal * glassSize}ml ({goal} Glasses)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  visualizerContainer: {
    alignItems: "center",
    marginBottom: verticalScale(30),
  },
  bottleContainer: {
    height: verticalScale(250),
    width: scale(140),
    marginBottom: verticalScale(20),
    elevation: 10,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  bottleGlass: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(4),
    borderColor: "rgba(255,255,255,0.8)",
    overflow: "hidden",
    position: "relative",
    justifyContent: "flex-end", // Fills from bottom
  },
  liquidContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: "flex-end",
  },
  liquid: {
    width: "100%",
    backgroundColor: "#4facfe", // Fallback
  },
  markerContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "100%",
    justifyContent: "space-evenly",
    paddingLeft: scale(10),
    zIndex: 2,
    opacity: 0.5,
  },
  marker: {
    width: scale(20),
    height: verticalScale(1),
    backgroundColor: "#2d3436",
  },
  bottleTextContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  percentageText: {
    fontSize: moderateScale(32),
    fontWeight: "bold",
    color: "#2d3436", // Dark text when empty
    textShadowColor: "rgba(255,255,255,0.5)",
    textShadowRadius: 5,
  },
  volumeText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#636e72",
    marginTop: verticalScale(5),
  },
  goalText: {
    fontSize: moderateScale(16),
    color: "#636e72",
    fontWeight: "600",
  },
});

export default WaterBottle;
