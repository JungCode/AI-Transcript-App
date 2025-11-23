import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Setting() {
  const router = useRouter();

  const generalSettings = [
    {
      id: '1',
      icon: 'language',
      title: 'App Language',
      description: 'Select the language of the app',
      iconType: 'material',
    },
    {
      id: '2',
      icon: 'closed-caption',
      title: 'Subtitles Preferences',
      description: 'Manage subtitle display settings.',
      iconType: 'material',
    },
    {
      id: '3',
      icon: 'color-palette',
      title: 'App Theme',
      description: 'Adjust the app theme',
      iconType: 'ionicons',
    },
    {
      id: '4',
      icon: 'people',
      title: 'Echo Workflow',
      description: 'Configure the workflow for Echoing',
      iconType: 'ionicons',
    },
  ] as const;

  return (
    <View className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <View className="flex-row items-center mb-2">
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            }}
            activeOpacity={0.7}
            className="mr-3"
          >
            <Ionicons name="arrow-back" size={28} color="#e7e9dd" />
          </TouchableOpacity>
          <Text className="text-[#e7e9dd] text-[32px] font-bold">Settings</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-6 pb-[120px]"
        contentContainerStyle={{ paddingTop: 0 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <View className="mb-8">
          <Text className="text-[#4a6b2a] text-[18px] font-bold mb-4">
            Account
          </Text>

          {/* Not Signed In Card */}
          <View className="bg-[#171e16] border border-[#262e1f] rounded-[12px] p-4 mb-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <Text className="text-[#e7e9dd] text-[16px] font-bold mb-1">
                  Not signed in
                </Text>
                <Text className="text-[#e7e9dd] text-[12px] opacity-70">
                  Sign in to use all features
                </Text>
              </View>
              <TouchableOpacity
                className="bg-[#4a6b2a] rounded-[8px] px-4 py-2"
                activeOpacity={0.7}
              >
                <Text className="text-[#e7e9dd] text-[14px] font-bold">
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Enroll Miraa Pro Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="rounded-[12px] bg-[#4f7530] p-4"
          >
            <View className="flex-row items-center">
              <View className="w-[40px] h-[40px] rounded-full bg-[#e7e9dd] items-center justify-center mr-3">
                <MaterialCommunityIcons
                  name="rabbit"
                  size={24}
                  color="#4a6b2a"
                />
              </View>
              <View className="flex-1">
                <Text className="text-[#e7e9dd] text-[16px] font-bold mb-1">
                  Enroll Miraa Pro
                </Text>
                <Text className="text-[#e7e9dd] text-[12px] opacity-80">
                  Unlock the full power with AI
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* General Section */}
        <View>
          <Text className="text-[#4a6b2a] text-[18px] font-bold mb-4">
            General
          </Text>

          <View className="bg-[#171e16] border border-[#262e1f] rounded-[12px] overflow-hidden">
            {generalSettings.map((setting, index) => (
              <TouchableOpacity
                key={setting.id}
                className={`flex-row items-center px-4 py-4 ${index < generalSettings.length - 1 ? 'border-b border-[#262e1f]' : ''}`}
                activeOpacity={0.7}
              >
                {/* Icon */}
                <View className="w-[40px] h-[40px] items-center justify-center mr-3">
                  {setting.iconType === 'material' ? (
                    <MaterialIcons
                      name={
                        setting.icon as React.ComponentPropsWithoutRef<
                          typeof MaterialIcons
                        >['name']
                      }
                      size={24}
                      color="#e7e9dd"
                    />
                  ) : (
                    <Ionicons
                      name={
                        setting.icon as React.ComponentPropsWithoutRef<
                          typeof Ionicons
                        >['name']
                      }
                      size={24}
                      color="#e7e9dd"
                    />
                  )}
                </View>

                {/* Text Content */}
                <View className="flex-1">
                  <Text className="text-[#e7e9dd] text-[16px] font-bold mb-1">
                    {setting.title}
                  </Text>
                  <Text className="text-[#e7e9dd] text-[12px] opacity-70">
                    {setting.description}
                  </Text>
                </View>

                {/* Chevron */}
                <View className="opacity-50">
                  <Ionicons name="chevron-forward" size={20} color="#e7e9dd" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
