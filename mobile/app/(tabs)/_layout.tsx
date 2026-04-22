import { Tabs } from "expo-router";
import { View } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import { theme } from "../../constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.primarySoft,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          position: "absolute",
          height: 85,
          paddingBottom: 10,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint="light"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                shadowColor: theme.colors.primarySoft,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: focused ? 0.4 : 0,
                shadowRadius: 8,
                elevation: focused ? 8 : 0,
              }}
            >
              <Ionicons name="stats-chart" size={size} color={color} />
            </View>
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="analysis"
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                shadowColor: theme.colors.primarySoft,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: focused ? 0.4 : 0,
                shadowRadius: 8,
                elevation: focused ? 8 : 0,
              }}
            >
              <Ionicons name="analytics" size={size} color={color} />
            </View>
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="actionplan"
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                shadowColor: theme.colors.primarySoft,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: focused ? 0.4 : 0,
                shadowRadius: 8,
                elevation: focused ? 8 : 0,
              }}
            >
              <Ionicons name="clipboard-outline" size={size} color={color} />
            </View>
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
