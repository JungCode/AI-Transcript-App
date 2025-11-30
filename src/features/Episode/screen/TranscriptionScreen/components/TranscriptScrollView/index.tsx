import type {
  IHandleBeforeScrollFlashList,
  IHandleScrollFlashList,
} from '@/features/Episode/screen/TranscriptionScreen/components/TranscriptScrollView/hooks/useFlashListScroll';
import { useFlashListScroll } from '@/features/Episode/screen/TranscriptionScreen/components/TranscriptScrollView/hooks/useFlashListScroll';
import { useTranslateManagement } from '@/features/Episode/screen/TranscriptionScreen/components/TranscriptScrollView/hooks/useTranslateManagement';
import type {
  TranscriptData,
  TranscriptSegment,
  TranscriptWord,
} from '@/features/Episode/screen/TranscriptionScreen/constants/transcript';
import { FlashList } from '@shopify/flash-list';
import type { AudioPlayer, AudioStatus } from 'expo-audio';
import { useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import NoSubtitles from './NoSubtitles';
import { Segment } from './Segment';

interface ITranscriptScrollViewProps {
  episodeId: number;
  episodeUrl: string;
  audioStatus: AudioStatus;
  player: AudioPlayer;
  onShowWordDefinition?: (
    word: TranscriptWord,
    segment: TranscriptSegment,
  ) => void;
  transcriptData: TranscriptData | undefined;
  segments: TranscriptSegment[];
  setSegments: React.Dispatch<React.SetStateAction<TranscriptSegment[]>>;
  isLoading: boolean;
  refetch: () => void;
}

const TranscriptScrollView = ({
  episodeId,
  episodeUrl,
  audioStatus,
  player,
  onShowWordDefinition,
  transcriptData,
  segments,
  setSegments,
  isLoading,
  refetch,
}: ITranscriptScrollViewProps) => {
  const transcriptId = transcriptData?.id;

  const { requestTranslation } = useTranslateManagement({
    episodeId,
    segments,
    setSegments,
  });

  const requestSingleTranslation = useCallback(
    (segment: TranscriptSegment) => {
      requestTranslation([segment]);
    },
    [requestTranslation],
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

  if (isLoading) {
    return (
      <ActivityIndicator
        className="w-full h-[70%] justify-center items-center"
        color="white"
        size="large"
      />
    );
  }

  if (!transcriptData || segments.length === 0) {
    return (
      <NoSubtitles
        initTranscriptId={transcriptId ?? undefined}
        refetch={refetch}
        episodeId={episodeId}
        episodeUrl={episodeUrl}
      />
    );
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
          onRequestTranslation={() => requestSingleTranslation(currentSegment)}
          onShowWordDefinition={onShowWordDefinition}
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
