import 'dotenv/config'

// Grab the environment variables
const { CLIENT_ID, DISCORD_TOKEN } = process.env;

if (!CLIENT_ID || !DISCORD_TOKEN) {
  throw new Error("Missing environment variables");
}

// Export the environment variables
export const config = {
  CLIENT_ID, 
  DISCORD_TOKEN
};
