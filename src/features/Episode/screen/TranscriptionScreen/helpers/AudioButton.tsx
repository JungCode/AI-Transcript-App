import { AudioFunctionName } from '../constants';

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

export { getButtonFunctionByName };
