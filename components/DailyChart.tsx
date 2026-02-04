import { DailyChartProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const DailyChart = ({ stats, onRefresh }: DailyChartProps) => {
  const calorieTarget = stats.calorieGoal || 2000;
  const waterTarget = stats.waterGoal || 8;
  const remainingCals = Math.max(0, calorieTarget - stats.calories);
  const remainingWater = Math.max(0, waterTarget - stats.water);

  const caloriesPieData = [
    { value: stats.calories, color: "#4facfe" },
    { value: remainingCals, color: "#F1F5F9" },
  ];

  const waterPieData = [
    { value: stats.water, color: "#00f2fe" },
    { value: remainingWater, color: "#F1F5F9" },
  ];

  return (
    <View style={styles.chartCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: "#4facfe15" }]}>
          <Ionicons name="pie-chart" size={moderateScale(20)} color="#4facfe" />
        </View>
        <Text style={styles.cardTitle}>Daily Breakdown</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={moderateScale(20)} color="#b2bec3" />
        </TouchableOpacity>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#4facfe" }]} />
          <Text style={styles.legendText}>
            Calories{" "}
            {Math.round((stats.calories / (stats.calorieGoal || 1)) * 100)}%
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#00f2fe" }]} />
          <Text style={styles.legendText}>
            Water {Math.round((stats.water / (stats.waterGoal || 1)) * 100)}%
          </Text>
        </View>
      </View>

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: 260,
          marginTop: 20,
        }}
      >
        {/* Outer Ring - Calories */}
        <View style={{ position: "absolute" }}>
          <PieChart
            data={caloriesPieData}
            donut
            radius={90}
            innerRadius={74}
            initialAngle={-90}
          />
        </View>
        {/* Inner Ring - Water */}
        <View style={{ position: "absolute" }}>
          <PieChart
            data={waterPieData}
            donut
            radius={60}
            innerRadius={48}
            initialAngle={-90}
          />
        </View>
        {/* Center Text */}
        <View style={{ position: "absolute", alignItems: "center" }}>
          <Ionicons name="stats-chart" size={24} color="#bdc3c7" />
        </View>
      </View>
      <Text style={styles.chartFooterText}>
        Keep it up! You're making great progress.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(30),
    padding: moderateScale(25),
    marginBottom: verticalScale(25),
    elevation: 10,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    alignItems: "center",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: verticalScale(25),
    justifyContent: "space-between",
  },
  iconBox: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(12),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  cardTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#2d3436",
    flex: 1,
  },
  chartFooterText: {
    fontSize: moderateScale(13),
    color: "#95a5a6",
    fontWeight: "600",
    marginTop: verticalScale(5),
    marginBottom: verticalScale(5),
    textAlign: "center",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: verticalScale(10),
    marginTop: verticalScale(-10),
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: scale(15),
  },
  legendDot: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    marginRight: scale(6),
  },
  legendText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#636e72",
  },
});

export default DailyChart;
