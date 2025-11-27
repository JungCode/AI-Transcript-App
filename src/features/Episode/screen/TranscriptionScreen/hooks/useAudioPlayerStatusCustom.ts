import type { AudioPlayer } from 'expo-audio';
import { useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useState } from 'react';

const useAudioPlayerStatusCustom = (player: AudioPlayer, interval = 16) => {
  const defaultStatus = useAudioPlayerStatus(player);

  // Custom hook for more frequent updates (default 16ms ≈ 60fps)
  const [status, setStatus] = useState(defaultStatus);

  useEffect(() => {
    if (!player || !defaultStatus.playing) {
      setStatus(defaultStatus);
      return;
    }

    const timer = setInterval(() => {
      setStatus({
        ...defaultStatus,
        currentTime: player.currentTime,
      });
    }, interval);

    return () => clearInterval(timer);
  }, [player, defaultStatus.playing, interval]);

  return status;
};

export { useAudioPlayerStatusCustom };
