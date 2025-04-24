import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { TaskProvider } from "../context/TaskContext";

export default function TabLayout() {
  return (
    <TaskProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#6366F1",
          tabBarInactiveTintColor: "#94A3B8",
          tabBarShowLabel: true,
          tabBarStyle: {
            height: 60,
            paddingBottom: 10,
            paddingTop: 5,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Calendar",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: "Tasks",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: "About",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="information-circle-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </TaskProvider>
  );
}
