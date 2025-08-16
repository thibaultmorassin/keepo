import { AuthError } from "../auth";

type AuthPromise<T> = Promise<[T | null, AuthError | null]>;

// Types for the auth session
type AuthSession = {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
  userSub?: string;
  userConfirmed?: boolean;
  email?: string;
  firstName?: string;
  lastName?: string;
};

type AuthContextType = {
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Core auth methods
  signOut: () => Promise<void>;
  updateSession: (updates: Partial<AuthSession>) => Promise<void>;
};

export { AuthContextType, AuthPromise, AuthSession };
