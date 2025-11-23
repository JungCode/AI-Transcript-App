import dotenv from 'dotenv';

dotenv.config();
const BASE_URL = process.env.BASE_URL;

// orval.config.ts
export default {
  auth: {
    input: `${BASE_URL}/auth/openapi.json`, // đường dẫn file spec
    output: {
      target: './src/shared/api/authSchemas.ts', // file kết quả
      client: 'react-query', // sinh code dùng React Query
      prettier: true, // format code
      mock: false, // bật nếu muốn sinh dữ liệu giả
      override: {
        mutator: {
          // Dùng chung instance axios
          path: './src/shared/api/apiClient.ts',
          name: 'apiClient',
        },
      },
    },
  },
  podcast: {
    input: `${BASE_URL}/podcast/openapi.json`, // đường dẫn file spec
    output: {
      target: './src/shared/api/podcastSchemas.ts', // file kết quả
      client: 'react-query', // sinh code dùng React Query
      prettier: true, // format code
      mock: false, // bật nếu muốn sinh dữ liệu giả
      override: {
        mutator: {
          // Dùng chung instance axios
          path: './src/shared/api/apiClient.ts',
          name: 'apiClient',
        },
      },
    },
  },
  ai_translator: {
    input: `${BASE_URL}/ai-translator/openapi.json`, // đường dẫn file spec
    output: {
      target: './src/shared/api/ai-translatorSchemas.ts', // file kết quả
      client: 'react-query', // sinh code dùng React Query
      prettier: true, // format code
      mock: false, // bật nếu muốn sinh dữ liệu giả
      override: {
        mutator: {
          // Dùng chung instance axios
          path: './src/shared/api/apiClient.ts',
          name: 'apiClient',
        },
      },
    },
  },
};
