import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Ionicons";

const NutritionScreen = () => {
  const router = useRouter();

  // Reanimated Shared Values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50); // Start slightly lower

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withTiming(0, { duration: 800 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }],
    };
  });

  const nutritionists = [
    {
      id: 1,
      name: "Dr. Sarah Smith",
      role: "Clinical Nutritionist",
      online: true,
    },
    { id: 2, name: "Dr. John Doe", role: "Sports Nutritionist", online: false },
  ];

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
            <Text style={styles.headerTitle}>Nutritionist</Text>
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
        <Animated.View style={animatedStyle}>
          {/* Hero/Intro Section */}
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>Expert Guidance</Text>
            <Text style={styles.introText}>
              Connect with certified nutritionists or use our advanced AI
              assistant for personalized diet plans and advice.
            </Text>
          </View>

          {/* Live Chat Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Live Consultation</Text>
            {nutritionists.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.chatCard}
                activeOpacity={0.9}
              >
                <View
                  style={[
                    styles.avatarContainer,
                    { backgroundColor: item.online ? "#e0f7fa" : "#f5f5f5" },
                  ]}
                >
                  <Icon
                    name="person"
                    size={moderateScale(24)}
                    color={item.online ? "#00bcd4" : "#bdbdbd"}
                  />
                  {item.online && <View style={styles.onlineBadge} />}
                </View>
                <View style={styles.chatInfo}>
                  <Text style={styles.chatName}>{item.name}</Text>
                  <Text style={styles.chatRole}>{item.role}</Text>
                </View>
                <View style={styles.chatAction}>
                  <Icon
                    name="chatbubble-ellipses-outline"
                    size={moderateScale(24)}
                    color="#4facfe"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {/* AI Chatbot Section */}
          <View style={styles.aiCard}>
            <LinearGradient
              colors={["#4facfe", "#00f2fe"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiGradient}
            >
              <View style={styles.aiContent}>
                <View>
                  <Text style={styles.aiTitle}>AI Assistant</Text>
                  <Text style={styles.aiDescription}>
                    Get instant answers 24/7
                  </Text>
                </View>
                <Icon
                  name="hardware-chip-outline"
                  size={moderateScale(40)}
                  color="#fff"
                  style={{ opacity: 0.8 }}
                />
              </View>
              <TouchableOpacity
                style={styles.aiBtn}
                onPress={() => router.push("/AiAssistant")}
              >
                <Text style={styles.aiBtnText}>Start Chat</Text>
                <Icon
                  name="arrow-forward"
                  size={moderateScale(16)}
                  color="#0d8af0"
                />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Animated.View>
        <View style={{ height: verticalScale(50) }} />
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
    paddingTop: verticalScale(20),
  },
  introCard: {
    marginBottom: verticalScale(25),
  },
  introTitle: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: verticalScale(5),
  },
  introText: {
    fontSize: moderateScale(14),
    color: "#636e72",
    lineHeight: verticalScale(20),
  },
  sectionContainer: {
    marginBottom: verticalScale(25),
  },
  sectionHeader: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: verticalScale(15),
  },
  chatCard: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    padding: moderateScale(15),
    marginBottom: verticalScale(12),
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  avatarContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(15),
    position: "relative",
  },
  onlineBadge: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    backgroundColor: "#00e676",
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#fff",
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#2d3436",
  },
  chatRole: {
    fontSize: moderateScale(12),
    color: "#b2bec3",
    marginTop: verticalScale(2),
  },
  chatAction: {
    padding: moderateScale(10),
  },

  // Consultation Card
  consultationCard: {
    marginBottom: verticalScale(25),
    borderRadius: moderateScale(25),
    elevation: 6,
    shadowColor: "#4facfe",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    backgroundColor: "#fff",
  },
  cardGradient: {
    borderRadius: moderateScale(25),
    padding: moderateScale(25),
    alignItems: "center",
  },
  consultIconContainer: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(20),
    backgroundColor: "#f0f9ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(15),
  },
  cardTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: verticalScale(8),
  },
  cardDescription: {
    fontSize: moderateScale(14),
    color: "#636e72",
    textAlign: "center",
    marginBottom: verticalScale(20),
    lineHeight: verticalScale(20),
  },
  bookBtn: {
    width: "100%",
    borderRadius: moderateScale(15),
    elevation: 4,
    shadowColor: "#4facfe",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  btnGradient: {
    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(15),
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },

  // AI Card
  aiCard: {
    borderRadius: moderateScale(25),
    elevation: 8,
    shadowColor: "#764ba2",
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    marginBottom: verticalScale(40),
  },
  aiGradient: {
    borderRadius: moderateScale(25),
    padding: moderateScale(25),
  },
  aiContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  aiTitle: {
    fontSize: moderateScale(22),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: verticalScale(4),
  },
  aiDescription: {
    fontSize: moderateScale(14),
    color: "rgba(255,255,255,0.8)",
  },
  aiBtn: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  aiBtnText: {
    color: "#0b8ffc",
    fontSize: moderateScale(14),
    fontWeight: "bold",
    marginRight: scale(8),
  },
});

export default NutritionScreen;
