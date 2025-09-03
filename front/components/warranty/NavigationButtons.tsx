import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { ActivityIndicator, View } from "react-native";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function NavigationButtons({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSubmit,
  isSubmitting,
}: NavigationButtonsProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <View className="flex-row gap-4 mt-4">
      {isFirstStep ? (
        <Link href="../" asChild>
          <Button variant="secondary">
            <Text>Annuler</Text>
          </Button>
        </Link>
      ) : (
        <Button
          variant="secondary"
          onPress={onPrev}
          className="flex-row items-center gap-1.5"
        >
          <ArrowLeft size={16} color="currentColor" />
          <Text className="ml-2">Précédent</Text>
        </Button>
      )}

      {isLastStep ? (
        <Button
          variant="default"
          onPress={onSubmit}
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text>Terminer</Text>
          )}
        </Button>
      ) : (
        <Button
          variant="default"
          onPress={onNext}
          className="flex-1 flex-row items-center gap-1.5"
        >
          <Text>Suivant</Text>
          <ArrowRight size={16} color="currentColor" className="ml-2" />
        </Button>
      )}
    </View>
  );
}
