import { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const onlyDigits = (s = "") => s.replace(/\D/g, "").slice(0, 11);
const isBDPhone = (p = "") => /^01\d{9}$/.test(p); // exactly 11 digits, starts with 01

const signUp = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((s) => s.auth);
  const { width } = useWindowDimensions();

  const bannerHeight = Math.min(280, Math.max(160, Math.round(width * 0.5)));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched] = useState({});

  const errors = useMemo(() => {
    const e = {};
    if (!name.trim() || name.trim().length < 2)
      e.name = "Enter your full name.";
    if (!emailRegex.test(email)) e.email = "Enter a valid email address.";
    if (!isBDPhone(phone))
      e.phone = "Phone must be an 11-digit BD number (starts with 01).";
    if (!password || password.length < 6)
      e.password = "Password must be at least 6 characters.";
    if (!["student", "teacher"].includes(role)) e.role = "Choose a role.";
    return e;
  }, [name, email, phone, password, role]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const onSubmit = () => {
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      role: true,
    });
    if (!isValid || loading) return;

    const registerData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      role,
    };

    dispatch({
      type: "REGISTER",
      payload: {
        registerData,
        navigate: (path) => router.replace(path),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          className="px-5"
        >
          {/* Hero Image */}
          <View className="mt-8 mb-4">
            <View className="bg-green-50 border border-green-100 rounded-3xl overflow-hidden">
              <Image
                source={require("../../assets/images/auth/sign_up.png")}
                style={{ width: "100%", height: bannerHeight }}
                resizeMode="contain"
                accessible
                accessibilityLabel="Join us — sign up illustration"
              />
            </View>
          </View>

          {/* Header */}
          <View className="mt-10 mb-6">
            <Text className="text-3xl font-bold text-gray-900">
              Create account
            </Text>
            <Text className="text-gray-500 mt-1">
              Join and manage your tuitions effortlessly.
            </Text>
          </View>

          {/* Card */}
          <View className="bg-white rounded-2xl p-5 shadow-[0_6px_30px_rgba(0,0,0,0.08)] border border-gray-100">
            {/* Role Toggle */}
            <View className="flex-row items-center mb-4">
              <Text className="text-gray-700 font-semibold mr-3">I am a</Text>
              <View className="flex-row bg-gray-100 rounded-xl p-1">
                {["student", "teacher"].map((r) => {
                  const active = role === r;
                  return (
                    <Pressable
                      key={r}
                      onPress={() => setRole(r)}
                      className={`px-4 py-2 rounded-lg flex-row items-center justify-center ${
                        active ? "bg-indigo-600" : "bg-transparent"
                      }`}
                    >
                      <Ionicons
                        name={
                          r === "student"
                            ? "school-outline"
                            : "briefcase-outline"
                        }
                        size={16}
                        color={active ? "#fff" : "#4B5563"}
                      />
                      <Text
                        className={`ml-2 text-sm font-medium ${
                          active ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            {touched.role && errors.role ? (
              <Text className="text-red-500 text-xs mb-2">{errors.role}</Text>
            ) : null}

            {/* Name */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Full name</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3">
                <Ionicons name="person-outline" size={18} color="#6B7280" />
                <TextInput
                  value={name}
                  onChangeText={(t) => setName(t)}
                  onBlur={() => setTouched((x) => ({ ...x, name: true }))}
                  placeholder="e.g., Kabir Hasan"
                  className="flex-1 px-3 py-3 text-gray-900"
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
              {touched.name && errors.name ? (
                <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>
              ) : null}
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Email</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3">
                <Ionicons name="mail-outline" size={18} color="#6B7280" />
                <TextInput
                  value={email}
                  onChangeText={(t) => setEmail(t)}
                  onBlur={() => setTouched((x) => ({ ...x, email: true }))}
                  placeholder="kabir@example.com"
                  className="flex-1 px-3 py-3 text-gray-900"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
              </View>
              {touched.email && errors.email ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.email}
                </Text>
              ) : null}
            </View>

            {/* Phone */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Phone (BD)</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3">
                <Ionicons name="call-outline" size={18} color="#6B7280" />
                <TextInput
                  value={phone}
                  onChangeText={(t) => setPhone(onlyDigits(t))}
                  onBlur={() => setTouched((x) => ({ ...x, phone: true }))}
                  placeholder="01900000000"
                  className="flex-1 px-3 py-3 text-gray-900"
                  keyboardType="phone-pad"
                  maxLength={11}
                  returnKeyType="next"
                />
                <Text className="text-gray-400 text-xs">{phone.length}/11</Text>
              </View>
              {touched.phone && errors.phone ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.phone}
                </Text>
              ) : null}
            </View>

            {/* Password */}
            <View className="mb-2">
              <Text className="text-gray-700 mb-2 font-medium">Password</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3">
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#6B7280"
                />
                <TextInput
                  value={password}
                  onChangeText={(t) => setPassword(t)}
                  onBlur={() => setTouched((x) => ({ ...x, password: true }))}
                  placeholder="Min. 6 characters"
                  className="flex-1 px-3 py-3 text-gray-900"
                  secureTextEntry={!showPass}
                  returnKeyType="done"
                />
                <Pressable onPress={() => setShowPass((s) => !s)} hitSlop={10}>
                  <Ionicons
                    name={showPass ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color="#6B7280"
                  />
                </Pressable>
              </View>
              {touched.password && errors.password ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.password}
                </Text>
              ) : null}
            </View>

            {/* Submit */}
            <Pressable
              onPress={onSubmit}
              disabled={!isValid || loading}
              className={`mt-5 rounded-xl py-3.5 items-center justify-center flex-row ${
                !isValid || loading ? "bg-indigo-300" : "bg-indigo-600"
              }`}
            >
              {loading ? (
                <ActivityIndicator />
              ) : (
                <>
                  <Ionicons name="person-add-outline" size={18} color="#fff" />
                  <Text className="text-white font-semibold ml-2">
                    Create account
                  </Text>
                </>
              )}
            </Pressable>

            {/* Terms */}
            <Text className="text-gray-400 text-xs text-center mt-3">
              By signing up, you agree to our Terms & Privacy Policy.
            </Text>
          </View>

          {/* Already have account */}
          <View className="items-center mt-6 mb-8">
            <Pressable onPress={() => router.push("/(auth)/signIn")}>
              <Text className="text-gray-600">
                Already have an account?{" "}
                <Text className="text-indigo-600 font-semibold">Log in</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default signUp;
