import { useTokenChecker } from '@/shared/hooks/secureStore/useSecureStore';
import { Redirect, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivateLayout() {
  const { hasToken, isLoading } = useTokenChecker();

  if (isLoading)
    return (
      <View>
        <Text>Loading</Text>
      </View>
    ); // loading screen

  if (!hasToken) return <Redirect href="/login" />;

  return (
    <SafeAreaView className="flex-1">
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
