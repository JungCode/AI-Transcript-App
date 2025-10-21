import { useHealthHealthGet } from '@/shared/api/authSchemas';
import { Text, View } from 'react-native';

export default function Index() {
  const { data, isLoading, error } = useHealthHealthGet();

  console.log('🔍 isLoading:', isLoading, 'error:', error, 'data:', data);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
        {data
          ? ` Gateway: ${(data as { gateway: string | undefined }).gateway}`
          : ''}
      </Text>
    </View>
  );
}
