// getSecret.js

// const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
// Initialize the SecretsManager client
const client = new SecretsManagerClient({ region: "ap-south-1" });

// Create reusable function to get a secret from AWS Secrets Manager
async function getSecretValue(secretId) {
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretId,         // The secret ID passed as parameter
        VersionStage: "AWSCURRENT", // Default to AWSCURRENT version
      })
    );
    
    // Return the secret as a string
    if (response.SecretString) {
      return response.SecretString;
    } else {
      throw new Error("Secret does not contain a valid SecretString.");
    }
  } catch (error) {
    console.error("Error retrieving secret:", error);
    throw error; // Propagate error if needed
  }
}

export default getSecretValue // This exports the function properly
