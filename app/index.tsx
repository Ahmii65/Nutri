import OnboardingItem from "@/components/OnboardingItem";
import OnboardingPagination from "@/components/OnboardingPagination";
import { ONBOARDING_SLIDES } from "@/constants/data";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { moderateScale, verticalScale } from "react-native-size-matters";

const { width } = Dimensions.get("window");

const FirstScreen = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems && viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <Animated.FlatList
          data={ONBOARDING_SLIDES}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>
      <View style={styles.footer}>
        {/* Pagination Dots - Hide on last slide */}
        {currentIndex < ONBOARDING_SLIDES.length - 1 ? (
          <OnboardingPagination data={ONBOARDING_SLIDES} scrollX={scrollX} />
        ) : (
          /* Button - Show only on last slide */
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/Login")}
              activeOpacity={0.4}
            >
              <LinearGradient
                colors={["#4A75F0", "#6C8DF5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  sliderContainer: {
    flex: 3,
  },
  footer: {
    flex: 1,
    paddingBottom: verticalScale(40),
    width: "100%",
    justifyContent: "flex-end", // Push button to bottom
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    height: verticalScale(60),
    justifyContent: "center",
  },
  button: {
    width: width * 0.8,
    borderRadius: moderateScale(99),
    overflow: "hidden",
    shadowColor: "#4A75F0",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: "#fff", // Fallback
  },
  gradient: {
    paddingVertical: verticalScale(15),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "700",
  },
});

export default FirstScreen;
