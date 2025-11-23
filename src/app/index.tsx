import { useGetRecentFeedsFeedsGet } from '@/shared/api/podcastSchemas';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomePageEmpty() {
  const router = useRouter();
  
  // Fetch feeds from API
  const { data: feeds, isLoading, isError, error } = useGetRecentFeedsFeedsGet(
    { limit: 20 },
    {
      query: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    }
  );

  return (
    <SafeAreaView className="flex-1 bg-[#13140e]" edges={['top']}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-4">
          {/* Logo Section */}
          <View className="flex-row items-center" style={{ gap: 12 }}>
            <View className="relative">
              <View className="w-[60px] h-[60px] rounded-full bg-[#4a6b2a] items-center justify-center">
                <MaterialCommunityIcons name="rabbit" size={32} color="#e7e9dd" />
              </View>
            </View>
            <Text className="text-[#e7e9dd] text-[50px] font-black" style={{ letterSpacing: -1 }}>
              MIRAI
            </Text>
          </View>

          {/* Right Icons */}
          <View className="flex-row items-center" style={{ gap: 16 }}>
            <TouchableOpacity>
              <Ionicons name="search" size={24} color="#e7e9dd" />
            </TouchableOpacity>
            <TouchableOpacity>
              <View className="w-[40px] h-[40px] rounded-full bg-[#314c19] items-center justify-center">
                <Ionicons name="add" size={24} color="#e7e9dd" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Document List Content */}
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {isLoading && (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#4a6b2a" />
              <Text className="text-[#e7e9dd] text-[14px] mt-4" style={{ opacity: 0.7 }}>
                Loading feeds...
              </Text>
            </View>
          )}

          {isError && (
            <View className="flex-1 items-center justify-center py-20 px-4">
              <Ionicons name="alert-circle" size={48} color="#e7e9dd" style={{ opacity: 0.5, marginBottom: 12 }} />
              <Text className="text-[#e7e9dd] text-[16px] font-bold mb-2 text-center">
                Failed to load feeds
              </Text>
              <Text className="text-[#e7e9dd] text-[12px] text-center" style={{ opacity: 0.7 }}>
                {error instanceof Error ? error.message : 'Please try again later'}
              </Text>
            </View>
          )}

          {!isLoading && !isError && feeds?.length === 0 && (
            <View className="flex-1 items-center justify-center py-20">
              <MaterialIcons name="podcasts" size={48} color="#e7e9dd" style={{ opacity: 0.5, marginBottom: 12 }} />
              <Text className="text-[#e7e9dd] text-[16px] font-bold mb-2">
                No feeds available
              </Text>
              <Text className="text-[#e7e9dd] text-[12px]" style={{ opacity: 0.7 }}>
                Check back later for new content
              </Text>
            </View>
          )}

          {!isLoading && !isError && feeds && feeds.length > 0 && feeds.map((feed) => (
            <TouchableOpacity
              key={feed.id}
              className="bg-[#171e16] border border-[#262e1f] rounded-[12px] p-4 mb-3"
              activeOpacity={0.7}
            >
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1 mr-3">
                  <Text className="text-[#e7e9dd] text-[16px] font-bold mb-1" numberOfLines={2}>
                    {feed.title}
                  </Text>
                  <View className="flex-row items-center" style={{ gap: 12, marginTop: 4 }}>
                    <View className="flex-row items-center" style={{ gap: 4 }}>
                      <Ionicons
                        name="mic"
                        size={14}
                        color="#e7e9dd"
                        style={{ opacity: 0.7 }}
                      />
                      <Text className="text-[#e7e9dd] text-[12px]" style={{ opacity: 0.7 }}>
                        Podcast
                      </Text>
                    </View>
                    {feed.author && (
                      <View className="flex-row items-center" style={{ gap: 4 }}>
                        <Ionicons name="person-outline" size={14} color="#e7e9dd" style={{ opacity: 0.7 }} />
                        <Text className="text-[#e7e9dd] text-[12px]" style={{ opacity: 0.7 }}>
                          {feed.author}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <View className="items-end">
                  <View className="bg-[#314c19] rounded-full px-3 py-1">
                    <Text className="text-[#e7e9dd] text-[10px] font-bold">Feed</Text>
                  </View>
                </View>
              </View>
              <View className="flex-row items-center mt-2" style={{ gap: 8 }}>
                <TouchableOpacity className="flex-row items-center" style={{ gap: 4 }}>
                  <Ionicons name="play-circle" size={18} color="#4a6b2a" />
                  <Text className="text-[#4a6b2a] text-[12px] font-medium">View</Text>
                </TouchableOpacity>
                {feed.url && (
                  <TouchableOpacity className="flex-row items-center" style={{ gap: 4 }}>
                    <Ionicons name="link" size={18} color="#4a6b2a" />
                    <Text className="text-[#4a6b2a] text-[12px] font-medium">Open URL</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom Navigation - Fixed */}
        <View className="absolute bottom-0 left-0 right-0">
          <SafeAreaView edges={['bottom']} className="pb-4">
            <View className="items-center">
              <View className="bg-[#171e16] border border-[#262e1f] rounded-[15px] py-3" style={{ width: 200 }}>
                <View className="flex-row items-center justify-around px-4">
                  {/* Home Tab - Active */}
                  <TouchableOpacity className="items-center" onPress={() => router.push('/')}>
                    <View className="bg-[#314c19] rounded-[5px] w-[30px] h-[26px] items-center justify-center mb-1">
                      <Ionicons name="home" size={18} color="#e7e9dd" />
                    </View>
                    <Text className="text-[#e7e9dd] text-[10px] font-bold" style={{ marginTop: 2 }}>
                      Home
                    </Text>
                  </TouchableOpacity>

                  {/* Podcast Tab */}
                  <TouchableOpacity className="items-center" onPress={() => router.push('/Podcast')}>
                    <View className="w-[24px] h-[24px] mb-1 items-center justify-center">
                      <MaterialIcons name="podcasts" size={20} color="#e7e9dd" />
                    </View>
                    <Text className="text-[#e7e9dd] text-[10px] font-bold" style={{ marginTop: 2 }}>
                      Podcast
                    </Text>
                  </TouchableOpacity>

                  {/* Setting Tab */}
                  <TouchableOpacity className="items-center" onPress={() => router.push('/Setting')}>
                    <View className="w-[24px] h-[24px] mb-1 items-center justify-center">
                      <Ionicons name="settings-sharp" size={20} color="#e7e9dd" />
                    </View>
                    <Text className="text-[#e7e9dd] text-[10px] font-bold" style={{ marginTop: 2 }}>
                      Setting
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </SafeAreaView>
  );
}
