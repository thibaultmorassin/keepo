import { Button } from "@/components/ui/button";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { Link } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ModalScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-background gap-8">
        <View className="flex-1 rounded-b-3xl bg-primary" />
        <View className="flex-1 p-4 gap-4">
          <View className="flex gap-4">
            <H1 className="self-start">Modal</H1>
            <Muted>Ceci est une modal</Muted>
          </View>
          <View className="flex flex-row gap-4">
            <Link href="../" asChild>
              <Button size="default" className="w-full" variant="secondary">
                <Text>Retour</Text>
              </Button>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
