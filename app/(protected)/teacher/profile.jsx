import { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import useAuth from "../../../hooks/useAuth";

/* ---------- small helpers ---------- */
const initialsFrom = (name = "") =>
  (name.match(/\b\w/g) || []).slice(0, 2).join("").toUpperCase() || "U";

const stringToColor = (str = "") => {
  const colors = [
    "#8B5CF6",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#EF4444",
    "#6366F1",
    "#14B8A6",
    "#F43F5E",
    "#84CC16",
    "#D946EF",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

/* ---------- row component ---------- */
const Row = ({ icon, color = "#6B7280", title, subtitle, onPress, right }) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center justify-between py-4 border-b border-gray-100"
  >
    <View className="flex-row items-center">
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: "#F3F4F6" }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View>
        <Text className="text-gray-900 font-medium">{title}</Text>
        {subtitle ? (
          <Text className="text-gray-500 text-xs mt-0.5">{subtitle}</Text>
        ) : null}
      </View>
    </View>
    {right ?? <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />}
  </Pressable>
);

/* ---------- profile screen ---------- */
const profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, role } = useAuth();

  // dark mode toggle mock (doesn't persist here)
  const [dark, setDark] = useState(false);

  const name = user?.name || "Kabir Hasan";
  const email = user?.email || "kabir@example.com";
  const phone = user?.phone || "01900000000";
  const r = role || user?.role || "student";

  const badgeColor = useMemo(() => stringToColor(name), [name]);

  /* ----- actions ----- */
  const onEditProfile = () => Alert.alert("Edit Profile", "Coming soon.");
  const onChangePassword = () => router.push("/profile/changePassword");
  const onHelp = () =>
    Alert.alert("Help & Support", "Email: support@example.com");
  const onLogout = () => {
    dispatch({
      type: "LOGOUT",
      payload: { navigate: (p) => router.replace(p) },
    });
  };

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-black" : "bg-white"}`}>
      {/* Header card */}
      <View className="px-5 pt-6 pb-4">
        <View
          className={`rounded-3xl p-5 ${dark ? "bg-neutral-900" : "bg-gray-50"} border border-gray-100`}
        >
          <View className="flex-row items-center">
            {/* Avatar */}
            <View
              className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
              style={{ backgroundColor: badgeColor }}
            >
              <Text className="text-white text-xl font-bold">
                {initialsFrom(name)}
              </Text>
            </View>

            {/* Name & meta */}
            <View className="flex-1">
              <Text
                className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}
              >
                {name}
              </Text>
              <Text
                className={`text-xs mt-0.5 ${dark ? "text-gray-300" : "text-gray-500"}`}
              >
                {r === "teacher" ? "Teacher" : "Student"}
              </Text>
              <View className="flex-row items-center mt-2">
                <Ionicons
                  name="mail-outline"
                  size={14}
                  color={dark ? "#D1D5DB" : "#6B7280"}
                />
                <Text
                  className={`text-xs ml-1 ${dark ? "text-gray-300" : "text-gray-600"}`}
                >
                  {email}
                </Text>
              </View>
              <View className="flex-row items-center mt-1">
                <Ionicons
                  name="call-outline"
                  size={14}
                  color={dark ? "#D1D5DB" : "#6B7280"}
                />
                <Text
                  className={`text-xs ml-1 ${dark ? "text-gray-300" : "text-gray-600"}`}
                >
                  {phone}
                </Text>
              </View>
            </View>

            {/* Edit button */}
            <Pressable
              onPress={onEditProfile}
              className="px-3 py-2 rounded-xl bg-indigo-600"
            >
              <Text className="text-white text-sm font-semibold">Edit</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Sections */}
      <View className="px-5">
        <Text
          className={`text-xs mb-2 ${dark ? "text-gray-400" : "text-gray-400"}`}
        >
          ACCOUNT
        </Text>
        <View
          className={`rounded-2xl px-4 ${dark ? "bg-neutral-900" : "bg-white"} border border-gray-100`}
        >
          <Row
            icon="person-outline"
            title="Profile details"
            subtitle="Name, email, phone"
            onPress={onEditProfile}
          />
          <Row
            icon="key-outline"
            title="Change password"
            subtitle="Update your password"
            onPress={onChangePassword}
          />
        </View>

        <Text
          className={`text-xs mt-6 mb-2 ${dark ? "text-gray-400" : "text-gray-400"}`}
        >
          PREFERENCES
        </Text>
        <View
          className={`rounded-2xl px-4 ${dark ? "bg-neutral-900" : "bg-white"} border border-gray-100`}
        >
          <Row
            icon="moon-outline"
            title="Dark mode"
            subtitle={dark ? "On" : "Off"}
            right={<Switch value={dark} onValueChange={setDark} />}
          />
          <Row
            icon="notifications-outline"
            title="Notifications"
            subtitle="Push & in-app"
            onPress={() => Alert.alert("Notifications", "Coming soon.")}
          />
        </View>

        <Text
          className={`text-xs mt-6 mb-2 ${dark ? "text-gray-400" : "text-gray-400"}`}
        >
          SUPPORT
        </Text>
        <View
          className={`rounded-2xl px-4 ${dark ? "bg-neutral-900" : "bg-white"} border border-gray-100`}
        >
          <Row
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="FAQ, contact us"
            onPress={onHelp}
          />
          <Row
            icon="log-out-outline"
            title="Log out"
            subtitle="Sign out of this device"
            onPress={onLogout}
            right={<Ionicons name="exit-outline" size={18} color="#EF4444" />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default profile;
