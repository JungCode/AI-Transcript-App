import type { TranscriptData } from '@/features/Episode/screen/TranscriptionScreen/constants/transcript';
import { useFlashListScroll } from '@/features/Episode/screen/TranscriptionScreen/hooks/useFlashListScroll';
import { useGetTranscriptByEpisodeId } from '@/shared/api/ai-translatorSchemas';
import { FlashList } from '@shopify/flash-list';
import type { AudioPlayer, AudioStatus } from 'expo-audio';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Word } from './Word';

interface ITranscriptScrollViewProps {
  episodeId: number;
  episodeUrl: string;
  audioStatus: AudioStatus;
  player: AudioPlayer;
}

const TranscriptScrollView = ({
  episodeId,
  // episodeUrl,
  audioStatus,
  player,
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

  const { listRef } = useFlashListScroll({
    currentTime: audioStatus.currentTime,
    transcriptSegments,
    scrollCallback: async (listRef, index) => {
      const isLastItems = index > transcriptSegments.length - 4;

      if (isLastItems) return;

      await listRef.current?.scrollToIndex({
        index: index,
        animated: true,
        viewPosition: isLastItems ? 0 : 0.3,
      });
    },
  });

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
    <FlashList
      ref={listRef}
      data={transcriptSegments}
      renderItem={({ item: currentSegment }) => {
        const currentTime = audioStatus.currentTime;
        const isActive =
          currentTime >= currentSegment.start &&
          currentTime <= currentSegment.end;

        return (
          <View
            className={`${
              isActive ? 'bg-surface-deep' : ''
            } rounded-3xl p-4 gap-2 mb-4`}
          >
            <TouchableOpacity
              onPress={() => player.seekTo(currentSegment.start + 0.01)}
            >
              <View className="flex-row flex-wrap gap-2">
                {currentSegment.words.map((word, index: number) => {
                  let wordActive = false;

                  if (isActive) {
                    wordActive =
                      currentTime >= word.start && currentTime <= word.end;
                  }

                  return (
                    <Word
                      player={player}
                      key={index}
                      word={word}
                      isActive={wordActive}
                    />
                  );
                })}
              </View>
            </TouchableOpacity>
          </View>
        );
      }}
      className="w-full min-h-full pt-3"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 200 }}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export { TranscriptScrollView };
