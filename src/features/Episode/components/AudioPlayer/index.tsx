import Slider from '@react-native-community/slider';
import type { AudioStatus} from 'expo-audio';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useState } from 'react';
import { Text, View } from 'react-native';

interface IRenderChildrenProps {
  handlePlayPause: () => void;
  status: AudioStatus;
}

interface IAudioPlayerProps {
  audioUrl: string;
  className?: string;
  children?: (props: IRenderChildrenProps) => React.ReactNode;
}

const AudioPlayer = ({ audioUrl, className, children }: IAudioPlayerProps) => {
  const player = useAudioPlayer(audioUrl);
  const status = useAudioPlayerStatus(player);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const displayTime = isSeeking ? seekPosition : status.currentTime || 0;

  return (
    <View className={className ?? ''}>
      {/* Play/Pause Button */}
      {/* <TouchableOpacity
          onPress={handlePlayPause}
          disabled={!status.duration}
          className="w-12 h-12 rounded-full bg-primary items-center justify-center"
          activeOpacity={0.7}
        >
          {!status.duration ? (
            <ActivityIndicator size="small" color="#13140e" />
          ) : (
            <Ionicons
              name={status.playing ? 'pause' : 'play'}
              size={24}
              color="#13140e"
            />
          )}
        </TouchableOpacity> */}

      {/* Slider and Time */}
      <View className="flex-row items-center gap-3">
        <Text className="text-text-muted text-xs font-nunito">
          {formatTime(displayTime)}
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
          {formatTime(status.duration || 0)}
        </Text>
      </View>
      {children?.({ handlePlayPause, status })}
    </View>
  );
};

export { AudioPlayer };
