import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Podcast() {
  const router = useRouter();
  
  return (
    <SafeAreaView className="flex-1 bg-[#13140e]" edges={['top', 'bottom']}>
      {/* Back Button */}
      <View className="px-6 pt-4 pb-2">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={28} color="#e7e9dd" />
        </TouchableOpacity>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-xl">Podcast Screen</Text>
      </View>
    </SafeAreaView>
  );
}

