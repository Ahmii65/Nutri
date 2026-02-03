import { MEAL_LOG_DATA } from "@/constants/data";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const HistoryList = () => {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {MEAL_LOG_DATA.map((meal, index) => (
        <View
          key={meal.id}
          style={[
            styles.logItem,
            index === MEAL_LOG_DATA.length - 1 && { marginBottom: 0 },
          ]}
        >
          <View
            style={[
              styles.logIconContainer,
              { backgroundColor: meal.color + "15" },
            ]}
          >
            <Ionicons
              name={meal.icon as any}
              size={moderateScale(20)}
              color={meal.color}
            />
          </View>
          <View style={styles.logContent}>
            <Text style={styles.logName}>{meal.name}</Text>
            <Text style={styles.logTime}>{meal.time}</Text>
          </View>
          <View style={styles.calBadge}>
            <Text style={styles.calText}>{meal.calories} kcal</Text>
          </View>
        </View>
      ))}
      <View style={{ height: verticalScale(20) }} />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(20),
    paddingHorizontal: scale(5),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#2d3436",
  },
  seeAllText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#4facfe",
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: verticalScale(15),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  logIconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(16),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(16),
  },
  logContent: {
    flex: 1,
  },
  logName: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    color: "#2d3436",
  },
  logTime: {
    fontSize: moderateScale(13),
    color: "#94A3B8",
    marginTop: verticalScale(4),
    fontWeight: "500",
  },
  calBadge: {
    backgroundColor: "#F5F7FA",
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(12),
  },
  calText: {
    fontSize: moderateScale(13),
    fontWeight: "800",
    color: "#64748B",
  },
});

export default HistoryList;
