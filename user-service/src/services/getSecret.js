import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: 'ap-south-1' });

const isLocal = !process.env.AWS_EXECUTION_ENV;

async function getSecret(key) {
  if (isLocal) {
    console.log(`[Secret] LOCAL: Fetching "${key}" from .env`);
    const value = process.env[key];
    if (!value) {
      console.error(`[Secret] Missing key "${key}" in .env`);
      process.exit(1);
    }
    return value;
  } else {
    console.log(`[Secret] PROD: Fetching "${key}" from AWS Secrets Manager`);
    try {
      const response = await client.send(
        new GetSecretValueCommand({
          SecretId: key,
          VersionStage: 'AWSCURRENT',
        })
      );

      const raw = response.SecretString?.trim();
      console.log(`[Secret] Raw string received: "${raw}"`);

      // Case 1: It's JSON (recommended)
      try {
        const parsed = JSON.parse(raw);
        const value = parsed[key];
        if (value) {
          console.log(`[Secret] Parsed JSON value for "${key}": "${value}"`);
          return value;
        }
      } catch (e) {
        // not JSON
      }

      // Case 2: It's a raw key=value string like "MONGO_URI=mongodb+srv://..."
      if (raw.startsWith(`${key}=`)) {
        const value = raw.slice(key.length + 1).trim();
        console.log(`[Secret] Parsed raw string value for "${key}": "${value}"`);
        return value;
      }

      throw new Error(`Could not extract key "${key}" from Secrets Manager value.`);

    } catch (error) {
      console.error(`[Secret] Error fetching "${key}":`, error.message);
      process.exit(1);
    }
  }
}

export default getSecret;
