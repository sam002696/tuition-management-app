import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Header = ({
  query,
  onChangeQuery,
  onClearQuery,
  isSearching,
  onRefreshPress,
  refreshing,
}) => {
  return (
    <>
      {/* Hero header */}
      <View className="bg-indigo-600 px-4 pt-5 pb-6 rounded-b-2xl">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-2xl font-extrabold">Schedule</Text>
          <TouchableOpacity
            className="bg-white/90 px-3 py-2 rounded-xl flex-row items-center"
            onPress={() => {}}
          >
            <Ionicons name="person-add-outline" size={18} color="#111827" />
            <Text className="ml-1 font-semibold text-gray-900">
              Add Student
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-white mt-1 opacity-90">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </Text>

        {/* Search */}
        <View
          className="mt-4 rounded-xl px-3 py-2 flex-row items-center border"
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            borderColor: "rgba(255,255,255,0.2)",
          }}
        >
          <Ionicons name="search" size={16} color="white" />
          <TextInput
            value={query}
            onChangeText={onChangeQuery}
            placeholder="Search students, subjects, phone…"
            placeholderTextColor="rgba(255,255,255,0.85)"
            className="ml-2 text-white flex-1"
            returnKeyType="search"
          />
          {isSearching ? (
            <ActivityIndicator size="small" />
          ) : !!query ? (
            <TouchableOpacity
              onPress={onClearQuery}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={18} color="white" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Section title + refresh */}
      <View className="px-4 mt-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View
            className="w-8 h-8 rounded-xl items-center justify-center"
            style={{ backgroundColor: "#EEF2FF" }}
          >
            <Ionicons name="people-outline" size={18} color="#4F46E5" />
          </View>
          <Text className="text-sm font-semibold text-gray-900">
            Active Students
          </Text>
        </View>

        <TouchableOpacity
          onPress={onRefreshPress}
          disabled={!!refreshing}
          className="w-9 h-9 rounded-xl items-center justify-center"
          style={{ backgroundColor: "#EEF2FF", opacity: refreshing ? 0.6 : 1 }}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          accessibilityRole="button"
          accessibilityLabel="Refresh"
        >
          {refreshing ? (
            <ActivityIndicator size="small" />
          ) : (
            <Ionicons name="refresh-outline" size={18} color="#4F46E5" />
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Header;
