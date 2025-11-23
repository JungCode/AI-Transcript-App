import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'https://mirai-ai.space',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log API URL for debugging
if (__DEV__) {
  console.log(
    'API Base URL:',
    process.env.EXPO_PUBLIC_API_URL ?? 'https://mirai-ai.space',
  );
}

// Interceptor thêm token
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token: string | null = null;

    try {
      if (Platform.OS === 'web') {
        token = localStorage.getItem('access_token');
      } else {
        token = await SecureStore.getItemAsync('access_token');
      }
    } catch (err) {
      console.warn('Error getting token:', err);
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: unknown) => {
    // ✅ cast về Error nếu có thể
    if (error instanceof Error) return Promise.reject(error);
    return Promise.reject(new Error('Unknown request error'));
  },
);

// Interceptor xử lý lỗi
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    // ✅ kiểu hóa lỗi Axios
    const axiosError = error as AxiosError;

    const status = axiosError.response?.status;

    if (status === 401) {
      router.replace('/login');
      console.warn('⚠️ Unauthorized - redirect to login');
    }

    // Log network errors for debugging (skip ERR_CANCELED as it's normal when requests are cancelled)
    if (__DEV__ && !axiosError.response) {
      interface NetworkError extends AxiosError {
        code?: string;
      }
      const networkError = axiosError as NetworkError;
      const errorCode: string | undefined = networkError.code;

      // Don't log ERR_CANCELED errors as they're expected when navigating away or cancelling requests
      if (errorCode !== 'ERR_CANCELED') {
        console.error('Network Error:', {
          message:
            typeof axiosError.message === 'string'
              ? axiosError.message
              : 'Unknown error',
          code: errorCode,
          config: {
            url: axiosError.config?.url,
            baseURL: axiosError.config?.baseURL,
            method: axiosError.config?.method,
          },
        });
      }
    }

    // ✅ Trả về Error hợp lệ cho Promise.reject
    if (axiosError instanceof Error) {
      return Promise.reject(axiosError);
    }
    return Promise.reject(new Error('Unknown response error'));
  },
);

const apiClient = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const res = await axiosInstance.request<T>(config);
  return res.data;
};

export { apiClient };
