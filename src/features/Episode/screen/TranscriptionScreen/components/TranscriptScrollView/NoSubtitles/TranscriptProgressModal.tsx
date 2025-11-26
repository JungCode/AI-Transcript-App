import { Modal, Text, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const TranscriptProgressModal = ({ visible, onClose }: Props) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)] px-4">
        <View className="bg-white p-6 rounded-xl w-full max-w-[400px]">
          <Text className="text-xl font-bold mb-4 text-center">
            Generating Subtitles...
          </Text>

          {/* {!data && (
            <View className="items-center py-4">
              <ActivityIndicator size="large" />
              <Text className="mt-3 text-gray-600">Waiting for updates...</Text>
            </View>
          )}

          {data && (
            <View>
              <Text className="text-gray-700 font-semibold mb-2">
                Latest Update:
              </Text>
              <Text className="text-gray-900">
                {JSON.stringify(data, null, 2)}
              </Text>
            </View>
          )} */}

          <Text
            onPress={onClose}
            className="text-center text-blue-600 mt-6 font-medium"
          >
            Close
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export { TranscriptProgressModal };
