import { DurationFormat, formatDuration } from '@/shared/helpers/format';
import Slider from '@react-native-community/slider';
import type { AudioStatus, AudioPlayer as ExpoAudioPlayer } from 'expo-audio';
import { useState } from 'react';
import { Text, View } from 'react-native';

interface IRenderProps {
  handlePlayPause: () => void;
  status: AudioStatus;
}

interface IAudioPlayerProps {
  className?: string;
  player: ExpoAudioPlayer;
  status: AudioStatus;
  children?: (props: IRenderProps) => React.ReactNode;
}

const AudioPlayer = ({
  className,
  player,
  status,
  children,
}: IAudioPlayerProps) => {
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);

  const handlePlayPause = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleSliderValueChange = (value: number) => {
    setIsSeeking(true);
    setSeekPosition(value);
  };

  const handleSliderSlidingComplete = async (value: number) => {
    await player.seekTo(value);
    setIsSeeking(false);
  };

  const displayTime = isSeeking ? seekPosition : status.currentTime || 0;

  return (
    <View className={className ?? ''}>
      {/* Slider and Time */}
      <View className="flex-row items-center gap-3">
        <Text className="text-text-muted text-xs font-nunito">
          {formatDuration(displayTime, DurationFormat.Compact)}
        </Text>
        <Slider
          style={{ height: 40, flex: 1 }}
          minimumValue={0}
          maximumValue={status.duration || 0}
          value={displayTime}
          onValueChange={handleSliderValueChange}
          onSlidingComplete={handleSliderSlidingComplete}
          minimumTrackTintColor="#C2F590"
          maximumTrackTintColor="#979989"
          thumbTintColor="#C2F590"
          disabled={!status.duration}
        />
        <Text className="text-text-muted text-xs font-nunito">
          {formatDuration(status.duration || 0, DurationFormat.Compact)}
        </Text>
      </View>
      {children?.({ handlePlayPause, status })}
    </View>
  );
};

export { AudioPlayer };
