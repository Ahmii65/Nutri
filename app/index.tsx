import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
const { width } = Dimensions.get("window");
const SLIDES = [
  {
    id: "1",
    title: "Track Your Goal",
    description:
      "Don't worry if you have trouble determining your goals. We can help you determine and track your goals.",
    image: require("../assets/images/TRACK2.png"),
  },
  {
    id: "2",
    title: "Eat Well",
    description:
      "Let's start a healthy lifestyle with us, we can determine your diet every day. Healthy eating is fun.",
    image: require("../assets/images/EAT2.png"),
  },
  {
    id: "3",
    title: "Stay Healthy",
    description:
      "Improve the quality of your sleep with us, good quality sleep can bring a good mood in the morning.",
    image: require("../assets/images/REACT2.png"),
  },
];

const Pagination = ({
  data,
  scrollX,
}: {
  data: any[];
  scrollX: SharedValue<number>;
}) => {
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

  const scrollToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push("/Registration");
    }
  };
  return (
    <View style={styles.container}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#fff" /> */}

      <View style={styles.sliderContainer}>
        <Animated.FlatList
          data={SLIDES}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          )}
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
        {currentIndex < SLIDES.length - 1 ? (
          <Pagination data={SLIDES} scrollX={scrollX} />
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
  slide: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width,
    height: width * 1.2, // Make it taller to fill more screen
    flex: 0.7,
    marginBottom: verticalScale(20),
    resizeMode: "cover",
  },
  textContainer: {
    flex: 0.3,
    alignItems: "center",
    paddingHorizontal: scale(20),
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: "700",
    color: "#1D1617",
    marginBottom: verticalScale(10),
    textAlign: "center",
  },
  description: {
    fontSize: moderateScale(14),
    color: "#7B6F72",
    textAlign: "center",
    lineHeight: verticalScale(20),
  },
  footer: {
    flex: 1,
    paddingBottom: verticalScale(40),
    width: "100%",
    justifyContent: "flex-end", // Push button to bottom
  },
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
