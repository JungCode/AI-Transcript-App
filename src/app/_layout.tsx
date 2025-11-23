import { applyGlobalFont } from '@/core/libs/font-patch';
import '@/core/styles/global.css';
import NunitoItalic from '@/shared/assets/fonts/Nunito-Italic-VariableFont_wght.ttf';
import Nunito from '@/shared/assets/fonts/Nunito-VariableFont_wght.ttf';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded] = useFonts({
    Nunito,
    NunitoItalic,
  });

  if (!loaded) return null;

  applyGlobalFont();

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
