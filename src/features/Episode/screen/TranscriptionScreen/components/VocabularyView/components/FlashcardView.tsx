import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  translation: string;
  detail?: string;
}

interface FlashcardViewProps {
  words: VocabularyWord[];
}

const FlashcardView = ({ words }: FlashcardViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const rotation = useSharedValue(0);

  const currentWord = words[currentIndex];

  useEffect(() => {
    rotation.value = withTiming(isFlipped ? 180 : 0, { duration: 300 });
  }, [isFlipped]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotation.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotation.value, [0, 180], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  if (!currentWord) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-text-soft text-base font-nunito text-center">
          No saved words for flashcard practice
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-4">
      {/* Progress Indicator */}
      <View className="py-4 items-center">
        <Text className="text-text-soft text-sm font-nunito font-semibold">
          {currentIndex + 1} / {words.length}
        </Text>
      </View>

      {/* Flashcard */}
      <Pressable onPress={handleFlip} className="flex-1 justify-center">
        <View style={{ height: 300, position: 'relative' }}>
          {/* Front Side */}
          <Animated.View
            style={[
              frontAnimatedStyle,
              {
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#1a1a1a',
                borderRadius: 16,
                padding: 24,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <Text className="text-white text-3xl font-nunito font-bold mb-3">
              {currentWord.word}
            </Text>
            {currentWord.phonetic && (
              <Text className="text-text-soft text-lg font-nunito">
                {currentWord.phonetic}
              </Text>
            )}
            <Text className="text-mirai-lime text-sm font-nunito mt-6">
              Tap to flip
            </Text>
          </Animated.View>

          {/* Back Side */}
          <Animated.View
            style={[
              backAnimatedStyle,
              {
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#1a1a1a',
                borderRadius: 16,
                padding: 24,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <Text className="text-mirai-lime text-2xl font-nunito font-bold mb-3">
              {currentWord.translation}
            </Text>
            {currentWord.detail && (
              <Text className="text-text-soft text-base font-nunito text-center mt-4">
                {currentWord.detail}
              </Text>
            )}
          </Animated.View>
        </View>
      </Pressable>

      {/* Navigation Buttons */}
      <View className="flex-row justify-between items-center py-6 gap-4">
        <Pressable
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          className={`flex-1 py-4 rounded-lg flex-row items-center justify-center gap-2 ${
            currentIndex === 0
              ? 'bg-mirai-bgDarker opacity-50'
              : 'bg-mirai-bgDarker'
          }`}
        >
          <Ionicons name="chevron-back" size={20} color="#cbd8e1" />
          <Text className="text-white font-nunito font-semibold">Previous</Text>
        </Pressable>

        <Pressable
          onPress={handleNext}
          disabled={currentIndex === words.length - 1}
          className={`flex-1 py-4 rounded-lg flex-row items-center justify-center gap-2 ${
            currentIndex === words.length - 1
              ? 'bg-mirai-bgDarker opacity-50'
              : 'bg-mirai-lime'
          }`}
        >
          <Text
            className={`font-nunito font-semibold ${
              currentIndex === words.length - 1
                ? 'text-text-soft'
                : 'text-black'
            }`}
          >
            Next
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={currentIndex === words.length - 1 ? '#cbd8e1' : '#000'}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default FlashcardView;
