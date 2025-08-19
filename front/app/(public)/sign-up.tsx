import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import useSignUp from "@/lib/cognito/use-signup";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, View } from "react-native";
import * as z from "zod";

const formSchema = z
  .object({
    firstName: z.string().min(1, "Merci d'entrer votre prénom."),
    lastName: z.string().min(1, "Merci d'entrer votre nom."),
    email: z.email("Merci d'entrer une adresse email valide."),
    password: z
      .string()
      .min(8, "Merci d'entrer au moins 8 caractères.")
      .max(64, "Merci d'entrer moins de 64 caractères.")
      .regex(
        /^(?=.*[a-z])/,
        "Votre mot de passe doit contenir au moins une lettre minuscule.",
      )
      .regex(
        /^(?=.*[A-Z])/,
        "Votre mot de passe doit contenir au moins une lettre majuscule.",
      )
      .regex(
        /^(?=.*[0-9])/,
        "Votre mot de passe doit contenir au moins un chiffre.",
      )
      .regex(
        /^(?=.*[!@#$%^&*])/,
        "Votre mot de passe doit contenir au moins un caractère spécial.",
      ),
    confirmPassword: z.string().min(8, "Merci d'entrer au moins 8 caractères."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Vos mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const router = useRouter();

  const { signUp } = useSignUp();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const [signUpResult, error] = await signUp({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    });

    if (error) {
      console.error(error.message);
      return;
    }

    if (signUpResult) {
      if (signUpResult.UserConfirmed) {
        router.push("/");
      }

      if (signUpResult.UserConfirmed === false) {
        router.push("/(public)/confirm-sign-up");
      }

      form.reset();
    }
  }

  return (
    <SafeAreaView className="flex-1  bg-background">
      <ScrollView className="flex-1 gap-8">
        <View className="flex-1 min-h-[300px] rounded-b-3xl bg-primary" />
        <View className="flex-1 p-4 gap-4">
          <View className="flex gap-4 web:m-4">
            <H1 className="self-start">Inscription</H1>
            <Form {...form}>
              <View className="gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormInput
                      label="Prénom"
                      placeholder="Prénom"
                      autoCapitalize="none"
                      autoComplete="given-name"
                      autoCorrect={false}
                      keyboardType="email-address"
                      {...field}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormInput
                      label="Nom"
                      placeholder="Nom"
                      autoCapitalize="none"
                      autoComplete="family-name"
                      autoCorrect={false}
                      keyboardType="email-address"
                      {...field}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormInput
                      label="Adresse email"
                      placeholder="Adresse email"
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormInput
                      label="Confirm Password"
                      placeholder="Confirm password"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry
                      {...field}
                    />
                  )}
                />
              </View>
            </Form>
          </View>
          <View className="flex flex-row gap-4">
            <Link href="../" dismissTo asChild>
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
                <Text>Inscription</Text>
              )}
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
