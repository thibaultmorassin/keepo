import { Form, FormField, FormInput } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { Dimensions, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CATEGORIES } from "./constants";
import { StepProps } from "./types";

export function Step1({ form }: StepProps) {
  const insets = useSafeAreaInsets();
  const windowWidth = Dimensions.get("window").width;

  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({
      ios: insets.bottom,
      android: insets.bottom + 24,
    }),
    left: 12,
    right: 12,
  };

  return (
    <View className="flex-1 gap-6">
      <View className="gap-2">
        <H1 className="font-display">Informations de base</H1>
        <Muted>Renseignez les détails de votre article</Muted>
      </View>

      <Form {...form}>
        <View className="gap-4">
          <FormField
            control={form.control}
            name="itemName"
            render={({ field }) => (
              <FormInput
                label="Nom de l'article"
                placeholder="Téléphone, four, aspirateur..."
                autoCapitalize="none"
                autoCorrect={false}
                {...field}
              />
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <View className="gap-2">
                <Label>Catégorie</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent
                    insets={contentInsets}
                    style={{ width: windowWidth - 24 }}
                  >
                    {CATEGORIES.map((category) => (
                      <SelectItem
                        key={category.value}
                        value={category.value}
                        label={category.label}
                      >
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </View>
            )}
          />

          <FormField
            control={form.control}
            name="amountCents"
            render={({ field }) => (
              <FormInput
                label="Prix d'achat"
                placeholder="599,99"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numeric"
                className="peer pr-12"
                {...field}
              >
                <Text className="text-muted-foreground pointer-events-none absolute top-1/2 -translate-y-1/2 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                  EUR
                </Text>
              </FormInput>
            )}
          />
        </View>
      </Form>
    </View>
  );
}
