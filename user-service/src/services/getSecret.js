import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import dotenv from 'dotenv';

dotenv.config();

const isLocal = !process.env.AWS_EXECUTION_ENV;

const getSecret = async (key) => {
  if (isLocal) {
    console.log(`[Secret] LOCAL: Fetching "${key}" from .env`);
    const value = process.env[key];

    if (!value) {
      console.error(`[Secret] Missing key "${key}" in .env`);
      process.exit(1);
    }

    console.log(`[Secret] Found local value for "${key}": "${value}"`);
    return value;
  }

  console.log(`[Secret] PROD: Fetching "${key}" from AWS Secrets Manager`);

  const client = new SecretsManagerClient({ region: process.env.AWS_REGION || 'us-east-1' });

  const secretName = process.env.SECRET_NAME;
  if (!secretName) {
    console.error(`[Secret] Missing SECRET_NAME in environment`);
    process.exit(1);
  }

  try {
    const data = await client.send(
      new GetSecretValueCommand({ SecretId: secretName })
    );

    if (!data.SecretString) {
      throw new Error('SecretString is empty or undefined');
    }

    const raw = data.SecretString;
    console.log(`[Secret] Raw string received: ${raw}`);

    const parsed = JSON.parse(raw);
    let value = parsed[key];

    if (!value) {
      console.error(`[Secret] Key "${key}" not found in Secrets Manager value`);
      process.exit(1);
    }

    if (value.startsWith(`${key}=`)) {
      console.warn(`[Secret] Value for "${key}" contains "${key}=" prefix, stripping it...`);
      value = value.slice(key.length + 1).trim();
    }

    console.log(`[Secret] Parsed JSON value for "${key}": "${value}"`);

    return value;
  } catch (err) {
    console.error(`[Secret] Error fetching "${key}" from Secrets Manager:`, err.message);
    process.exit(1);
  }
};

export default getSecret;
