import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";

const formSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Please enter at least 8 characters.")
    .max(64, "Please enter fewer than 64 characters."),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      // await signIn(data.email, data.password);

      form.reset();
    } catch (error: Error | any) {
      console.error(error.message);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4" edges={["bottom"]}>
      <View className="flex-1 gap-4 web:m-4">
        <H1 className="self-start ">Login</H1>
        <Form {...form}>
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
                  label="Password"
                  placeholder="Password"
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
      <View className="flex flex-col gap-y-4 web:m-4">
        <Button
          size="default"
          variant="default"
          onPress={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
          className="web:m-4"
        >
          {form.formState.isSubmitting ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text>Sign In</Text>
          )}
        </Button>
        <Link href="/(public)" dismissTo asChild>
          <Button size="default" variant="secondary">
            <Text>Back</Text>
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
