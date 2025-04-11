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

      const raw = response.SecretString;

      // If JSON, parse and return the key
      try {
        const parsed = JSON.parse(raw);
        if (parsed[key]) return parsed[key];
      } catch (e) {
        // Not JSON - maybe a raw key=value string
        if (raw.startsWith(`${key}=`)) {
          const value = raw.replace(`${key}=`, '').trim();
          return value;
        }
      }

      throw new Error(`Key "${key}" not found in secret string`);

    } catch (error) {
      console.error(`[Secret] Error fetching "${key}":`, error.message);
      process.exit(1);
    }
  }
}

export default getSecret;
