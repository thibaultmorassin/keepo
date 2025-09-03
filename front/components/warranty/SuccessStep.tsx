import { H1, Muted } from "@/components/ui/typography";
import { CheckCircle } from "lucide-react-native";
import { useEffect } from "react";
import { Animated, View } from "react-native";

interface SuccessStepProps {
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
}

export function SuccessStep({ fadeAnim, scaleAnim }: SuccessStepProps) {
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View className="flex-1 items-center justify-center">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="items-center"
      >
        <CheckCircle size={80} color="#10b981" />
        <H1 className="mt-6 text-center">Garantie ajoutée !</H1>
        <Muted className="mt-2 text-center">
          Votre garantie a été enregistrée avec succès
        </Muted>
      </Animated.View>
    </View>
  );
}
