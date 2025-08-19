import { Stack } from "expo-router";

export default function PublicLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="login" options={{}} />
      <Stack.Screen
        name="confirm-sign-up"
        options={{
          presentation: "modal",
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
