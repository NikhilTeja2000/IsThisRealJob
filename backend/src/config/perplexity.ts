import dotenv from 'dotenv';

dotenv.config();

export const perplexityConfig = {
  apiKey: process.env.PERPLEXITY_API_KEY,
  apiUrl: 'https://api.perplexity.ai/chat/completions',
  model: 'sonar-pro'
}; 