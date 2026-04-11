import { View, Text, TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

/* ---------- helpers ---------- */
const fmtDuration = (m) => {
  if (!m || typeof m !== "number") return "—";
  if (m % 60 === 0) return `${m / 60}h`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h ? `${h}h ${r}m` : `${r}m`;
};

const STATUS_UI = {
  live: { bg: "#FCE7F3", color: "#9D174D", label: "Live", accent: "#EF4444" },
  starting_soon: {
    bg: "#FEE2E2",
    color: "#991B1B",
    label: "Starting soon",
    accent: "#8B5CF6",
  },
  upcoming: {
    bg: "#E0F2FE",
    color: "#075985",
    label: "Upcoming",
    accent: "#06B6D4",
  },
  completed: {
    bg: "#DCFCE7",
    color: "#065F46",
    label: "Completed",
    accent: "#10B981",
  },
  overdue: {
    bg: "#FEF3C7",
    color: "#92400E",
    label: "Missed",
    accent: "#F59E0B",
  },
};
const getUiForStatus = (status) =>
  STATUS_UI[status] || {
    bg: "#E5E7EB",
    color: "#374151",
    label: "Scheduled",
    accent: "#6366F1",
  };

/* ---------- subcomponents ---------- */
const StatusPill = ({ status }) => {
  const { bg, color, label } = getUiForStatus(status);
  return (
    <View className="px-2 py-1 rounded-full" style={{ backgroundColor: bg }}>
      <Text className="text-[11px] font-semibold" style={{ color }}>
        {label}
      </Text>
    </View>
  );
};

const EventCard = ({ item }) => {
  const ui = getUiForStatus(item.status);
  const duration = fmtDuration(item.duration_min);
  const subtitle = item?.student?.name
    ? `${item.student.name} • ${duration}`
    : duration;

  return (
    <View className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <View className="flex-row">
        {/* accent bar */}
        <View
          className="w-1.5 rounded-full mr-3"
          style={{ backgroundColor: ui.accent }}
        />

        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="font-semibold text-gray-900">{item.title}</Text>
              <Text className="text-xs text-gray-600 mt-0.5">{subtitle}</Text>
            </View>
            <StatusPill status={item.status} />
          </View>

          <View className="mt-3 flex-row items-center">
            <Feather name="clock" size={12} color="#4B5563" />
            <Text className="text-sm font-medium text-gray-700 ml-1">
              {item.starts_at_human}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

/* ---------- main ---------- */
const TodaysSchedule = ({ scheduleData = [] }) => {
  return (
    <View>
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-xl items-center justify-center bg-indigo-50 mr-2">
            <Ionicons name="calendar-outline" size={16} color="#4F46E5" />
          </View>
          <Text className="text-gray-900 font-semibold text-base">
            Today’s Schedule
          </Text>
        </View>

        <TouchableOpacity className="px-3 py-1.5 rounded-xl border border-gray-200">
          <Text className="text-xs text-gray-700">View all</Text>
        </TouchableOpacity>
      </View>

      {scheduleData.length === 0 ? (
        <View className="bg-white p-4 rounded-2xl border border-gray-100">
          <Text className="text-gray-600 text-sm">
            No classes scheduled for today.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {scheduleData.map((ev) => (
            <EventCard key={ev.id} item={ev} />
          ))}
        </View>
      )}
    </View>
  );
};

export default TodaysSchedule;
