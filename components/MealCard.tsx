import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

interface MealCardProps {
  name: string;
  description: string;
  onPress: () => void;
}

const MealCard = ({ name, description, onPress }: MealCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.mealCard}
    >
      <View style={styles.mealIconPlaceholder}>
        <Ionicons name="fast-food" size={moderateScale(24)} color="#fff" />
      </View>
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{name}</Text>
        <Text style={styles.mealDesc}>{description}</Text>
        <View style={styles.mealProgressBg}>
          <LinearGradient
            colors={["#00a2f9ff", "#023b8bb1"]}
            style={styles.mealProgressFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
      </View>
      <Ionicons name="chevron-forward" size={moderateScale(20)} color="#ccc" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mealCard: {
    backgroundColor: "#FFF",
    borderRadius: moderateScale(16),
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(15),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: verticalScale(10),
  },
  mealIconPlaceholder: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: "#0996e2ff",
    justifyContent: "center",
    alignItems: "center",
  },
  mealInfo: {
    flex: 1,
    marginLeft: scale(15),
    marginRight: scale(10),
  },
  mealName: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#1D1617",
  },
  mealDesc: {
    fontSize: moderateScale(11),
    color: "#A4A9AD",
    marginTop: verticalScale(2),
  },
  mealProgressBg: {
    backgroundColor: "#F7F8F8",
    borderRadius: moderateScale(4),
    height: verticalScale(6),
    marginTop: verticalScale(8),
    overflow: "hidden",
    width: "100%",
  },
  mealProgressFill: {
    height: "100%",
    width: "40%",
    borderRadius: moderateScale(4),
  },
});

export default MealCard;
