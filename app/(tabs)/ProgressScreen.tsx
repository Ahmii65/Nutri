import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";

import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const screenWidth = Dimensions.get("window").width;

const ProgressScreen = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("Daily");
  const [stats, setStats] = useState({
    calories: 0,
    calorieGoal: 2000,
    water: 0,
    waterGoal: 8,
  });

  // No Animation for Tab Switching
  const changeTab = (tab: string) => {
    setSelectedTab(tab);
  };

  const loadStats = useCallback(async (showFeedback = false) => {
    try {
      // Load Calories
      const calories = await AsyncStorage.getItem("calories_consumed");
      const category = await AsyncStorage.getItem("user_category");
      const weight = await AsyncStorage.getItem("user_weight");

      let calorieGoal = 2000;
      if (category && weight) {
        const weightNum = parseFloat(weight);
        let maintenance = weightNum * 24 * 1.2;
        if (category === "Underweight") calorieGoal = maintenance + 500;
        else if (category === "Overweight") calorieGoal = maintenance - 500;
        else if (category === "Obese") calorieGoal = maintenance - 750;
        else calorieGoal = maintenance;
      }

      // Load Water
      const waterIntake = await AsyncStorage.getItem("water_intake");
      const waterGoal = await AsyncStorage.getItem("water_goal");

      setStats({
        calories: calories ? parseInt(calories, 10) : 0,
        calorieGoal: Math.round(calorieGoal),
        water: waterIntake ? parseInt(waterIntake, 10) : 0,
        waterGoal: waterGoal ? parseInt(waterGoal, 10) : 8,
      });

      if (showFeedback) {
        Alert.alert("Refreshed", "Your daily stats have been updated.");
      }
    } catch (e) {
      console.error("Failed to load progress stats", e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats]),
  );

  // Charts Configuration

  const weeklyData = [
    { value: 1800, label: "Mon" },
    { value: 2100, label: "Tue" },
    { value: 1950, label: "Wed" },
    { value: 2200, label: "Thu" },
    { value: 2400, label: "Fri" },
    { value: 2100, label: "Sat" },
    { value: 1900, label: "Sun" },
  ];

  const monthlyData = [
    { value: 14500, label: "W1" },
    { value: 15800, label: "W2" },
    { value: 14900, label: "W3" },
    { value: 16200, label: "W4" },
  ];

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

  const mealLog = [
    {
      id: 1,
      name: "Breakfast",
      calories: "420",
      time: "08:30 AM",
      icon: "sunny-outline",
      color: "#ffbd2e",
    },
    {
      id: 2,
      name: "Lunch",
      calories: "650",
      time: "01:00 PM",
      icon: "restaurant-outline",
      color: "#ff5e57",
    },
    {
      id: 3,
      name: "Snack",
      calories: "150",
      time: "04:30 PM",
      icon: "cafe-outline",
      color: "#0fbcf9",
    },
    {
      id: 4,
      name: "Dinner",
      calories: "580",
      time: "07:45 PM",
      icon: "moon-outline",
      color: "#575fcf",
    },
  ];

  const renderDailyView = () => (
    <View style={styles.viewContainer}>
      {/* Summary Stats Grid */}
      <View style={styles.gridContainer}>
        {/* Calories Card */}
        <View style={styles.gridCard}>
          <View style={[styles.iconCircle, { backgroundColor: "#4facfe15" }]}>
            <Ionicons name="flame" size={moderateScale(22)} color="#4facfe" />
          </View>
          <View>
            <Text style={styles.gridValue}>{stats.calories}</Text>
            <Text style={styles.gridLabel}>Calories</Text>
            <Text style={styles.gridSub}>/ {stats.calorieGoal} kcal</Text>
          </View>
        </View>

        {/* Water Card */}
        <View style={styles.gridCard}>
          <View style={[styles.iconCircle, { backgroundColor: "#00f2fe15" }]}>
            <Ionicons name="water" size={moderateScale(22)} color="#00f2fe" />
          </View>
          <View>
            <Text style={styles.gridValue}>
              {(stats.water * 0.25).toFixed(1)}L
            </Text>
            <Text style={styles.gridLabel}>Water</Text>
            <Text style={styles.gridSub}>
              / {(stats.waterGoal * 0.25).toFixed(1)}L
            </Text>
          </View>
        </View>
      </View>

      {/* Main Chart Card */}
      <View style={styles.chartCard}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: "#4facfe15" }]}>
            <Ionicons
              name="pie-chart"
              size={moderateScale(20)}
              color="#4facfe"
            />
          </View>
          <Text style={styles.cardTitle}>Daily Breakdown</Text>
          <TouchableOpacity onPress={() => loadStats(true)}>
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

      {/* Recent Activity */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {mealLog.map((meal, index) => (
        <View
          key={meal.id}
          style={[
            styles.logItem,
            index === mealLog.length - 1 && { marginBottom: 0 },
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

  const renderMonthlyView = () => (
    <View style={styles.viewContainer}>
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
            data={[
              {
                value: 14500,
                label: "Week 1",
                frontColor: "#4facfe",
                topLabelComponent: () => (
                  <Text
                    style={{ color: "#4facfe", fontSize: 10, marginBottom: 4 }}
                  >
                    14.5k
                  </Text>
                ),
              },
              {
                value: 15800,
                label: "Week 2",
                frontColor: "#4facfe",
                topLabelComponent: () => (
                  <Text
                    style={{ color: "#4facfe", fontSize: 10, marginBottom: 4 }}
                  >
                    15.8k
                  </Text>
                ),
              },
              {
                value: 14900,
                label: "Week 3",
                frontColor: "#4facfe",
                topLabelComponent: () => (
                  <Text
                    style={{ color: "#4facfe", fontSize: 10, marginBottom: 4 }}
                  >
                    14.9k
                  </Text>
                ),
              },
              {
                value: 16200,
                label: "Week 4",
                frontColor: "#4facfe",
                showGradient: false,
                topLabelComponent: () => (
                  <Text
                    style={{ color: "#4facfe", fontSize: 10, marginBottom: 4 }}
                  >
                    16.2k
                  </Text>
                ),
              },
            ]}
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
            maxValue={20000} // Create headroom for top labels
            // isAnimated
            animationDuration={400}
            // disablePress={true} // Disable touch interaction/tooltip
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
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#4facfe" /> */}

      {/* Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={["#4facfe", "#00f2fe"]}
          style={styles.headerGradient}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconBtn}
            >
              <Ionicons
                name="chevron-back"
                size={moderateScale(28)}
                color="#fff"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Progress Tracker</Text>
            <TouchableOpacity
              onPress={() => router.push("/NotificationScreen")}
              style={styles.iconBtn}
            >
              <Ionicons
                name="notifications-outline"
                size={moderateScale(24)}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.contentContainer}>
        {/* Floating Tab Bar */}
        <View style={styles.tabContainerWrapper}>
          <View style={styles.tabBarContainer}>
            {["Daily", "Monthly"].map((tab) => {
              const isActive = selectedTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={styles.tabItemWrapper}
                  onPress={() => changeTab(tab)}
                  activeOpacity={0.9}
                >
                  <View
                    style={[styles.tabItem, isActive && styles.activeTabItem]}
                  >
                    {isActive ? (
                      <LinearGradient
                        colors={["#4facfe", "#00f2fe"]}
                        style={StyleSheet.absoluteFillObject}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      />
                    ) : null}
                    <Text
                      style={[styles.tabText, isActive && styles.activeTabText]}
                    >
                      {tab}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {selectedTab === "Daily" && renderDailyView()}
          {selectedTab === "Monthly" && renderMonthlyView()}
          <View style={{ height: verticalScale(100) }} />
          {/* Bottom Spacer */}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  headerContainer: {
    height: verticalScale(100),
    backgroundColor: "transparent",
    overflow: "hidden",
    borderBottomLeftRadius: moderateScale(30),
    borderBottomRightRadius: moderateScale(30),
    elevation: 8,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    zIndex: 10,
  },
  headerGradient: {
    flex: 1,
    paddingTop: verticalScale(40),
    paddingHorizontal: scale(20),
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: moderateScale(22),
    fontWeight: "bold",
    color: "#fff",
  },
  iconBtn: {
    padding: moderateScale(5),
  },
  contentContainer: {
    flex: 1,
    marginTop: verticalScale(20),
  },

  // Tab Bar Styles
  tabContainerWrapper: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(20),
  },
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: moderateScale(30),
    padding: moderateScale(5),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  tabItemWrapper: {
    flex: 1,
  },
  tabItem: {
    paddingVertical: verticalScale(10),
    alignItems: "center",
    borderRadius: moderateScale(25),
    overflow: "hidden", // Ensure gradient respects border radius
    justifyContent: "center",
  },
  activeTabItem: {
    // Background handled by LinearGradient
  },
  tabText: {
    fontSize: moderateScale(13),
    fontWeight: "600",
    color: "#95a5a6",
    zIndex: 1, // Text above gradient
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },

  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(20),
  },
  viewContainer: {
    flex: 1,
  },

  // Grid Stats
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
  },
  gridCard: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: moderateScale(25), // Increased radius
    padding: moderateScale(18),
    elevation: 8, // Increased elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1, // Increased opacity
    shadowRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: moderateScale(45), // Larger icon circle
    height: moderateScale(45),
    borderRadius: moderateScale(15),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  gridValue: {
    fontSize: moderateScale(20), // Larger Font
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

  // Chart Card
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(30), // Increased radius
    padding: moderateScale(25), // Increased spacing
    marginBottom: verticalScale(25),
    elevation: 10, // Match CaloriesScreen
    shadowColor: "#4facfe", // Colored shadow for premium feel
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    alignItems: "center",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: verticalScale(25), // More breathing room
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
    fontSize: moderateScale(18), // Larger Title
    fontWeight: "bold",
    color: "#2d3436",
    flex: 1,
  },
  chartStyle: {
    borderRadius: 20,
    marginVertical: verticalScale(10),
  },
  chartFooterText: {
    fontSize: moderateScale(13),
    color: "#95a5a6",
    fontWeight: "600",
    marginTop: verticalScale(5),
    marginBottom: verticalScale(5),
    textAlign: "center",
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

  // Recent Activity
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(20),
    paddingHorizontal: scale(5),
  },
  sectionTitle: {
    fontSize: moderateScale(20), // Larger Title
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
    elevation: 4, // Increased elevation
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
  // Legend Styles
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

export default ProgressScreen;
