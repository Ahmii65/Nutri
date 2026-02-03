import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const BMICalculator = () => {
  const router = useRouter();
  const [weight, setWeight] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm"); // 'cm' or 'ft'
  const [bmi, setBmi] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  // Animation value for the gauge/bar
  const progressAnim = useSharedValue(0);
  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    if (!weightNum || weightNum <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid weight.");
      return;
    }
    let heightInMeters = 0;
    if (heightUnit === "cm") {
      const cm = parseFloat(heightCm);
      if (!cm || cm <= 0) {
        Alert.alert(
          "Invalid Input",
          "Please enter valid height in centimeters.",
        );
        return;
      }
      heightInMeters = cm / 100;
    } else {
      const feet = parseFloat(heightFeet);
      const inches = parseFloat(heightInches);
      if (!feet || feet <= 0) {
        Alert.alert("Invalid Input", "Please enter valid feet height.");
        return;
      }
      const totalInches = feet * 12 + (inches ? inches : 0);
      heightInMeters = totalInches * 0.0254;
    }
    const bmiValue = weightNum / heightInMeters ** 2;
    const bmiRounded = bmiValue.toFixed(1);
    setBmi(bmiRounded);
    let newCategory = "";
    let progressValue = 0;
    if (bmiValue < 18.5) {
      newCategory = "Underweight";
      progressValue = 0.2; // 20%
    } else if (bmiValue < 25) {
      newCategory = "Normal";
      progressValue = 0.5; // 50%
    } else if (bmiValue < 30) {
      newCategory = "Overweight";
      progressValue = 0.75; // 75%
    } else {
      newCategory = "Obese";
      progressValue = 1; // 100%
    }
    setCategory(newCategory);
    // Animate the bar
    progressAnim.value = withTiming(progressValue, {
      duration: 1000,
    });

    // Save to AsyncStorage
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("user_bmi", bmiRounded);
        await AsyncStorage.setItem("user_category", newCategory);
        await AsyncStorage.setItem("user_weight", weightNum.toString());
      } catch (e) {
        console.log("Failed to save BMI data", e);
      }
    };
    saveData();
  };
  const resetCalculator = () => {
    setWeight("");
    setHeightCm("");
    setHeightFeet("");
    setHeightInches("");
    setBmi(null);
    setCategory("");
    progressAnim.value = 0;
  };
  const getMetricColor = () => {
    if (!category) return "#e0e0e0";
    if (category === "Underweight") return "#f1c40f";
    if (category === "Normal") return "#2ecc71";
    if (category === "Overweight") return "#e67e22";
    return "#e74c3c";
  };
  const barAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnim.value * 100}%`,
    };
  });
  return (
    <View style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#4facfe" /> */}

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
            <Text style={styles.headerTitle}>BMI Calculator</Text>
            <View style={{ width: moderateScale(28) }} />
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Input Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Details</Text>

          {/* Weight */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Weight (kg)</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="scale-outline"
                size={moderateScale(20)}
                color="#a4b0be"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor="#ccc"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
          </View>

          {/* Unit Toggle */}
          <View style={styles.unitToggleContainer}>
            <Text style={styles.label}>Height Unit</Text>
            <View style={styles.toggleWrapper}>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  heightUnit === "cm" && styles.toggleBtnActive,
                ]}
                onPress={() => setHeightUnit("cm")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    heightUnit === "cm" && styles.toggleTextActive,
                  ]}
                >
                  CM
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  heightUnit === "ft" && styles.toggleBtnActive,
                ]}
                onPress={() => setHeightUnit("ft")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    heightUnit === "ft" && styles.toggleTextActive,
                  ]}
                >
                  FT/IN
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Height */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Height</Text>
            {heightUnit === "cm" ? (
              <View style={styles.inputContainer}>
                <Ionicons
                  name="resize-outline"
                  size={moderateScale(20)}
                  color="#a4b0be"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="175"
                  placeholderTextColor="#ccc"
                  keyboardType="numeric"
                  value={heightCm}
                  onChangeText={setHeightCm}
                />
                <Text style={styles.unitSuffix}>cm</Text>
              </View>
            ) : (
              <View style={styles.row}>
                <View
                  style={[
                    styles.inputContainer,
                    { flex: 1, marginRight: scale(10) },
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="5"
                    placeholderTextColor="#ccc"
                    keyboardType="numeric"
                    value={heightFeet}
                    onChangeText={setHeightFeet}
                  />
                  <Text style={styles.unitSuffix}>ft</Text>
                </View>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="10"
                    placeholderTextColor="#ccc"
                    keyboardType="numeric"
                    value={heightInches}
                    onChangeText={setHeightInches}
                  />
                  <Text style={styles.unitSuffix}>in</Text>
                </View>
              </View>
            )}
          </View>

          {/* Calculate Button */}
          <TouchableOpacity onPress={calculateBMI} activeOpacity={0.8}>
            <LinearGradient
              colors={["#4facfe", "#00f2fe"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.calculateBtn}
            >
              <Text style={styles.calculateBtnText}>Calculate BMI</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Result Area */}
        {bmi && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Your Result</Text>

            <View style={styles.bmiCircle}>
              <LinearGradient
                colors={[getMetricColor(), "#fff"]}
                style={styles.bmiCircleGradient}
              >
                <View style={styles.bmiCircleInner}>
                  <Text style={[styles.bmiValue, { color: getMetricColor() }]}>
                    {bmi}
                  </Text>
                  <Text style={styles.bmiLabel}>BMI</Text>
                </View>
              </LinearGradient>
            </View>

            <Text style={[styles.categoryText, { color: getMetricColor() }]}>
              {category}
            </Text>

            {/* Visual Bar */}
            <View style={styles.barContainer}>
              <View style={styles.barBackground}>
                <Animated.View
                  style={[
                    styles.barFill,
                    barAnimatedStyle,
                    {
                      backgroundColor: getMetricColor(),
                    },
                  ]}
                />
              </View>
              <View style={styles.barLabels}>
                <Text style={styles.barLabel}>Underweight</Text>
                <Text style={styles.barLabel}>Normal</Text>
                <Text style={styles.barLabel}>Overweight</Text>
                <Text style={styles.barLabel}>Obese</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.resetBtn} onPress={resetCalculator}>
              <Text style={styles.resetBtnText}>Reset Calculation</Text>
              <Ionicons
                name="refresh"
                size={moderateScale(18)}
                color="#636e72"
              />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
    elevation: 5,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
    padding: moderateScale(4),
  },
  scrollContent: {
    padding: scale(20),
    paddingTop: verticalScale(20),
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: verticalScale(20),
    textAlign: "center",
  },
  inputWrapper: {
    marginBottom: verticalScale(15),
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#636e72",
    marginBottom: verticalScale(8),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f2f6",
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(15),
    height: verticalScale(50),
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputIcon: {
    marginRight: scale(10),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(16),
    color: "#2d3436",
    fontWeight: "600",
    height: "100%",
  },
  unitSuffix: {
    fontSize: moderateScale(14),
    color: "#a4b0be",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  unitToggleContainer: {
    marginBottom: verticalScale(15),
  },
  toggleWrapper: {
    flexDirection: "row",
    backgroundColor: "#f1f2f6",
    borderRadius: moderateScale(10),
    padding: moderateScale(4),
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: verticalScale(8),
    alignItems: "center",
    borderRadius: moderateScale(8),
  },
  toggleBtnActive: {
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
  },
  toggleText: {
    fontSize: moderateScale(13),
    fontWeight: "600",
    color: "#a4b0be",
  },
  toggleTextActive: {
    color: "#2d3436",
  },
  calculateBtn: {
    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(15),
    alignItems: "center",
    marginTop: verticalScale(10),
    elevation: 5,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
  },
  calculateBtnText: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    padding: moderateScale(25),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    alignItems: "center",
    marginBottom: verticalScale(30),
  },
  resultLabel: {
    fontSize: moderateScale(16),
    color: "#636e72",
    marginBottom: verticalScale(20),
  },
  bmiCircle: {
    width: moderateScale(140),
    height: moderateScale(140),
    borderRadius: moderateScale(70),
    marginBottom: verticalScale(15),
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    backgroundColor: "#fff",
  },
  bmiCircleGradient: {
    flex: 1,
    borderRadius: moderateScale(70),
    padding: moderateScale(5),
  },
  bmiCircleInner: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: moderateScale(65),
    justifyContent: "center",
    alignItems: "center",
  },
  bmiValue: {
    fontSize: moderateScale(40),
    fontWeight: "bold",
  },
  bmiLabel: {
    fontSize: moderateScale(14),
    color: "#b2bec3",
    textTransform: "uppercase",
  },
  categoryText: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    marginBottom: verticalScale(20),
  },
  barContainer: {
    width: "100%",
    marginBottom: verticalScale(20),
  },
  barBackground: {
    height: verticalScale(10),
    backgroundColor: "#f1f2f6",
    borderRadius: moderateScale(5),
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: moderateScale(5),
  },
  barLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(5),
  },
  barLabel: {
    fontSize: moderateScale(10),
    color: "#b2bec3",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(10),
  },
  resetBtnText: {
    fontSize: moderateScale(14),
    color: "#636e72",
    marginRight: scale(5),
    fontWeight: "600",
  },
});

export default BMICalculator;
