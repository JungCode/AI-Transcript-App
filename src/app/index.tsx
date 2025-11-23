import type { FeedRead } from '@/shared/api/podcastSchemas';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Dummy data for feeds
const dummyFeeds: FeedRead[] = [
  {
    id: '1',
    title: 'Learning English Conversations - Episode 1: Daily Greetings',
    author: 'BBC Radio',
    url: 'https://example.com/podcast/1',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400',
  },
  {
    id: '2',
    title: 'Tech Talk Weekly - AI and Machine Learning Trends',
    author: 'Tech Podcast Network',
    url: 'https://example.com/podcast/2',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
  },
  {
    id: '3',
    title: 'Business Insights - Startup Success Stories',
    author: 'Business Daily',
    url: 'https://example.com/podcast/3',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
  },
  {
    id: '4',
    title: 'Science Explained - The Universe and Beyond',
    author: 'Science Channel',
    url: 'https://example.com/podcast/4',
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400',
  },
  {
    id: '5',
    title: 'Health & Wellness - Mindfulness and Meditation',
    author: 'Wellness Podcast',
    url: 'https://example.com/podcast/5',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
  },
  {
    id: '6',
    title: 'History Uncovered - Ancient Civilizations',
    author: 'History Network',
    url: 'https://example.com/podcast/6',
    image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400',
  },
  {
    id: '7',
    title: 'Music Discovery - Indie Artists Spotlight',
    author: 'Music Weekly',
    url: 'https://example.com/podcast/7',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
  },
  {
    id: '8',
    title: 'Travel Stories - Adventures Around the World',
    author: 'Travel Podcast',
    url: 'https://example.com/podcast/8',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400',
  },
];

export default function HomePageEmpty() {
  const router = useRouter();
  
  // Use dummy data instead of API
  const feeds = dummyFeeds;

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
          {feeds && feeds.length > 0 && feeds.map((feed) => (
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
                  <TouchableOpacity className="items-center" onPress={() => router.replace('/')}>
                    <View className="bg-[#314c19] rounded-[5px] w-[30px] h-[26px] items-center justify-center mb-1">
                      <Ionicons name="home" size={18} color="#e7e9dd" />
                    </View>
                    <Text className="text-[#e7e9dd] text-[10px] font-bold" style={{ marginTop: 2 }}>
                      Home
                    </Text>
                  </TouchableOpacity>

                  {/* Podcast Tab */}
                  <TouchableOpacity className="items-center" onPress={() => router.replace('/Podcast')}>
                    <View className="w-[24px] h-[24px] mb-1 items-center justify-center">
                      <MaterialIcons name="podcasts" size={20} color="#e7e9dd" />
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
