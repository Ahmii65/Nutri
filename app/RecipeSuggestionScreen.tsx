import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const RecipeCard = ({
  recipe,
  single,
  onPress,
  isFavorite,
  onToggleFavorite,
}: {
  recipe: any;
  single?: boolean;
  onPress?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.recipeCard, single && styles.recipeCardSingle]}
  >
    <LinearGradient colors={["#ffffff", "#f0f4f8"]} style={styles.cardGradient}>
      <View style={styles.cardHeader}>
        <View style={styles.imagePlaceholder}>
          {recipe.image && recipe.image.uri ? (
            <Image
              source={recipe.image}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: moderateScale(40),
              }}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.recipeImage}>{recipe.imageText || "🥘"}</Text>
          )}
        </View>
        <Pressable
          onPress={() => onToggleFavorite?.(recipe.id)}
          style={styles.favoriteButton}
          hitSlop={moderateScale(10)}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={moderateScale(22)}
            color={isFavorite ? "#ff4757" : "#2d3436"}
          />
        </Pressable>
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={moderateScale(10)} color="#FFD700" />
          <Text style={styles.ratingText}>{recipe.rating}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.recipeCategory}>{recipe.category}</Text>
        <Text style={styles.recipeName} numberOfLines={2}>
          {recipe.name}
        </Text>

        <View style={styles.recipeMeta}>
          <View style={styles.metaItem}>
            <Ionicons
              name="flame-outline"
              size={moderateScale(12)}
              color="#747d8c"
            />
            <Text style={styles.metaText}>{recipe.calories}kcal</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons
              name="time-outline"
              size={moderateScale(12)}
              color="#747d8c"
            />
            <Text style={styles.metaText}>{recipe.prepTime}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  </Pressable>
);

const RecipeDetailModal = ({
  recipe,
  visible,
  onClose,
  isFavorite,
  onToggleFavorite,
  onShare,
}: {
  recipe: any;
  visible: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onShare: (recipe: any) => void;
}) => {
  if (!recipe) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Close Indicator */}
          <View style={styles.dragIndicator} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header Image Area */}
            <View style={styles.detailHeader}>
              <View
                style={[
                  styles.detailImageBg,
                  { overflow: "hidden", backgroundColor: "#e0c3fc" },
                ]}
              >
                {recipe.image && recipe.image.uri ? (
                  <Image
                    source={recipe.image}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.detailLargeImage}>
                    {recipe.imageText || "🥘"}
                  </Text>
                )}
              </View>

              <View style={styles.headerOverlay}>
                <Pressable onPress={onClose} style={styles.modalCloseBtn}>
                  <Ionicons
                    name="close"
                    size={moderateScale(24)}
                    color="#333"
                  />
                </Pressable>
                <Pressable
                  onPress={() => onToggleFavorite(recipe.id)}
                  style={styles.modalFavBtn}
                >
                  <Ionicons
                    name={isFavorite ? "heart" : "heart-outline"}
                    size={moderateScale(24)}
                    color={isFavorite ? "#ff4757" : "#333"}
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.detailBody}>
              <Text style={styles.detailTitle}>{recipe.name}</Text>
              <View style={styles.tagsRow}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{recipe.category}</Text>
                </View>
                <View style={[styles.tag, styles.tagDifficulty]}>
                  <Text style={styles.tagText}>{recipe.difficulty}</Text>
                </View>
              </View>

              {/* Nutrition Grid */}
              <View style={styles.nutritionCard}>
                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientValue}>
                    {recipe.nutrients.protein}
                  </Text>
                  <Text style={styles.nutrientLabel}>Protein</Text>
                </View>
                <View style={styles.nutrientVerticalDivider} />
                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientValue}>
                    {recipe.nutrients.carbs}
                  </Text>
                  <Text style={styles.nutrientLabel}>Carbs</Text>
                </View>
                <View style={styles.nutrientVerticalDivider} />
                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientValue}>
                    {recipe.nutrients.fat}
                  </Text>
                  <Text style={styles.nutrientLabel}>Fat</Text>
                </View>
              </View>

              {/* Quick Info */}
              <View style={styles.quickInfoRow}>
                <View style={styles.quickInfoItem}>
                  <Ionicons
                    name="time-outline"
                    size={moderateScale(20)}
                    color="#0984e3"
                  />
                  <Text style={styles.quickInfoText}>{recipe.prepTime}</Text>
                </View>
                <View style={styles.quickInfoItem}>
                  <Ionicons
                    name="flame-outline"
                    size={moderateScale(20)}
                    color="#e17055"
                  />
                  <Text style={styles.quickInfoText}>
                    {recipe.calories} kcal
                  </Text>
                </View>
                <View style={styles.quickInfoItem}>
                  <Ionicons
                    name="people-outline"
                    size={moderateScale(20)}
                    color="#00b894"
                  />
                  <Text style={styles.quickInfoText}>
                    {recipe.servings} Serv
                  </Text>
                </View>
              </View>

              {/* Ingredients */}
              <Text style={styles.sectionHeader}>Ingredients</Text>
              <View style={styles.ingredientsList}>
                {recipe.ingredients.map((item: string, index: number) => (
                  <View key={index} style={styles.ingredientRow}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.ingredientText}>{item}</Text>
                  </View>
                ))}
              </View>

              {/* Instructions */}
              <Text style={styles.sectionHeader}>Instructions</Text>
              <View style={styles.instructionsList}>
                {recipe.instructions.map((step: string, index: number) => (
                  <View key={index} style={styles.instructionRow}>
                    <View style={styles.stepCircle}>
                      <Text style={styles.stepNumber}>{index + 1}</Text>
                    </View>
                    <Text style={styles.instructionText}>{step}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.shareButton} onPress={onShare}>
                <LinearGradient
                  colors={["#00f2fe", "#4facfe"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.shareGradient}
                >
                  <Ionicons
                    name="share-social-outline"
                    size={moderateScale(20)}
                    color="#fff"
                  />
                  <Text style={styles.shareButtonText}>Share Recipe</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={{ height: verticalScale(40) }} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Module-level cache to persist data across navigation
const recipeCache: Record<string, any[]> = {};

const RecipeSuggestionScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize state with cached data if available
  const getInitialRecipes = () => {
    const cacheKey = searchQuery
      ? `search:${searchQuery}`
      : `cat:${selectedCategory}`;
    return recipeCache[cacheKey] || [];
  };

  const [recipes, setRecipes] = useState<any[]>(getInitialRecipes);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showRecipeDetail, setShowRecipeDetail] = useState(false);

  const categories = [
    "All",
    "Breakfast",
    "Chicken",
    "Vegetarian",
    "Seafood",
    "Pasta",
    "Dessert",
  ];

  // Load favorites
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem("user_favorites");
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (e) {
        console.log("Failed to load favorites", e);
      }
    };
    loadFavorites();
  }, []);

  // Save favorites
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem("user_favorites", JSON.stringify(favorites));
      } catch (e) {
        console.log("Failed to save favorites", e);
      }
    };
    saveFavorites();
  }, [favorites]);

  // Fetch Recipes
  const fetchRecipes = async () => {
    const cacheKey = searchQuery
      ? `search:${searchQuery}`
      : `cat:${selectedCategory}`;

    // Check cache first
    if (recipeCache[cacheKey]) {
      setRecipes(recipeCache[cacheKey]);
      return;
    }

    setLoading(true);
    try {
      let url =
        "https://www.themealdb.com/api/json/v1/1/search.php?s=" + searchQuery;

      if (selectedCategory !== "All" && searchQuery === "") {
        url =
          "https://www.themealdb.com/api/json/v1/1/filter.php?c=" +
          selectedCategory;
      }

      const response = await fetch(url);
      const data = await response.json();

      let mappedRecipes = [];
      if (data.meals) {
        mappedRecipes = data.meals.map((meal: any) => {
          // Extract ingredients and measures
          const ingredients = [];
          for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== "") {
              ingredients.push(`${ingredient} - ${measure}`);
            }
          }

          // Split instructions (or fallback)
          const instructions = meal.strInstructions
            ? meal.strInstructions
                .split(/\r\n|\n/)
                .filter((step: string) => step.trim() !== "")
            : ["Cook thoroughly and serve."];

          // Simulate nutritional data
          const calories = Math.floor(Math.random() * (600 - 200) + 200);
          const protein = Math.floor(Math.random() * (40 - 10) + 10);
          const carbs = Math.floor(Math.random() * (60 - 20) + 20);
          const fat = Math.floor(Math.random() * (30 - 5) + 5);

          return {
            id: meal.idMeal,
            name: meal.strMeal,
            category: meal.strCategory || selectedCategory,
            image: { uri: meal.strMealThumb },
            imageText: "🥘",
            calories: calories,
            prepTime: `${Math.floor(Math.random() * (60 - 15) + 15)} min`,
            servings: Math.floor(Math.random() * (4 - 1) + 1),
            difficulty: ["Easy", "Medium", "Hard"][
              Math.floor(Math.random() * 3)
            ],
            rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
            ingredients: ingredients,
            instructions: instructions,
            nutrients: {
              protein: `${protein}g`,
              carbs: `${carbs}g`,
              fat: `${fat}g`,
              fiber: `${Math.floor(Math.random() * 10)}g`,
            },
          };
        });
      }

      // Update cache and state
      recipeCache[cacheKey] = mappedRecipes;
      setRecipes(mappedRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect for Category changes (Immediate)
  useEffect(() => {
    fetchRecipes();
  }, [selectedCategory]);

  // Effect for Search changes (Debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecipes();
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleFavorite = (recipeId: string) => {
    setFavorites((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId],
    );
  };

  const handleShareRecipe = async () => {
    if (!selectedRecipe) return;
    try {
      await Share.share({
        message: `Check out this recipe: ${selectedRecipe.name}\n\nCalories: ${selectedRecipe.calories}kcal\nPrepTime: ${selectedRecipe.prepTime}\n\nIngredients:\n${selectedRecipe.ingredients.join("\n")}\n\nInstructions:\n${selectedRecipe.instructions.join("\n")}`,
        title: selectedRecipe.name,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#4facfe" /> */}
      {/* Header Area */}
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
            <Text style={styles.headerTitle}>Discover Recipes</Text>
            <View style={{ width: moderateScale(28) }} />
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={moderateScale(20)}
              color="#a4b0be"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search healthy recipes..."
              placeholderTextColor="#a4b0be"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== "" && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Ionicons
                  name="close-circle"
                  size={moderateScale(18)}
                  color="#a4b0be"
                />
              </Pressable>
            )}
          </View>
        </LinearGradient>
      </View>

      {/* Categories */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryPill,
                selectedCategory === category && styles.categoryPillActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recipe Grid */}
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#4facfe" />
          <Text style={{ marginTop: 10, color: "#636e72" }}>
            Loading recipes...
          </Text>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }: { item: any }) => (
            <RecipeCard
              recipe={item}
              single={recipes.length === 1}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={toggleFavorite}
              onPress={() => {
                setSelectedRecipe(item);
                setShowRecipeDetail(true);
              }}
            />
          )}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="search"
                size={moderateScale(50)}
                color="#dcdde1"
              />
              <Text style={styles.emptyText}>No recipes found</Text>
            </View>
          }
        />
      )}

      <RecipeDetailModal
        recipe={selectedRecipe}
        visible={showRecipeDetail}
        onClose={() => setShowRecipeDetail(false)}
        isFavorite={
          selectedRecipe ? favorites.includes(selectedRecipe.id) : false
        }
        onToggleFavorite={toggleFavorite}
        onShare={handleShareRecipe}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  headerContainer: {
    height: verticalScale(160),
    backgroundColor: "transparent",
    overflow: "hidden",
    borderBottomLeftRadius: moderateScale(30),
    borderBottomRightRadius: moderateScale(30),
    elevation: 8,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    marginBottom: verticalScale(20),
  },
  headerTitle: {
    fontSize: moderateScale(22),
    fontWeight: "bold",
    color: "#fff",
  },
  iconBtn: {
    padding: moderateScale(4),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: moderateScale(15),
    paddingHorizontal: scale(15),
    height: verticalScale(45),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: scale(10),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14),
    color: "#2d3436",
    height: "100%",
  },
  categoryContainer: {
    marginTop: verticalScale(15),
    height: verticalScale(50),
  },
  categoryContent: {
    paddingHorizontal: scale(20),
    alignItems: "center",
  },
  categoryPill: {
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    backgroundColor: "#fff",
    marginRight: scale(10),
    borderWidth: 1,
    borderColor: "#dfe6e9",
  },
  categoryPillActive: {
    backgroundColor: "#4facfe",
    borderColor: "#4facfe",
    elevation: 2,
  },
  categoryText: {
    fontSize: moderateScale(13),
    fontWeight: "600",
    color: "#636e72",
  },
  categoryTextActive: {
    color: "#fff",
  },
  listContent: {
    padding: scale(15),
    paddingBottom: verticalScale(50),
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  // Recipe Card Styles
  recipeCard: {
    width: "48%",
    marginBottom: verticalScale(15),
    borderRadius: moderateScale(15),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    backgroundColor: "#fff",
  },
  recipeCardSingle: {
    width: "100%",
  },
  cardGradient: {
    borderRadius: moderateScale(15),
    padding: moderateScale(10),
    overflow: "hidden",
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  imagePlaceholder: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    marginBottom: verticalScale(5),
  },
  recipeImage: {
    fontSize: moderateScale(40),
  },
  favoriteButton: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#fff",
    borderRadius: moderateScale(12),
    padding: moderateScale(4),
    elevation: 2,
  },
  ratingBadge: {
    position: "absolute",
    left: 0,
    top: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(8),
  },
  ratingText: {
    fontSize: moderateScale(10),
    fontWeight: "bold",
    marginLeft: scale(2),
    color: "#2d3436",
  },
  cardBody: {
    paddingHorizontal: scale(5),
  },
  recipeCategory: {
    fontSize: moderateScale(10),
    color: "#0984e3",
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: verticalScale(2),
  },
  recipeName: {
    fontSize: moderateScale(14),
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: verticalScale(8),
    height: verticalScale(40),
  },
  recipeMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: moderateScale(11),
    color: "#636e72",
    marginLeft: scale(2),
  },
  emptyState: {
    alignItems: "center",
    marginTop: verticalScale(50),
  },
  emptyText: {
    marginTop: verticalScale(10),
    fontSize: moderateScale(16),
    color: "#b2bec3",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    height: "90%",
    borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(30),
    overflow: "hidden",
  },
  dragIndicator: {
    width: scale(40),
    height: verticalScale(5),
    backgroundColor: "#dfe6e9",
    borderRadius: moderateScale(3),
    alignSelf: "center",
    marginTop: verticalScale(10),
    marginBottom: verticalScale(5),
  },
  scrollContent: {},
  detailHeader: {
    height: verticalScale(220),
    marginBottom: verticalScale(20),
  },
  detailImageBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: moderateScale(40),
    borderBottomRightRadius: moderateScale(40),
  },
  detailLargeImage: {
    fontSize: moderateScale(80),
  },
  headerOverlay: {
    position: "absolute",
    top: verticalScale(20),
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
  },
  modalCloseBtn: {
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: moderateScale(8),
    borderRadius: moderateScale(20),
  },
  modalFavBtn: {
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: moderateScale(8),
    borderRadius: moderateScale(20),
  },
  detailBody: {
    paddingHorizontal: scale(25),
  },
  detailTitle: {
    fontSize: moderateScale(26),
    fontWeight: "bold",
    color: "#2d3436",
    textAlign: "center",
    marginBottom: verticalScale(10),
  },
  tagsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: verticalScale(20),
  },
  tag: {
    backgroundColor: "#dfe6e9",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(10),
    marginHorizontal: scale(5),
  },
  tagDifficulty: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#b2bec3",
  },
  tagText: {
    fontSize: moderateScale(12),
    color: "#636e72",
    fontWeight: "600",
  },
  nutritionCard: {
    flexDirection: "row",
    backgroundColor: "#f1f2f6",
    borderRadius: moderateScale(15),
    padding: moderateScale(15),
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
  },
  nutrientItem: {
    alignItems: "center",
    flex: 1,
  },
  nutrientValue: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#2d3436",
  },
  nutrientLabel: {
    fontSize: moderateScale(11),
    color: "#636e72",
  },
  nutrientVerticalDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#dcdde1",
  },
  quickInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(25),
    paddingHorizontal: scale(10),
  },
  quickInfoItem: {
    alignItems: "center",
  },
  quickInfoText: {
    fontSize: moderateScale(12),
    color: "#636e72",
    marginTop: verticalScale(5),
    fontWeight: "500",
  },
  sectionHeader: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: verticalScale(15),
    marginTop: verticalScale(10),
  },
  ingredientsList: {
    marginBottom: verticalScale(20),
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  bulletPoint: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: "#0984e3",
    marginRight: scale(10),
  },
  ingredientText: {
    fontSize: moderateScale(14),
    color: "#2d3436",
  },
  instructionsList: {
    marginBottom: verticalScale(30),
  },
  instructionRow: {
    flexDirection: "row",
    marginBottom: verticalScale(15),
  },
  stepCircle: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    backgroundColor: "#00cec9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(10),
  },
  stepNumber: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: moderateScale(12),
  },
  instructionText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: "#2d3436",
    lineHeight: verticalScale(20),
  },
  shareButton: {
    borderRadius: moderateScale(25),
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  shareGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(15),
  },
  shareButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: moderateScale(16),
    marginLeft: scale(8),
  },
});

export default RecipeSuggestionScreen;
