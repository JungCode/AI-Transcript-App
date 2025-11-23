import { useTokenChecker } from '@/shared/hooks/secureStore/useSecureStore';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivateLayout() {
  const { hasToken, isLoading } = useTokenChecker();

  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4a6b2a" />
      </View>
    );

  if (!hasToken) return <Redirect href="/login" />;

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaView>
  );
}
