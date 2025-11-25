import { useGetRecentFeeds } from '@/shared/api/podcastSchemas';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { FeedList } from './components/FeedList';

const PodcastScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: feeds, isLoading } = useGetRecentFeeds({ limit: 20 });

  // Filter feeds based on search query
  const filteredFeeds = useMemo(() => {
    if (!feeds) return [];

    if (!searchQuery.trim()) return feeds;

    const query = searchQuery.toLowerCase();

    return feeds.filter(
      feed =>
        feed.title.toLowerCase().includes(query) ||
        feed.author.toLowerCase().includes(query),
    );
  }, [searchQuery, feeds]);

  return (
    <View className="flex-1 bg-surface">
      {/* Header with Title */}
      <View className="items-center mb-3">
        <Text className="text-white text-xl font-medium font-nunito">
          Podcast
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-6 mb-4">
        <View className="bg-surface-darkest h-[47px] rounded-3xl flex-row items-center px-4">
          <Ionicons name="search" size={20} color="#979989" />
          <TextInput
            className="flex-1 ml-3 text-white text-[16px] font-nunito"
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
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <FeedList
          isLoading={isLoading}
          filteredFeeds={filteredFeeds}
          searchQuery={searchQuery}
        />
      </ScrollView>
    </View>
  );
};

export { PodcastScreen };
