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

const FOOD_CALORIE_DATA = [
  { name: "Apple", calories: 95, icon: "nutrition" },
  { name: "Banana", calories: 105, icon: "nutrition" },
  { name: "Boiled Egg", calories: 78, icon: "egg" },
  { name: "Omelette", calories: 250, icon: "egg" },
  { name: "Grilled Chicken", calories: 450, icon: "restaurant" },
  { name: "Rice", calories: 200, icon: "leaf" },
  { name: "Chapati", calories: 120, icon: "leaf" },
  { name: "Burger", calories: 295, icon: "fast-food" },
  { name: "Pizza Slice", calories: 285, icon: "pizza" },
  { name: "Salad", calories: 150, icon: "leaf" },
];

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
  const progress = Math.min(totalCalories / dailyGoal, 1);

  const renderMealSection = (title: keyof MealLogState, iconName: string) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleContainer}>
          <LinearGradient
            colors={["#e0c3fc", "#8ec5fc"]}
            style={styles.iconBackground}
          >
            <Ionicons
              name={iconName as any}
              size={moderateScale(18)}
              color="#fff"
            />
          </LinearGradient>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <TouchableOpacity onPress={() => openAddMealModal(title)}>
          <Ionicons
            name="add-circle"
            size={moderateScale(28)}
            color="#4facfe"
          />
        </TouchableOpacity>
      </View>

      {meals[title].length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No food logged</Text>
        </View>
      ) : (
        meals[title].map((meal: MealLogEntry, index: number) => (
          <View key={index} style={styles.mealCard}>
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.caloriesText}>{meal.calories} kcal</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );

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
        <LinearGradient
          colors={["#ffffff", "#f8fbff"]}
          style={styles.summaryCard}
        >
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Calories Eaten</Text>
              <Text style={styles.summaryValue}>
                {totalCalories} <Text style={styles.summaryUnit}>kcal</Text>
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.summaryLabel}>
                Daily Goal <Text style={styles.goalLabel}>({goalLabel})</Text>
              </Text>
              <Text style={styles.summaryValueLight}>
                {dailyGoal} <Text style={styles.summaryUnit}>kcal</Text>
              </Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <LinearGradient
              colors={["#43e97b", "#38f9d7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(progress * 100)}% of daily goal
          </Text>
        </LinearGradient>

        {/* Meal Sections */}
        {renderMealSection("Breakfast", "sunny")}
        {renderMealSection("Lunch", "restaurant")}
        {renderMealSection("Dinner", "moon")}
        {renderMealSection("Snacks", "cafe")}

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
  summaryCard: {
    borderRadius: moderateScale(15),
    padding: moderateScale(20),
    marginBottom: verticalScale(20),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(15),
  },
  summaryLabel: {
    fontSize: moderateScale(12),
    color: "#888",
    marginBottom: verticalScale(4),
  },
  goalLabel: {
    fontSize: moderateScale(10),
    color: "#4facfe",
    fontWeight: "bold",
  },
  summaryValue: {
    fontSize: moderateScale(22),
    fontWeight: "bold",
    color: "#2d3436",
  },
  summaryValueLight: {
    fontSize: moderateScale(22),
    fontWeight: "600",
    color: "#b2bec3",
    textAlign: "right",
  },
  summaryUnit: {
    fontSize: moderateScale(14),
    fontWeight: "normal",
    color: "#888",
  },
  progressBarContainer: {
    height: verticalScale(10),
    backgroundColor: "#f1f2f6",
    borderRadius: moderateScale(5),
    overflow: "hidden",
    marginBottom: verticalScale(8),
  },
  progressBarFill: {
    height: "100%",
    borderRadius: moderateScale(5),
  },
  progressText: {
    fontSize: moderateScale(11),
    color: "#aaa",
    textAlign: "center",
  },
  sectionContainer: {
    marginBottom: verticalScale(20),
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(10),
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBackground: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(8),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(10),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#2d3436",
  },
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(12),
    padding: moderateScale(15),
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#dfe6e9",
  },
  emptyText: {
    color: "#b2bec3",
    fontSize: moderateScale(12),
  },
  mealCard: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    marginBottom: verticalScale(8),
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  mealInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealName: {
    fontSize: moderateScale(14),
    fontWeight: "500",
    color: "#2d3436",
  },
  caloriesText: {
    fontSize: moderateScale(13),
    color: "#636e72",
    fontWeight: "600",
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
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  suggestionIcon: {
    marginRight: scale(8),
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
