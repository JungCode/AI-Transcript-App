import { BottomSheet } from '@/core/components/BottomSheet';

import { Ionicons } from '@expo/vector-icons';
import type { AudioPlayer, AudioStatus } from 'expo-audio';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type {
  TranscriptSegment,
  TranscriptWord,
} from '../../constants/transcript';
import { Segment } from '../TranscriptScrollView/Segment';
import ShadowingComponent from './components/ShadowingComponent';
import {
  PLAY_FUNCTION_BUTTON_COMPONENTS,
  SHADOWING_FUNCTION_BUTTON_COMPONENTS,
  ShadowingFunctionName,
} from './constants';

interface IShadowingBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  episodeId: number;
  player: AudioPlayer;
  status: AudioStatus;
  selectedSegment: TranscriptSegment | null;
  segments: TranscriptSegment[];
  onShowWordDefinition?: (
    word: TranscriptWord,
    segment: TranscriptSegment,
  ) => void;
  onSegmentChange?: (segment: TranscriptSegment | null) => void;
}

const ShadowingBottomSheet = ({
  visible,
  onClose,
  episodeId,
  player,
  status,
  selectedSegment,
  segments,
  onShowWordDefinition,
  onSegmentChange,
}: IShadowingBottomSheetProps) => {
  const [isAutoEchoActive, setIsAutoEchoActive] = useState(false);

  const handleAutoEchoToggle = () => {
    if (!selectedSegment) return;
    void player.seekTo(selectedSegment.start);
    player.play();

    setIsAutoEchoActive(prev => !prev);
  };

  const handlePlayPause = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleClose = () => {
    setIsAutoEchoActive(false);
    onClose();
  };
  // Seek to segment start when opening
  useEffect(() => {
    if (selectedSegment === null || !visible) return;

    if (status.duration > selectedSegment?.end) {
      void player.seekTo(selectedSegment?.start ?? 0);
    }
  }, [selectedSegment, player, visible]);

  // Loop the segment continuously
  useEffect(() => {
    if (!visible || !selectedSegment || !status.playing || isAutoEchoActive)
      return;

    const currentTime = status.currentTime;
    const segmentEnd = selectedSegment.end;
    const segmentStart = selectedSegment.start;

    // When current time reaches or passes the segment end, loop back to start
    if (currentTime >= segmentEnd) {
      void player.seekTo(segmentStart);
    }
  }, [status.currentTime, status.playing, selectedSegment, visible, player]);

  return (
    <BottomSheet
      visible={visible}
      isHeightAuto={true}
      onClose={handleClose}
      className="bg-mirai-bgDeep rounded-3xl p-5"
    >
      <View className="p-5 bg-mirai-black rounded-3xl h-auto">
        <Segment
          segment={selectedSegment!}
          player={player}
          audioStatus={status}
          onShowWordDefinition={onShowWordDefinition}
        />

        <View className="my-6 flex-row justify-center items-center gap-10">
          {isAutoEchoActive ? (
            // ⭐ THÊM: Component khác khi Auto Echo active
            <ShadowingComponent
              player={player}
              status={status}
              selectedSegment={selectedSegment}
              segments={segments}
              visible={isAutoEchoActive}
              onSegmentChange={onSegmentChange}
            />
          ) : (
            // Component ban đầu
            <>
              {PLAY_FUNCTION_BUTTON_COMPONENTS.map((button, index) => (
                <TouchableOpacity key={index} onPress={handlePlayPause}>
                  {button.name === ShadowingFunctionName.PLAY && (
                    <Ionicons
                      name={status.playing ? 'pause' : 'play'}
                      color="white"
                      size={20}
                    />
                  )}
                  {button.name !== ShadowingFunctionName.PLAY && button.icon}
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </View>
      <View className="justify-start flex-row gap-10">
        {SHADOWING_FUNCTION_BUTTON_COMPONENTS.map((button, index) => (
          <TouchableOpacity
            key={index}
            className="py-9 items-center gap-2"
            onPress={
              button.name === ShadowingFunctionName.AUTO_ECHO
                ? handleAutoEchoToggle
                : undefined
            }
          >
            {button.icon}

            <Text className="text-text-soft text-sm font-bold">
              {button.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </BottomSheet>
  );
};

export default ShadowingBottomSheet;
