// Word.tsx
import type { AudioPlayer } from 'expo-audio';
import { Text, TouchableOpacity } from 'react-native';
import type { TranscriptWord } from '../../constants/transcript';

interface IWordProps {
  word: TranscriptWord;
  isActive: boolean;
  player: AudioPlayer;
}

export const Word = ({ word, isActive, player }: IWordProps) => {
  return (
    <TouchableOpacity onPress={() => player.seekTo(word.start + 0.01)}>
      <Text
        className={`text-white font-nunito font-bold text-lg border-2 ${
          isActive ? 'border-success' : 'border-transparent'
        } rounded-lg px-1`}
      >
        {word.word}
      </Text>
    </TouchableOpacity>
  );
};
