import { RecipeDetailModalProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const RecipeDetailModal = ({
  recipe,
  visible,
  onClose,
  isFavorite,
  onToggleFavorite,
  onShare,
}: RecipeDetailModalProps) => {
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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "90%",
    backgroundColor: "#fff",
    borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(30),
    overflow: "hidden",
  },
  dragIndicator: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#dfe6e9",
    alignSelf: "center",
    marginTop: verticalScale(10),
    marginBottom: verticalScale(5),
  },
  scrollContent: {
    paddingBottom: verticalScale(30),
  },
  detailHeader: {
    height: verticalScale(250),
    position: "relative",
  },
  detailImageBg: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  detailLargeImage: {
    fontSize: moderateScale(100),
  },
  headerOverlay: {
    position: "absolute",
    top: verticalScale(15),
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
    flex: 1,
    paddingHorizontal: scale(20),
    marginTop: verticalScale(20),
  },
  detailTitle: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#2d3436",
    textAlign: "center",
    marginBottom: verticalScale(10),
  },
  tagsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  tag: {
    backgroundColor: "#e3fcf7",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(15),
    marginHorizontal: scale(5),
  },
  tagDifficulty: {
    backgroundColor: "#ffece6",
  },
  tagText: {
    fontSize: moderateScale(12),
    color: "#00b894",
    fontWeight: "600",
  },
  nutritionCard: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: moderateScale(20),
    padding: moderateScale(15),
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: verticalScale(25),
  },
  nutrientItem: {
    alignItems: "center",
  },
  nutrientVerticalDivider: {
    width: 1,
    height: "70%",
    backgroundColor: "#dfe6e9",
  },
  nutrientValue: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#2d3436",
  },
  nutrientLabel: {
    fontSize: moderateScale(12),
    color: "#636e72",
    marginTop: verticalScale(2),
  },
  quickInfoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: verticalScale(25),
    borderBottomWidth: 1,
    borderBottomColor: "#f1f2f6",
    paddingBottom: verticalScale(20),
  },
  quickInfoItem: {
    alignItems: "center",
  },
  quickInfoText: {
    marginTop: verticalScale(5),
    fontSize: moderateScale(13),
    color: "#636e72",
    fontWeight: "500",
  },
  sectionHeader: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: verticalScale(15),
  },
  ingredientsList: {
    marginBottom: verticalScale(25),
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4facfe",
    marginRight: scale(10),
  },
  ingredientText: {
    fontSize: moderateScale(14),
    color: "#2d3436",
    flex: 1,
    lineHeight: verticalScale(20),
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
    backgroundColor: "#4facfe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
    marginTop: verticalScale(2),
  },
  stepNumber: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: moderateScale(12),
  },
  instructionText: {
    fontSize: moderateScale(14),
    color: "#2d3436",
    lineHeight: verticalScale(22),
    flex: 1,
  },
  shareButton: {
    borderRadius: moderateScale(25),
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  shareGradient: {
    paddingVertical: verticalScale(15),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  shareButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "bold",
    marginLeft: scale(10),
  },
});

export default RecipeDetailModal;
