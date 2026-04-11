// Header.js
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import useAuth from "../../../hooks/useAuth";
import InitialsAvatar from "../../ui/InitialsAvatar";

function getGreeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Header() {
  const [greeting, setGreeting] = useState(getGreeting());
  const { user } = useAuth();

  const displayName = user?.name || "Teacher";

  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="mr-3">
            <InitialsAvatar
              name={displayName}
              size={48}
              showGlow
              glowPadding={4}
              glowBgClass="bg-white/15"
            />
          </View>

          <View>
            <Text className="text-white/80 text-xs">{greeting}</Text>
            <Text className="text-white font-bold text-xl leading-6">
              {displayName}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <TouchableOpacity className="p-2 rounded-full bg-white/15 mr-2">
            <Feather name="search" size={18} color="white" />
          </TouchableOpacity>

          <TouchableOpacity className="p-2 rounded-full bg-white/15 mr-2 relative">
            <Ionicons name="notifications-outline" size={18} color="white" />
            <View className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-indigo-600" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
