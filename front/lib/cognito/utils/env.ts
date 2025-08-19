/**
 * As this file is reused in several other files, try to keep it lean and small.
 * Importing other npm packages here could lead to needlessly increasing the client bundle size, or end up in a server-only function that don't need it.
 */
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}

export const AWS_REGION = assertValue(
  process.env.EXPO_PUBLIC_AWS_REGION,
  "Missing environment variable: EXPO_PUBLIC_AWS_REGION",
);

export const CLIENT_ID = assertValue(
  process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID,
  "Missing environment variable: EXPO_PUBLIC_COGNITO_CLIENT_ID",
);
