import { Tabs } from "expo-router";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

import { HapticTab } from "@/src/components/haptic-tab";
import { STITCH_COLOR_MODE, getTabBarPalette } from "@/src/infra/theme/stitch-palette";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const tabBarPalette = getTabBarPalette(
    isDark ? STITCH_COLOR_MODE.dark : STITCH_COLOR_MODE.light
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        sceneStyle: {
          backgroundColor: tabBarPalette.sceneBackgroundColor,
        },
        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 12,
          backgroundColor: tabBarPalette.backgroundColor,
          borderTopColor: tabBarPalette.borderTopColor,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
        tabBarActiveTintColor: tabBarPalette.activeTintColor,
        tabBarInactiveTintColor: tabBarPalette.inactiveTintColor,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Painel",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="view-grid-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="stores"
        options={{
          title: "Lojas",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="storefront-outline" size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
