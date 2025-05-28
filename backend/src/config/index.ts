import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Define environment variable schema
const envSchema = z.object({
  // Server
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Perplexity API
  PERPLEXITY_API_KEY: z.string(),
  PERPLEXITY_API_URL: z.string().default('https://api.perplexity.ai/chat/completions'),
  PERPLEXITY_MODEL: z.string().default('sonar-pro'),

  // CORS
  FRONTEND_URL: z.string().default('http://localhost:5173'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100')
});

// Parse and validate environment variables
const env = envSchema.parse(process.env);

// Export configuration
export const config = {
  server: {
    port: parseInt(env.PORT),
    nodeEnv: env.NODE_ENV
  },
  perplexity: {
    apiKey: env.PERPLEXITY_API_KEY,
    apiUrl: env.PERPLEXITY_API_URL,
    model: env.PERPLEXITY_MODEL
  },
  cors: {
    frontendUrl: env.FRONTEND_URL
  },
  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS),
    max: parseInt(env.RATE_LIMIT_MAX_REQUESTS)
  }
} as const; 