import { MONTHLY_DATA } from "@/constants/data";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const screenWidth = Dimensions.get("window").width;

const MonthlyChart = () => {
  const chartData = MONTHLY_DATA.map((item) => ({
    ...item,
    topLabelComponent: () => (
      <Text style={{ color: "#4facfe", fontSize: 10, marginBottom: 4 }}>
        {item.topLabelComponent}
      </Text>
    ),
  }));

  return (
    <View style={styles.chartCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: "#4facfe15" }]}>
          <Ionicons
            name="calendar-clear-outline"
            size={moderateScale(20)}
            color="#4facfe"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Monthly Activity</Text>
          <Text style={styles.gridSub}>Last 4 Weeks</Text>
        </View>
        <View style={[styles.trendBadge, { backgroundColor: "#e0f2fe" }]}>
          <Text style={[styles.trendText, { color: "#0ea5e9" }]}>
            Avg 15.3k
          </Text>
        </View>
      </View>

      <View
        style={{ alignItems: "center", overflow: "visible", marginTop: 20 }}
      >
        <BarChart
          data={chartData}
          barWidth={28}
          barBorderRadius={8}
          spacing={32}
          noOfSections={3}
          yAxisThickness={0}
          xAxisThickness={0}
          xAxisLabelTextStyle={{
            color: "#94A3B8",
            fontFamily: "System",
            fontSize: 11,
            fontWeight: "600",
          }}
          yAxisTextStyle={{
            color: "#94A3B8",
            fontSize: 10,
          }}
          yAxisLabelSuffix="k"
          rulesType="dashed"
          rulesColor="#EDF2F7"
          width={screenWidth - moderateScale(110)}
          height={220}
          maxValue={20000}
          animationDuration={400}
        />
      </View>

      <View
        style={{
          marginTop: 20,
          backgroundColor: "#f0f9ff",
          padding: 12,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons name="information-circle" size={20} color="#4facfe" />
        <Text
          style={{
            marginLeft: 8,
            color: "#0284c7",
            fontSize: 12,
            fontWeight: "600",
          }}
        >
          You burned 61,400 kcal in total this month.
        </Text>
      </View>
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
  gridSub: {
    fontSize: moderateScale(11),
    color: "#b2bec3",
    marginTop: verticalScale(2),
    fontWeight: "600",
  },
  trendBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(10),
  },
  trendText: {
    color: "#2ecc71",
    fontSize: moderateScale(12),
    fontWeight: "800",
  },
});

export default MonthlyChart;
