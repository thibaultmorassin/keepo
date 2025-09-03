import { View } from "react-native";
import { Link } from "expo-router";

import { Button } from "@/components/ui/button";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
      <View className="gap-4 flex-1 pt-12">
        <H1 className="text-center">Accueil</H1>
        <Muted className="text-center">
          Vous êtes maintenant authentifié et cette session persistera même
          après la fermeture de l&apos;application.
        </Muted>
      </View>
      <Link href="/(protected)/camera" asChild>
        <Button className="w-full" variant="default" size="default">
          <Text>Ajouter une nouvelle garantie</Text>
        </Button>
      </Link>
    </SafeAreaView>
  );
}
