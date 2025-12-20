import { Button } from '@/core/components';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAudioPlayer } from 'expo-audio';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AudioPlayer } from './components/AudioPlayer';
import ExplainBottomSheet from './components/ExplainBottomSheet';
import ShadowingBottomSheet from './components/ShadowingBottomSheet';
import { TranscriptScrollView } from './components/TranscriptScrollView';
import VocabularyView from './components/VocabularyView';
import { WordDefinitionModal } from './components/WordDefinitionModal';
import {
  AUDIO_FUNCTION_BUTTON_COMPONENTS,
  AudioFunctionName,
} from './constants';
import type { TranscriptSegment, TranscriptWord } from './constants/transcript';
import { getButtonFunctionByName } from './helpers/AudioButton';
import { useAudioPlayerStatusCustom } from './hooks/useAudioPlayerStatusCustom';
import { useTranscriptManagement } from './hooks/useTranscriptManagement';

const TranscriptionScreen = () => {
  const [isWordModalVisible, setIsWordModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState<TranscriptWord | null>(null);
  const [isExplainBottomSheetVisible, setIsExplainBottomSheetVisible] =
    useState(false);
  const [isShadowingBottomSheetVisible, setIsShadowingBottomSheetVisible] =
    useState(false);
  //const [isVocabularyDrawerVisible, setIsVocabularyDrawerVisible] = useState(false);

  const [isVocabularyViewVisible, setIsVocabularyViewVisible] = useState(false);

  const [selectedSegment, setSelectedSegment] =
    useState<TranscriptSegment | null>(null);

  const { episodeUrl, episodeTitle, feedTitle, episodeId } =
    useLocalSearchParams<{
      episodeId: string;
      episodeUrl: string;
      episodeTitle: string;
      feedTitle?: string;
    }>();

  const player = useAudioPlayer(episodeUrl);
  const status = useAudioPlayerStatusCustom(player);

  const handleShowWordDefinition = (
    word: TranscriptWord,
    segment: TranscriptSegment,
  ) => {
    setSelectedWord(word);
    setSelectedSegment(segment);
    setIsWordModalVisible(true);
  };

  const handleCloseWordModal = () => {
    setIsWordModalVisible(false);
    setSelectedWord(null);
    setSelectedSegment(null);
  };

  const handleOpenExplainBottomSheet = () => {
    player.pause();
    const currentTime = player.currentTime;
    const currentSegment = segments.find(
      seg => currentTime >= seg.start && currentTime <= seg.end,
    );
    setSelectedSegment(currentSegment ?? null);
    setIsExplainBottomSheetVisible(true);
  };

  const handleOpenShadowingBottomSheet = () => {
    const currentTime = player.currentTime;
    const currentSegment = segments.find(
      seg => currentTime >= seg.start && currentTime <= seg.end,
    );
    setSelectedSegment(currentSegment ?? null);
    setIsShadowingBottomSheetVisible(true);
  };

  // const handleOpenVocabularyDrawer = () => {
  //   setIsVocabularyDrawerVisible(true);
  // };

  const handleOpenVocabularyView = () => {
    setIsVocabularyViewVisible(prev => !prev);
    if (!isVocabularyViewVisible) {
      player.pause();
    }
  };

  const { transcriptData, segments, setSegments, isLoading, refetch } =
    useTranscriptManagement({ episodeId: Number(episodeId) });

  useEffect(() => {
    if (!player) return;

    player.play();
  }, [player]);

  return (
    <View className="flex-1 bg-surface px-4">
      <View className="flex-row items-center justify-between gap-5">
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/dashboard/podcast');
            }
          }}
        >
          <Ionicons name="chevron-back-outline" size={28} color="#e7e9dd" />
        </TouchableOpacity>
        <View className="items-start flex-1">
          <Text
            numberOfLines={1}
            className="text-text-soft font-nunito font-bold text-base"
          >
            {episodeTitle}
          </Text>
          <View className="flex-row gap-1 w-full items-center justify-between">
            <Button
              numberOfLines={1}
              type="ghost"
              className="text-white flex-1"
              style={{ justifyContent: 'flex-start' }}
              textClassName="text-sm font-nunito font-semibold"
            >
              {feedTitle}
            </Button>
            <Ionicons
              name="chevron-forward-outline"
              size={14}
              color="#C2F590"
            />
          </View>
        </View>
        <TouchableOpacity onPress={() => setIsVocabularyViewVisible(false)}>
          <Ionicons name="document-text-outline" size={24} color="#e7e9dd" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenVocabularyView}>
          <SimpleLineIcons name="notebook" size={22} color="#e7e9dd" />
        </TouchableOpacity>
      </View>

      {isVocabularyViewVisible ? (
        <VocabularyView
          onClose={() => setIsVocabularyViewVisible(false)}
          visible={isVocabularyViewVisible}
          episodeId={Number(episodeId)}
        ></VocabularyView>
      ) : (
        <TranscriptScrollView
          isLoading={isLoading}
          refetch={refetch}
          transcriptData={transcriptData}
          segments={segments}
          setSegments={setSegments}
          player={player}
          episodeUrl={episodeUrl}
          episodeId={Number(episodeId)}
          audioStatus={status}
          onShowWordDefinition={handleShowWordDefinition}
        />
      )}

      {!isVocabularyViewVisible && (
        <View className="absolute bottom-10 left-0 right-0 px-4">
          <View className=" bg-mirai-bgDeep border border-mirai-borderDark rounded-3xl shadow-xl p-5">
            <AudioPlayer player={player} status={status} className="gap-4">
              {({ handlePlayPause, status }) => (
                <View className="flex-row justify-between items-center">
                  <View className="flex-row gap-3">
                    {AUDIO_FUNCTION_BUTTON_COMPONENTS.map((button, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={getButtonFunctionByName({
                          name: button.name,
                          handlePlayPause,
                          onExplainPress: handleOpenExplainBottomSheet,
                        })}
                        className="items-center "
                      >
                        <View
                          className={`rounded-[5px] p-1.5 items-center justify-center`}
                        >
                          {button.name === AudioFunctionName.PLAY && (
                            <Ionicons
                              name={status.playing ? 'pause' : 'play'}
                              color="white"
                              size={24}
                            />
                          )}
                          {button.name !== AudioFunctionName.PLAY &&
                            button.icon}
                        </View>
                        <Text className="text-text-soft text-sm font-bold">
                          {button.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity
                    className="p-3 bg-surface-darkest rounded-xl"
                    onPress={handleOpenShadowingBottomSheet}
                  >
                    <AntDesign name="audio" size={24} color="#C2F590" />
                  </TouchableOpacity>
                </View>
              )}
            </AudioPlayer>
          </View>
        </View>
      )}

      {/* Explain Bottom Sheet */}
      <ExplainBottomSheet
        selectedText={selectedSegment?.text ?? null}
        visible={isExplainBottomSheetVisible}
        onClose={() => setIsExplainBottomSheetVisible(false)}
        episodeId={Number(episodeId)}
      />
      <ShadowingBottomSheet
        player={player}
        status={status}
        selectedSegment={selectedSegment}
        segments={segments}
        visible={isShadowingBottomSheetVisible}
        onClose={() => setIsShadowingBottomSheetVisible(false)}
        episodeId={Number(episodeId)}
        onShowWordDefinition={handleShowWordDefinition}
        onSegmentChange={setSelectedSegment}
      />
      <WordDefinitionModal
        visible={isWordModalVisible}
        selectedWord={selectedWord}
        selectedSegment={selectedSegment}
        player={player}
        onClose={handleCloseWordModal}
        episodeId={Number(episodeId)}
      />

      {/* <VocabularyDrawer
        visible={isVocabularyDrawerVisible}
        onClose={() => setIsVocabularyDrawerVisible(false)}
      /> */}
    </View>
  );
};

export { TranscriptionScreen };
