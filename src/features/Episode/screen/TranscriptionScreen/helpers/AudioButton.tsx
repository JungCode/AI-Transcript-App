import { AudioFunctionName } from '../constants';

const getButtonFunctionByName = ({
  name,
  handlePlayPause,
  onExplainPress,
}: {
  name: AudioFunctionName;
  handlePlayPause: () => void;
  onExplainPress?: () => void;
}) => {
  switch (name) {
    case AudioFunctionName.PIN:
      break;
    case AudioFunctionName.EXPLAIN:
      return onExplainPress;
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

export { getButtonFunctionByName };
