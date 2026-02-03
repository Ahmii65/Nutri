import React from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const { width } = Dimensions.get("window");

interface OnboardingItemProps {
  item: {
    id: string;
    title: string;
    description: string;
    image: ImageSourcePropType;
  };
}

const OnboardingItem = ({ item }: OnboardingItemProps) => {
  return (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width,
    height: width * 1.2,
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
});

export default OnboardingItem;
