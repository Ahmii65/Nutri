import { RecipeCardProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const RecipeCard = ({
  recipe,
  single,
  onPress,
  isFavorite,
  onToggleFavorite,
}: RecipeCardProps) => (
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

const styles = StyleSheet.create({
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
});

export default RecipeCard;
