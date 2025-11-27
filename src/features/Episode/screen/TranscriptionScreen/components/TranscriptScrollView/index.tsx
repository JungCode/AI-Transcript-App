import type {
  TranscriptData,
  TranscriptSegment,
} from '@/features/Episode/screen/TranscriptionScreen/constants/transcript';
import type {
  IHandleBeforeScrollFlashList,
  IHandleScrollFlashList,
} from '@/features/Episode/screen/TranscriptionScreen/hooks/useFlashListScroll';
import { useFlashListScroll } from '@/features/Episode/screen/TranscriptionScreen/hooks/useFlashListScroll';
import {
  useGetTranscriptByEpisodeId,
  useTranslateSentence,
} from '@/shared/api/ai-translatorSchemas';
import { FlashList } from '@shopify/flash-list';
import type { AudioPlayer, AudioStatus } from 'expo-audio';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import NoSubtitles from './NoSubtitles';
import { Segment } from './Segment';

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

  const requestTranslation = useCallback(
    (batch: TranscriptSegment[]) => {
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
    [episodeId, translateBatch],
  );

  const handleBeforeScroll: IHandleBeforeScrollFlashList = useCallback(
    (_, __, activedSegment) => {
      if (!activedSegment) return;

      const activeIndex = segments.findIndex(s => s.id === activedSegment.id);
      if (activeIndex === -1) return;

      if (activedSegment.translated_sentence) return;

      const batch = segments.slice(activeIndex, activeIndex + 5);
      requestTranslation(batch);
    },
    [segments, requestTranslation],
  );

  const handleScroll: IHandleScrollFlashList = useCallback(
    async (listRef, index) => {
      const isLastItems = index > segments.length - 4;
      if (isLastItems) return;

      await listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.3,
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
      requestTranslation(segments.slice(0, 5));
    }
  }, [segments.length, requestTranslation]);

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
      renderItem={({ item: currentSegment }) => (
        <Segment
          segment={currentSegment}
          player={player}
          audioStatus={audioStatus}
        />
      )}
      className="w-full min-h-full pt-3"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 200 }}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export { TranscriptScrollView };
