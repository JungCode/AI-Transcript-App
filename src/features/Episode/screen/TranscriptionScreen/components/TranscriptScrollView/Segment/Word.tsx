// Word.tsx
import type { AudioPlayer } from 'expo-audio';
import { memo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { TranscriptWord } from '../../../constants/transcript';

interface IWordProps {
  word: TranscriptWord;
  isActive: boolean;
  player: AudioPlayer;
}


const WordComponent = ({ word, isActive, player }: IWordProps) => {
  const onPress = useCallback(async () => {
    await player.seekTo(word.start + 0.01);
  }, [player, word.start]);

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
    prev.word.word === next.word.word,
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
