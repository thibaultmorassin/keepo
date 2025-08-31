import { Button } from "@/components/ui/button";
import { H1, Muted } from "@/components/ui/typography";
import { useAuth } from "@/lib/cognito/auth.provider";
import { useRouter } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  const { session } = useAuth();

  return (
    <SafeAreaView className="flex flex-1 bg-background">
      <View className="p-4 flex-1">
        <View className="flex flex-1 items-center justify-center gap-y-4 web:m-4">
          <H1 className="text-center font-display">
            {session ? `Hello, ${session.firstName} !` : "Welcome to Keepo"}
          </H1>
          <Muted className="text-center">
            A comprehensive starter project for developing React Native and Expo
            applications with Supabase as the backend.
          </Muted>
        </View>
        <View className="flex flex-col gap-y-4 web:m-4">
          <Button
            size="default"
            variant="default"
            onPress={() => {
              router.push("/login");
            }}
          >
            <Text>Login</Text>
          </Button>
          <Button
            size="default"
            variant="secondary"
            onPress={() => {
              router.push("/sign-up");
            }}
          >
            <Text>Sign up</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
