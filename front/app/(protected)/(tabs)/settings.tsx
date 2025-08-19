import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useAuth } from "@/lib/cognito/auth.provider";

export default function Settings() {
  const { signOut } = useAuth();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
      <View className="gap-4 flex-1 pt-12">
        <H1 className="text-center">Déconnexion</H1>
        <Muted className="text-center">
          Déconnexion et retour à l&apos;écran de bienvenue.
        </Muted>
      </View>
      <Button
        className="w-full"
        size="default"
        variant="default"
        onPress={async () => {
          await signOut();
        }}
      >
        <Text>Déconnexion</Text>
      </Button>
    </SafeAreaView>
  );
}
