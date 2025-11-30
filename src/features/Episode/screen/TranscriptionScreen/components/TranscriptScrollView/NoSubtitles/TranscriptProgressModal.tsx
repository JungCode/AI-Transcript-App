import type { RefetchOptions } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  progress: number;
  onClose: () => void;
  refetch: (options?: RefetchOptions) => void;
}

const TranscriptProgressModal = ({
  visible,
  progress,
  onClose,
  refetch,
}: Props) => {
  useEffect(() => {
    if (progress >= 100 && visible) {
      onClose();
      refetch();
    }
  }, [progress, visible]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)] px-4">
        <View className="bg-surface p-6 rounded-xl w-full max-w-[400px]">
          <Text className="text-xl font-bold mb-4 text-center text-white font-nunito">
            Generating Subtitles...
          </Text>

          <View className="mb-4">
            <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>
            <Text className="text-center text-gray-600 mt-2">
              {progress.toFixed(1)}%
            </Text>
          </View>

          <TouchableOpacity onPress={onClose}>
            <Text className="text-center text-white mt-6 font-medium font-nunito">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export { TranscriptProgressModal };
