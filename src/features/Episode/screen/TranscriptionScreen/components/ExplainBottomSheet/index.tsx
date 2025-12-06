import { BottomSheet } from '@/core/components';
import {
  useChatWithEpisode,
  useGetConversationHistory,
} from '@/shared/api/ai-translatorSchemas';
import { useKeyboardScroll } from '@/shared/hooks';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChatMessage } from './components/ChatMessage';

interface IExplainBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  episodeId: number;
  selectedText: string | null;
}

interface LocalMessage {
  type: 'user' | 'bot';
  message: string;
}

const ExplainBottomSheet = ({
  visible,
  onClose,
  episodeId,
  selectedText,
}: IExplainBottomSheetProps) => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<LocalMessage[]>([]);

  const inputRef = useRef<TextInput>(null);
  const { keyboardHeight, scrollViewRef, scrollToEnd } = useKeyboardScroll();

  const { data: history } = useGetConversationHistory(episodeId, {
    query: {
      enabled: visible,
    },
  });

  const { mutate: sendMessage, isPending } = useChatWithEpisode({
    mutation: {
      onSuccess: res => {
        setMessages(prev => [...prev, { type: 'bot', message: res.response }]);
      },
    },
  });

  const handleSendMessage = (prompt: string) => {
    setMessages(prev => [...prev, { type: 'user', message: prompt }]);
    sendMessage({
      data: {
        prompt,
        episode_id: episodeId,
      },
    });
  };

  const handleSendUserInput = () => {
    if (!text.trim() || isPending) return;
    handleSendMessage(text);
    setText('');
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (history && visible) {
      const formatted: LocalMessage[] = [];

      history.conversations.forEach(conv => {
        formatted.push({ type: 'user', message: conv.prompt });
        formatted.push({ type: 'bot', message: conv.response });
      });

      setMessages(formatted);
      // Auto-send current segment when opening the
    }
  }, [history, visible]);

  useEffect(() => {
    if (selectedText) {
      setText(`Hãy giúp tôi hiểu "${selectedText}"`);
    }
  }, [selectedText]);

  return (
    <BottomSheet
      className="bg-mirai-bgDeep rounded-3xl"
      visible={visible}
      height={700}
      onClose={onClose}
    >
      <View className="flex-1 bg-mirai-bgDeep">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 p-6"
          contentContainerStyle={{
            paddingBottom: keyboardHeight > 0 ? 20 : 20,
          }}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={scrollToEnd}
        >
          {messages.map((m, i) => (
            <ChatMessage key={i} message={m.message} type={m.type} />
          ))}

          {isPending && (
            <View className="mb-4 flex-row items-center gap-2">
              <ActivityIndicator size="small" color="#C2F590" />
              <View className="h-2 w-2 rounded-full bg-gray-600" />
              <View className="h-2 w-2 rounded-full bg-gray-600" />
              <View className="h-2 w-2 rounded-full bg-gray-600" />
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View
          className="flex-row items-end gap-3 px-6 bg-mirai-bgDeep"
          style={{
            paddingTop: 16,
            paddingBottom: keyboardHeight > 0 ? 16 : 32,
            marginBottom: keyboardHeight,
          }}
        >
          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={setText}
            placeholder="Type question ..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            editable={!isPending}
            className="flex-1 bg-mirai-black text-white p-4 rounded-2xl font-nunito min-h-12 max-h-32 border border-border-deep text-lg"
          />
          <TouchableOpacity
            className="rounded-full bg-mirai-greenDark size-14 items-center justify-center"
            onPress={handleSendUserInput}
            disabled={isPending}
          >
            <Ionicons name="send" size={20} color="#C2F590" />
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};
export default ExplainBottomSheet;
