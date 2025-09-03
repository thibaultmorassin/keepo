import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useCallback, useEffect, useState } from "react";
import * as z from "zod";

const formSchema = z.object({
  itemName: z.string().min(1, "Merci d'entrer le nom de l'article."),
  amountCents: z.string().min(1, "Merci d'entrer le montant."),
  purchaseDate: z.date({
    message: "Merci de sélectionner la date d'achat.",
  }),
  warrantyDuration: z.string({
    message: "Merci de sélectionner la durée de la garantie.",
  }),
  file: z.any(), // For image file upload
});

type FormData = z.infer<typeof formSchema>;

export default function ModalScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();
  const [hasSelectedImage, setHasSelectedImage] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: "",
      amountCents: "",
      purchaseDate: new Date(),
      warrantyDuration: "",
      file: undefined,
    },
  });

  const pickImage = useCallback(
    async (source: "camera" | "library") => {
      try {
        let result;

        if (source === "camera") {
          const permissionResult =
            await ImagePicker.requestCameraPermissionsAsync();
          if (permissionResult.granted === false) {
            Alert.alert(
              "Permission refusée",
              "L'accès à la caméra est nécessaire pour prendre une photo.",
            );
            return;
          }
          result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          });
        } else {
          const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (permissionResult.granted === false) {
            Alert.alert(
              "Permission refusée",
              "L'accès à la galerie est nécessaire pour sélectionner une image.",
            );
            return;
          }
          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          });
        }

        if (!result.canceled && result.assets && result.assets[0]) {
          form.setValue("file", result.assets[0]);
          setHasSelectedImage(true);
        }
      } catch (error) {
        console.error("Erreur lors de la sélection d'image:", error);
        Alert.alert(
          "Erreur",
          "Une erreur s'est produite lors de la sélection de l'image.",
        );
      }
    },
    [form],
  );

  const showImagePickerOptions = () => {
    Alert.alert(
      "Sélectionner une image",
      "Choisissez comment ajouter une image",
      [
        {
          text: "Appareil photo",
          onPress: () => pickImage("camera"),
        },
        {
          text: "Galerie",
          onPress: () => pickImage("library"),
        },
        {
          text: "Annuler",
          style: "cancel",
        },
      ],
    );
  };

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
      setHasSelectedImage(true);
    }
  }, [imageUri, form]);

  const onSubmit = async (data: FormData) => {
    console.log("Warranty data:", data);

    router.push("/(protected)/(tabs)");
  };

  const selectedImage = form.watch("file");

  if (!hasSelectedImage) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-background pt-8 px-4">
          <ScrollView className="flex-1 gap-4">
            <View className="flex-1 items-center justify-center">
              <Text>Sélectionnez une image de votre reçu pour commencer</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <View className="h-64 w-full">
                <Pressable
                  onPress={() => router.push("/camera" as any)}
                  className="h-full rounded-xl items-center justify-center border-dashed bg-muted border-2 border-muted-foreground/25"
                >
                  <Text className="text-muted-foreground pt-4">
                    Prendre une photo
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-0.5">
                    Appuyez pour ouvrir la caméra
                  </Text>
                </Pressable>
              </View>
              <View className="mt-4 w-full">
                <Button
                  variant="outline"
                  onPress={showImagePickerOptions}
                  className="w-full"
                >
                  <Text>Ou choisir depuis la galerie</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
          <View className="flex-row gap-4 mt-4">
            <Link href="../" asChild>
              <Button variant="secondary">
                <Text>Annuler</Text>
              </Button>
            </Link>

            <Button
              variant="default"
              onPress={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
              className="flex-1"
            >
              {form.formState.isSubmitting ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text>Ajouter la garantie</Text>
              )}
            </Button>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-background pt-8 px-4">
        <View className="flex gap-2 mb-4">
          <H1 className="self-start font-display">Ajouter une garantie</H1>
          <Muted>Remplissez les informations de votre garantie</Muted>
        </View>

        <ScrollView className="flex-1 gap-4">
          <Form {...form}>
            <View className="gap-4">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <View className="gap-2">
                    <Text className="text-sm font-medium text-foreground">
                      Facture
                    </Text>
                    <View className="h-64 p-2 border rounded-lg border-input bg-muted border-dotted">
                      {selectedImage ? (
                        <View className="h-full gap-2">
                          <Image
                            source={{ uri: selectedImage.uri }}
                            className="flex-1 mx-auto border bg-background border-input aspect-[9/16] rounded-lg"
                            resizeMode="contain"
                          />
                          <View className="flex-row gap-2">
                            <Link href="../" asChild>
                              <Button variant="outline">
                                <Text>Changer</Text>
                              </Button>
                            </Link>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  </View>
                )}
              />

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
                  <View className="relative">
                    <FormInput
                      label="Durée de la garantie"
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
                )}
              />
              <View className="flex-row gap-2">
                {[
                  {
                    duration: 6,
                    label: "6 mois",
                  },
                  {
                    duration: 12,
                    label: "1 an",
                  },
                  {
                    duration: 24,
                    label: "2 ans",
                  },
                  {
                    duration: 36,
                    label: "3 ans",
                  },
                ].map((duration) => (
                  <Pressable
                    key={duration.duration}
                    onPress={() =>
                      form.setValue(
                        "warrantyDuration",
                        duration.duration.toString(),
                      )
                    }
                    className="bg-muted rounded-full py-1 px-3"
                  >
                    <Text>{duration.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Form>
        </ScrollView>
        <View className="flex-row gap-4 mt-4">
          <Link href="../" asChild>
            <Button variant="secondary">
              <Text>Annuler</Text>
            </Button>
          </Link>

          <Button
            variant="default"
            onPress={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            className="flex-1"
          >
            {form.formState.isSubmitting ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text>Ajouter la garantie</Text>
            )}
          </Button>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
