import {
  useSaveWordTranslation,
  useTranslateWord,
} from '@/shared/api/ai-translatorSchemas';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import type { AudioPlayer } from 'expo-audio';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type {
  TranscriptSegment,
  TranscriptWord,
} from '../../constants/transcript';

interface WordDefinitionData {
  word: string;
  phonetic?: string;
  translation?: string;
  explanation?: string;
  partOfSpeech?: string;
  episode_id?: number;
}

interface IWordDefinitionModalProps {
  visible: boolean;
  selectedWord: TranscriptWord | null;
  selectedSegment: TranscriptSegment | null;
  player: AudioPlayer;
  onClose: () => void;
  episodeId?: number;
}

const WordDefinitionModal = ({
  visible,
  selectedWord,
  selectedSegment,
  player,
  onClose,
  episodeId,
}: IWordDefinitionModalProps) => {
  const [wordDefinition, setWordDefinition] =
    useState<WordDefinitionData | null>(null);
  const [wordToTranslate, setWordToTranslate] = useState<string | null>(null);
  const [saveSuccessful, setSaveSuccessful] = useState(false);
  const [sentenceToTranslate, setSentenceToTranslate] = useState<string | null>(
    null,
  );

  // Query for word translation
  const {
    data: wordTranslationData,
    isLoading: isTranslatingWord,
    error: translationError,
  } = useTranslateWord(wordToTranslate ?? '', sentenceToTranslate ?? '', {
    query: {
      enabled: !!(
        wordToTranslate &&
        sentenceToTranslate &&
        wordToTranslate.trim() !== '' &&
        sentenceToTranslate.trim() !== ''
      ),
      retry: 1,
    },
  });

  const { mutate: saveWord, isPending: isSavingWord } = useSaveWordTranslation({
    mutation: {
      onSuccess: () => {
        setSaveSuccessful(true);
      },
    },
  });

  const handleSaveWord = () => {
    if (wordDefinition) {
      saveWord({
        data: {
          word: wordDefinition.word,
          phonetic: wordDefinition.phonetic ?? '',
          translated_word: wordDefinition.translation ?? '',
          detail: wordDefinition.explanation ?? '',
          word_type: wordDefinition.partOfSpeech ?? '',
          episode_id: episodeId ?? 0,
        },
      });
    }
  };
  // Handle word/segment change
  useEffect(() => {
    if (!visible || !selectedWord || !selectedSegment) {
      return;
    }

    const wordText = selectedWord.word?.trim() ?? '';
    const sentenceText = selectedSegment.text?.trim() ?? '';

    if (!wordText || !sentenceText) {
      // Show with segment translation only
      setWordDefinition({
        word: wordText,
        translation: selectedSegment.translated_sentence,
        explanation: selectedSegment.translated_sentence ?? undefined,
      });
      return;
    }

    // Set word and sentence for API call
    setWordToTranslate(wordText);
    setSentenceToTranslate(sentenceText);

    // Set initial definition (will be updated when API responds)
    setWordDefinition({
      word: wordText,
      translation: selectedSegment.translated_sentence,
      explanation: `Đang tải định nghĩa cho "${wordText}"...`,
    });
  }, [visible, selectedWord, selectedSegment]);

  // Handle successful translation
  useEffect(() => {
    if (wordTranslationData) {
      setWordDefinition({
        word: wordTranslationData.word ?? wordToTranslate ?? '',
        phonetic: wordTranslationData.phonetic,
        translation: wordTranslationData.translated_word,
        explanation: wordTranslationData.detail,
        partOfSpeech: wordTranslationData.word_type,
      });
    }
  }, [wordTranslationData, wordToTranslate]);

  // Handle translation error
  useEffect(() => {
    if (translationError && selectedSegment) {
      const translation = selectedSegment.translated_sentence ?? '';
      setWordDefinition({
        word: wordToTranslate ?? '',
        translation: translation,
        explanation: translation
          ? `"${wordToTranslate}" trong câu này có nghĩa là "${translation}"`
          : undefined,
        partOfSpeech: 't.phụ',
      });
    }
  }, [translationError, wordToTranslate, selectedSegment]);

  const handlePlayWordAudio = () => {
    if (selectedWord) {
      void player.seekTo(selectedWord.start + 0.01);
    }
  };

  const handleClose = () => {
    setWordDefinition(null);
    setWordToTranslate(null);
    setSentenceToTranslate(null);
    onClose();
  };

  if (!wordDefinition) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleClose}
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
                {wordDefinition.word}
              </Text>

              {/* Phonetic */}
              {wordDefinition.phonetic && (
                <Text className="text-[#cbd8e1] text-base font-nunito font-medium">
                  {wordDefinition.phonetic}
                </Text>
              )}
            </View>
            {/* Save Button */}
            {!isTranslatingWord && !isSavingWord && !saveSuccessful && (
              <TouchableOpacity onPress={handleSaveWord}>
                <MaterialIcons name="save-alt" size={24} color="#cbd8e1" />
              </TouchableOpacity>
            )}

            {isSavingWord && <ActivityIndicator size="small" color="#cbd8e1" />}
            {saveSuccessful && (
              <MaterialIcons name="check-circle" size={24} color="#cbd8e1" />
            )}
            {/* Audio Button */}
            {!isTranslatingWord && (
              <TouchableOpacity
                onPress={handlePlayWordAudio}
                className="p-2 -mt-1"
              >
                <Ionicons name="volume-high" size={22} color="#cbd8e1" />
              </TouchableOpacity>
            )}
          </View>

          {/* Loading State */}
          {isTranslatingWord && (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color="#cbd8e1" />
              <Text className="text-[#cbd8e1] text-sm font-nunito font-medium mt-2">
                Translating ...
              </Text>
            </View>
          )}

          {/* Content */}
          {!isTranslatingWord && (
            <>
              {/* Translation */}
              {wordDefinition.translation && (
                <Text className="text-white text-2xl font-nunito font-bold mb-3">
                  {wordDefinition.translation}
                </Text>
              )}

              {/* Explanation */}
              {wordDefinition.explanation && (
                <Text className="text-[#cbd8e1] text-base font-nunito font-medium mb-4 leading-6">
                  {wordDefinition.explanation}
                </Text>
              )}

              {/* Part of Speech Tag */}
              {wordDefinition.partOfSpeech && (
                <View className="flex-row items-center">
                  <View className="bg-[#2b2e33] rounded-full px-3 py-1.5">
                    <Text className="text-white text-sm font-nunito font-bold">
                      {wordDefinition.partOfSpeech}
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
