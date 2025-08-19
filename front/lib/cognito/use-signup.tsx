import { AuthSession } from "@/lib/cognito/utils/auth.types";
import {
  ConfirmSignUpCommandOutput,
  ResendConfirmationCodeCommandOutput,
  SignUpCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { useState } from "react";
import {
  AuthError,
  signUp as cognitoSignUp,
  confirmSignUp,
  resendConfirmationCode,
} from "./auth";
import { useAuth } from "./auth.provider";

const useSignUp = () => {
  const { updateSession, session } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (values: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }): Promise<[SignUpCommandOutput | null, AuthError | null]> => {
    setIsLoading(true);

    const [signUpResult, error] = await cognitoSignUp(values);

    if (error) {
      setIsLoading(false);
      return [null, error];
    }

    if (signUpResult) {
      const authSession: AuthSession = {
        userSub: signUpResult.UserSub,
        userConfirmed: signUpResult.UserConfirmed,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
      };
      await updateSession(authSession);
    }

    setIsLoading(false);
    return [signUpResult, null];
  };

  const handleConfirmSignUp = async ({
    email,
    code,
  }: {
    email: string;
    code: string;
  }): Promise<[ConfirmSignUpCommandOutput | null, AuthError | null]> => {
    setIsLoading(true);

    const [confirmResult, error] = await confirmSignUp(email, code);

    if (error) {
      setIsLoading(false);
      return [null, error];
    }

    if (confirmResult) {
      await updateSession({ userConfirmed: true });
    }

    setIsLoading(false);
    return [confirmResult, null];
  };

  const handleResendConfirmationCode = async (): Promise<
    [ResendConfirmationCodeCommandOutput | null, AuthError | null]
  > => {
    setIsLoading(true);

    if (!session?.email) {
      setIsLoading(false);
      return [null, new AuthError("Email not found", "EmailNotFound")];
    }

    const [resendResult, error] = await resendConfirmationCode(
      session?.email ?? "",
    );

    if (error) {
      setIsLoading(false);
      return [null, error];
    }

    setIsLoading(false);
    return [resendResult, null];
  };

  return {
    signUp: handleSignUp,
    confirmSignUp: handleConfirmSignUp,
    resendConfirmationCode: handleResendConfirmationCode,
    isLoading,
  };
};

export default useSignUp;
