import { useGetFeedEpisodes } from '@/shared/api/podcastSchemas';
import {
  formatDate,
  formatDuration,
  formatStripHTML,
} from '@/shared/helpers/format';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const EpisodeScreen = () => {
  const router = useRouter();
  const { feedId, feedAuthor, feedImage, feedTitle } = useLocalSearchParams<{
    feedId: string;
    feedTitle?: string;
    feedAuthor?: string;
    feedImage?: string;
  }>();

  const parsedFeedId = parseInt(feedId, 10);

  const { data: episodes = [], isLoading } = useGetFeedEpisodes(
    parsedFeedId,
    undefined,
  );

  const episodeCount = episodes.length;

  return (
    <View className="bg-surface flex-1 px-6">
      {/* Header */}
      <View className="flex-row items-center justify-between pt-4 pb-4">
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/dashboard/podcast');
            }
          }}
        >
          <Ionicons name="arrow-back" size={28} color="#e7e9dd" />
        </TouchableOpacity>
      </View>

      {/* Podcast Info Section */}
      <View className="mb-6">
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
              <View className="w-full h-full bg-mirai-bgDarkest items-center justify-center">
                <MaterialIcons name="podcasts" size={48} color="#979989" />
              </View>
            )}
          </View>

          {/* Podcast Info */}
          <View className="flex-1">
            <View className="flex-1 justify-center">
              <Text
                className="text-text-soft text-2xl font-bold mb-2 font-nunito"
                numberOfLines={2}
              >
                {feedTitle}
              </Text>
              <Text className="text-text-soft text-lg mb-2 font-nunito">
                {feedAuthor}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-text-muted text-base font-nunito">
          {episodeCount} {episodeCount === 1 ? 'episode' : 'episodes'}
        </Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="swap-vertical" size={20} color="#C2F590" />
        </TouchableOpacity>
      </View>

      {/* Episodes List */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#4a6b2a" />
            <Text className="text-text-muted text-sm font-nunito mt-4">
              Loading episodes...
            </Text>
          </View>
        )}

        {!isLoading && episodes.length === 0 && (
          <View className="flex-1 items-center justify-center py-20">
            <MaterialIcons
              name="podcasts"
              size={48}
              color="#e7e9dd"
              style={{ opacity: 0.5, marginBottom: 12 }}
            />
            <Text className="text-[#e7e9dd] text-[16px] font-bold mb-2">
              No episodes available
            </Text>
            <Text className="text-[#e7e9dd] text-[12px]">
              Check back later for new content
            </Text>
          </View>
        )}

        {!isLoading &&
          episodes?.length > 0 &&
          episodes.map((episode, index) => (
            <TouchableOpacity
              key={episode.id || index}
              className="bg-surface-deep rounded-[12px] p-4 mb-3"
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
                      <MaterialIcons
                        name="podcasts"
                        size={28}
                        color="#979989"
                      />
                    </View>
                  )}
                </View>

                {/* Episode Info */}
                <View className="flex-1">
                  {episode.episode_pub_date && (
                    <Text className="text-text-muted text-xs font-bold mb-1 font-nunito">
                      {formatDate(episode.episode_pub_date)}
                    </Text>
                  )}

                  <Text
                    className="text-text-soft text-base font-bold mb-2 font-nunito"
                    numberOfLines={2}
                  >
                    {episode.episode_title}
                  </Text>

                  <Text
                    className="text-text-muted text-[14px] mb-2 font-nunito"
                    numberOfLines={2}
                  >
                    {formatStripHTML(episode.episode_description)}
                  </Text>

                  {episode.duration && (
                    <Text className="text-primary text-[14px] font-bold font-nunito">
                      {formatDuration(episode.duration)}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

export { EpisodeScreen };
