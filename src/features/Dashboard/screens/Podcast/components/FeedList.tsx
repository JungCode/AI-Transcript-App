import type { FeedRead } from '@/shared/api/podcastSchemas';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface IFeedListProps {
  isLoading: boolean;
  filteredFeeds: FeedRead[];
  searchQuery: string;
}

const FeedList = ({
  isLoading,
  filteredFeeds,
  searchQuery,
}: IFeedListProps) => {
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <ActivityIndicator size="large" color="#4a6b2a" />
        <Text
          className="text-text-soft text-[14px] mt-4 font-nunito"
          style={{ opacity: 0.7 }}
        >
          Loading podcasts...
        </Text>
      </View>
    );
  }

  if (!filteredFeeds || filteredFeeds.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <MaterialIcons
          name="podcasts"
          size={48}
          color="#e7e9dd"
          style={{ opacity: 0.5, marginBottom: 12 }}
        />
        <Text className="text-text-soft text-[16px] font-bold mb-2 font-nunito">
          {searchQuery ? 'No podcasts found' : 'No podcasts available'}
        </Text>
        <Text
          className="text-text-soft text-[12px] font-nunito"
          style={{ opacity: 0.7 }}
        >
          {searchQuery
            ? 'Try a different search term'
            : 'Check back later for new content'}
        </Text>
      </View>
    );
  }

  return filteredFeeds.map(feed => (
    <TouchableOpacity
      key={feed.id}
      className="bg-[#13140e] h-[72px] mb-0 flex-row items-center"
      activeOpacity={0.7}
      onPress={() => {
        // Convert feed.id (string) to number for API
        const feedIdNum = parseInt(feed.id, 10);
        if (isNaN(feedIdNum)) {
          return;
        }
        router.push({
          pathname: '/episode',
          params: {
            feedId: feedIdNum.toString(),
            feedTitle: feed.title,
            feedAuthor: feed.author,
            feedImage: feed.image ?? '',
          },
        });
      }}
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
          <View className="w-full h-full bg-surface-darkest items-center justify-center">
            <MaterialIcons name="podcasts" size={24} />
          </View>
        )}
      </View>

      {/* Podcast Info */}
      <View className="flex-1">
        <Text
          className="text-text-soft text-[16px] font-normal mb-1 font-nunito"
          numberOfLines={1}
        >
          {feed.title}
        </Text>
        <Text
          className="text-text-muted text-[14px] font-normal font-nunito"
          numberOfLines={1}
        >
          {feed.author}
        </Text>
      </View>
    </TouchableOpacity>
  ));
};

export { FeedList };
