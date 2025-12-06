import type { ViewProps } from 'react-native';
import { Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { markdownStyles, userMessageStyle } from '../constants/markdownStyles';

interface IChatMessageProps extends ViewProps {
  message: string;
  type?: 'user' | 'bot';
}

const messageContainerVariants: Record<
  NonNullable<IChatMessageProps['type']>,
  string
> = {
  user: 'mb-6 items-end',
  bot: 'mb-4',
};

const messageBubbleVariants: Record<
  NonNullable<IChatMessageProps['type']>,
  string
> = {
  user: 'bg-mirai-greenDark px-4 py-3 rounded-2xl max-w-[80%]',
  bot: '',
};

const ChatMessage = ({
  message,
  type = 'user',
  className,
  ...props
}: IChatMessageProps) => {
  const containerClass = messageContainerVariants[type];
  const bubbleClass = messageBubbleVariants[type];

  return (
    <View className={containerClass} {...props}>
      {type === 'bot' ? (
        <Markdown style={markdownStyles}>{message}</Markdown>
      ) : (
        <View className={bubbleClass}>
          <Text style={userMessageStyle}>{message}</Text>
        </View>
      )}
    </View>
  );
};

export { ChatMessage };
