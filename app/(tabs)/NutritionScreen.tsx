import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const NutritionScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#4facfe" /> */}

      {/* Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={["#4facfe", "#00f2fe"]}
          style={[styles.headerGradient, { paddingTop: insets.top }]}
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
            <Text style={styles.headerTitle}>Nutritionist</Text>
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
        <View>
          {/* Hero/Intro Section */}
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>Your AI Health Partner</Text>
            <Text style={styles.introText}>
              Get personalized diet plans, recipe ideas, and nutrition advice
              instantly.
            </Text>
          </View>

          {/* AI Chatbot Section */}
          <View style={styles.aiCardWrapper}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push("/AiAssistant")}
            >
              <LinearGradient
                colors={["#4facfe", "#00f2fe"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.aiCard}
              >
                <View style={styles.aiContentContainer}>
                  <View style={styles.aiIconContainer}>
                    <Ionicons
                      name="chatbubble-ellipses"
                      size={moderateScale(40)}
                      color="#fff"
                    />
                  </View>
                  <View style={styles.aiTextContainer}>
                    <Text style={styles.aiTitle}>Chat with AI</Text>
                    <Text style={styles.aiDescription}>
                      Ask about calories, meal plans, or healthy habits.
                    </Text>
                  </View>
                  <View style={styles.arrowContainer}>
                    <Ionicons
                      name="arrow-forward-circle"
                      size={moderateScale(40)}
                      color="rgba(255,255,255,0.9)"
                    />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingBottom: verticalScale(20),
    paddingHorizontal: scale(20),
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#fff",
  },
  iconBtn: {
    padding: moderateScale(5),
    borderRadius: moderateScale(20),
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  scrollContent: {
    padding: scale(20),
    paddingTop: verticalScale(30),
  },
  introCard: {
    marginBottom: verticalScale(30),
    paddingHorizontal: scale(10),
  },
  introTitle: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: verticalScale(10),
  },
  introText: {
    fontSize: moderateScale(16),
    color: "#636e72",
    lineHeight: verticalScale(24),
  },
  aiCardWrapper: {
    marginBottom: verticalScale(20),
    elevation: 10,
    shadowColor: "#4facfe",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    borderRadius: moderateScale(25),
    backgroundColor: "#fff", // needed for shadow on iOS if gradient doesn't carry it
  },
  aiCard: {
    borderRadius: moderateScale(25),
    padding: moderateScale(25),
    minHeight: verticalScale(160),
    justifyContent: "center",
  },
  aiContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  aiIconContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: moderateScale(12),
    borderRadius: moderateScale(18),
    marginRight: scale(15),
  },
  aiTextContainer: {
    flex: 1,
    marginRight: scale(10),
  },
  aiTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: verticalScale(5),
  },
  aiDescription: {
    fontSize: moderateScale(14),
    color: "rgba(255,255,255,0.9)",
    lineHeight: verticalScale(18),
  },
  arrowContainer: {
    justifyContent: "center",
  },
});

export default NutritionScreen;
