import { useMemo, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";

const changePassword = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { changeLoading } = useSelector((s) => s.auth);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [touched, setTouched] = useState({});

  const errors = useMemo(() => {
    const e = {};
    if (!currentPassword || currentPassword.length < 6)
      e.current = "Enter your current password (min 6 chars).";
    if (!newPassword || newPassword.length < 6)
      e.new = "New password must be at least 6 characters.";
    if (newPassword && currentPassword && newPassword === currentPassword)
      e.new = "New password must be different from current.";
    if (!confirm || confirm !== newPassword)
      e.confirm = "Passwords do not match.";
    return e;
  }, [currentPassword, newPassword, confirm]);

  const valid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const onSubmit = () => {
    setTouched({ current: true, new: true, confirm: true });
    if (!valid || changeLoading) return;

    dispatch({
      type: "CHANGE_PASSWORD",
      payload: {
        data: {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirm,
        },
      },
    });
  };

  const bannerHeight = Math.min(280, Math.max(160, Math.round(width * 0.5)));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="px-5"
        >
          {/* Top bar with back button */}
          <View className="flex-row items-center mt-3 mb-3">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center"
            >
              <Ionicons name="arrow-back" size={20} color="#111827" />
            </Pressable>
            <Text className="ml-3 text-xl font-semibold text-gray-900">
              Change password
            </Text>
          </View>

          {/* Hero image */}
          <View className="mb-4">
            <View className="rounded-3xl overflow-hidden bg-green-50 border border-green-100">
              <Image
                source={require("../../../assets/images/changePassword/changePassword.png")}
                style={{ width: "100%", height: bannerHeight }}
                resizeMode="contain"
                accessible
                accessibilityLabel="Secure password illustration"
              />
            </View>
          </View>

          <Text className="text-gray-500 mb-3">
            Keep your account secure by updating your password.
          </Text>

          {/* Card */}
          <View className="bg-white rounded-2xl p-5 shadow-[0_6px_30px_rgba(0,0,0,0.08)] border border-gray-100">
            {/* Current */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">
                Current password
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3">
                <Ionicons name="key-outline" size={18} color="#6B7280" />
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  onBlur={() => setTouched((t) => ({ ...t, current: true }))}
                  placeholder="••••••••"
                  className="flex-1 px-3 py-3 text-gray-900"
                  secureTextEntry={!showCurrent}
                  returnKeyType="next"
                />
                <Pressable
                  onPress={() => setShowCurrent((s) => !s)}
                  hitSlop={10}
                >
                  <Ionicons
                    name={showCurrent ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color="#6B7280"
                  />
                </Pressable>
              </View>
              {touched.current && errors.current ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.current}
                </Text>
              ) : null}
            </View>

            {/* New */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">
                New password
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3">
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#6B7280"
                />
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  onBlur={() => setTouched((t) => ({ ...t, new: true }))}
                  placeholder="At least 6 characters"
                  className="flex-1 px-3 py-3 text-gray-900"
                  secureTextEntry={!showNew}
                  returnKeyType="next"
                />
                <Pressable onPress={() => setShowNew((s) => !s)} hitSlop={10}>
                  <Ionicons
                    name={showNew ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color="#6B7280"
                  />
                </Pressable>
              </View>
              {touched.new && errors.new ? (
                <Text className="text-red-500 text-xs mt-1">{errors.new}</Text>
              ) : null}
            </View>

            {/* Confirm */}
            <View className="mb-2">
              <Text className="text-gray-700 mb-2 font-medium">
                Confirm new password
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3">
                <Ionicons
                  name="checkmark-done-outline"
                  size={18}
                  color="#6B7280"
                />
                <TextInput
                  value={confirm}
                  onChangeText={setConfirm}
                  onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                  placeholder="Repeat new password"
                  className="flex-1 px-3 py-3 text-gray-900"
                  secureTextEntry={!showConfirm}
                  returnKeyType="done"
                />
                <Pressable
                  onPress={() => setShowConfirm((s) => !s)}
                  hitSlop={10}
                >
                  <Ionicons
                    name={showConfirm ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color="#6B7280"
                  />
                </Pressable>
              </View>
              {touched.confirm && errors.confirm ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.confirm}
                </Text>
              ) : null}
            </View>

            {/* Submit */}
            <Pressable
              onPress={onSubmit}
              disabled={!valid || changeLoading}
              className={`mt-5 rounded-xl py-3.5 items-center justify-center flex-row ${
                !valid || changeLoading ? "bg-indigo-300" : "bg-indigo-600"
              }`}
            >
              {changeLoading ? (
                <ActivityIndicator />
              ) : (
                <>
                  <Ionicons name="save-outline" size={18} color="#fff" />
                  <Text className="text-white font-semibold ml-2">
                    Update password
                  </Text>
                </>
              )}
            </Pressable>

            <Text className="text-gray-400 text-xs text-center mt-3">
              Pro tip: use a unique passphrase you haven’t used elsewhere.
            </Text>
          </View>

          <View className="h-8" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default changePassword;
