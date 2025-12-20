import { useGetSavedWords } from '@/shared/api/ai-translatorSchemas';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FlashcardView from './components/FlashcardView';

interface IVocabularyViewProps {
  visible: boolean;
  onClose: () => void;
  episodeId: number;
}

interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  translation: string;
}

// Mock data - replace with real data later

const VocabularyView = ({
  visible,
  onClose,
  episodeId,
}: IVocabularyViewProps) => {
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'flashcard'>(
    'vocabulary',
  );

  const { data: savedWordsData } = useGetSavedWords(
    { episode_id: episodeId },
    {
      query: {
        enabled: !!episodeId && visible, // Chỉ fetch khi drawer mở
      },
    },
  );

  const words: VocabularyWord[] = (savedWordsData ?? []).map(item => ({
    id: String(item.id),
    word: item.word,
    phonetic: item.phonetic || '',
    translation: item.translated_word,
  }));

  const handleDeleteWord = (id: string) => {
    console.log('Delete word:', id);
  };

  const handlePlayAudio = (word: string) => {
    console.log('Play audio:', word);
  };

  const renderWordItem = ({
    item,
    index,
  }: {
    item: VocabularyWord;
    index: number;
  }) => (
    <View className="bg-mirai-bgDarker rounded-lg p-4 mb-3 flex-row items-center justify-between">
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-white text-lg font-nunito font-semibold">
            {item.word}
          </Text>
          <Text className="text-text-soft text-sm font-nunito">
            {item.phonetic}
          </Text>
        </View>
        <Text className="text-text-soft text-base font-nunito mt-1">
          {item.translation}
        </Text>
      </View>

      <View className="flex-row items-center gap-3">
        <TouchableOpacity onPress={() => handlePlayAudio(item.word)}>
          <Ionicons name="volume-high" size={24} color="#cbd8e1" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDeleteWord(item.id)}>
          <MaterialIcons name="delete-outline" size={24} color="#cbd8e1" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!words.length) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-text-soft text-base font-nunito text-center">
          No saved words yet. Start saving words to see them here!
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-mirai-bgDeep">
      {/* Tabs */}
      <View className="flex-row gap-3 m-2">
        <Pressable
          onPress={() => setActiveTab('vocabulary')}
          className={`flex-1 py-3 rounded-lg ${
            activeTab === 'vocabulary' ? 'bg-mirai-lime' : 'bg-mirai-bgDarker'
          }`}
        >
          <Text
            className={`text-center font-nunito font-semibold ${
              activeTab === 'vocabulary' ? 'text-black' : 'text-text-soft'
            }`}
          >
            Vocabulary
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('flashcard')}
          className={`flex-1 py-3 rounded-lg ${
            activeTab === 'flashcard' ? 'bg-mirai-lime' : 'bg-mirai-bgDarker'
          }`}
        >
          <Text
            className={`text-center font-nunito font-semibold ${
              activeTab === 'flashcard' ? 'text-black' : 'text-text-soft'
            }`}
          >
            Flashcard
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      {activeTab === 'vocabulary' ? (
        <FlatList
          data={words}
          renderItem={renderWordItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlashcardView words={words} />
      )}
    </View>
  );
};

export default VocabularyView;
