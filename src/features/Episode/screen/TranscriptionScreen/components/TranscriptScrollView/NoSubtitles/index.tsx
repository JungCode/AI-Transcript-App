import { Button } from '@/core/components';
import { useCreateTranscript } from '@/shared/api/ai-translatorSchemas';
import { useState } from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTranscriptStream } from '../../../hooks/useTranscriptStream';
import { TranscriptProgressModal } from './TranscriptProgressModal';

interface INoSubtitlesProps {
  episodeId: number;
  episodeUrl: string;
}

const NoSubtitles = ({ episodeId, episodeUrl }: INoSubtitlesProps) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { mutate: createTranscript } = useCreateTranscript({
    mutation: {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: 'Transcription successful! 🎉',
          text2: 'Your subtitles are in progress.',
        });
        setModalVisible(true);
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

  const { data } = useTranscriptStream(episodeId);

  const handleCreateTranscription = () => {
    createTranscript({
      data: {
        episode_id: episodeId,
        audio_url: episodeUrl,
      },
    });
  };

  const handleOnCloseModal = () => {
    setModalVisible(false);
  };

  console.log('Transcript Stream Data:', data);

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
        visible={isModalVisible}
        // data={data}
        onClose={handleOnCloseModal}
      />
    </View>
  );
};

export default NoSubtitles;
