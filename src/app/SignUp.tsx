import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState('Chau Thi');
  const [email, setEmail] = useState('chauthi1704@gmail.com');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-[#f6fdee]" edges={['top', 'bottom']}>
      {/* Back Button */}
      <View className="px-6 pt-4 pb-2">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
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
          {/* Name Field */}
          <Text className="text-[#61764b] text-[19px] font-bold mb-2">Name</Text>
          <View className="bg-white border border-[#61764b] border-[0.8px] rounded-[10px] h-[53px] px-[17px] justify-center mb-4" style={{ opacity: 0.8 }}>
            <TextInput
              className="text-[18px] text-black flex-1"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#999"
            />
          </View>

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

        {/* SIGNUP Button */}
        <View className="items-center mb-8">
          <TouchableOpacity
            className="bg-[#c0f18f] rounded-[50px] h-[53px] items-center justify-center"
            style={{ width: 231 }}
            activeOpacity={0.8}
          >
            <Text className="text-white text-[26px] font-bold">SIGNUP</Text>
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View className="items-center">
          <Text className="text-black text-[18px] mb-2">Have account yet?</Text>
          <TouchableOpacity onPress={() => router.push('/Login')} activeOpacity={0.7}>
            <Text className="text-[#61764b] text-[20px] font-bold underline">Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

