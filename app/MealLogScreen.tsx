import CalorieSummaryCard from "@/components/CalorieSummaryCard";
import MealSection from "@/components/MealSection";
import { FOOD_CALORIE_DATA } from "@/constants/data";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { MealLogEntry, MealLogState } from "../types";

const MealLogScreen = () => {
  const router = useRouter();
  const [dailyGoal, setDailyGoal] = useState(2000); // Default fallback
  const [goalLabel, setGoalLabel] = useState("Maintain Weight");

  const [meals, setMeals] = useState<MealLogState>({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMealType, setSelectedMealType] =
    useState<keyof MealLogState>("Breakfast");
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const category = await AsyncStorage.getItem("user_category");
          const weight = await AsyncStorage.getItem("user_weight");

          if (category && weight) {
            const weightNum = parseFloat(weight);
            // Basic BMR Estimate
            let maintenance = weightNum * 24 * 1.2;
            let target = maintenance;
            let label = "Maintain Weight";

            if (category === "Underweight") {
              target = maintenance + 500;
              label = "Weight Gain";
            } else if (category === "Normal") {
              target = maintenance;
              label = "Maintain";
            } else if (category === "Overweight") {
              target = maintenance - 500;
              label = "Weight Loss";
            } else if (category === "Obese") {
              target = maintenance - 750;
              label = "Weight Loss";
            }

            setDailyGoal(Math.round(target));
            setGoalLabel(label);
          }

          // Load Saved Meals
          const savedMeals = await AsyncStorage.getItem("meals_data");
          if (savedMeals) {
            setMeals(JSON.parse(savedMeals));
          }
        } catch (e) {
          console.log("Error loading data", e);
        }
      };
      loadData();
    }, []),
  );

  const getTotalCalories = () => {
    let total = 0;
    Object.values(meals).forEach((category: MealLogEntry[]) =>
      category.forEach((item: MealLogEntry) => (total += item.calories)),
    );
    return total;
  };

  const openAddMealModal = (type: keyof MealLogState) => {
    setSelectedMealType(type);
    setModalVisible(true);
    setMealName("");
    setCalories("");
    setSuggestions([]);
  };

  const addMeal = async () => {
    if (!mealName || !calories) return;

    const newMeals = {
      ...meals,
      [selectedMealType]: [
        ...meals[selectedMealType],
        { name: mealName, calories: parseInt(calories, 10) },
      ],
    };

    setMeals(newMeals);

    // Calculate new total and save for other screens
    let total = 0;
    Object.values(newMeals).forEach((category: MealLogEntry[]) =>
      category.forEach((item: MealLogEntry) => (total += item.calories)),
    );
    await AsyncStorage.setItem("calories_consumed", total.toString());

    // Save Meals Data Persistence
    await AsyncStorage.setItem("meals_data", JSON.stringify(newMeals));

    setModalVisible(false);
  };

  const handleMealNameChange = (text: string) => {
    setMealName(text);
    if (text.length === 0) {
      setSuggestions([]);
      return;
    }
    const filtered = FOOD_CALORIE_DATA.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase()),
    );
    setSuggestions(filtered);
  };

  const totalCalories = getTotalCalories();

  return (
    <View style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#4facfe" /> */}

      {/* Premium Header */}
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
            <Text style={styles.headerTitle}>Food Diary</Text>
            <View style={{ width: moderateScale(28) }} />
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <CalorieSummaryCard
          totalCalories={totalCalories}
          dailyGoal={dailyGoal}
          goalLabel={goalLabel}
        />

        {/* Meal Sections */}
        <MealSection
          title="Breakfast"
          iconName="sunny"
          meals={meals.Breakfast}
          onAddPress={() => openAddMealModal("Breakfast")}
        />
        <MealSection
          title="Lunch"
          iconName="restaurant"
          meals={meals.Lunch}
          onAddPress={() => openAddMealModal("Lunch")}
        />
        <MealSection
          title="Dinner"
          iconName="moon"
          meals={meals.Dinner}
          onAddPress={() => openAddMealModal("Dinner")}
        />
        <MealSection
          title="Snacks"
          iconName="cafe"
          meals={meals.Snacks}
          onAddPress={() => openAddMealModal("Snacks")}
        />

        <View style={{ height: verticalScale(50) }} />
      </ScrollView>

      {/* Add Meal Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add {selectedMealType}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={moderateScale(24)} color="#999" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Food Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Avocado Toast"
              value={mealName}
              onChangeText={handleMealNameChange}
              placeholderTextColor="#ccc"
            />

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <View style={styles.suggestionBox}>
                {suggestions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => {
                      setMealName(item.name);
                      setCalories(item.calories.toString());
                      setSuggestions([]);
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Ionicons
                        name={item.icon || "fast-food"}
                        size={moderateScale(16)}
                        color="#aaa"
                        style={{ marginRight: 8 }}
                      />
                      <Text style={styles.suggestionText}>{item.name}</Text>
                    </View>
                    <Text style={styles.suggestionCal}>
                      {item.calories} kcal
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.inputLabel}>Calories</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={calories}
              onChangeText={setCalories}
              placeholderTextColor="#ccc"
            />

            <TouchableOpacity style={styles.saveButton} onPress={addMeal}>
              <LinearGradient
                colors={["#4facfe", "#00f2fe"]}
                style={styles.saveGradient}
              >
                <Text style={styles.saveButtonText}>Add Entry</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  headerContainer: {
    height: verticalScale(80),
    backgroundColor: "transparent",
    overflow: "hidden",
    borderBottomLeftRadius: moderateScale(25),
    borderBottomRightRadius: moderateScale(25),
    elevation: 5,
  },
  headerGradient: {
    flex: 1,
    paddingTop: verticalScale(30),
    paddingHorizontal: scale(20),
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#fff",
  },
  iconBtn: {
    padding: moderateScale(5),
  },
  contentContainer: {
    padding: scale(20),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: moderateScale(25),
    borderTopRightRadius: moderateScale(25),
    padding: moderateScale(25),
    paddingBottom: verticalScale(40),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#2d3436",
  },
  inputLabel: {
    fontSize: moderateScale(14),
    color: "#636e72",
    marginBottom: verticalScale(8),
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#f1f2f6",
    borderRadius: moderateScale(12),
    padding: moderateScale(15),
    fontSize: moderateScale(16),
    color: "#2d3436",
    marginBottom: verticalScale(20),
  },
  saveButton: {
    marginTop: verticalScale(10),
    borderRadius: moderateScale(15),
    overflow: "hidden",
  },
  saveGradient: {
    paddingVertical: verticalScale(15),
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  suggestionBox: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#f1f2f6",
    marginTop: verticalScale(-15),
    marginBottom: verticalScale(15),
    maxHeight: verticalScale(150),
    elevation: 2,
  },
  suggestionItem: {
    padding: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#f1f2f6",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  suggestionText: {
    fontSize: moderateScale(14),
    color: "#2d3436",
  },
  suggestionCal: {
    fontSize: moderateScale(12),
    color: "#aaa",
  },
});

export default MealLogScreen;
