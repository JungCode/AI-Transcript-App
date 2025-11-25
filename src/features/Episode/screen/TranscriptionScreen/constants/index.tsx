import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface ITranscriptionScreenParams {
  episodeId: string;
  episodeUrl: string;
  episodeTitle: string;
  feedTitle?: string;
}

interface IAudioFunctionButton {
  icon: React.ReactNode;
  onPress?: () => void;
  name: AudioFunctionName;
}



enum AudioFunctionName {
  PIN = 'Pin',
  EXPLAIN = 'Explain',
  REPEAT = 'Repeat',
  SPEED = 'Speed',
  PLAY = 'Play',
}

const AUDIO_FUNCTION_BUTTON_COMPONENTS: IAudioFunctionButton[] = [
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

export {
  AUDIO_FUNCTION_BUTTON_COMPONENTS,
  AudioFunctionName,
  type ITranscriptionScreenParams,
};
