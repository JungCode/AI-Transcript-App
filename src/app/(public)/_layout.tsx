import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PublicLayout() {
  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1 bg-surface">
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </>
  );
}
