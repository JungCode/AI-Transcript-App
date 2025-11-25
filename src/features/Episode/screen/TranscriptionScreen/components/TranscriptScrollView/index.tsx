import { useGetTranscriptByEpisodeId } from '@/shared/api/ai-translatorSchemas';
import type { AudioStatus } from 'expo-audio';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import type { TranscriptData } from '../../constants/transcript';

interface ITranscriptScrollViewProps {
  episodeId: number;
  episodeUrl: string;
  audioStatus: AudioStatus;
}

const TranscriptScrollView = ({
  episodeId,
  episodeUrl,
  audioStatus,
}: ITranscriptScrollViewProps) => {
  // const { mutate: createTranscript } = useCreateTranscript();
  const { data, isLoading } = useGetTranscriptByEpisodeId(episodeId, {
    query: {
      enabled: !!episodeId,
    },
  });

  const transcriptData = data?.transcript_data as TranscriptData | undefined;
  const transcriptSegments = transcriptData?.transcript?.segments ?? [];

  // const handleCreateTranscription = () => {
  //   createTranscript({
  //     data: {
  //       episode_id: episodeId,
  //       audio_url: episodeUrl,
  //     },
  //   });
  // };

  if (isLoading) {
    return (
      <ActivityIndicator
        className="w-full h-[70%] justify-center items-center"
        color="white"
        size="large"
      />
    );
  }

  return (
    <ScrollView
      className="w-full min-h-full pt-3"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      {transcriptSegments.map((segment, index) => {
        const startSec = segment.start;
        const endSec = segment.end;

        const isCurrentlyPlayingSegment =
          audioStatus.currentTime >= startSec &&
          audioStatus.currentTime <= endSec;

        return (
          <View
            key={index}
            className={`${isCurrentlyPlayingSegment ? 'bg-surface-deep' : ''} rounded-3xl p-4 gap-2 mb-4`}
          >
            <View className="flex-row flex-wrap gap-2">
              {segment?.words?.map((wordData, wordIndex) => {
                const startSec = wordData.start;
                const endSec = wordData.end;

                const isCurrentlyPlayingWord =
                  audioStatus.currentTime >= startSec &&
                  audioStatus.currentTime <= endSec;

                return (
                  <Text
                    key={wordIndex}
                    className={`text-white text-center font-nunito font-bold text-lg border-2 
                ${isCurrentlyPlayingWord ? 'border-success' : 'border-transparent'} rounded-lg px-1 `}
                  >
                    {wordData.word}
                  </Text>
                );
              })}
            </View>
            <View>
              <Text className="text-text-muted text-base font-nunito font-semibold">
                Nếu bạn muốn mình viết wrapper tự động để không phải sửa từng
                query một thì mình có thể làm luôn.
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export { TranscriptScrollView };
