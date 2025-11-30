import type { TranscriptSegment } from '@/features/Episode/screen/TranscriptionScreen/constants/transcript';
import { useTranslateSentence } from '@/shared/api/ai-translatorSchemas';
import { useCallback, useEffect } from 'react';

interface IUseTranslateManagementProps {
  episodeId: number;
  segments: TranscriptSegment[];
  setSegments: React.Dispatch<React.SetStateAction<TranscriptSegment[]>>;
}

export function useTranslateManagement({
  episodeId,
  segments,
  setSegments,
}: IUseTranslateManagementProps) {
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
    if (segments.length === 0) return;

    const first = segments[0];

    if (!first.translated_sentence) {
      requestTranslation(segments.slice(0, 5));
    }
  }, [segments.length, requestTranslation]);

  return {
    requestTranslation,
  };
}
