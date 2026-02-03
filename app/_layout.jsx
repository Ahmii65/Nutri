import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      {/* <StatusBar barStyle={"dark-content"} backgroundColor={"transparent"} /> */}
      <Stack
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="Login" />
        <Stack.Screen name="Registration" />
        <Stack.Screen name="Register2" />
        <Stack.Screen name="ForgotPassword" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="BMICalculator" />
        <Stack.Screen name="CaloriesScreen" />
        <Stack.Screen name="WaterScreen" />
        <Stack.Screen name="MealLogScreen" />
        <Stack.Screen name="NotificationScreen" />
        <Stack.Screen name="RecipeSuggestionScreen" />
      </Stack>
    </>
  );
}
