import dotenv from 'dotenv';

dotenv.config();
const BASE_URL = process.env.BASE_URL;

const commonOutput = {
  client: 'react-query',
  prettier: true,
  mock: false,
  override: {
    mutator: {
      path: './src/shared/api/apiClient.ts',
      name: 'apiClient',
    },
  },
  // Đây mới là nơi đúng cho queryOptions
  // KHÔNG nằm trong override
  query: {
    queryOptions: true,
  },
};

export default {
  auth: {
    input: `${BASE_URL}/auth/openapi.json`,
    output: {
      target: './src/shared/api/authSchemas.ts',
      ...commonOutput,
    },
  },

  podcast: {
    input: `${BASE_URL}/podcast/openapi.json`,
    output: {
      target: './src/shared/api/podcastSchemas.ts',
      ...commonOutput,
    },
  },

  ai_translator: {
    input: `${BASE_URL}/ai-translator/openapi.json`,
    output: {
      target: './src/shared/api/ai-translatorSchemas.ts',
      ...commonOutput,
    },
  },
};
