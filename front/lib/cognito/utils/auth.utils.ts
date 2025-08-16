import { AuthSession } from "@/lib/cognito/utils/auth.types";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Custom error class for auth errors
class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: any,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

// Helper function to extract user-friendly error messages
const getErrorMessage = (error: any): string => {
  if (error?.name === "NotAuthorizedException") {
    return "Email ou mot de passe incorrect";
  }
  if (error?.name === "UserNotConfirmedException") {
    return "Veuillez d'abord confirmer votre compte";
  }
  if (error?.name === "UsernameExistsException") {
    return "Un compte avec cette adresse email existe déjà";
  }
  if (error?.name === "InvalidPasswordException") {
    return "Le mot de passe ne respecte pas les exigences";
  }
  if (error?.name === "CodeMismatchException") {
    return "Code de confirmation invalide";
  }
  if (error?.name === "ExpiredCodeException") {
    return "Code de confirmation expiré";
  }
  if (error?.name === "LimitExceededException") {
    return "Trop de tentatives. Veuillez réessayer plus tard";
  }
  if (error?.name === "UserNotFoundException") {
    return "Utilisateur non trouvé";
  }

  return error?.message || "Authentification échouée";
};

const saveSessionToStorage = async (authSession: AuthSession) => {
  try {
    await AsyncStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(authSession),
    );
  } catch (error) {
    console.error("Error saving session to storage:", error);
  }
};

const clearSessionFromStorage = async () => {
  try {
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing session from storage:", error);
  }
};

const loadSessionFromStorage = async (): Promise<AuthSession | undefined> => {
  try {
    const storedSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    if (storedSession) {
      const parsedSession = JSON.parse(storedSession);
      return parsedSession;
    }
  } catch (error) {
    console.error("Error loading session from storage:", error);
  }
};

const SESSION_STORAGE_KEY = "@keepo:auth_session";

export {
  AuthError,
  clearSessionFromStorage,
  getErrorMessage,
  loadSessionFromStorage,
  saveSessionToStorage,
  SESSION_STORAGE_KEY,
};
