import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

import { useChat } from "@/context/ChatContext";
import { ChatMessage } from "../types";

const SUGGESTIONS = [
  { id: "1", text: "Create a meal plan for weight loss", icon: "food-apple" },
  { id: "2", text: "How much protein do I need?", icon: "arm-flex" },
  { id: "3", text: "Healthy snack ideas", icon: "food-croissant" },
  { id: "4", text: "Explain macronutrients", icon: "chart-pie" },
];

const AiAssistant = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { messages, sendMessage, isTyping } = useChat();
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim() === "") return;
    sendMessage(inputText.trim());
    setInputText("");
  };

  const handleSuggestion = (text: string) => {
    sendMessage(text);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === "user";
    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.messageRowUser : styles.messageRowAi,
        ]}
      >
        {!isUser && (
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={styles.avatarGradient}
            >
              <MaterialCommunityIcons name="robot" size={14} color="#fff" />
            </LinearGradient>
          </View>
        )}
        <View
          style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.messageTextUser : styles.messageTextAi,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.timeText,
              isUser ? styles.timeTextUser : styles.timeTextAi,
            ]}
          >
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#2d3436" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>AI Nutritionist</Text>
          <View style={styles.onlineContainer}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={styles.chatContainer}>
          {messages.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <MaterialCommunityIcons
                name="robot-excited-outline"
                size={60}
                color="#667eea"
                style={{ marginBottom: 20 }}
              />
              <Text style={styles.welcomeText}>
                Hello! I'm your personal AI Nutritionist.
              </Text>
              <Text style={styles.subtitleText}>
                Ask me about diet plans, calories, or recipes!
              </Text>

              <View style={styles.suggestionsGrid}>
                {SUGGESTIONS.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={styles.suggestionCard}
                    onPress={() => handleSuggestion(s.text)}
                  >
                    <View style={styles.suggestionIcon}>
                      <MaterialCommunityIcons
                        name={s.icon as any}
                        size={20}
                        color="#667eea"
                      />
                    </View>
                    <Text style={styles.suggestionText}>{s.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              inverted
              showsVerticalScrollIndicator={false}
            />
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <View style={styles.typingContainer}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  style={styles.avatarGradient}
                >
                  <MaterialCommunityIcons name="robot" size={14} color="#fff" />
                </LinearGradient>
              </View>
              <View style={styles.typingBubble}>
                <TypingDot delay={0} />
                <TypingDot delay={150} />
                <TypingDot delay={300} />
              </View>
            </View>
          )}
        </View>

        {/* Input Bar */}
        <View
          style={[
            styles.inputContainer,
            {
              paddingBottom: insets.bottom > 0 ? insets.bottom + 10 : 20,
            },
          ]}
        >
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything..."
              placeholderTextColor="#a4b0be"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim()}
              style={[styles.sendButton, !inputText.trim() && { opacity: 0.5 }]}
            >
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.sendGradient}
              >
                <MaterialCommunityIcons name="send" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const TypingDot = ({ delay }: { delay: number }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(0.3, { duration: delay }),
      withRepeat(withTiming(1, { duration: 500 }), -1, true),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

export default AiAssistant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(15),
    backgroundColor: "#F9FAFB",
    zIndex: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#2d3436",
  },
  onlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#00b894",
    marginRight: 4,
  },
  onlineText: {
    fontSize: moderateScale(11),
    color: "#00b894",
    fontWeight: "600",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: scale(15),
  },
  listContent: {
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(10),
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(20),
    marginTop: verticalScale(-50), // Visual center offset
  },
  welcomeText: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#2d3436",
    textAlign: "center",
    marginBottom: verticalScale(8),
  },
  subtitleText: {
    fontSize: moderateScale(14),
    color: "#636e72",
    textAlign: "center",
    marginBottom: verticalScale(30),
  },
  suggestionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  suggestionCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: moderateScale(16),
    padding: moderateScale(15),
    marginBottom: verticalScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f2f6",
  },
  suggestionIcon: {
    marginBottom: verticalScale(10),
    backgroundColor: "#f0f3ff",
    alignSelf: "flex-start",
    padding: 6,
    borderRadius: 10,
  },
  suggestionText: {
    fontSize: moderateScale(13),
    color: "#2d3436",
    fontWeight: "500",
    lineHeight: verticalScale(18),
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: verticalScale(15),
    alignItems: "flex-end",
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  messageRowAi: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginRight: scale(8),
    marginBottom: verticalScale(2),
  },
  avatarGradient: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(18),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  bubbleUser: {
    backgroundColor: "#667eea",
    borderBottomRightRadius: 4,
  },
  bubbleAi: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#f1f2f6",
  },
  messageText: {
    fontSize: moderateScale(14),
    lineHeight: verticalScale(20),
  },
  messageTextUser: {
    color: "#fff",
  },
  messageTextAi: {
    color: "#2d3436",
  },
  timeText: {
    fontSize: moderateScale(10),
    marginTop: verticalScale(4),
    alignSelf: "flex-end",
  },
  timeTextUser: {
    color: "rgba(255,255,255,0.7)",
  },
  timeTextAi: {
    color: "#b2bec3",
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(5),
    marginBottom: verticalScale(15),
  },
  typingBubble: {
    backgroundColor: "#fff",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(18),
    borderBottomLeftRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#f1f2f6",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#667eea",
  },
  inputContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10),
    borderTopLeftRadius: moderateScale(25),
    borderTopRightRadius: moderateScale(25),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f6fa",
    borderRadius: moderateScale(25),
    paddingHorizontal: scale(5),
    paddingVertical: verticalScale(5),
  },
  input: {
    flex: 1,
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(10),
    fontSize: moderateScale(14),
    color: "#2d3436",
    maxHeight: verticalScale(80),
  },
  sendButton: {
    marginRight: 2,
  },
  sendGradient: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    justifyContent: "center",
    alignItems: "center",
  },
});
