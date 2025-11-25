import type { AudioPlayer} from 'expo-audio';
import { useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useState } from 'react';

const useAudioPlayerStatusCustom = (player: AudioPlayer) => {
  const defaultStatus = useAudioPlayerStatus(player);

  // Custom hook for more frequent updates (every 100ms instead of 500ms)
  const [status, setStatus] = useState(defaultStatus);

  useEffect(() => {
    if (!player || !defaultStatus.playing) {
      setStatus(defaultStatus);
      return;
    }

    const interval = setInterval(() => {
      setStatus({
        ...defaultStatus,
        currentTime: player.currentTime,
      });
    }, 50);

    return () => clearInterval(interval);
  }, [player, defaultStatus.playing, defaultStatus]);

  return status;
};

export { useAudioPlayerStatusCustom };
