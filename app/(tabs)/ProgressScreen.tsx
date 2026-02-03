import DailyChart from "@/components/DailyChart";
import HistoryList from "@/components/HistoryList";
import MonthlyChart from "@/components/MonthlyChart";
import ProgressGrid from "@/components/ProgressGrid";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

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

  const renderDailyView = () => (
    <View style={styles.viewContainer}>
      {/* Summary Stats Grid */}
      <ProgressGrid
        calories={stats.calories}
        calorieGoal={stats.calorieGoal}
        water={stats.water}
        waterGoal={stats.waterGoal}
      />

      {/* Main Chart Card */}
      <DailyChart stats={stats} onRefresh={() => loadStats(true)} />

      {/* Recent Activity */}
      <HistoryList />
    </View>
  );

  const renderMonthlyView = () => (
    <View style={styles.viewContainer}>
      <MonthlyChart />
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
});

export default ProgressScreen;
