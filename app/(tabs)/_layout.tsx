import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";

const TabIcon = ({
  focused,
  name,
  size,
  color,
}: {
  focused: boolean;
  name: React.ComponentProps<typeof Ionicons>["name"];
  size: number;
  color: string;
}) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
};

export default function TabsLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            paddingTop: moderateScale(8),
            backgroundColor: "#fff",
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarActiveTintColor: "#4A75F0",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ size, color, focused }) => (
              <TabIcon
                size={size}
                color={color}
                focused={focused}
                name={focused ? "home" : "home-outline"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="ProgressScreen"
          options={{
            title: "Progress",
            tabBarIcon: ({ size, color, focused }) => (
              <TabIcon
                size={size}
                color={color}
                focused={focused}
                name={focused ? "stats-chart" : "stats-chart-outline"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="NutritionScreen"
          options={{
            tabBarIcon: ({ size, color, focused }) => (
              <TabIcon
                size={size}
                color={color}
                focused={focused}
                name={focused ? "chatbubbles" : "chatbubbles-outline"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="ProfileScreen"
          options={{
            title: "Profile",
            tabBarIcon: ({ size, color, focused }) => (
              <TabIcon
                size={size}
                color={color}
                focused={focused}
                name={focused ? "person" : "person-outline"}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
