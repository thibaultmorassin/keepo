import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useAuth } from "@/lib/cognito/auth.provider";
import useSignUp from "@/lib/cognito/use-signup";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Alert, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as z from "zod";

const formSchema = z.object({
  code: z.string().length(6, "Merci d'entrer un code de confirmation."),
});

export default function ConfirmSignUp() {
  const router = useRouter();

  const { session } = useAuth();

  const { confirmSignUp, resendConfirmationCode } = useSignUp();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!session?.email) {
      alert("Email not found");
      throw new Error("Email not found");
    }

    const [confirmResult, error] = await confirmSignUp({
      email: session?.email,
      code: data.code,
    });

    if (error) {
      if (error.message === "Code de confirmation expiré") {
        Alert.alert(
          "Code de confirmation expiré",
          "Nous vous avons envoyé un nouveau code de confirmation.",
          [
            {
              text: "Recevoir un nouveau code",
              onPress: async () => {
                const [, resendError] = await resendConfirmationCode();
                if (resendError) {
                  console.error(resendError.message);
                }
                form.reset();
              },
            },
            {
              text: "Fermer",
              style: "destructive",
            },
          ],
        );
      } else {
        console.error(error.message);
      }
      return;
    }

    if (confirmResult) {
      router.push("/(public)");
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 justify-end bg-background gap-8">
        <View className="flex-1 rounded-b-3xl bg-primary" />
        <View className="flex-1 p-4 gap-4">
          <View className="flex gap-4">
            <H1 className="self-start">Confirmation</H1>
            <Muted>
              Veuillez entrer le code de confirmation envoyé à votre adresse{" "}
              <Muted className="text-foreground">{session?.email}</Muted>.
            </Muted>
            <Form {...form}>
              <View className="gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormInput
                      label="Code de confirmation"
                      placeholder="Code de confirmation"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="number-pad"
                      {...field}
                    />
                  )}
                />
              </View>
            </Form>
          </View>
          <View className="flex flex-row gap-4">
            <Link href="../" asChild>
              <Button size="default" variant="secondary">
                <Text>Retour</Text>
              </Button>
            </Link>
            <Button
              size="default"
              variant="default"
              onPress={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
              className="flex-1"
            >
              {form.formState.isSubmitting ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text>Confirmer</Text>
              )}
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
