import "server-only";

export const REQUIRED_AI_ENV_VARS = ["GOOGLE_GENERATIVE_AI_API_KEY"] as const;

export function getMissingAiEnvVars() {
  const missing: Array<(typeof REQUIRED_AI_ENV_VARS)[number]> = [];

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()) {
    missing.push("GOOGLE_GENERATIVE_AI_API_KEY");
  }

  return missing;
}

export function isGoogleAiConfigured() {
  return getMissingAiEnvVars().length === 0;
}
