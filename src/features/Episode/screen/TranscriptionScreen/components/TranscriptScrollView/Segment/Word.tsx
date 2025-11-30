// Word.tsx
import type { AudioPlayer } from 'expo-audio';
import { memo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import type {
  TranscriptSegment,
  TranscriptWord,
} from '../../../constants/transcript';

interface IWordProps {
  word: TranscriptWord;
  isActive: boolean;
  player: AudioPlayer;
  segment: TranscriptSegment;
  isSegmentActive: boolean;
  onRequestTranslation?: () => void;
  onShowWordDefinition?: (
    word: TranscriptWord,
    segment: TranscriptSegment,
  ) => void;
}

const WordComponent = ({
  word,
  isActive,
  player,
  segment,
  isSegmentActive,
  onRequestTranslation,
  onShowWordDefinition,
}: IWordProps) => {
  const onPress = useCallback(async () => {
    // Nếu segment đang được đọc, hiển thị bản dịch thay vì seek
    if (isSegmentActive) {
      player.pause();
      if (segment.translated_sentence && onShowWordDefinition) {
        // Hiển thị modal định nghĩa từ
        onShowWordDefinition(word, segment);
      } else {
        // Nếu chưa có bản dịch, yêu cầu dịch
        if (onRequestTranslation) {
          onRequestTranslation();
          Toast.show({
            type: 'info',
            text1: 'Translating...',
            text2: 'Please wait for translation',
            visibilityTime: 2000,
          });
        }
      }
    } else {
      // Nếu segment không active, seek như bình thường
      await player.seekTo(word.start + 0.01);
    }
  }, [
    player,
    word,
    word.start,
    isSegmentActive,
    segment,
    segment.translated_sentence,
    onRequestTranslation,
    onShowWordDefinition,
  ]);

  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.text, isActive ? styles.active : styles.inactive]}>
        {word.word}
      </Text>
    </TouchableOpacity>
  );
};

const Word = memo(
  WordComponent,
  (prev, next) =>
    prev.isActive === next.isActive &&
    prev.word.start === next.word.start &&
    prev.word.word === next.word.word &&
    prev.isSegmentActive === next.isSegmentActive &&
    prev.segment.id === next.segment.id &&
    prev.segment.translated_sentence === next.segment.translated_sentence,
);

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontFamily: 'nunito',
    fontWeight: 'bold',
    fontSize: 18,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  active: {
    borderColor: '#32CD32',
  },
  inactive: {
    borderColor: 'transparent',
  },
});

export { Word };
