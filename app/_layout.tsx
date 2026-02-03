import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ChatProvider } from "../context/ChatContext";

const StackLayout = () => {
  const { user, loading } = useAuth();

  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      {/* Public Routes: Only accessible when NOT logged in */}
      <Stack.Protected guard={!user}>
        <Stack.Screen name="index" />
        <Stack.Screen name="Login" />
        <Stack.Screen name="Registration" />
        <Stack.Screen name="Register2" />
        <Stack.Screen name="ForgotPassword" />
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
  return (
    <AuthProvider>
      <ChatProvider>
        <StackLayout />
      </ChatProvider>
    </AuthProvider>
  );
}
