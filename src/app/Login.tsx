import { useLoginUserLoginPost } from '@/shared/api/authSchemas';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Alert, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('string');

  const loginMutation = useLoginUserLoginPost({
    mutation: {
      onSuccess: async (data) => {
        // Store token
        const token = data.access_token;
        try {
          if (Platform.OS === 'web') {
            localStorage.setItem('access_token', token);
          } else {
            await SecureStore.setItemAsync('access_token', token);
          }
          // Navigate to home page
          router.replace('/');
        } catch (error: unknown) {
          console.error('Error storing token:', error);
          Alert.alert('Error', 'Failed to save login credentials');
        }
      },
      onError: (error: unknown) => {
        console.error('Login error:', error);
        
        interface ErrorResponse {
          detail?: { msg?: string }[] | string;
          message?: string;
        }
        
        interface NetworkError extends AxiosError<ErrorResponse> {
          code?: string;
        }
        
        // Type guard to check if error is an AxiosError
        const isAxiosError = (err: unknown): err is AxiosError<ErrorResponse> => {
          return (
            typeof err === 'object' &&
            err !== null &&
            'isAxiosError' in err &&
            (err as AxiosError).isAxiosError === true
          );
        };
        
        if (!isAxiosError(error)) {
          Alert.alert('Login Failed', 'An unexpected error occurred. Please try again.');
          return;
        }
        
        const axiosError = error;
        const networkError = axiosError as NetworkError;
        const errorCode = networkError.code;
        const errorMessage = typeof axiosError.message === 'string' ? axiosError.message : '';
        
        // Check for network errors
        if (errorCode === 'ECONNREFUSED' || errorCode === 'ENOTFOUND' || errorCode === 'ETIMEDOUT') {
          Alert.alert(
            'Network Error',
            'Unable to connect to the server. Please check your internet connection and try again.'
          );
          return;
        }
        
        // Check if API URL is not configured
        if (errorMessage.includes('Network Error') || errorMessage.includes('ERR_NETWORK')) {
          Alert.alert(
            'Network Error',
            'Unable to reach the server. Please check your internet connection or contact support.'
          );
          return;
        }
        
        // Check for timeout
        if (errorCode === 'ECONNABORTED' || errorMessage.includes('timeout')) {
          Alert.alert(
            'Request Timeout',
            'The request took too long. Please try again.'
          );
          return;
        }
        
        // Check for API response errors
        const responseData = axiosError.response?.data;
        const detail = responseData?.detail;
        const detailMessage = Array.isArray(detail) && detail[0] && typeof detail[0] === 'object' 
          ? detail[0].msg 
          : typeof detail === 'string' 
            ? detail 
            : undefined;
        
        const responseMessage = 
          responseData && 
          typeof responseData === 'object' && 
          'message' in responseData && 
          typeof responseData.message === 'string'
            ? responseData.message 
            : undefined;
        
        const finalErrorMessage = 
          detailMessage ?? 
          responseMessage ??
          errorMessage ?? 
          'Login failed. Please check your credentials.';
        
        Alert.alert('Login Failed', finalErrorMessage);
      },
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password');
      return;
    }

    loginMutation.mutate({
      data: {
        email,
        password,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f6fdee]" edges={['top', 'bottom']}>
      {/* Back Button */}
      <View className="px-6 pt-4 pb-2">
        <TouchableOpacity 
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/');
            }
          }} 
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={28} color="#61764b" />
        </TouchableOpacity>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 19, paddingTop: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View className="items-center mb-16">
          <View className="w-[129px] h-[129px] rounded-full bg-[#61764b] items-center justify-center mb-4">
            <MaterialCommunityIcons name="rabbit" size={80} color="#f6fdee" />
          </View>
          <Text className="text-[#61764b] text-[60px] font-black" style={{ letterSpacing: -1 }}>
            MIRAI
          </Text>
        </View>

        {/* Form Fields */}
        <View className="mb-6">
          {/* Email Field */}
          <Text className="text-[#61764b] text-[19px] font-bold mb-2">Email</Text>
          <View className="bg-white border border-[#61764b] border-[0.8px] rounded-[10px] h-[53px] px-[17px] justify-center mb-4" style={{ opacity: 0.8 }}>
            <TextInput
              className="text-[18px] text-black flex-1"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Field */}
          <Text className="text-[#61764b] text-[19px] font-bold mb-2">Password</Text>
          <View className="bg-white border border-[#61764b] border-[0.8px] rounded-[10px] h-[53px] px-[17px] justify-center mb-6" style={{ opacity: 0.8 }}>
            <TextInput
              className="text-[18px] text-black flex-1"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>
        </View>

        {/* LOGIN Button */}
        <View className="items-center mb-8">
          <TouchableOpacity
            className="bg-[#c0f18f] rounded-[50px] h-[53px] items-center justify-center"
            style={{ width: 231, opacity: loginMutation.isPending ? 0.6 : 1 }}
            activeOpacity={0.8}
            onPress={handleLogin}
            disabled={loginMutation.isPending}
          >
            <Text className="text-white text-[26px] font-bold">
              {loginMutation.isPending ? 'LOGGING IN...' : 'LOGIN'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* SignUp Link */}
        <View className="items-center">
          <Text className="text-black text-[18px] mb-2">Don&apos;t have an account yet?</Text>
          <TouchableOpacity onPress={() => router.push('/SignUp')} activeOpacity={0.7}>
            <Text className="text-[#61764b] text-[20px] font-bold underline">SignUp</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

