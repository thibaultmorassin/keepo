import { Form, FormField, FormInput } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { H1, Muted, Code } from "@/components/ui/typography";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { addMonths, format } from "date-fns";
import { fr } from "date-fns/locale";
import { useMemo } from "react";
import { Pressable, View } from "react-native";
import { WARRANTY_DURATIONS } from "./constants";
import { StepProps } from "./types";

export function Step2({ form }: StepProps) {
  const { warrantyDuration, purchaseDate } = form.watch();

  const expirationDate = useMemo(() => {
    if (!warrantyDuration || !purchaseDate) {
      return null;
    }
    return addMonths(purchaseDate, parseInt(warrantyDuration));
  }, [purchaseDate, warrantyDuration]);

  return (
    <View className="flex-1 gap-6">
      <View className="gap-2">
        <H1 className="font-display">Date et garantie </H1>
        <Muted>Définissez la durée de votre garantie</Muted>
      </View>

      <Form {...form}>
        <View className="gap-4">
          <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
              <View className="gap-2">
                <Label>{"Date d'achat"}</Label>
                <DateTimePicker
                  value={field.value}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={(
                    _event: DateTimePickerEvent,
                    selectedDate?: Date,
                  ) => {
                    if (selectedDate) {
                      field.onChange(selectedDate);
                    }
                  }}
                />
              </View>
            )}
          />

          <FormField
            control={form.control}
            name="warrantyDuration"
            render={({ field }) => (
              <View className="gap-2">
                <Label>Durée de la garantie</Label>
                <View className="relative">
                  <FormInput
                    placeholder="24"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="numeric"
                    className="peer pr-12"
                    {...field}
                  />
                  <Text className="text-muted-foreground pointer-events-none absolute bottom-3.5 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                    MOIS
                  </Text>
                </View>

                <View className="flex-row gap-2 flex-wrap mt-2">
                  {WARRANTY_DURATIONS.map((duration) => (
                    <Pressable
                      key={duration.duration}
                      onPress={() =>
                        form.setValue(
                          "warrantyDuration",
                          duration.duration.toString(),
                        )
                      }
                      className={`rounded-full py-2 px-4 ${
                        field.value === duration.duration.toString()
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    >
                      <Text
                        className={
                          field.value === duration.duration.toString()
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }
                      >
                        {duration.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          />
        </View>
      </Form>
      {expirationDate && (
        <Code className="py-2">
          Votre garantie expirera le{" "}
          {format(expirationDate, "dd MMMM yyyy", { locale: fr })}.
        </Code>
      )}
    </View>
  );
}
