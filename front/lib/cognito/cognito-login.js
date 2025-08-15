require('dotenv').config();
const crypto = require('crypto');
const { CognitoIdentityProviderClient, InitiateAuthCommand } = require('@aws-sdk/client-cognito-identity-provider');

const REGION = process.env.AWS_REGION;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;

if (!REGION || !CLIENT_ID) {
  console.error('Please set AWS_REGION and COGNITO_CLIENT_ID in .env');
  process.exit(1);
}

const client = new CognitoIdentityProviderClient({ region: REGION });

function getSecretHash(username) {
  if (!CLIENT_SECRET) return undefined;
  const hmac = crypto.createHmac('sha256', CLIENT_SECRET);
  hmac.update(username + CLIENT_ID);
  return hmac.digest('base64');
}

async function login(username, password) {
  const authParams = {
    USERNAME: username,
    PASSWORD: password,
  };
  const secretHash = getSecretHash(username);
  if (secretHash) authParams.SECRET_HASH = secretHash;

  const command = new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: CLIENT_ID,
    AuthParameters: authParams,
  });

  const out = await client.send(command);
  console.log('Tokens:');
  console.log('AccessToken:', out.AuthenticationResult?.AccessToken);
  console.log('IdToken:', out.AuthenticationResult?.IdToken);
  console.log('RefreshToken:', out.AuthenticationResult?.RefreshToken);
}

(async () => {
  const [username, password] = process.argv.slice(2);
  if (!username || !password) {
    console.error('Usage: node cognito-login.js <username/email> <password>');
    process.exit(1);
  }
  try {
    await login(username, password);
  } catch (err) {
    console.error('Login failed:', err.name, err.message);
    process.exit(1);
  }
})();
