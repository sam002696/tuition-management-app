import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

const loginHero = require("../../assets/images/auth/login.png");

export default function SignIn() {
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const isDisabled = loading || !email.trim() || !password;

  const handleLogin = () => {
    if (isDisabled) return;
    dispatch({
      type: "LOGIN",
      payload: {
        loginData: { email: email.trim(), password },
        navigate: (path) => router.replace(path),
      },
    });
  };

  const goToForgot = () => router.push("/(auth)/forgotPassword");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View className="flex-1 justify-between pb-8">
            {/* Top hero image (like Welcome) */}
            <View className="relative">
              <Image
                source={loginHero}
                resizeMode="contain"
                className="w-full h-[320px]"
              />
              <Pressable
                onPress={() => router.back()}
                hitSlop={10}
                className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/95 border border-gray-200 items-center justify-center"
              >
                <Ionicons name="chevron-back" size={20} color="#111827" />
              </Pressable>
            </View>

            {/* Body */}
            <View className="px-6">
              {/* Headings */}
              <View className="mt-4">
                <Text className="text-[26px] leading-[30px] font-bold text-gray-900 text-center">
                  Login
                </Text>
                <Text className="mt-1 text-[13px] text-gray-500 text-center">
                  Login to continue using the app
                </Text>
              </View>

              {/* Fields */}
              <View className="mt-6">
                <Text className="mb-2 text-[14px] text-gray-700">Email</Text>
                <View className="h-14 rounded-[28px] bg-gray-100 px-5 flex-row items-center">
                  <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    className="ml-3 flex-1 text-[16px] text-gray-900"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <Text className="mt-5 mb-2 text-[14px] text-gray-700">
                  Password
                </Text>
                <View className="h-14 rounded-[28px] bg-gray-100 px-5 flex-row items-center">
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color="#9CA3AF"
                  />
                  <TextInput
                    placeholder="Enter password"
                    placeholderTextColor="#9CA3AF"
                    className="ml-3 flex-1 text-[16px] text-gray-900"
                    secureTextEntry={!showPass}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <Pressable
                    onPress={() => setShowPass((v) => !v)}
                    hitSlop={10}
                  >
                    <Ionicons
                      name={showPass ? "eye-outline" : "eye-off-outline"}
                      size={22}
                      color="#9CA3AF"
                    />
                  </Pressable>
                </View>

                <View className="mt-3 items-end">
                  <Pressable onPress={goToForgot} hitSlop={8}>
                    <Text className="text-[12px] text-[#1E6DFF] font-semibold underline">
                      Forgot password?
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* CTA + Social + Register */}
              <View className="mt-6">
                <Pressable
                  onPress={handleLogin}
                  disabled={isDisabled}
                  className={`h-14 rounded-[28px] items-center justify-center ${
                    isDisabled ? "bg-[#1E6DFF]/60" : "bg-[#1E6DFF]"
                  }`}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text className="text-white text-[16px] font-semibold">
                      Login
                    </Text>
                  )}
                </Pressable>

                <View className="mt-7 flex-row items-center">
                  <View className="flex-1 h-px bg-gray-200" />
                  <Text className="px-3 text-[12px] text-gray-500">
                    Or Login with
                  </Text>
                  <View className="flex-1 h-px bg-gray-200" />
                </View>

                <View className="mt-5 flex-row justify-center gap-5">
                  <Pressable className="w-14 h-14 rounded-full border border-gray-200 bg-white items-center justify-center">
                    <Ionicons name="logo-facebook" size={22} color="#1877F2" />
                  </Pressable>
                  <Pressable className="w-14 h-14 rounded-full border border-gray-200 bg-white items-center justify-center">
                    <Ionicons name="logo-google" size={22} color="#DB4437" />
                  </Pressable>
                  <Pressable className="w-14 h-14 rounded-full border border-gray-200 bg-white items-center justify-center">
                    <Ionicons name="logo-apple" size={24} color="#000000" />
                  </Pressable>
                </View>

                <View className="mt-6 flex-row justify-center">
                  <Text className="text-[12px] text-gray-500">
                    Don’t have an account?{" "}
                  </Text>
                  <Pressable onPress={() => router.push("/(auth)/signUp")}>
                    <Text className="text-[12px] text-[#1E6DFF] font-semibold">
                      Register
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
