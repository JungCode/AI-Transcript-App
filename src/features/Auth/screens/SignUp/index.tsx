import { Button, Input } from '@/core/components';
import { useRegisterUser } from '@/shared/api/authSchemas';
import logoSource from '@/shared/assets/images/icons/logo.svg';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';

export default function SignUpScreen() {
  const [full_name, setFullName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const { mutate: registerMutate, isPending: isLoading } = useRegisterUser({
    mutation: {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: 'Đăng ký thành công 🎉',
          text2: 'Chào mừng bạn!',
        });
      },
      onError: () => {
        Toast.show({
          type: 'error',
          text1: 'Đăng ký thất bại',
          text2: 'Email hoặc mật khẩu không hợp lệ!',
        });
      },
    },
  });

  const handleGoToLogin = () => {
    router.replace('/login');
  };

  const handleChangeName = (value: string) => {
    setFullName(value);
  };

  const handleChangeEmail = (value: string) => {
    setEmail(value);
  };

  const handleChangePassword = (value: string) => {
    setPassword(value);
  };

  const onSubmit = () => {
    if (!full_name || !email || !password) return;
    registerMutate({
      data: {
        full_name,
        email,
        password,
      },
    });
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled"
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
            label="Full Name"
            value={full_name}
            onChangeText={handleChangeName}
            placeholder="Full Name"
          />

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
            Sign Up
          </Button>

          <Text className="text-white text-center font-nunito">Or</Text>

          <View className="flex-row justify-center gap-1">
            <Text className="text-white font-nunito font-medium text-sm">
              Already have an account?
            </Text>

            <Button
              type="ghost"
              textClassName="text-sm"
              onPress={handleGoToLogin}
            >
              Log In
            </Button>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
