import type { TranscriptSegment } from '@/features/Episode/screen/TranscriptionScreen/constants/transcript';
import type { AudioPlayer, AudioStatus } from 'expo-audio';
import { Text, TouchableOpacity, View } from 'react-native';
import { Word } from './Word';

interface ISegmentProps {
  segment: TranscriptSegment;
  audioStatus: AudioStatus;
  player: AudioPlayer;
}

const EXPAND_TIME = 0.2;

const Segment = ({ segment, audioStatus, player }: ISegmentProps) => {
  const currentTime = audioStatus.currentTime;
  const isActive =
    currentTime >= segment.start - EXPAND_TIME &&
    currentTime <= segment.end + EXPAND_TIME;

  return (
    <View
      className={`${
        isActive ? 'bg-surface-deep' : ''
      } rounded-3xl p-4 gap-2 mb-4`}
    >
      <TouchableOpacity
        onPress={() => {
          void player.seekTo(segment.start);
        }}
      >
        <View className="flex-row flex-wrap">
          {segment.words.map((word, index: number) => {
            let wordActive = false;

            if (isActive) {
              wordActive = currentTime >= word.start && currentTime <= word.end;
            }

            return (
              <Word
                player={player}
                key={index}
                word={word}
                isActive={wordActive}
              />
            );
          })}
        </View>
        <View className="px-3">
          <Text className="text-text-muted text-base font-nunito font-semibold">
            {segment.translated_sentence}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export { Segment };
