import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import useLogin from "@/lib/cognito/use-login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Alert, View } from "react-native";
import * as z from "zod";

const formSchema = z.object({
  email: z.email("Merci d'entrer une adresse email valide."),
  password: z
    .string()
    .min(8, "Merci d'entrer au moins 8 caractères.")
    .max(64, "Merci d'entrer moins de 64 caractères."),
});

export default function Login() {
  const router = useRouter();

  const { handleLogin } = useLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "thibaultmorassin+cognito@gmail.com",
      password: "AAAaaa111&&&",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const [result, error] = await handleLogin(data.email, data.password);

    if (error) {
      if (error.message.includes("Veuillez d'abord confirmer votre compte")) {
        Alert.alert(
          "Compte non confirmé",
          "Nous vous avons envoyé un code de confirmation à votre adresse email.",
          [
            {
              text: "Confirmer mon compte",
              onPress: () => router.push("/(public)/confirm-sign-up"),
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
    console.log("Login successful", result);
  }

  return (
    <SafeAreaView className="flex-1 gap-8 bg-background">
      <View className="flex-1 rounded-b-3xl bg-primary" />
      <View className="flex-1 p-4 gap-4">
        <Form {...form}>
          <View className="flex-1 gap-4">
            <H1>Connexion</H1>
            <View className="gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormInput
                    label="Email"
                    placeholder="Email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    keyboardType="email-address"
                    {...field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormInput
                    label="Mot de passe"
                    placeholder="Mot de passe"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                    {...field}
                  />
                )}
              />
            </View>
          </View>
          <View className="flex-row gap-4">
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
                <Text>Se connecter</Text>
              )}
            </Button>
          </View>
        </Form>
      </View>
    </SafeAreaView>
  );
}
