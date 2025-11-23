import { BottomNavigation } from '@/features/Dashboard/components/BottomNavigation';
import { Stack } from 'expo-router';

export default function PrivateLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      />
      <BottomNavigation />
    </>
  );
}
