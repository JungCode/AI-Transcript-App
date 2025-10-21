import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
      console.warn('⚠️ Unauthorized - redirect to login');
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
