import type { AudioPlayer, AudioStatus } from 'expo-audio';
import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
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
  segments: TranscriptSegment[];
  visible: boolean;
  onSegmentChange?: (segment: TranscriptSegment | null) => void;
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
  segments,
  visible,
  onSegmentChange,
}: IShadowingComponentProps) => {
  const [echoTimer, setEchoTimer] = useState(0);
  const [echoState, setEchoState] = useState<EchoState>(EchoState.LISTEN);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [isRecording, setIsRecording] = useState(false);

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

  const recordingRef = useRef<Audio.Recording | null>(null);

  // const addTimeout = (cb: () => void, delay: number) => {
  //   const t = setTimeout(cb, delay);
  //   timeoutRefs.current.push(t);
  //   return t;
  // };

  const getSegmentDurationMs = () => {
    if (!selectedSegment) return 3000;
    const ms = (selectedSegment.end - selectedSegment.start) * 1000;
    return ms > 0 ? ms : 3000;
  };

  const startRecording = async (durationMs?: number) => {
    try {
      // chặn double start
      if (recordingRef.current) return;

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Reset old recording state when starting a new one
      setRecordingUri(null);
      setRecordingDuration(0);

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );

      recordingRef.current = newRecording;
      setRecording(newRecording);
      setIsRecording(true);

      const animDuration = durationMs ?? getSegmentDurationMs();
      speakProgress.value = 0;
      speakProgress.value = withTiming(1, { duration: animDuration });
    } catch (error) {
      console.error('Failed to start recording', error);
      recordingRef.current = null;
      setRecording(null);
    }
  };

  const stopRecording = async () => {
    const rec = recordingRef.current;
    if (!rec) return;

    try {
      // Lấy thông tin recording trước khi stop
      const status = await rec.getStatusAsync();
      const durationMs = status.isRecording ? status.durationMillis : 0;

      await rec.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      const uri = rec.getURI();
      if (!uri) {
        return;
      }

      setRecordingUri(uri);
      setRecordingDuration(durationMs);
      setRecording(null);
      setIsRecording(false);
      speakProgress.value = withTiming(1, { duration: 150 });
      speakFlex.value = withTiming(1, { duration: 300 });
      playFlex.value = withTiming(1.5, { duration: 300 });
      setEchoState(EchoState.PLAY);
      setEchoTimer(0);
    } catch (err) {
      console.error('Failed to stop recording', err);
    } finally {
      recordingRef.current = null;
    }
  };

  const playRecording = async () => {
    if (!recordingUri) {
      console.log('⚠️ No recording to play');
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      await sound.playAsync();
    } catch (err) {
      console.error('Failed to play recording', err);
    }
  };

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
  };

  const addTimeout = (callback: () => void, delay: number) => {
    const timeout = setTimeout(callback, delay);
    timeoutRefs.current.push(timeout);
    return timeout;
  };

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
          setEchoTimer(-1);
          // Animate progress over segmentDuration
          echoProgress.value = withTiming(1, {
            duration: segmentDuration * 1000,
          });

          addTimeout(() => {
            // Shrink ECHO, expand SPEAK
            echoFlex.value = withTiming(1, { duration: 300 });
            speakFlex.value = withTiming(1.5, { duration: 300 });
            setEchoTimer(segmentDuration);
            setEchoState(EchoState.SPEAK);
          }, segmentDuration * 1000);
        }
        break;

      case EchoState.SPEAK:
        // if (echoTimer > 0) {
        //   // Animate progress over segmentDuration
        //   speakProgress.value = withTiming(1, {
        //     duration: recordingDuration,
        //   });
        //   setEchoTimer(-1);

        //   addTimeout(async () => {
        //     if (!isRecording) {
        //       // Shrink SPEAK, expand PLAY
        //       speakFlex.value = withTiming(1, { duration: 300 });
        //       playFlex.value = withTiming(1.5, { duration: 300 });
        //       setEchoState(EchoState.PLAY);
        //       setEchoTimer(0);
        //     }
        //   }, segmentDuration * 1000);
        // }
        break;

      case EchoState.PLAY:
        if (echoTimer === 0) {
          void playRecording();
          // ⭐ Sử dụng độ dài recording thay vì segment
          const playDuration = recordingDuration || segmentDuration * 1000;
          playProgress.value = withTiming(1, {
            duration: playDuration,
          });
          setEchoTimer(-1);

          addTimeout(() => {
            // Tìm segment tiếp theo
            const currentIndex = segments.findIndex(
              seg => seg.start === selectedSegment?.start,
            );
            const nextSegment =
              currentIndex >= 0 && currentIndex < segments.length - 1
                ? segments[currentIndex + 1]
                : null;

            if (nextSegment && onSegmentChange) {
              // Chuyển sang segment mới
              onSegmentChange(nextSegment);
              void player.seekTo(nextSegment.start);
              void player.play();
            } else {
              // Không còn segment tiếp theo, quay lại segment hiện tại
              void player.seekTo(segmentStart);
              void player.play();
            }

            // Reset all progress
            listenProgress.value = 0;
            echoProgress.value = 0;
            speakProgress.value = 0;
            playProgress.value = 0;
            listenFlex.value = withTiming(1.5, { duration: 300 });
            echoFlex.value = 1;
            speakFlex.value = 1;
            playFlex.value = 1;
            setRecordingUri(null);
            setRecordingDuration(0);
            setEchoState(EchoState.LISTEN);
            setEchoTimer(0);
          }, playDuration);
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
      clearAllTimeouts();
      void stopRecording();
      setRecordingUri(null);
      if (recording) {
        void stopRecording();
      }
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

  const stateText = {
    [EchoState.LISTEN]: 'Listen to the audio',
    [EchoState.ECHO]: 'Record and understand the content just heard',
    [EchoState.SPEAK]: 'Try to say this sentence',
    [EchoState.PLAY]: 'Listen to and compare your voice',
  };

  return (
    <View className="w-full gap-4 items-center">
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
      <Text className="text-text-lime text-sm font-nunito">
        {stateText[echoState]}
      </Text>
      {echoState === EchoState.SPEAK ? (
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          {/* Nút Record/Stop */}
          <Pressable
            onPress={() =>
              isRecording ? void stopRecording() : void startRecording()
            }
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isRecording ? '#ff3b30' : '#34c759', // đỏ khi ghi
            }}
          >
            <Text style={{ color: 'white', fontWeight: '700' }}>
              {isRecording ? 'STOP' : 'REC'}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

export default ShadowingComponent;
