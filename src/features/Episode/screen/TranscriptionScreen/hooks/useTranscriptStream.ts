import { useSSEStreamExpo } from '@/shared/hooks/useSSEStreamExpo';

export const useTranscriptStream = (id?: number) => {
  return useSSEStreamExpo(
    id ? `/ai-translator/transcript/stream/${id}` : null,
    {
      onMessage: msg => console.log('Progress:', msg),
      onError: e => console.error('Stream error:', e),
    },
  );
};
