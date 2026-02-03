import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

interface ProgressGridProps {
  calories: number;
  calorieGoal: number;
  water: number;
  waterGoal: number;
}

const ProgressGrid = ({
  calories,
  calorieGoal,
  water,
  waterGoal,
}: ProgressGridProps) => {
  return (
    <View style={styles.gridContainer}>
      {/* Calories Card */}
      <View style={styles.gridCard}>
        <View style={[styles.iconCircle, { backgroundColor: "#4facfe15" }]}>
          <Ionicons name="flame" size={moderateScale(22)} color="#4facfe" />
        </View>
        <View>
          <Text style={styles.gridValue}>{calories}</Text>
          <Text style={styles.gridLabel}>Calories</Text>
          <Text style={styles.gridSub}>/ {calorieGoal} kcal</Text>
        </View>
      </View>

      {/* Water Card */}
      <View style={styles.gridCard}>
        <View style={[styles.iconCircle, { backgroundColor: "#00f2fe15" }]}>
          <Ionicons name="water" size={moderateScale(22)} color="#00f2fe" />
        </View>
        <View>
          <Text style={styles.gridValue}>{(water * 0.25).toFixed(1)}L</Text>
          <Text style={styles.gridLabel}>Water</Text>
          <Text style={styles.gridSub}>/ {(waterGoal * 0.25).toFixed(1)}L</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
  },
  gridCard: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: moderateScale(25),
    padding: moderateScale(18),
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: moderateScale(45),
    height: moderateScale(45),
    borderRadius: moderateScale(15),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  gridValue: {
    fontSize: moderateScale(20),
    fontWeight: "800",
    color: "#2d3436",
  },
  gridLabel: {
    fontSize: moderateScale(13),
    color: "#636e72",
    marginTop: verticalScale(2),
    fontWeight: "700",
  },
  gridSub: {
    fontSize: moderateScale(11),
    color: "#b2bec3",
    marginTop: verticalScale(2),
    fontWeight: "600",
  },
});

export default ProgressGrid;
