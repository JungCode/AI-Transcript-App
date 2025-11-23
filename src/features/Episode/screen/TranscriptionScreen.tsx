import { Button } from '@/core/components';
import { AudioPlayer } from '@/features/Episode/components/AudioPlayer';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

enum AudioFunctionName {
  PIN = 'Pin',
  EXPLAIN = 'Explain',
  REPEAT = 'Repeat',
  SPEED = 'Speed',
  PLAY = 'Play',
}

interface IAudioFunctionButton {
  icon: React.ReactNode;
  onPress?: () => void;
  name: AudioFunctionName;
}

const AUDIO_FUNCTION_BUTTONS: IAudioFunctionButton[] = [
  {
    icon: <MaterialCommunityIcons name="pin" size={24} color="white" />,
    name: AudioFunctionName.PIN,
  },
  {
    icon: (
      <MaterialCommunityIcons
        name="comment-text-outline"
        size={24}
        color="white"
      />
    ),
    name: AudioFunctionName.EXPLAIN,
  },
  {
    icon: <MaterialIcons name="repeat" size={24} color="white" />,
    name: AudioFunctionName.REPEAT,
  },
  {
    icon: <MaterialCommunityIcons name="speedometer" size={24} color="white" />,
    name: AudioFunctionName.SPEED,
  },
  {
    icon: <Ionicons name="stop-circle" size={24} color="white" />,
    name: AudioFunctionName.PLAY,
  },
];

const TranscriptionScreen = () => {
  const { episodeUrl, episodeTitle, feedTitle } = useLocalSearchParams<{
    episodeId: string;
    episodeUrl: string;
    episodeTitle: string;
    feedTitle?: string;
  }>();

  const getButtonFunctionByName = ({
    name,
    handlePlayPause,
  }: {
    name: AudioFunctionName;
    handlePlayPause: () => void;
  }) => {
    switch (name) {
      case AudioFunctionName.PIN:
        break;
      case AudioFunctionName.EXPLAIN:
        break;
      case AudioFunctionName.REPEAT:
        break;
      case AudioFunctionName.SPEED:
        break;
      case AudioFunctionName.PLAY:
        return handlePlayPause;
      default:
        break;
    }
  };

  return (
    <View className="flex-1 bg-surface px-6">
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

      <View className="absolute bottom-10 left-0 right-0 px-4">
        <View className=" bg-mirai-bgDeep rounded-3xl shadow-xl p-5">
          <AudioPlayer audioUrl={episodeUrl} className="gap-4">
            {({ handlePlayPause, status }) => (
              <View className="flex-row justify-between items-center">
                <View className="flex-row gap-3">
                  {AUDIO_FUNCTION_BUTTONS.map((button, index) => (
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
