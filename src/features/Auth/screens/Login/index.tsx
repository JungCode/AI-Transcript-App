import { useLoginUserLoginPost } from '@/shared/api/authSchemas';
import logoSource from '@/shared/assets/images/icons/logo.svg';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const handleChangeEmail = (value: string) => {
    setEmail(value);
  };

  const handleChangePassword = (value: string) => {
    setPassword(value);
  };

  const onSubmit = () => {
    if (!email || !password) return;

    loginMutate({
      data: {
        email,
        password,
      },
    });
  };

  const handleGoToRegister = () => {
    router.push('/register');
  };

  const { mutate: loginMutate, isPending: isLoading } = useLoginUserLoginPost({
    mutation: {
      onSuccess: res => {
        Toast.show({
          type: 'success',
          text1: 'Đăng nhập thành công 🎉',
          text2: 'Chào mừng bạn quay trở lại!',
        });
      },
      onError: err => {
        Toast.show({
          type: 'error',
          text1: 'Đăng nhập thất bại',
          text2: 'Email hoặc mật khẩu sai rồi!',
        });
      },
    },
  });

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled"
      className="bg-surface"
    >
      <View className="bg-surface h-full justify-center items-center gap-14 p-11">
        <View className="items-center">
          <Image source={logoSource} style={{ width: 87, height: 87 }} />
          <Text className="font-black text-6xl text-white mt-3 font-nunito leading-tight">
            MIRAI
          </Text>
        </View>

        <View className="w-full gap-5">
          <Input
            label="Email"
            value={email}
            onChangeText={handleChangeEmail}
            placeholder="Email"
          />

          <Input
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={handleChangePassword}
            placeholder="Password"
          />
        </View>
        <View className="w-full gap-3">
          <Button
            isLoading={isLoading}
            loadingIconProps={{ size: 24 }}
            onPress={onSubmit}
          >
            Sign in with Email
          </Button>

          <Text className="text-white text-center font-nunito">Or</Text>

          <View className="flex-row justify-center gap-1">
            <Text className="text-white font-nunito font-medium text-sm">
              Don&apos;t have account yet?
            </Text>

            <Button
              type="ghost"
              textClassName="text-sm"
              onPress={handleGoToRegister}
            >
              Sign Up
            </Button>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
