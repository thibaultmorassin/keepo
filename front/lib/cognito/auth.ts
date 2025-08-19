import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandOutput,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
  ResendConfirmationCodeCommand,
  ResendConfirmationCodeCommandOutput,
  SignUpCommand,
  SignUpCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import "react-native-get-random-values";
// import "react-native-url-polyfill";
import { AuthPromise } from "./utils/auth.types";
import { AuthError, getErrorMessage } from "./utils/auth.utils";
import { AWS_REGION, CLIENT_ID } from "./utils/env";

const client = new CognitoIdentityProviderClient({ region: AWS_REGION });

const login = async (
  email: string,
  password: string,
): AuthPromise<InitiateAuthCommandOutput> => {
  const username = email;
  const authParams = {
    USERNAME: username,
    PASSWORD: password,
  };

  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: CLIENT_ID,
    AuthParameters: authParams,
  });

  try {
    const result = await client.send(command);
    return [result, null];
  } catch (error: any) {
    const message = getErrorMessage(error);
    const authError = new AuthError(
      message,
      error?.name || "UnknownError",
      error,
    );
    return [null, authError];
  }
};

const signUp = async (values: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}): AuthPromise<SignUpCommandOutput> => {
  const { email, firstName, lastName, password } = values;
  const username = email;

  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "given_name", Value: firstName },
      { Name: "family_name", Value: lastName },
    ],
  };

  try {
    const result = await client.send(new SignUpCommand(params));
    return [result, null];
  } catch (error: any) {
    const message = getErrorMessage(error);
    const authError = new AuthError(
      message,
      error?.name || "UnknownError",
      error,
    );
    return [null, authError];
  }
};

const confirmSignUp = async (
  email: string,
  code: string,
): AuthPromise<ConfirmSignUpCommandOutput> => {
  const username = email;

  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
  };

  try {
    const result = await client.send(new ConfirmSignUpCommand(params));
    return [result, null];
  } catch (error: any) {
    const message = getErrorMessage(error);
    const authError = new AuthError(
      message,
      error?.name || "UnknownError",
      error,
    );
    return [null, authError];
  }
};

const resendConfirmationCode = async (
  email: string,
): AuthPromise<ResendConfirmationCodeCommandOutput> => {
  const username = email;

  const params = {
    ClientId: CLIENT_ID,
    Username: username,
  };

  try {
    const result = await client.send(new ResendConfirmationCodeCommand(params));
    return [result, null];
  } catch (error: any) {
    const message = getErrorMessage(error);
    const authError = new AuthError(
      message,
      error?.name || "UnknownError",
      error,
    );
    return [null, authError];
  }
};

export { AuthError, confirmSignUp, login, resendConfirmationCode, signUp };
