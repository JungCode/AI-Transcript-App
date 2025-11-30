import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native';

interface IWordDefinitionModalProps {
  visible: boolean;
  word: string;
  phonetic?: string;
  translation?: string;
  explanation?: string;
  partOfSpeech?: string;
  isLoading?: boolean;
  onClose: () => void;
  onPlayAudio?: () => void;
}

const WordDefinitionModal = ({
  visible,
  word,
  phonetic,
  translation,
  explanation,
  partOfSpeech,
  isLoading = false,
  onClose,
  onPlayAudio,
}: IWordDefinitionModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-[rgba(0,0,0,0.5)] justify-center items-center px-4"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={e => e.stopPropagation()}
          className="bg-[#373f42] rounded-2xl p-6 w-full max-w-[265px]"
        >
          {/* Header with Word and Audio Button */}
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-3">
              {/* Word */}
              <Text className="text-white text-2xl font-nunito font-bold mb-1">
                {word}
              </Text>

              {/* Phonetic */}
              {phonetic && (
                <Text className="text-[#cbd8e1] text-base font-nunito font-medium">
                  {phonetic}
                </Text>
              )}
            </View>
            
            {/* Audio Button */}
            {onPlayAudio && !isLoading && (
              <TouchableOpacity
                onPress={onPlayAudio}
                className="p-2 -mt-1"
              >
                <Ionicons name="volume-high" size={22} color="#cbd8e1" />
              </TouchableOpacity>
            )}
          </View>

          {/* Loading State */}
          {isLoading && (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color="#cbd8e1" />
              <Text className="text-[#cbd8e1] text-sm font-nunito font-medium mt-2">
                Đang tải định nghĩa...
              </Text>
            </View>
          )}

          {/* Content */}
          {!isLoading && (
            <>
              {/* Translation */}
              {translation && (
                <Text className="text-white text-2xl font-nunito font-bold mb-3">
                  {translation}
                </Text>
              )}

              {/* Explanation */}
              {explanation && (
                <Text className="text-[#cbd8e1] text-base font-nunito font-medium mb-4 leading-6">
                  {explanation}
                </Text>
              )}

              {/* Part of Speech Tag */}
              {partOfSpeech && (
                <View className="flex-row items-center">
                  <View className="bg-[#2b2e33] rounded-full px-3 py-1.5">
                    <Text className="text-white text-sm font-nunito font-bold">
                      {partOfSpeech}
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export { WordDefinitionModal };

