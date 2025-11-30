import { useGetTranscriptByEpisodeId } from '@/shared/api/ai-translatorSchemas';
import { useEffect, useState } from 'react';
import type { TranscriptData, TranscriptSegment } from '../constants/transcript';

interface IUseTranscriptManagementParams {
  episodeId: number;
}

const useTranscriptManagement = ({
  episodeId,
}: IUseTranscriptManagementParams) => {
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);

  const { data, isLoading, refetch } = useGetTranscriptByEpisodeId(episodeId, {
    query: {
      retry: false,
      enabled: !!episodeId,
    },
  });

  const transcriptData = data?.transcript_data as TranscriptData | undefined;

  useEffect(() => {
    const transcriptSegments = transcriptData?.transcript?.segments ?? [];

    if (transcriptSegments?.length) {
      setSegments(transcriptSegments);
    }
  }, [transcriptData?.transcript?.segments]);

  return {
    transcriptData,
    segments,
    setSegments,
    isLoading,
    refetch,
  };
};

export { useTranscriptManagement };
