import HomeStatusCard from "@/components/HomeStatusCard";
import MealCard from "@/components/MealCard";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

import { useAuth } from "@/context/AuthContext";

const index = () => {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [bmi, setBmi] = useState("N/A");
  const [bmiCategory, setBmiCategory] = useState("Calculate your BMI");
  // const [username, setUsername] = useState("User"); // Derived from user object now
  const [waterIntake, setWaterIntake] = useState(0);
  const [calories, setCalories] = useState(0);

  // Derive username from AuthContext
  const username =
    user && user.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : "User";

  useFocusEffect(
    useCallback(() => {
      const loadDashboardData = async () => {
        try {
          // Load stored data
          const storedBmi = await AsyncStorage.getItem("user_bmi");
          const storedCategory = await AsyncStorage.getItem("user_category");
          const storedWater = await AsyncStorage.getItem("water_intake");
          const storedCalories =
            await AsyncStorage.getItem("calories_consumed");
          // let currentName = await AsyncStorage.getItem("user_name"); // No longer needed for name

          if (storedBmi) setBmi(storedBmi);
          if (storedCategory)
            setBmiCategory(`You have a ${storedCategory} weight`);
          if (storedWater) setWaterIntake(parseInt(storedWater, 10));
          if (storedCalories) setCalories(parseInt(storedCalories, 10));

          // Removed legacy name loading logic in favor of useAuth
        } catch (e) {
          console.log("Failed to load Dashboard data", e);
        }
      };
      loadDashboardData();
    }, []),
  );
  return (
    <View style={styles.mainContainer}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#FFF" /> */}
      <View style={[styles.container, styles.contentContainer]}>
        {/* Header */}
        <View style={[styles.header, { marginTop: insets.top + 10 }]}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </Text>
              </LinearGradient>
            </View>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.username}>{username}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={() => router.push("/NotificationScreen")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="notifications-outline"
              size={moderateScale(24)}
              color="#2d3436"
            />
            <View style={styles.activeDot} />
          </TouchableOpacity>
        </View>
        {/* BMI Banner */}
        <LinearGradient
          colors={["#044d88ff", "#00a2f9ff"]}
          style={styles.banner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>BMI (Body Mass Index)</Text>
            <Text style={styles.bannerSubtitle}>{bmiCategory}</Text>
            <TouchableOpacity
              style={styles.bannerButton}
              onPress={() => router.push("/BMICalculator")}
            >
              <Text style={styles.bannerButtonText}>Calculate BMI</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bannerCircle}>
            <Text style={styles.bmiValue}>{bmi}</Text>
          </View>
        </LinearGradient>
        {/* Today Target */}
        {/* <View style={styles.todayTarget}>
          <Text style={styles.todayText}>Today Target</Text>
          <TouchableOpacity style={styles.checkButton}>
            <Text style={styles.checkText}>Check</Text>
          </TouchableOpacity>
        </View> */}
        {/* Stats Section */}
        <View style={styles.statusSection}>
          {/* Water Intake Card */}
          <HomeStatusCard
            title="Water"
            value={`${(waterIntake * 0.25).toFixed(1)}L`}
            icon="water"
            iconColor="#317fc4ff"
            gradientColors={["#4facfe", "#00f2fe"]}
            onPress={() => router.push("/WaterScreen")}
          />
          {/* Calories Card */}
          <HomeStatusCard
            title="Calories"
            value={calories}
            icon="flame"
            iconColor="#e46f73ff"
            gradientColors={["#ff9a9e", "#fecfef"]}
            onPress={() => router.push("/CaloriesScreen")}
          />
          {/* Recipes Card */}
          <HomeStatusCard
            title="Recipes"
            label="View All"
            icon="restaurant"
            iconColor="#038970ff"
            gradientColors={["#66dd8eff", "#5fefd5ff"]}
            onPress={() => router.push("/RecipeSuggestionScreen")}
          />
        </View>

        {/* Nutrition Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Nutrition Progress</Text>
          <View style={styles.progressBarBg}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.progressBarContainer}
            >
              <LinearGradient
                colors={["#00a2f9ff", "#023b8bb1"]}
                style={styles.progressBarFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.progressLabel}>Progress: 40%</Text>
        </View>
        {/* Latest Meals */}
        <View style={styles.latestMeals}>
          <View style={styles.mealHeader}>
            <Text style={styles.mealTitle}>Latest Meals</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/MealLogScreen")}
            >
              <Text style={styles.seeMore}>See more</Text>
            </TouchableOpacity>
          </View>
          {/* Meal Card */}
          <MealCard
            name="Breakfast"
            description="180 Calories | 20 mins"
            onPress={() => router.push("/MealLogScreen")}
          />
        </View>
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  contentContainer: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(100),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(30),
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: scale(12),
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarGradient: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: moderateScale(14),
    color: "#636e72",
    marginBottom: verticalScale(2),
  },
  username: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#2d3436",
  },
  notificationBtn: {
    width: moderateScale(45),
    height: moderateScale(45),
    backgroundColor: "#fff",
    borderRadius: moderateScale(15),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f2f6",
  },
  activeDot: {
    position: "absolute",
    top: moderateScale(10),
    right: moderateScale(10),
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: "#ff7675",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  banner: {
    borderRadius: moderateScale(22),
    padding: moderateScale(20),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(20),
    shadowColor: "#044d88ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bannerText: {
    flex: 1,
    paddingRight: scale(10),
  },
  bannerTitle: {
    color: "#FFF",
    fontSize: moderateScale(16),
    fontWeight: "700",
  },
  bannerSubtitle: {
    color: "#FFF",
    fontSize: moderateScale(12),
    marginTop: verticalScale(5),
    opacity: 0.9,
  },
  bannerButton: {
    backgroundColor: "rgba(5, 146, 228, 1)",
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(15),
    borderRadius: moderateScale(50),
    marginTop: verticalScale(15),
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: "#FFF",
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  bannerCircle: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(35),
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.77)",
  },
  bmiValue: {
    color: "#fff",
    fontWeight: "700",
    fontSize: moderateScale(18),
  },
  todayTarget: {
    backgroundColor: "#21AEFA33",
    borderRadius: moderateScale(16),
    padding: moderateScale(15),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  todayText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#1D1617",
  },
  checkButton: {
    backgroundColor: "#0c98e4",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(50),
  },
  checkText: {
    color: "#FFF",
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  statusSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(25),
  },
  progressSection: {
    marginBottom: verticalScale(25),
  },
  progressTitle: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    color: "#1D1617",
    marginBottom: verticalScale(10),
  },
  progressBarBg: {
    height: verticalScale(12),
    backgroundColor: "#F7F8F8",
    borderRadius: moderateScale(6),
    overflow: "hidden",
  },
  progressBarContainer: {
    width: "100%",
    height: "100%",
  },
  progressBarFill: {
    height: "100%",
    width: "40%", // Example progress
    borderRadius: moderateScale(6),
  },
  progressLabel: {
    fontSize: moderateScale(12),
    color: "#A4A9AD",
    marginTop: verticalScale(5),
    textAlign: "right",
  },
  latestMeals: {
    marginBottom: verticalScale(20),
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(15),
  },
  mealTitle: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    color: "#1D1617",
  },
  seeMore: {
    fontSize: moderateScale(12),
    color: "#ADA4A5",
    fontWeight: "600",
  },
});
