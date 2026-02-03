import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const WaterScreen = () => {
  const router = useRouter();
  const [intake, setIntake] = useState(0); // Current glasses
  const [goal, setGoal] = useState(8); // Daily goal in glasses
  const [customGoal, setCustomGoal] = useState(""); // For setting new goal

  const glassSize = 250; // ml per glass
  const progressAnim = useSharedValue(0);

  // Calculate percentage
  const percentage = Math.min(intake / goal, 1);
  const displayPercentage = Math.round(percentage * 100);

  useEffect(() => {
    progressAnim.value = withTiming(percentage, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [percentage]);

  // Load Data
  useEffect(() => {
    const loadWaterData = async () => {
      try {
        const savedIntake = await AsyncStorage.getItem("water_intake");
        const savedGoal = await AsyncStorage.getItem("water_goal");
        if (savedIntake !== null) setIntake(parseInt(savedIntake, 10));
        if (savedGoal !== null) setGoal(parseInt(savedGoal, 10));
      } catch (e) {
        console.error("Failed to load water data", e);
      }
    };
    loadWaterData();
  }, []);

  // Save Data
  useEffect(() => {
    const saveWaterData = async () => {
      try {
        await AsyncStorage.setItem("water_intake", intake.toString());
        await AsyncStorage.setItem("water_goal", goal.toString());
      } catch (e) {
        console.error("Failed to save water data", e);
      }
    };
    saveWaterData();
  }, [intake, goal]);

  const addGlass = () => {
    if (intake < goal) {
      setIntake((prev) => prev + 1);
    } else {
      Alert.alert("Hydrated!", "You've met your daily water goal! Great job!", [
        { text: "Keep Drinking", onPress: () => setIntake((prev) => prev + 1) },
        { text: "OK" },
      ]);
    }
  };

  const removeGlass = () => {
    if (intake > 0) {
      setIntake((prev) => prev - 1);
    }
  };

  const setNewGoal = () => {
    const newGoalNum = parseInt(customGoal, 10);
    if (newGoalNum > 0) {
      setGoal(newGoalNum);
      setCustomGoal("");
      Alert.alert("Goal Updated", `New daily goal: ${newGoalNum} glasses`);
    } else {
      Alert.alert("Invalid Goal", "Please enter a valid number of glasses.");
    }
  };

  const resetIntake = () => {
    setIntake(0);
  };

  // Interpolate height for liquid fill
  const liquidStyle = useAnimatedStyle(() => {
    return {
      height: `${progressAnim.value * 100}%`,
    };
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
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
            <Text style={styles.headerTitle}>Water Tracker</Text>
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Visualizer */}
        <View style={styles.visualizerContainer}>
          <View style={styles.bottleContainer}>
            <View style={styles.bottleGlass}>
              {/* Liquid */}
              <View style={styles.liquidContainer}>
                <Animated.View style={[styles.liquid, liquidStyle]}>
                  <LinearGradient
                    colors={["#4facfe", "#00f2fe"]}
                    style={{ flex: 1 }}
                  />
                </Animated.View>
              </View>

              {/* Markers */}
              <View style={styles.markerContainer}>
                <View style={styles.marker} />
                <View style={styles.marker} />
                <View style={styles.marker} />
              </View>

              {/* Text Overlay */}
              <View style={styles.bottleTextContainer}>
                <Text style={styles.percentageText}>{displayPercentage}%</Text>
                <Text style={styles.volumeText}>{intake * glassSize}ml</Text>
              </View>
            </View>
          </View>

          <Text style={styles.goalText}>
            Target: {goal * glassSize}ml ({goal} Glasses)
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controlsCard}>
          <Text style={styles.sectionTitle}>Quick Adds</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionBtnSmall}
              onPress={removeGlass}
            >
              <Ionicons
                name="remove"
                size={moderateScale(24)}
                color="#ff6b6b"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addGlassBtn}
              onPress={addGlass}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#4facfe", "#00f2fe"]}
                style={styles.addGlassGradient}
              >
                <Ionicons name="water" size={moderateScale(30)} color="#fff" />
                <Text style={styles.addGlassText}>+250ml</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtnSmall} onPress={addGlass}>
              <Ionicons name="add" size={moderateScale(24)} color="#4facfe" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings / Goals */}
        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Daily Goal</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="8"
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              value={customGoal}
              onChangeText={setCustomGoal}
            />
            <TouchableOpacity style={styles.updateBtn} onPress={setNewGoal}>
              <Text style={styles.btnText}>Set Goal</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.resetBtn} onPress={resetIntake}>
            <Text style={styles.resetText}>Reset Daily Intake</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: verticalScale(50) }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  visualizerContainer: {
    alignItems: "center",
    marginBottom: verticalScale(30),
  },
  bottleContainer: {
    height: verticalScale(250),
    width: scale(140),
    marginBottom: verticalScale(20),
    elevation: 10,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  bottleGlass: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(4),
    borderColor: "rgba(255,255,255,0.8)",
    overflow: "hidden",
    position: "relative",
    justifyContent: "flex-end", // Fills from bottom
  },
  liquidContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: "flex-end",
  },
  liquid: {
    width: "100%",
    backgroundColor: "#4facfe", // Fallback
  },
  liquidGradient: {
    flex: 1,
  },
  markerContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "100%",
    justifyContent: "space-evenly",
    paddingLeft: scale(10),
    zIndex: 2,
    opacity: 0.5,
  },
  marker: {
    width: scale(20),
    height: verticalScale(1),
    backgroundColor: "#2d3436",
  },
  bottleTextContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  percentageText: {
    fontSize: moderateScale(32),
    fontWeight: "bold",
    color: "#2d3436", // Dark text when empty
    textShadowColor: "rgba(255,255,255,0.5)",
    textShadowRadius: 5,
  },
  volumeText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#636e72",
    marginTop: verticalScale(5),
  },
  goalText: {
    fontSize: moderateScale(16),
    color: "#636e72",
    fontWeight: "600",
  },
  controlsCard: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    marginBottom: verticalScale(20),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: verticalScale(15),
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionBtnSmall: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(15),
    backgroundColor: "#f1f2f6",
    justifyContent: "center",
    alignItems: "center",
  },
  addGlassBtn: {
    flex: 1,
    marginHorizontal: scale(15),
    height: verticalScale(60),
    borderRadius: moderateScale(20),
    // overflow: 'hidden',
  },
  addGlassGradient: {
    flex: 1,
    borderRadius: moderateScale(20),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addGlassText: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#fff",
    marginLeft: scale(8),
  },
  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: verticalScale(15),
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f2f6",
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(15),
    fontSize: moderateScale(16),
    marginRight: scale(10),
    color: "#2d3436",
  },
  updateBtn: {
    backgroundColor: "#4facfe",
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(20),
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: moderateScale(14),
  },
  resetBtn: {
    padding: moderateScale(10),
    alignItems: "center",
  },
  resetText: {
    color: "#ff6b6b",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
});

export default WaterScreen;
