import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { MealLogEntry } from "../types";

interface MealSectionProps {
  title: string;
  iconName: string;
  meals: MealLogEntry[];
  onAddPress: () => void;
}

const MealSection = ({
  title,
  iconName,
  meals,
  onAddPress,
}: MealSectionProps) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleContainer}>
          <LinearGradient
            colors={["#e0c3fc", "#8ec5fc"]}
            style={styles.iconBackground}
          >
            <Ionicons
              name={iconName as any}
              size={moderateScale(18)}
              color="#fff"
            />
          </LinearGradient>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <TouchableOpacity onPress={onAddPress}>
          <Ionicons
            name="add-circle"
            size={moderateScale(28)}
            color="#4facfe"
          />
        </TouchableOpacity>
      </View>

      {meals.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No food logged</Text>
        </View>
      ) : (
        meals.map((meal: MealLogEntry, index: number) => (
          <View key={index} style={styles.mealCard}>
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.caloriesText}>{meal.calories} kcal</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: verticalScale(20),
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(10),
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBackground: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(8),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(10),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#2d3436",
  },
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(12),
    padding: moderateScale(15),
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#dfe6e9",
  },
  emptyText: {
    color: "#b2bec3",
    fontSize: moderateScale(12),
  },
  mealCard: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    marginBottom: verticalScale(8),
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  mealInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealName: {
    fontSize: moderateScale(14),
    fontWeight: "500",
    color: "#2d3436",
  },
  caloriesText: {
    fontSize: moderateScale(13),
    color: "#636e72",
    fontWeight: "600",
  },
});

export default MealSection;
