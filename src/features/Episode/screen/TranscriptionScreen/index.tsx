import { Button } from '@/core/components';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAudioPlayer } from 'expo-audio';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { AudioPlayer } from './components/AudioPlayer';
import { TranscriptScrollView } from './components/TranscriptScrollView';
import {
  AUDIO_FUNCTION_BUTTON_COMPONENTS,
  AudioFunctionName,
} from './constants';
import { getButtonFunctionByName } from './helpers/AudioButton';
import { useAudioPlayerStatusCustom } from './hooks/useAudioPlayerStatusCustom';

const TranscriptionScreen = () => {
  const { episodeUrl, episodeTitle, feedTitle, episodeId } =
    useLocalSearchParams<{
      episodeId: string;
      episodeUrl: string;
      episodeTitle: string;
      feedTitle?: string;
    }>();

  const player = useAudioPlayer(episodeUrl);
  const status = useAudioPlayerStatusCustom(player);

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
        <Ionicons name="cloud-download-outline" size={24} color="#e7e9dd" />
        <MaterialCommunityIcons
          name="subtitles-outline"
          size={24}
          color="#e7e9dd"
        />
      </View>

      <TranscriptScrollView
        player={player}
        episodeUrl={episodeUrl}
        episodeId={Number(episodeId)}
        audioStatus={status}
      />

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
                        {button.name !== AudioFunctionName.PLAY && button.icon}
                      </View>
                      <Text className="text-text-soft text-sm font-bold">
                        {button.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View className="p-3 bg-surface-darkest rounded-xl">
                  <AntDesign name="audio" size={24} color="#C2F590" />
                </View>
              </View>
            )}
          </AudioPlayer>
        </View>
      </View>
    </View>
  );
};

export { TranscriptionScreen };
