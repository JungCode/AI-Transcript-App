import type { AudioPlayer, AudioStatus } from 'expo-audio';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { TranscriptSegment } from '../../../constants/transcript';

interface IShadowingComponentProps {
  player: AudioPlayer;
  status: AudioStatus;
  selectedSegment: TranscriptSegment | null;
  visible: boolean;
}

enum EchoState {
  LISTEN = 'listen',
  ECHO = 'echo',
  SPEAK = 'speak',
  PLAY = 'play',
}

const ShadowingComponent = ({
  player,
  status,
  selectedSegment,
  visible,
}: IShadowingComponentProps) => {
  const [echoTimer, setEchoTimer] = useState(0);
  const [echoState, setEchoState] = useState<EchoState>(EchoState.LISTEN);

  // Progress animations for each state
  const listenProgress = useSharedValue(0);
  const echoProgress = useSharedValue(0);
  const speakProgress = useSharedValue(0);
  const playProgress = useSharedValue(0);

  // Flex animations for width changes
  const listenFlex = useSharedValue(1);
  const echoFlex = useSharedValue(1);
  const speakFlex = useSharedValue(1);
  const playFlex = useSharedValue(1);

  useEffect(() => {
    if (!selectedSegment || !visible) return;

    const currentTime = status.currentTime;
    const segmentEnd = selectedSegment.end;
    const segmentStart = selectedSegment.start;
    const segmentDuration = segmentEnd - segmentStart;

    switch (echoState) {
      case EchoState.LISTEN:
        // Update progress during LISTEN
        if (
          status.playing &&
          currentTime >= segmentStart &&
          currentTime < segmentEnd
        ) {
          const progress = (currentTime - segmentStart) / segmentDuration;
          listenProgress.value = Math.min(progress, 1);
        }

        if (currentTime >= segmentEnd) {
          void player.pause();
          listenProgress.value = 1;
          // Shrink LISTEN, expand ECHO
          listenFlex.value = withTiming(1, { duration: 300 });
          echoFlex.value = withTiming(1.5, { duration: 300 });
          setEchoState(EchoState.ECHO);
          setEchoTimer(0);
        }
        break;

      case EchoState.ECHO:
        if (echoTimer === 0) {
          // Animate progress over segmentDuration
          echoProgress.value = withTiming(1, {
            duration: segmentDuration * 1000,
          });

          setTimeout(() => {
            // Shrink ECHO, expand SPEAK
            echoFlex.value = withTiming(1, { duration: 300 });
            speakFlex.value = withTiming(1.5, { duration: 300 });
            setEchoTimer(segmentDuration);
            setEchoState(EchoState.SPEAK);
          }, segmentDuration * 1000);
        }
        break;

      case EchoState.SPEAK:
        if (echoTimer > 0) {
          // Animate progress over segmentDuration
          speakProgress.value = withTiming(1, {
            duration: segmentDuration * 1000,
          });

          setTimeout(() => {
            // Shrink SPEAK, expand PLAY
            speakFlex.value = withTiming(1, { duration: 300 });
            playFlex.value = withTiming(1.5, { duration: 300 });
            setEchoState(EchoState.PLAY);
            setEchoTimer(0);
          }, segmentDuration * 1000);
        }
        break;

      case EchoState.PLAY:
        if (echoTimer === 0) {
          // Animate progress over segmentDuration
          playProgress.value = withTiming(1, {
            duration: segmentDuration * 1000,
          });

          setTimeout(() => {
            void player.seekTo(segmentStart);
            void player.play();
            // Reset all progress
            listenProgress.value = 0;
            echoProgress.value = 0;
            speakProgress.value = 0;
            playProgress.value = 0;
          }, segmentDuration * 1000);
          setEchoTimer(-1);
        }
        break;
    }
  }, [
    visible,
    echoState,
    status.currentTime,
    status.playing,
    selectedSegment,
    player,
    echoTimer,
  ]);

  // Reset when visible changes
  useEffect(() => {
    if (!visible) {
      listenProgress.value = 0;
      echoProgress.value = 0;
      speakProgress.value = 0;
      playProgress.value = 0;
      listenFlex.value = 1;
      echoFlex.value = 1;
      speakFlex.value = 1;
      playFlex.value = 1;
      setEchoState(EchoState.LISTEN);
      setEchoTimer(0);
    } else {
      // Khi mở, expand LISTEN ngay
      listenFlex.value = withTiming(1.5, { duration: 300 });
    }
  }, [visible]);

  // Animated styles for progress bars
  const listenProgressStyle = useAnimatedStyle(() => ({
    width: `${listenProgress.value * 100}%`,
  }));

  const echoProgressStyle = useAnimatedStyle(() => ({
    width: `${echoProgress.value * 100}%`,
  }));

  const speakProgressStyle = useAnimatedStyle(() => ({
    width: `${speakProgress.value * 100}%`,
  }));

  const playProgressStyle = useAnimatedStyle(() => ({
    width: `${playProgress.value * 100}%`,
  }));

  // ⭐ Animated styles cho flex (width của box)
  const listenFlexStyle = useAnimatedStyle(() => ({
    flex: listenFlex.value,
  }));

  const echoFlexStyle = useAnimatedStyle(() => ({
    flex: echoFlex.value,
  }));

  const speakFlexStyle = useAnimatedStyle(() => ({
    flex: speakFlex.value,
  }));

  const playFlexStyle = useAnimatedStyle(() => ({
    flex: playFlex.value,
  }));

  const states = [
    {
      name: 'Listen',
      state: EchoState.LISTEN,
      progress: listenProgressStyle,
      flex: listenFlexStyle, // ⭐ Thêm flex style
    },
    {
      name: 'Echo',
      state: EchoState.ECHO,
      progress: echoProgressStyle,
      flex: echoFlexStyle,
    },
    {
      name: 'Speak',
      state: EchoState.SPEAK,
      progress: speakProgressStyle,
      flex: speakFlexStyle,
    },
    {
      name: 'Play',
      state: EchoState.PLAY,
      progress: playProgressStyle,
      flex: playFlexStyle,
    },
  ];

  return (
    <View className="w-full gap-4 ">
      {/* 4 squares in a row */}
      <View className="flex-row gap-3 justify-center">
        {states.map((item, index) => (
          <Animated.View
            key={index}
            style={item.flex}
            className={`h-16 rounded-xl overflow-hidden ${
              echoState === item.state
                ? 'bg-mirai-bgDarker border-2'
                : 'bg-mirai-bgDarker border'
            }`}
          >
            {/* Progress fill */}
            <Animated.View
              style={[item.progress]}
              className="h-full bg-mirai-greenDark absolute left-0 top-0"
            />

            {/* Label */}
            <View className="h-full justify-center items-center relative z-10">
              <Text className={`font-bold text-base text-white`}>
                {item.name}
              </Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

export default ShadowingComponent;
