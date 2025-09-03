import { SafeAreaView } from "@/components/ui/safe-area-view";
import { ScrollView, Animated } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Stepper,
  Step1,
  Step2,
  SuccessStep,
  NavigationButtons,
  formSchema,
  FormData,
  TOTAL_STEPS,
} from "@/components/warranty";

export default function ModalScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: "",
      category: "",
      amountCents: "",
      purchaseDate: new Date(),
      warrantyDuration: "",
      file: undefined,
    },
  });

  // Handle image from camera screen
  useEffect(() => {
    if (imageUri) {
      // Create a mock asset object from the URI
      const mockAsset = {
        uri: imageUri,
        width: 0,
        height: 0,
        type: "image",
        fileName: "receipt.jpg",
        fileSize: 0,
      };
      form.setValue("file", mockAsset);
    }
  }, [imageUri, form]);

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log("Warranty data:", data);
    setIsSuccess(true);

    // Navigate back after 2 seconds
    setTimeout(() => {
      router.push("/(protected)/(tabs)");
    }, 2000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1 form={form} />;
      case 1:
        return <Step2 form={form} />;
      default:
        return <SuccessStep fadeAnim={fadeAnim} scaleAnim={scaleAnim} />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-background pt-8 px-4">
        <Stepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <ScrollView className="flex-1">{renderStep()}</ScrollView>

        <NavigationButtons
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onNext={nextStep}
          onPrev={prevStep}
          onSubmit={form.handleSubmit(onSubmit)}
          isSubmitting={form.formState.isSubmitting}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
