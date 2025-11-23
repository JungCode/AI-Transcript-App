import type { TextInputProps} from 'react-native';
import { Text, TextInput, View } from 'react-native';

interface IInput extends TextInputProps {
  label?: string;
}

const Input = ({ label, ...rest }: IInput) => {
  return (
    <View className="gap-1.5">
      {label && (
        <Text className="text-white font-nunito font-bold text-lg">
          {label}
        </Text>
      )}
      <TextInput
        {...rest}
        placeholderTextColor="#E7E9DD"
        className="border px-5 py-4 rounded-xl border-border-soft text-white text-lg font-nunito items-center focus:border-primary leading-snug "
      />
    </View>
  );
};

export { Input };
