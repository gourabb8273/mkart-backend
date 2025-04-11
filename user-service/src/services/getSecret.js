import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import dotenv from 'dotenv';

dotenv.config();

const isLocal = !process.env.AWS_EXECUTION_ENV;
const client = new SecretsManagerClient({ region: 'ap-south-1' });

const getSecret = async (key) => {
  if (isLocal) {
    console.log(`[Secret] LOCAL: Fetching "${key}" from .env`);
    const value = process.env[key];
    if (!value) {
      console.error(`[Secret] Missing key "${key}" in .env`);
      process.exit(1);
    }
    return value;
  }

  try {
    console.log(`[Secret] PROD: Fetching "${key}" from AWS Secrets Manager`);
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: key,
        VersionStage: 'AWSCURRENT',
      })
    );

    if (!response.SecretString) {
      throw new Error('Secret does not contain a valid SecretString');
    }

    // Try to parse in case it's a JSON blob (e.g., `{ "MONGO_URI": "..." }`)
    try {
      const parsed = JSON.parse(response.SecretString);
      if (parsed[key]) return parsed[key];
    } catch {
      // Not JSON? Return raw string
      return response.SecretString;
    }

    throw new Error(`Key "${key}" not found in parsed secret`);
  } catch (err) {
    console.error(`[Secret] Error fetching "${key}":`, err.message);
    process.exit(1);
  }
};

export default getSecret;
