import WaterBottle from "@/components/WaterBottle";
import WaterControls from "@/components/WaterControls";
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
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const WaterScreen = () => {
  const router = useRouter();
  const [intake, setIntake] = useState(0); // Current glasses
  const [goal, setGoal] = useState(8); // Daily goal in glasses
  const [customGoal, setCustomGoal] = useState(""); // For setting new goal

  const glassSize = 250; // ml per glass

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
        <WaterBottle intake={intake} goal={goal} glassSize={glassSize} />

        {/* Controls */}
        <WaterControls
          onAdd={addGlass}
          onRemove={removeGlass}
          customGoal={customGoal}
          setCustomGoal={setCustomGoal}
          onSetNewGoal={setNewGoal}
          onReset={resetIntake}
        />

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
});

export default WaterScreen;
