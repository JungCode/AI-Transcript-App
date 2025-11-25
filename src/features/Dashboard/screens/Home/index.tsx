import logoSource from '@/shared/assets/images/icons/logo.svg';

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { HomeCard } from './components/HomeCard';

const HomeScreen = () => {
  return (
    <View className="bg-surface flex-1 px-6">
      {/* header */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row gap-5">
          <Image source={logoSource} style={{ width: 55, height: 55 }} />
          <Text className="font-black text-6xl text-white font-nunito leading-tight">
            MIRAI
          </Text>
        </View>

        <View className="rounded-full bg-mirai-greenDark size-12 justify-center items-center">
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </View>
      </View>
      {/* end header */}

      <HomeCard />
    </View>
  );
};

export { HomeScreen };
