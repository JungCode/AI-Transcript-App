import { Button } from '@/core/components';
import { useTranscriptStream } from '@/features/Episode/screen/TranscriptionScreen/components/TranscriptScrollView/NoSubtitles/hooks/useTranscriptStream';
import { useCreateTranscript } from '@/shared/api/ai-translatorSchemas';
import type { RefetchOptions } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { TranscriptProgressModal } from './TranscriptProgressModal';

interface successResponse {
  message: string;
  status: string;
  transcript_id: number;
}

interface INoSubtitlesProps {
  initTranscriptId: number | undefined;
  episodeId: number;
  episodeUrl: string;
  refetch: (options?: RefetchOptions  ) => void;
}

const NoSubtitles = ({
  episodeId,
  episodeUrl,
  refetch,
  initTranscriptId,
}: INoSubtitlesProps) => {
  const [transcriptId, setTranscriptId] = useState<number | null>(null);

  const { mutate: createTranscript } = useCreateTranscript({
    mutation: {
      onSuccess: data => {
        const response = data as successResponse;
        setTranscriptId(response.transcript_id);

        Toast.show({
          type: 'success',
          text1: 'Transcription successful! 🎉',
          text2: 'Your subtitles are in progress.',
        });
      },
      onError: () => {
        Toast.show({
          type: 'error',
          text1: 'Transcription failed',
          text2: 'Please try again later.',
        });
      },
    },
  });

  const { progress } = useTranscriptStream(
    transcriptId ?? 0,
    !!transcriptId, // enable SSE only when we have an id
  );

  const handleCreateTranscription = () => {
    createTranscript({
      data: {
        episode_id: episodeId,
        audio_url: episodeUrl,
      },
    });
  };

  const handleOnCloseModal = () => {
    if (progress < 100) {
      router.back();
    }
    setTranscriptId(null);
  };

  useEffect(() => {
    if (initTranscriptId) {
      setTranscriptId(initTranscriptId);
    }
  }, [initTranscriptId]);

  return (
    <View className="w-full h-[70%] justify-center items-center px-4 gap-4">
      <Text className="text-text-soft text-center font-nunito text-2xl font-medium">
        No Subtitles?
      </Text>
      <Button
        className="px-5 py-2"
        activeOpacity={0.7}
        onPress={handleCreateTranscription}
      >
        Enable AI Subtitles
      </Button>
      <Text className="text-text-muted font-nunito font-medium">
        Available in English
      </Text>
      <TranscriptProgressModal
        refetch={refetch}
        visible={!!transcriptId}
        progress={progress}
        onClose={handleOnCloseModal}
      />
    </View>
  );
};

export default NoSubtitles;
