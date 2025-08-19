import { AuthPromise, AuthSession } from "@/lib/cognito/utils/auth.types";
import { InitiateAuthCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import { useState } from "react";
import { login } from "./auth";
import { useAuth } from "./auth.provider";

const useLogin = () => {
  const { updateSession } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (
    email: string,
    password: string,
  ): AuthPromise<InitiateAuthCommandOutput> => {
    setIsLoading(true);

    const [authResult, error] = await login(email, password);

    if (error) {
      setIsLoading(false);
      return [null, error];
    }

    if (authResult) {
      const authSession: AuthSession = {
        accessToken: authResult.AuthenticationResult?.AccessToken,
        idToken: authResult.AuthenticationResult?.IdToken,
        refreshToken: authResult.AuthenticationResult?.RefreshToken,
        expiresIn: authResult.AuthenticationResult?.ExpiresIn,
        tokenType: authResult.AuthenticationResult?.TokenType,
      };
      await updateSession(authSession);
    }

    setIsLoading(false);
    return [authResult, null];
  };

  return { handleLogin, isLoading };
};

export default useLogin;
