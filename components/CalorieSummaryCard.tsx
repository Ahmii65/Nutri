import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

interface CalorieSummaryCardProps {
  totalCalories: number;
  dailyGoal: number;
  goalLabel: string;
}

const CalorieSummaryCard = ({
  totalCalories,
  dailyGoal,
  goalLabel,
}: CalorieSummaryCardProps) => {
  const progress = Math.min(totalCalories / dailyGoal, 1);

  return (
    <LinearGradient colors={["#ffffff", "#f8fbff"]} style={styles.summaryCard}>
      <View style={styles.summaryRow}>
        <View>
          <Text style={styles.summaryLabel}>Calories Eaten</Text>
          <Text style={styles.summaryValue}>
            {totalCalories} <Text style={styles.summaryUnit}>kcal</Text>
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.summaryLabel}>
            Daily Goal <Text style={styles.goalLabel}>({goalLabel})</Text>
          </Text>
          <Text style={styles.summaryValueLight}>
            {dailyGoal} <Text style={styles.summaryUnit}>kcal</Text>
          </Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <LinearGradient
          colors={["#43e97b", "#38f9d7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
        />
      </View>
      <Text style={styles.progressText}>
        {Math.round(progress * 100)}% of daily goal
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    borderRadius: moderateScale(15),
    padding: moderateScale(20),
    marginBottom: verticalScale(20),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(15),
  },
  summaryLabel: {
    fontSize: moderateScale(12),
    color: "#888",
    marginBottom: verticalScale(4),
  },
  goalLabel: {
    fontSize: moderateScale(10),
    color: "#4facfe",
    fontWeight: "bold",
  },
  summaryValue: {
    fontSize: moderateScale(22),
    fontWeight: "bold",
    color: "#2d3436",
  },
  summaryValueLight: {
    fontSize: moderateScale(22),
    fontWeight: "600",
    color: "#b2bec3",
    textAlign: "right",
  },
  summaryUnit: {
    fontSize: moderateScale(14),
    fontWeight: "normal",
    color: "#888",
  },
  progressBarContainer: {
    height: verticalScale(10),
    backgroundColor: "#f1f2f6",
    borderRadius: moderateScale(5),
    overflow: "hidden",
    marginBottom: verticalScale(8),
  },
  progressBarFill: {
    height: "100%",
    borderRadius: moderateScale(5),
  },
  progressText: {
    fontSize: moderateScale(11),
    color: "#aaa",
    textAlign: "center",
  },
});

export default CalorieSummaryCard;
