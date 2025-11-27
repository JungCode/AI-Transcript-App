import type { ITranscriptionScreenParams } from '@/features/Episode/screen/TranscriptionScreen/constants';
import { useGetUserEpisodes } from '@/shared/api/podcastSchemas';
import logoSource from '@/shared/assets/images/icons/logo.svg';
import { DurationFormat, formatDuration } from '@/shared/helpers/format';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { groupEpisodesByDate, sortEpisodes } from '../helpers';

const HomeCard = () => {
  const { data: userEpisodes, isLoading } = useGetUserEpisodes();

  const handleGoToTranscription = ({
    episodeId,
    episodeUrl,
    episodeTitle,
    feedTitle,
  }: ITranscriptionScreenParams) => {
    router.push({
      pathname: '/episode/transcription',
      params: {
        episodeId,
        episodeUrl,
        episodeTitle,
        feedTitle,
      },
    });
  };

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

  const sorted = sortEpisodes(userEpisodes);
  const groupedEpisodes = groupEpisodesByDate(sorted);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsHorizontalScrollIndicator={false}
    >
      {Object.entries(groupedEpisodes).map(([date, episodes], index) => (
        <View key={date}>
          <Text className="text-text-lime text-lg font-bold font-nunito mt-8 mb-3 pl-2">
            {date}
          </Text>
          {episodes.map((episode, index) => (
            <TouchableOpacity
              onPress={() =>
                handleGoToTranscription({
                  episodeId: episode.id,
                  episodeUrl: episode.enclosure_url,
                  episodeTitle: episode.episode_title,
                  feedTitle: episode.episode_title,
                })
              }
              activeOpacity={0.7}
              key={index}
              className="w-full bg-border-darker h-49 rounded-2xl p-3 mb-3"
            >
              <View className="bg-mirai-bgDarker w-full h-full rounded-2xl pl-6 pr-6 pt-3 flex-row justify-between items-center gap-2">
                <View className="flex-1">
                  <View className="rounded-full size-9 bg-mirai-bgDarkest items-center justify-center">
                    <MaterialIcons name="podcasts" size={18} color="white" />
                  </View>
                  <View className="flex-col mt-6">
                    <Text className="text-sm font-bold text-text-lime font-nunito">
                      {formatDuration(episode.duration, DurationFormat.Compact)}
                    </Text>
                    <Text
                      className="w-full text-xl font-nunito font-bold text-white truncate"
                      numberOfLines={2}
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
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};
export { HomeCard };
