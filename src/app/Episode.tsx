import { useGetFeedEpisodesFeedsFeedIdEpisodesGet } from '@/shared/api/podcastSchemas';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Helper function to format duration from seconds to "X minutes Y seconds"
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds} seconds`;
  }
  if (remainingSeconds === 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  return `${minutes} minute${minutes > 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}`;
};

// Helper function to format date
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  } catch {
    return dateString;
  }
};

interface EpisodeItem {
  id: string;
  title: string;
  enclosure_url?: string;
  enclosure_type?: string;
  duration?: number;
  episode?: number;
  episode_type?: string;
  feed_language?: string;
  published?: string;
  description?: string;
}

interface EpisodeResponse {
  feed_id: number;
  episodes: EpisodeItem[];
}

export default function Episode() {
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    feedId: string; 
    feedTitle?: string; 
    feedAuthor?: string; 
    feedImage?: string;
  }>();
  
  // Parse feedId - handle both string and number
  const feedIdParam = params.feedId;
  let feedId = 0;
  
  if (feedIdParam) {
    if (typeof feedIdParam === 'string') {
      feedId = parseInt(feedIdParam, 10);
    } else if (typeof feedIdParam === 'number') {
      feedId = feedIdParam;
    } else if (Array.isArray(feedIdParam)) {
      feedId = parseInt(feedIdParam[0], 10);
    }
  }
  
  // Fetch episodes from API
  const { data, isLoading, isError, error } = useGetFeedEpisodesFeedsFeedIdEpisodesGet(
    feedId,
    undefined,
    {
      query: {
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: feedId > 0 && !isNaN(feedId),
      },
    }
  );

  // Type assertion for the response - handle different response structures
  let episodeData: EpisodeResponse | undefined;
  let episodes: EpisodeItem[] = [];
  
  if (data) {
    // Check if data is already in the expected format
    if (typeof data === 'object' && 'episodes' in data) {
      episodeData = data as EpisodeResponse;
      episodes = episodeData.episodes ?? [];
    } else if (Array.isArray(data)) {
      // If data is directly an array of episodes
      episodes = data as EpisodeItem[];
    } else {
      // Try to access episodes property
      episodeData = data as EpisodeResponse;
      episodes = episodeData?.episodes ?? [];
    }
  }
  
  const episodeCount = episodes.length;

  // Get feed info from params or use defaults
  const feedTitle = params.feedTitle ?? 'Learning English Conversations';
  const feedAuthor = params.feedAuthor ?? 'BBC Radio';
  const feedImage = params.feedImage ?? 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400';

  return (
    <SafeAreaView className="flex-1 bg-[#13140e]" edges={['top']}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-4">
          <TouchableOpacity 
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/Podcast');
              }
            }} 
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={28} color="#e7e9dd" />
          </TouchableOpacity>
          
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons name="swap-vertical" size={24} color="#4a6b2a" />
          </TouchableOpacity>
        </View>

        {/* Podcast Info Section */}
        <View className="px-6 mb-6">
          <View className="flex-row items-start">
            {/* Podcast Cover Art */}
            <View className="w-[120px] h-[120px] rounded-[8px] overflow-hidden mr-4">
              {feedImage ? (
                <Image
                  source={{ uri: feedImage }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
              ) : (
                <View className="w-full h-full bg-[#33362e] items-center justify-center">
                  <MaterialIcons name="podcasts" size={48} color="#979989" />
                </View>
              )}
            </View>

            {/* Podcast Info */}
            <View className="flex-1">
              <Text className="text-[#e7e9dd] text-[24px] font-bold mb-2" numberOfLines={2}>
                {feedTitle}
              </Text>
              <Text className="text-[#e7e9dd] text-[16px] mb-2">
                {feedAuthor}
              </Text>
              <Text className="text-[#979989] text-[14px]">
                {episodeCount} {episodeCount === 1 ? 'episode' : 'episodes'}
              </Text>
            </View>
          </View>
        </View>

        {/* Episodes List */}
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {isLoading && (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#4a6b2a" />
              <Text className="text-[#e7e9dd] text-[14px] mt-4" style={{ opacity: 0.7 }}>
                Loading episodes...
              </Text>
            </View>
          )}

          {isError && (
            <View className="flex-1 items-center justify-center py-20 px-4">
              <Ionicons name="alert-circle" size={48} color="#e7e9dd" style={{ opacity: 0.5, marginBottom: 12 }} />
              <Text className="text-[#e7e9dd] text-[16px] font-bold mb-2 text-center">
                Failed to load episodes
              </Text>
              <Text className="text-[#e7e9dd] text-[12px] text-center" style={{ opacity: 0.7 }}>
                {error instanceof Error ? error.message : 'Please try again later'}
              </Text>
            </View>
          )}

          {!isLoading && !isError && episodes.length === 0 && (
            <View className="flex-1 items-center justify-center py-20">
              <MaterialIcons name="podcasts" size={48} color="#e7e9dd" style={{ opacity: 0.5, marginBottom: 12 }} />
              <Text className="text-[#e7e9dd] text-[16px] font-bold mb-2">
                No episodes available
              </Text>
              <Text className="text-[#e7e9dd] text-[12px]" style={{ opacity: 0.7 }}>
                Check back later for new content
              </Text>
            </View>
          )}

          {!isLoading && !isError && episodes && episodes.length > 0 && episodes.map((episode, index) => (
            <TouchableOpacity
              key={episode.id || index}
              className="bg-[#171e16] border border-[#262e1f] rounded-[12px] p-4 mb-3"
              activeOpacity={0.7}
            >
              <View className="flex-row">
                {/* Episode Thumbnail */}
                <View className="w-[70px] h-[70px] rounded-[8px] overflow-hidden mr-4">
                  {feedImage ? (
                    <Image
                      source={{ uri: feedImage }}
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                    />
                  ) : (
                    <View className="w-full h-full bg-[#33362e] items-center justify-center">
                      <MaterialIcons name="podcasts" size={28} color="#979989" />
                    </View>
                  )}
                </View>

                {/* Episode Info */}
                <View className="flex-1">
                  {/* Date */}
                  {episode.published && (
                    <Text className="text-[#979989] text-[12px] mb-1">
                      {formatDate(episode.published)}
                    </Text>
                  )}
                  
                  {/* Episode Title */}
                  <Text className="text-[#e7e9dd] text-[16px] font-bold mb-2" numberOfLines={2}>
                    {episode.title}
                  </Text>

                  {/* Description */}
                  {episode.description && (
                    <Text 
                      className="text-[#979989] text-[14px] mb-2" 
                      numberOfLines={2}
                    >
                      {episode.description}
                    </Text>
                  )}

                  {/* Duration */}
                  {episode.duration && (
                    <Text className="text-[#4a6b2a] text-[14px] font-medium">
                      {formatDuration(episode.duration)}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

