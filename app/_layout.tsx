import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ChatProvider } from "../context/ChatContext";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const StackLayout = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return null; // Keep splash screen visible instead of showing a spinner
  }

  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      {/* Public Routes: Only accessible when NOT logged in */}
      <Stack.Protected guard={!user}>
        <Stack.Screen name="index" />
        <Stack.Screen name="Login" />
        <Stack.Screen name="Registration" />
        <Stack.Screen name="ForgotPassword" />
        <Stack.Screen name="Register2" />
      </Stack.Protected>

      {/* Private Routes: Only accessible when logged in */}
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="BMICalculator" />
        <Stack.Screen name="CaloriesScreen" />
        <Stack.Screen name="WaterScreen" />
        <Stack.Screen name="MealLogScreen" />
        <Stack.Screen name="NotificationScreen" />
        <Stack.Screen name="RecipeSuggestionScreen" />
        <Stack.Screen name="AiAssistant" />
      </Stack.Protected>
    </Stack>
  );
};

export default function RootLayout() {
  const [loaded] = useFonts({
    ...Ionicons.font,
    ...MaterialCommunityIcons.font,
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ChatProvider>
        <StackLayout />
      </ChatProvider>
    </AuthProvider>
  );
}
