import { useGetRecentFeedsFeedsGet } from '@/shared/api/podcastSchemas';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Podcast() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // Filter feeds based on search query
  const filteredFeeds = useMemo(() => {
    if (!feeds) return [];
    if (!searchQuery.trim()) return feeds;
    const query = searchQuery.toLowerCase();
    return feeds.filter((feed) => 
      feed.title.toLowerCase().includes(query) ||
      feed.author.toLowerCase().includes(query)
    );
  }, [searchQuery, feeds]);

  return (
    <SafeAreaView className="flex-1 bg-[#13140e]" edges={['top']}>
      <View className="flex-1">
        {/* Header with Title */}
        <View className="items-center pt-4 pb-4">
          <Text className="text-white text-[20px] font-medium">Podcast</Text>
        </View>

        {/* Search Bar */}
        <View className="px-[34px] mb-4">
          <View className="bg-[#33362e] h-[47px] rounded-[20px] flex-row items-center px-4">
            <Ionicons name="search" size={20} color="#979989" />
            <TextInput
              className="flex-1 ml-3 text-[#979989] text-[16px]"
              placeholder="Search podcast"
              placeholderTextColor="#979989"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Podcast List */}
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ paddingHorizontal: 34, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {isLoading && (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#4a6b2a" />
              <Text className="text-[#e7e9dd] text-[14px] mt-4" style={{ opacity: 0.7 }}>
                Loading podcasts...
              </Text>
            </View>
          )}

          {isError && (
            <View className="flex-1 items-center justify-center py-20 px-4">
              <Ionicons name="alert-circle" size={48} color="#e7e9dd" style={{ opacity: 0.5, marginBottom: 12 }} />
              <Text className="text-[#e7e9dd] text-[16px] font-bold mb-2 text-center">
                Failed to load podcasts
              </Text>
              <Text className="text-[#e7e9dd] text-[12px] text-center" style={{ opacity: 0.7 }}>
                {error instanceof Error ? error.message : 'Please try again later'}
              </Text>
            </View>
          )}

          {!isLoading && !isError && (!filteredFeeds || filteredFeeds.length === 0) && (
            <View className="flex-1 items-center justify-center py-20">
              <MaterialIcons name="podcasts" size={48} color="#e7e9dd" style={{ opacity: 0.5, marginBottom: 12 }} />
              <Text className="text-[#e7e9dd] text-[16px] font-bold mb-2">
                {searchQuery ? 'No podcasts found' : 'No podcasts available'}
              </Text>
              <Text className="text-[#e7e9dd] text-[12px]" style={{ opacity: 0.7 }}>
                {searchQuery ? 'Try a different search term' : 'Check back later for new content'}
              </Text>
            </View>
          )}

          {!isLoading && !isError && filteredFeeds && filteredFeeds.length > 0 && filteredFeeds.map((feed) => (
            <TouchableOpacity
              key={feed.id}
              className="bg-[#13140e] h-[72px] mb-0 flex-row items-center"
              activeOpacity={0.7}
            >
              {/* Podcast Image */}
              <View className="w-[59px] h-[59px] rounded-[3px] overflow-hidden mr-3">
                {feed.image ? (
                  <Image
                    source={{ uri: feed.image }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                  />
                ) : (
                  <View className="w-full h-full bg-[#33362e] items-center justify-center">
                    <MaterialIcons name="podcasts" size={24} color="#979989" />
                  </View>
                )}
              </View>

              {/* Podcast Info */}
              <View className="flex-1">
                <Text 
                  className="text-[#e7e9dd] text-[16px] font-normal mb-1" 
                  numberOfLines={1}
                >
                  {feed.title}
                </Text>
                <Text 
                  className="text-[#979989] text-[14px] font-normal"
                  numberOfLines={1}
                >
                  {feed.author}
                </Text>
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
                  {/* Home Tab */}
                  <TouchableOpacity className="items-center" onPress={() => router.replace('/')}>
                    <View className="w-[24px] h-[24px] mb-1 items-center justify-center">
                      <Ionicons name="home" size={20} color="#e7e9dd" />
                    </View>
                    <Text className="text-[#e7e9dd] text-[10px] font-bold" style={{ marginTop: 2 }}>
                      Home
                    </Text>
                  </TouchableOpacity>

                  {/* Podcast Tab - Active */}
                  <TouchableOpacity className="items-center">
                    <View className="bg-[#314c19] rounded-[5px] w-[30px] h-[26px] items-center justify-center mb-1">
                      <MaterialIcons name="podcasts" size={18} color="#e7e9dd" />
                    </View>
                    <Text className="text-[#e7e9dd] text-[10px] font-bold" style={{ marginTop: 2 }}>
                      Podcast
                    </Text>
                  </TouchableOpacity>

                  {/* Setting Tab */}
                  <TouchableOpacity className="items-center" onPress={() => router.replace('/Setting')}>
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

