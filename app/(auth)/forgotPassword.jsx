import { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Illustration from "../../assets/images/auth/forgotPassword.png";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export default function ForgotPassword() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { forgotLoading } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const valid = useMemo(() => emailRegex.test(email), [email]);

  const submit = () => {
    if (!valid) return;
    dispatch({ type: "FORGOT_PASSWORD", payload: { email } });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-3 pb-2 border-b border-gray-100">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            className="p-2 -ml-2 mr-1"
          >
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </Pressable>
          <Text className="ml-1 text-[18px] font-bold text-gray-900">
            Forgot Password
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // keyboardVerticalOffset={keyboardOffset}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Illustration */}
          <View className="items-center mb-6">
            <Image
              source={Illustration}
              resizeMode="contain"
              className="w-[340px] h-[340px]"
              accessible
              accessibilityRole="image"
              accessibilityLabel="Forgot password illustration"
            />
          </View>

          {/* Card */}
          <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <Text className="text-[20px] font-bold text-gray-900">
              Reset your password
            </Text>
            <Text className="text-[13px] text-gray-600 mt-1">
              Enter the email you used to create your account. We’ll email you a
              reset link.
            </Text>

            {/* Email input */}
            <View className="mt-4">
              <Text className="text-[13px] font-semibold text-gray-800 mb-1">
                Email address
              </Text>
              <View className="flex-row items-center border border-gray-200 rounded-xl px-3">
                <Ionicons name="mail-outline" size={18} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-2 py-3 text-[15px]"
                  placeholder="you@example.com"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  returnKeyType="send"
                  onSubmitEditing={submit}
                />
              </View>
              {!valid && !!email && (
                <Text className="text-[12px] text-rose-600 mt-1">
                  Enter a valid email address.
                </Text>
              )}
            </View>

            {/* Submit */}
            <Pressable
              onPress={submit}
              disabled={!valid || forgotLoading}
              className="mt-4 h-12 rounded-xl bg-indigo-600 items-center justify-center flex-row disabled:bg-gray-400"
              style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}
            >
              <Ionicons name="paper-plane-outline" size={18} color="#fff" />
              <Text className="text-white font-semibold ml-2">
                {forgotLoading ? "Sending…" : "Send Reset Link"}
              </Text>
            </Pressable>

            {/* Hint */}
            <Text className="text-[12px] text-gray-500 mt-3">
              Tip: check Spam/Promotions if you don’t see the email.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
