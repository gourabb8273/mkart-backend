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

    return value;
  }

  console.log(`[Secret] PROD: Fetching "${key}" from AWS Secrets Manager`);

  const secretName = key;

  const client = new SecretsManagerClient({ region: process.env.AWS_REGION || 'ap-south-1' });

  try {
    const data = await client.send(
      new GetSecretValueCommand({ SecretId: secretName })
    );

    if (!data.SecretString) {
      throw new Error('SecretString is empty or undefined');
    }

    const raw = data.SecretString;
    console.log(`[Secret] Raw string received for "${key}": ${raw}`);

    let value = raw;

    // If it's JSON like `{ "SESSION_SECRET": "xxx" }`, extract the value
    try {
      const parsed = JSON.parse(raw);
      if (parsed[key]) {
        value = parsed[key];
        console.log(`[Secret] Parsed JSON key "${key}" value: ${value}`);
      }
    } catch {
      console.log(`[Secret] Secret for "${key}" is plain string`);
    }

    // Strip "KEY=" prefix if present
    if (value.startsWith(`${key}=`)) {
      value = value.slice(key.length + 1).trim();
      console.warn(`[Secret] Stripped "${key}=" prefix. New value: ${value}`);
    }

    return value;
  } catch (err) {
    console.error(`[Secret] Error fetching secret "${key}":`, err.message);
    process.exit(1);
  }
};

export default getSecret;
