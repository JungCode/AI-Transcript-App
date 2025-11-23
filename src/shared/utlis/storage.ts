import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const getSecureItem = (key: string) => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
};

const setSecureItem = (key: string, value: string) => {
  if (Platform.OS === 'web') {
    return localStorage.setItem(key, value);
  }
  return SecureStore.setItemAsync(key, value);
};

export { getSecureItem, setSecureItem };
