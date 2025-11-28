import type {
  TranscriptData,
  TranscriptSegment,
} from '@/features/Episode/screen/TranscriptionScreen/constants/transcript';
import {
  useGetTranscriptByEpisodeId,
  useTranslateSentence,
} from '@/shared/api/ai-translatorSchemas';
import { useCallback, useEffect, useState } from 'react';

interface UseTranscriptManagementProps {
  episodeId: number;
}

export function useTranscriptManagement({
  episodeId,
}: UseTranscriptManagementProps) {
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

  const { data, isLoading, refetch } = useGetTranscriptByEpisodeId(episodeId, {
    query: {
      retry: false,
      enabled: !!episodeId,
    },
  });
  const transcriptData = data?.transcript_data as TranscriptData | undefined;
  const transcriptId = data?.id;

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

  return {
    segments,
    transcriptData,
    transcriptId,
    isLoading,
    refetch,
    requestTranslation,
  };
}
