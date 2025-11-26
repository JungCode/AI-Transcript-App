import type {
  TranscriptData,
  TranscriptSegment,
} from '@/features/Episode/screen/TranscriptionScreen/constants/transcript';
import type {
  IHandleBeforeScrollFlashList,
  IHandleScrollFlashList} from '@/features/Episode/screen/TranscriptionScreen/hooks/useFlashListScroll';
import {
  useFlashListScroll,
} from '@/features/Episode/screen/TranscriptionScreen/hooks/useFlashListScroll';
import {
  useGetTranscriptByEpisodeId,
  useTranslateSentence,
} from '@/shared/api/ai-translatorSchemas';
import { FlashList } from '@shopify/flash-list';
import type { AudioPlayer, AudioStatus } from 'expo-audio';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import NoSubtitles from './NoSubtitles';
import { Word } from './Word';

interface ITranscriptScrollViewProps {
  episodeId: number;
  episodeUrl: string;
  audioStatus: AudioStatus;
  player: AudioPlayer;
}

const TranscriptScrollView = ({
  episodeId,
  episodeUrl,
  audioStatus,
  player,
}: ITranscriptScrollViewProps) => {
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);

  const { mutate: translateBatch } = useTranslateSentence({
    mutation: {
      onSuccess: (response, variables) => {
        setSegments(prev => {
          const output = [...prev];
          const translatedList = response.translated_sentence_list;
          const inputList = variables.data.data;

          inputList.forEach((input, idx) => {
            const translated = translatedList[idx];
            const pos = output.findIndex(s => s.id === input.sentence_id);

            if (pos !== -1) {
              output[pos] = {
                ...output[pos],
                translated_sentence: translated,
              };
            }
          });

          return output;
        });
      },
    },
  });

  const { data, isLoading } = useGetTranscriptByEpisodeId(episodeId, {
    query: {
      enabled: !!episodeId,
    },
  });
  const transcriptData = data?.transcript_data as TranscriptData | undefined;

  const handleBeforeScroll: IHandleBeforeScrollFlashList = useCallback(
    (_, __, activedSegment) => {
      if (!activedSegment) return;

      const activeIndex = segments.findIndex(s => s.id === activedSegment.id);
      if (activeIndex === -1) return;

      if (activedSegment.translated_sentence) return;

      const batch = segments.slice(activeIndex, activeIndex + 5);

      translateBatch({
        data: {
          episode_id: episodeId,
          data: batch.map(seg => ({
            sentence_id: seg.id,
            sentence: seg.text,
          })),
        },
      });
    },
    [segments, translateBatch, episodeId],
  );

  const handleScroll: IHandleScrollFlashList = useCallback(
    async (listRef, index) => {
      const isLastItems = index > segments.length - 4;
      if (isLastItems) return;

      await listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: isLastItems ? 0 : 0.3,
      });
    },
    [segments.length],
  );

  const { listRef } = useFlashListScroll({
    currentTime: audioStatus.currentTime,
    transcriptSegments: segments,
    beforeScrollCallback: handleBeforeScroll,
    scrollCallback: handleScroll,
  });

  useEffect(() => {
    const transcriptSegments = transcriptData?.transcript?.segments ?? [];

    if (transcriptSegments?.length) {
      setSegments(transcriptSegments);
    }
  }, [transcriptData?.transcript?.segments]);

  useEffect(() => {
    if (segments.length === 0) return;

    const first = segments[0];

    if (!first.translated_sentence) {
      const batch = segments.slice(0, 5);

      const payload = batch.map(seg => ({
        sentence_id: seg.id,
        sentence: seg.text,
      }));

      translateBatch({
        data: {
          episode_id: episodeId,
          data: payload,
        },
      });
    }
  }, [segments.length]);

  if (isLoading) {
    return (
      <ActivityIndicator
        className="w-full h-[70%] justify-center items-center"
        color="white"
        size="large"
      />
    );
  }

  if (!transcriptData) {
    return <NoSubtitles episodeId={episodeId} episodeUrl={episodeUrl} />;
  }

  return (
    <FlashList
      ref={listRef}
      data={segments}
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
              onPress={() => {
                void player.seekTo(currentSegment.start);
                audioStatus.currentTime = currentSegment.start;
              }}
            >
              <View className="flex-row flex-wrap">
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
              <View className="px-3">
                <Text className="text-text-muted text-base font-nunito font-semibold">
                  {currentSegment.translated_sentence}
                </Text>
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
