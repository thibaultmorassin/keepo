import { Stack } from "expo-router";

import { colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function PublicLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="sign-up"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "Sign up",
          headerStyle: {
            backgroundColor:
              colorScheme === "dark"
                ? colors.dark.background
                : colors.light.background,
          },
          headerTintColor:
            colorScheme === "dark"
              ? colors.dark.foreground
              : colors.light.foreground,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "Login",
          headerStyle: {
            backgroundColor:
              colorScheme === "dark"
                ? colors.dark.background
                : colors.light.background,
          },
          headerTintColor:
            colorScheme === "dark"
              ? colors.dark.foreground
              : colors.light.foreground,
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}
