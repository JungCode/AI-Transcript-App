import type {
  EpisodeRecentRead} from '@/shared/api/podcastSchemas';
import {
  useGetUserEpisodes,
} from '@/shared/api/podcastSchemas';
import logoSource from '@/shared/assets/images/icons/logo.svg';
import { formatDateOnly, formatDuration } from '@/shared/helpers/format';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

const HomeCard = () => {
  const { data: userEpisodes, isLoading } = useGetUserEpisodes();

  if (isLoading) {
    return (
      <View className="h-[70%] items-center justify-center py-20">
        <ActivityIndicator size="large" color="#4a6b2a" />
        <Text
          className="text-text-soft text-[14px] mt-4 font-nunito"
          style={{ opacity: 0.7 }}
        >
          Loading...
        </Text>
      </View>
    );
  }

  if (!userEpisodes || userEpisodes.length === 0) {
    return (
      <View className="h-[70%] justify-center items-center">
        <Ionicons name="timer-outline" size={80} color="#314C19" />

        <Text className="text-text-soft font-bold text-xl font-nunito">
          No Document
        </Text>
        <Text className="text-text-soft font-nunito text-center mt-2 px-10">
          Please upload the audio or video file that you want to convert into
          study subtitles.
        </Text>
      </View>
    );
  }

  const groupedEpisodes = userEpisodes.reduce(
    (groups, episode) => {
      const date = formatDateOnly(
        episode.updated_at || episode.created_at || '',
      );
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(episode);
      return groups;
    },
    {} as Record<string, EpisodeRecentRead[]>,
  );

  return (
    <ScrollView>
      {Object.entries(groupedEpisodes).map(([date, episodes]) => (
        <View key={date}>
          <Text className="text-text-lime text-lg font-bold font-nunito mt-8 mb-3 pl-2">
            {date}
          </Text>
          {episodes.map((episode, index) => (
            <View
              key={index}
              className="w-full bg-border-darker h-49 rounded-2xl p-3 mb-3"
            >
              <View className="bg-mirai-bgDarker w-full h-full rounded-2xl pl-6 pr-6 pt-3 flex-row justify-between items-center">
                <View>
                  <View className="rounded-full size-9 bg-mirai-bgDarkest items-center justify-center">
                    <MaterialIcons name="podcasts" size={18} color="white" />
                  </View>
                  <View className="flex-col mt-6">
                    <Text className="text-sm font-bold text-text-lime font-nunito">
                      {formatDuration(episode.duration)}
                    </Text>
                    <Text
                      className="w-64 text-xl font-nunito font-bold text-white "
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {episode.episode_title || 'Untitled Episode'}
                    </Text>
                  </View>
                </View>

                <View className="bg-mirai-white rounded-full size-28 p-1 justify-center items-center">
                  <Image
                    source={episode.image_url ?? logoSource}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 100,
                      objectFit: 'cover',
                    }}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};
export { HomeCard };
