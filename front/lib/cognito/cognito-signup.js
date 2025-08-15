require('dotenv').config();
const crypto = require('crypto');
const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const REGION = process.env.AWS_REGION;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;

if (!REGION || !CLIENT_ID) {
  console.error('Veuillez définir AWS_REGION et COGNITO_CLIENT_ID dans .env');
  process.exit(1);
}

const client = new CognitoIdentityProviderClient({ region: REGION });

function getSecretHash(username) {
  if (!CLIENT_SECRET) return undefined;
  const hmac = crypto.createHmac('sha256', CLIENT_SECRET);
  hmac.update(username + CLIENT_ID);
  return hmac.digest('base64');
}

async function signup(email, firstName, lastName, password) {
  const username = email; // on utilise l'email comme username
  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'given_name', Value: firstName },
      { Name: 'family_name', Value: lastName },
    ],
  };
  const SecretHash = getSecretHash(username);
  if (SecretHash) params.SecretHash = SecretHash;

  const out = await client.send(new SignUpCommand(params));
  console.log('SignUp OK:', {
    userSub: out.UserSub,
    userConfirmed: out.UserConfirmed,
    codeDelivery: out.CodeDeliveryDetails,
  });
}

async function confirm(email, code) {
  const username = email;
  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
  };
  const SecretHash = getSecretHash(username);
  if (SecretHash) params.SecretHash = SecretHash;

  await client.send(new ConfirmSignUpCommand(params));
  console.log('Confirmation OK');
}

(async () => {
  const [cmd, ...args] = process.argv.slice(2);
  try {
    if (cmd === 'signup') {
      const [email, firstName, lastName, password] = args;
      if (!email || !firstName || !lastName || !password) {
        throw new Error('Usage: signup <email> <firstName> <lastName> <password>');
      }
      await signup(email, firstName, lastName, password);
    } else if (cmd === 'confirm') {
      const [email, code] = args;
      if (!email || !code) throw new Error('Usage: confirm <email> <code>');
      await confirm(email, code);
    } else {
      console.log('Commandes :\n - signup <email> <firstName> <lastName> <password>\n - confirm <email> <code>');
    }
  } catch (err) {
    const code = err?.name || 'Error';
    let message = err?.message || String(err);
    if (code === 'UsernameExistsException') message = 'Utilisateur déjà existant.';
    if (code === 'InvalidPasswordException') message = 'Mot de passe non conforme à la policy du pool.';
    if (code === 'CodeMismatchException') message = 'Code de confirmation invalide.';
    if (code === 'ExpiredCodeException') message = 'Code expiré.';
    console.error(`${code}: ${message}`);
    process.exit(1);
  }
})();
