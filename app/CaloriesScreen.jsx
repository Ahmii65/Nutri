import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Ionicons";

const CaloriesScreen = () => {
  const router = useRouter();
  const [data, setData] = useState({
    bmi: null,
    category: "",
    weight: null,
    calories: "---",
    suggestion: "Loading...",
    maintenance: null,
    consumed: 0,
  });

  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          // Reset Animations
          fadeAnim.setValue(0);
          slideAnim.setValue(50);
          scaleAnim.setValue(0.8);
          progressAnim.setValue(0);

          const bmi = await AsyncStorage.getItem("user_bmi");
          const category = await AsyncStorage.getItem("user_category");
          const weight = await AsyncStorage.getItem("user_weight");
          const consumed =
            (await AsyncStorage.getItem("calories_consumed")) || "0";

          if (bmi && category && weight) {
            const weightNum = parseFloat(weight);
            // Basic BMR Estimate
            let maintenance = weightNum * 24 * 1.2;
            let target = maintenance;
            let suggestionText =
              "Maintain your current weight by consuming your TDEE.";

            if (category === "Underweight") {
              target = maintenance + 500; // Surplus
              suggestionText =
                "You are underweight. Focus on nutrient-rich foods to gain weight safely.";
            } else if (category === "Normal") {
              target = maintenance;
              suggestionText =
                "You have a healthy weight. Maintain it with a balanced diet.";
            } else if (category === "Overweight") {
              target = maintenance - 500; // Deficit
              suggestionText =
                "You are overweight. Try a slight caloric deficit to lose weight.";
            } else if (category === "Obese") {
              target = maintenance - 750; // Larger Deficit
              suggestionText =
                "Consult a specialist. A safe caloric deficit is recommended.";
            }

            const consumedNum = parseFloat(consumed) || 0;
            const progress = Math.min(consumedNum / target, 1);

            setData({
              bmi,
              category,
              weight,
              calories: Math.round(target).toString(),
              suggestion: suggestionText,
              maintenance: Math.round(maintenance),
              consumed: consumedNum,
            });

            // Start Animations
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.out(Easing.exp),
              }),
              Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.out(Easing.exp),
              }),
              Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
              }),
              Animated.timing(progressAnim, {
                toValue: progress,
                duration: 1000,
                useNativeDriver: false,
                easing: Easing.out(Easing.cubic),
              }),
            ]).start();
          } else {
            setData((prev) => ({
              ...prev,
              suggestion: "Please calculate your BMI first.",
            }));
            // Start Fade even for empty state
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }).start();
          }
        } catch (e) {
          console.log("Error loading data", e);
        }
      };
      loadData();
    }, []),
  );

  const getThemeColor = () => {
    if (!data.category) return ["#4facfe", "#00f2fe"];
    if (data.category === "Underweight") return ["#f1c40f", "#f39c12"];
    if (data.category === "Normal") return ["#2ecc71", "#27ae60"];
    if (data.category === "Overweight") return ["#e67e22", "#d35400"];
    return ["#e74c3c", "#c0392b"];
  };

  const themeColors = getThemeColor();
  const primaryColor = themeColors[0];

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const progressPercentage =
    data.calories !== "---"
      ? Math.round((data.consumed / parseFloat(data.calories)) * 100)
      : 0;

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
              <Icon name="chevron-back" size={moderateScale(28)} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Calorie Tracker</Text>
            <TouchableOpacity
              onPress={() => router.push("/NotificationScreen")}
              style={styles.iconBtn}
            >
              <Icon
                name="notifications-outline"
                size={moderateScale(24)}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          {data.bmi ? (
            <>
              {/* Main Calorie Display Card */}
              <View style={styles.mainCard}>
                <Text style={styles.sectionTitle}>Daily Calorie Goal</Text>

                {/* Large Circular Display */}
                <Animated.View
                  style={[
                    styles.calorieCircle,
                    { transform: [{ scale: scaleAnim }] },
                  ]}
                >
                  <LinearGradient
                    colors={themeColors}
                    style={styles.circleGradient}
                  >
                    <View style={styles.circleInner}>
                      <Text
                        style={[styles.calorieValue, { color: primaryColor }]}
                      >
                        {data.calories}
                      </Text>
                      <Text style={styles.calorieUnit}>KCAL</Text>
                    </View>
                  </LinearGradient>
                </Animated.View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBackground}>
                    <Animated.View
                      style={[
                        styles.progressBarFill,
                        {
                          width: barWidth,
                          backgroundColor: primaryColor,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.progressTextRow}>
                    <Text style={styles.progressLabel}>
                      Consumed: {Math.round(data.consumed)} kcal
                    </Text>
                    <Text
                      style={[
                        styles.progressPercentage,
                        { color: primaryColor },
                      ]}
                    >
                      {progressPercentage}%
                    </Text>
                  </View>
                </View>

                {/* Category Badge */}
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: primaryColor + "15" },
                  ]}
                >
                  <Icon
                    name="body-outline"
                    size={moderateScale(18)}
                    color={primaryColor}
                  />
                  <Text style={[styles.categoryText, { color: primaryColor }]}>
                    {data.category}
                  </Text>
                </View>
              </View>

              {/* Stats Grid Card */}
              <View style={styles.statsCard}>
                <Text style={styles.cardSectionTitle}>Your Stats</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statBox}>
                    <View
                      style={[
                        styles.statIconBox,
                        { backgroundColor: "#4facfe15" },
                      ]}
                    >
                      <Icon
                        name="scale-outline"
                        size={moderateScale(22)}
                        color="#4facfe"
                      />
                    </View>
                    <Text style={styles.statValue}>{data.bmi}</Text>
                    <Text style={styles.statLabel}>BMI</Text>
                  </View>

                  <View style={styles.statBox}>
                    <View
                      style={[
                        styles.statIconBox,
                        { backgroundColor: "#2ecc7115" },
                      ]}
                    >
                      <Icon
                        name="barbell-outline"
                        size={moderateScale(22)}
                        color="#2ecc71"
                      />
                    </View>
                    <Text style={styles.statValue}>{data.weight}</Text>
                    <Text style={styles.statLabel}>Weight (kg)</Text>
                  </View>

                  <View style={styles.statBox}>
                    <View
                      style={[
                        styles.statIconBox,
                        { backgroundColor: "#e67e2215" },
                      ]}
                    >
                      <Icon
                        name="flame-outline"
                        size={moderateScale(22)}
                        color="#e67e22"
                      />
                    </View>
                    <Text style={styles.statValue}>
                      {data.maintenance || "---"}
                    </Text>
                    <Text style={styles.statLabel}>Maintenance</Text>
                  </View>
                </View>
              </View>

              {/* Diet Plan Card */}
              <View style={styles.planCard}>
                <View style={styles.planHeader}>
                  <View
                    style={[
                      styles.planIconBox,
                      { backgroundColor: primaryColor + "20" },
                    ]}
                  >
                    <Icon
                      name="restaurant-outline"
                      size={moderateScale(24)}
                      color={primaryColor}
                    />
                  </View>
                  <Text style={styles.planTitle}>Diet Plan</Text>
                </View>
                <Text style={styles.planText}>{data.suggestion}</Text>
              </View>

              <Text style={styles.disclaimer}>
                * Estimation based on standard TDEE formulas.
              </Text>
            </>
          ) : (
            <View style={styles.emptyStateCard}>
              <View style={styles.emptyIconCircle}>
                <LinearGradient
                  colors={["#4facfe", "#00f2fe"]}
                  style={styles.emptyIconGradient}
                >
                  <Icon
                    name="calculator-outline"
                    size={moderateScale(50)}
                    color="#fff"
                  />
                </LinearGradient>
              </View>
              <Text style={styles.emptyTitle}>No Data Available</Text>
              <Text style={styles.emptyText}>
                Calculate your BMI to get your personalized calorie plan and
                start tracking your daily intake.
              </Text>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => router.push("/BMICalculator")}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#4facfe", "#00f2fe"]}
                  style={styles.btnGradient}
                >
                  <Icon
                    name="calculator"
                    size={moderateScale(20)}
                    color="#fff"
                    style={{ marginRight: scale(8) }}
                  />
                  <Text style={styles.btnText}>Calculate BMI</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
        <View style={{ height: verticalScale(50) }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA", // Matches BMI & Water
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
  scrollContent: {
    padding: scale(20),
    paddingTop: verticalScale(30),
  },

  // --- Main Calorie Display Card ---
  mainCard: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(25),
    padding: moderateScale(25),
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: verticalScale(20),
    textAlign: "center",
  },
  calorieCircle: {
    width: moderateScale(180),
    height: moderateScale(180),
    borderRadius: moderateScale(90),
    marginBottom: verticalScale(25),
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    backgroundColor: "#fff",
  },
  circleGradient: {
    flex: 1,
    borderRadius: moderateScale(90),
    padding: moderateScale(8),
  },
  circleInner: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: moderateScale(82), // Inner radius
    justifyContent: "center",
    alignItems: "center",
  },
  calorieValue: {
    fontSize: moderateScale(42),
    fontWeight: "800",
    letterSpacing: -1,
  },
  calorieUnit: {
    fontSize: moderateScale(14),
    color: "#b2bec3",
    fontWeight: "700",
    marginTop: verticalScale(2),
    letterSpacing: 1,
  },

  // --- Progress Bar ---
  progressContainer: {
    width: "100%",
    marginBottom: verticalScale(25),
  },
  progressBarBackground: {
    height: verticalScale(12),
    backgroundColor: "#f1f2f6",
    borderRadius: moderateScale(6),
    overflow: "hidden",
    marginBottom: verticalScale(8),
  },
  progressBarFill: {
    height: "100%",
    borderRadius: moderateScale(6),
  },
  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: moderateScale(12),
    color: "#636e72",
    fontWeight: "600",
  },
  progressPercentage: {
    fontSize: moderateScale(14),
    fontWeight: "bold",
  },

  // --- Category Badge ---
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
  },
  categoryText: {
    fontSize: moderateScale(14),
    fontWeight: "bold",
    marginLeft: scale(8),
    textTransform: "capitalize",
  },

  // --- Stats Grid Card ---
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    marginBottom: verticalScale(20),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardSectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: verticalScale(15),
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    // backgroundColor: '#f9f9f9', // Optional sub-bg
    // borderRadius: moderateScale(15),
    // padding: moderateScale(10),
  },
  statIconBox: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  statValue: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: verticalScale(2),
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: "#b2bec3",
    fontWeight: "600",
  },

  // --- Diet Plan Card ---
  planCard: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    marginBottom: verticalScale(20),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  planIconBox: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  planTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#2d3436",
  },
  planText: {
    fontSize: moderateScale(14),
    color: "#636e72",
    lineHeight: verticalScale(22),
  },

  disclaimer: {
    textAlign: "center",
    fontSize: moderateScale(11),
    color: "#b2bec3",
    marginHorizontal: scale(20),
    marginBottom: verticalScale(10),
  },

  // --- Empty State ---
  emptyStateCard: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(25),
    padding: moderateScale(30),
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: verticalScale(20),
  },
  emptyIconCircle: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    marginBottom: verticalScale(25),
    elevation: 8,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    backgroundColor: "#fff", // Need bg for shadow to show on circle
  },
  emptyIconGradient: {
    flex: 1,
    borderRadius: moderateScale(50),
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: verticalScale(10),
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: moderateScale(14),
    color: "#636e72",
    lineHeight: verticalScale(22),
    marginBottom: verticalScale(30),
    paddingHorizontal: scale(10),
  },
  actionBtn: {
    width: "100%",
    borderRadius: moderateScale(15),
    elevation: 5,
    shadowColor: "#4facfe",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  btnGradient: {
    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(15),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
});

export default CaloriesScreen;
