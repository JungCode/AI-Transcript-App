import { Button } from '@/core/components';
import { useTranslateWord } from '@/shared/api/ai-translatorSchemas';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAudioPlayer } from 'expo-audio';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AudioPlayer } from './components/AudioPlayer';
import { TranscriptScrollView } from './components/TranscriptScrollView';
import { WordDefinitionModal } from './components/WordDefinitionModal';
import {
  AUDIO_FUNCTION_BUTTON_COMPONENTS,
  AudioFunctionName,
} from './constants';
import type { TranscriptSegment, TranscriptWord } from './constants/transcript';
import { getButtonFunctionByName } from './helpers/AudioButton';
import { useAudioPlayerStatusCustom } from './hooks/useAudioPlayerStatusCustom';

interface WordDefinitionData {
  word: string;
  phonetic?: string;
  translation?: string;
  explanation?: string;
  partOfSpeech?: string;
}

const TranscriptionScreen = () => {
  const { episodeUrl, episodeTitle, feedTitle, episodeId } =
    useLocalSearchParams<{
      episodeId: string;
      episodeUrl: string;
      episodeTitle: string;
      feedTitle?: string;
    }>();

  const player = useAudioPlayer(episodeUrl);
  const status = useAudioPlayerStatusCustom(player);
  const [wordDefinition, setWordDefinition] = useState<WordDefinitionData | null>(null);
  const [isWordModalVisible, setIsWordModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState<TranscriptWord | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<TranscriptSegment | null>(null);
  const [wordToTranslate, setWordToTranslate] = useState<string | null>(null);
  const [sentenceToTranslate, setSentenceToTranslate] = useState<string | null>(null);

  // Query for word translation
  const { 
    data: wordTranslationData, 
    isLoading: isTranslatingWord,
    error: translationError,
  } = useTranslateWord(
    wordToTranslate ?? '',
    sentenceToTranslate ?? '',
    {
      query: {
        enabled: !!(wordToTranslate && sentenceToTranslate && wordToTranslate.trim() !== '' && sentenceToTranslate.trim() !== ''),
        retry: 1,
      },
    },
  );

  // Handle successful translation
  useEffect(() => {
    if (wordTranslationData) {
      // Cập nhật word definition với data từ API
      setWordDefinition({
        word: wordTranslationData.word ?? wordToTranslate ?? '',
        phonetic: wordTranslationData.phonetic,
        translation: wordTranslationData.translated_word,
        explanation: wordTranslationData.detail,
        partOfSpeech: wordTranslationData.word_type,
      });
    }
  }, [wordTranslationData, wordToTranslate, sentenceToTranslate]);

  // Handle translation error
  useEffect(() => {
    if (translationError) {
      // Fallback to segment translation if API fails
      if (selectedSegment) {
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
    }
  }, [translationError, wordToTranslate, sentenceToTranslate, selectedSegment]);


  const handleShowWordDefinition = (
    word: TranscriptWord,
    segment: TranscriptSegment,
  ) => {
    setSelectedWord(word);
    setSelectedSegment(segment);
    
    // Set word and sentence for API call - ensure they're not empty
    const wordText = word.word?.trim() ?? '';
    const sentenceText = segment.text?.trim() ?? '';
    
    if (!wordText || !sentenceText) {
      // Show modal with segment translation only
      setIsWordModalVisible(true);
      setWordDefinition({
        word: wordText,
        translation: segment.translated_sentence,
        explanation: segment.translated_sentence ?? undefined,
      });
      return;
    }
    
    // Set word and sentence for API call
    setWordToTranslate(wordText);
    setSentenceToTranslate(sentenceText);
    
    // Show modal immediately with loading state
    setIsWordModalVisible(true);
    
    // Set initial definition (will be updated when API responds)
    setWordDefinition({
      word: wordText,
      translation: segment.translated_sentence,
      explanation: `Đang tải định nghĩa cho "${wordText}"...`,
    });
  };

  const handleCloseWordModal = () => {
    setIsWordModalVisible(false);
    setWordDefinition(null);
    setSelectedWord(null);
    setSelectedSegment(null);
    setWordToTranslate(null);
    setSentenceToTranslate(null);
  };

  const handlePlayWordAudio = () => {
    if (selectedWord) {
      // Seek to the word's start time to play it
      void player.seekTo(selectedWord.start + 0.01);
    }
  };

  return (
    <View className="flex-1 bg-surface px-4">
      <View className="flex-row items-center justify-between gap-5">
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/dashboard/podcast');
            }
          }}
        >
          <Ionicons name="chevron-back-outline" size={28} color="#e7e9dd" />
        </TouchableOpacity>
        <View className="items-start flex-1">
          <Text
            numberOfLines={1}
            className="text-text-soft font-nunito font-bold text-base"
          >
            {episodeTitle}
          </Text>
          <View className="flex-row gap-1 w-full items-center justify-between">
            <Button
              numberOfLines={1}
              type="ghost"
              className="text-white flex-1"
              style={{ justifyContent: 'flex-start' }}
              textClassName="text-sm font-nunito font-semibold"
            >
              {feedTitle}
            </Button>
            <Ionicons
              name="chevron-forward-outline"
              size={14}
              color="#C2F590"
            />
          </View>
        </View>
        <Ionicons name="cloud-download-outline" size={24} color="#e7e9dd" />
        <MaterialCommunityIcons
          name="subtitles-outline"
          size={24}
          color="#e7e9dd"
        />
      </View>

      <TranscriptScrollView
        player={player}
        episodeUrl={episodeUrl}
        episodeId={Number(episodeId)}
        audioStatus={status}
        onShowWordDefinition={handleShowWordDefinition}
      />

      <View className="absolute bottom-10 left-0 right-0 px-4">
        <View className=" bg-mirai-bgDeep border border-mirai-borderDark rounded-3xl shadow-xl p-5">
          <AudioPlayer player={player} status={status} className="gap-4">
            {({ handlePlayPause, status }) => (
              <View className="flex-row justify-between items-center">
                <View className="flex-row gap-3">
                  {AUDIO_FUNCTION_BUTTON_COMPONENTS.map((button, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={getButtonFunctionByName({
                        name: button.name,
                        handlePlayPause,
                      })}
                      className="items-center "
                    >
                      <View
                        className={`rounded-[5px] p-1.5 items-center justify-center`}
                      >
                        {button.name === AudioFunctionName.PLAY && (
                          <Ionicons
                            name={status.playing ? 'pause' : 'play'}
                            color="white"
                            size={24}
                          />
                        )}
                        {button.name !== AudioFunctionName.PLAY && button.icon}
                      </View>
                      <Text className="text-text-soft text-sm font-bold">
                        {button.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View className="p-3 bg-surface-darkest rounded-xl">
                  <AntDesign name="audio" size={24} color="#C2F590" />
                </View>
              </View>
            )}
          </AudioPlayer>
        </View>
      </View>

      {wordDefinition && (
        <WordDefinitionModal
          visible={isWordModalVisible}
          word={wordDefinition.word}
          phonetic={wordDefinition.phonetic}
          translation={wordDefinition.translation}
          explanation={wordDefinition.explanation}
          partOfSpeech={wordDefinition.partOfSpeech}
          isLoading={isTranslatingWord}
          onClose={handleCloseWordModal}
          onPlayAudio={handlePlayWordAudio}
        />
      )}
    </View>
  );
};

export { TranscriptionScreen };
