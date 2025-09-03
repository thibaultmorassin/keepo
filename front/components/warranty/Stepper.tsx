import { Text, View } from "react-native";
import { CheckCircle } from "lucide-react-native";
import { StepperProps } from "./types";

export function Stepper({ currentStep, totalSteps }: StepperProps) {
  return (
    <View className="flex-row items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, index) => (
        <View key={index} className="flex-row items-center">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center ${
              index < currentStep
                ? "bg-primary"
                : index === currentStep
                  ? "bg-primary border-2 border-primary"
                  : "bg-muted"
            }`}
          >
            {index < currentStep ? (
              <CheckCircle size={16} color="white" />
            ) : (
              <Text
                className={`text-sm font-medium ${
                  index <= currentStep
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {index + 1}
              </Text>
            )}
          </View>
          {index < totalSteps - 1 && (
            <View
              className={`w-8 h-0.5 mx-2 ${
                index < currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </View>
      ))}
    </View>
  );
}
