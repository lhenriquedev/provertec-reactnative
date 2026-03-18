import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import "@/global.css";
import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";
import { queryClient } from "@/src/infra/queryClient";
import { initializeMockServer } from "@/src/mocks/server";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  useEffect(() => {
    initializeMockServer();
  }, []);

  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode="system">
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </QueryClientProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
