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

      let raw = response.SecretString;

      // Try parsing as JSON
      try {
        const parsed = JSON.parse(raw);
        if (parsed[key]) return parsed[key];
      } catch {
        // Not JSON, try to parse key=value string
        const match = raw.match(new RegExp(`${key}=([^\\n]+)`));
        if (match) return match[1];
      }

      throw new Error(`Key "${key}" not found in AWS Secret`);

    } catch (error) {
      console.error(`[Secret] Error fetching "${key}":`, error.message);
      process.exit(1);
    }
  }
}

export default getSecret;
