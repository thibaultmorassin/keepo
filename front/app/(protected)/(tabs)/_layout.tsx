import Feather from "@expo/vector-icons/Feather";
import { Tabs } from "expo-router";
import React from "react";

import { colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor:
            colorScheme === "dark"
              ? colors.dark.background
              : colors.light.background,
        },
        tabBarActiveTintColor:
          colorScheme === "dark"
            ? colors.dark.foreground
            : colors.light.foreground,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Feather name="sliders" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
