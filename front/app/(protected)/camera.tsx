import { Button } from "@/components/ui/button";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import { Alert, Image, Pressable, View, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center px-4">
        <View className="gap-4 items-center">
          <H1 className="text-center">Accès à la caméra requis</H1>
          <Muted className="text-center">
            Nous avons besoin de l&apos;accès à votre caméra pour prendre une
            photo de votre reçu.
          </Muted>
          <Button onPress={requestPermission} className="w-full">
            <Text>Autoriser la caméra</Text>
          </Button>
          <Button
            variant="secondary"
            onPress={() => router.back()}
            className="w-full"
          >
            <Text>Retour</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setCapturedImage(photo.uri);
      } catch (error) {
        console.error("Erreur lors de la prise de photo:", error);
        Alert.alert("Erreur", "Impossible de prendre la photo.");
      }
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
  };

  const usePicture = () => {
    if (capturedImage) {
      // Navigate to modal with the captured image
      router.push({
        pathname: "/modal",
        params: { imageUri: capturedImage },
      });
    }
  };

  const openImageLibrary = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission refusée",
          "L'accès à la galerie est nécessaire pour sélectionner une image.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        router.push({
          pathname: "/modal",
          params: { imageUri: result.assets[0].uri },
        });
      }
    } catch (error) {
      console.error("Erreur lors de la sélection d'image:", error);
      Alert.alert(
        "Erreur",
        "Une erreur s'est produite lors de la sélection de l'image.",
      );
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  if (capturedImage) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex gap-2 p-4">
          <H1 className="text-center font-display">Photo prise</H1>
          <Muted className="text-center">
            Vérifiez votre photo avant de continuer
          </Muted>
        </View>

        <View className="flex-1 px-4">
          <Image
            source={{ uri: capturedImage }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        </View>

        <View className="flex-row gap-4 p-4">
          <Button variant="secondary" onPress={retakePicture}>
            <Text>Reprendre</Text>
          </Button>
          <Button variant="default" className="flex-1" onPress={usePicture}>
            <Text>Utiliser cette photo</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <View className="flex gap-2 p-4">
          <H1 className="text-center font-display">Prendre une photo</H1>
          <Muted className="text-center">
            Photographiez votre reçu pour ajouter une garantie
          </Muted>
        </View>

        <View className="flex-1 relative bg-black">
          <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
            <View className="flex-1 justify-end items-center pb-8">
              <View className="flex-row gap-4 items-center">
                <Pressable
                  onPress={openImageLibrary}
                  className="bg-white/20 shadow rounded-full p-4"
                >
                  <Text className="text-white font-medium">Galerie</Text>
                </Pressable>

                <Pressable
                  onPress={takePicture}
                  className="bg-white border shadow-lg rounded-full p-6"
                >
                  <View className="w-12 h-12 bg-white rounded-full border-4 border-gray-300" />
                </Pressable>

                <Pressable
                  onPress={toggleCameraFacing}
                  className="bg-white/20 shadow rounded-full p-4"
                >
                  <Text className="text-white font-medium">Retourner</Text>
                </Pressable>
              </View>
            </View>
          </CameraView>
        </View>

        <View className="p-4">
          <Button
            variant="secondary"
            onPress={() => router.back()}
            className="w-full"
          >
            <Text>Annuler</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
    borderRadius: 12,
  },
});
