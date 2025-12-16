import {
  Entypo,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';

interface IAudioFunctionButton {
  icon: React.ReactNode;
  onPress?: () => void;
  name: ShadowingFunctionName;
}

enum ShadowingFunctionName {
  EXPLAIN = 'Explain',
  AUTO_ECHO = 'Auto Echo',

  SPEED = 'Speed',
  COPY = 'Copy',
  PREVIOUS = 'Previous',
  NEXT = 'Next',
  PLAY = 'Play',
}

const SHADOWING_FUNCTION_BUTTON_COMPONENTS: IAudioFunctionButton[] = [
  {
    icon: <MaterialIcons name="auto-mode" size={24} color="white" />,
    name: ShadowingFunctionName.AUTO_ECHO,
  },

  {
    icon: (
      <MaterialCommunityIcons
        name="comment-text-outline"
        size={24}
        color="white"
      />
    ),
    name: ShadowingFunctionName.EXPLAIN,
  },
];

const PLAY_FUNCTION_BUTTON_COMPONENTS: IAudioFunctionButton[] = [
  {
    icon: <MaterialCommunityIcons name="speedometer" size={22} color="white" />,
    name: ShadowingFunctionName.SPEED,
  },

  {
    icon: <FontAwesome6 name="copy" size={18} color="white" />,
    name: ShadowingFunctionName.COPY,
  },

  {
    icon: <FontAwesome6 name="backward-step" size={17} color="white" />,
    name: ShadowingFunctionName.PREVIOUS,
  },

  {
    icon: <Entypo name="controller-next" size={22} color="white" />,
    name: ShadowingFunctionName.NEXT,
  },

  {
    icon: <Ionicons name="stop-circle" size={22} color="white" />,
    name: ShadowingFunctionName.PLAY,
  },
];

export {
  PLAY_FUNCTION_BUTTON_COMPONENTS,
  SHADOWING_FUNCTION_BUTTON_COMPONENTS,
  ShadowingFunctionName,
};
