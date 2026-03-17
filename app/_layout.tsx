import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";

import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";
import "@/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/src/infra/queryClient";
import { initializeMockServer } from "@/src/server";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  useEffect(() => {
    if (__DEV__ && Platform.OS === "web") {
      initializeMockServer();
    }
  }, []);

  return (
    <GluestackUIProvider mode="dark">
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}
