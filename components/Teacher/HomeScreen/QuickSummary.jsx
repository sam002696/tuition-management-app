import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/* ---- small helpers ---- */
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const fmtPct = (v) => (v == null ? null : v % 1 === 0 ? `${v}` : v.toFixed(1));
const fmtDelta = (minsFloat) => {
  if (minsFloat == null) return null;
  const m = Math.round(minsFloat);
  const sign = Math.sign(m);
  const abs = Math.abs(m);
  const h = Math.floor(abs / 60);
  const r = abs % 60;
  const body = h > 0 ? `${h}h${r ? ` ${r}m` : ""}` : `${abs}m`;
  return sign >= 0 ? `in ${body}` : `${body} ago`;
};

const QuickSummary = ({ overview = {} }) => {
  const sessions = overview?.sessions_today ?? 0;
  const students = overview?.students_today ?? 0;
  const attendance = fmtPct(overview?.attendance_rate);
  const pending = overview?.pending_requests ?? 0;
  const next = overview?.next_class;

  const titleLine = `${plural(sessions, "Class", "Classes")} • ${plural(
    students,
    "Student",
    "Students"
  )}`;
  const nextLabel = fmtDelta(next?.starts_in_minutes);

  return (
    <View className="mt-6 bg-white/10 border border-white/20 rounded-2xl p-4">
      <View className="flex-row items-start justify-between">
        {/* Left: title + chips */}
        <View className="flex-1 pr-3">
          <Text className="text-white/80 text-xs">Today’s Overview</Text>
          <Text className="text-white font-semibold text-lg mt-1">
            {titleLine}
          </Text>

          {/* mini chips */}
          <View className="flex-row mt-2">
            {attendance !== null && (
              <View className="px-2 py-1 rounded-full bg-emerald-400/20 mr-2">
                <Text className="text-[11px] font-semibold text-emerald-50">
                  Attendance {attendance}%
                </Text>
              </View>
            )}
            {pending > 0 && (
              <View className="px-2 py-1 rounded-full bg-amber-400/20">
                <Text className="text-[11px] font-semibold text-amber-50">
                  {pending} Pending request{pending > 1 ? "s" : ""}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Right: next class */}
        <View className="items-end">
          <Text className="text-white/80 text-xs">Next class</Text>

          {next ? (
            <>
              <View className="mt-1 px-2 py-1 rounded-lg bg-white/15 flex-row items-center">
                <Ionicons name="time-outline" size={12} color="#fff" />
                <Text className="ml-1 text-white text-xs font-semibold">
                  {nextLabel}
                </Text>
              </View>

              <TouchableOpacity
                className="mt-3 px-3 py-2 rounded-xl bg-white/90 flex-row items-center"
                // onPress={() => ...} // hook up your join/start action here
              >
                <Ionicons name="play-circle" size={16} color="#111827" />
                <Text className="ml-1 font-semibold text-gray-900 text-xs">
                  Start early
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View className="mt-1 px-2 py-1 rounded-lg bg-white/10">
              <Text className="text-white/70 text-xs font-semibold">
                All done
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default QuickSummary;
