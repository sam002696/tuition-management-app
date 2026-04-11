import { View, Text, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";

/* tiny helper to build cards from API stats */
const buildCards = (s = {}) => [
  {
    key: "students",
    label: "Students",
    value: String(s?.students_total ?? 0),
    icon: "users",
    tint: "#3B82F6", // blue
    chip:
      (s?.new_students_today ?? 0) > 0
        ? `+${s?.new_students_today} today`
        : null,
  },
  {
    key: "classes",
    label: "Classes",
    value: String(s?.classes_total ?? 0),
    icon: "book-open",
    tint: "#F59E0B", // amber
    chip: `${s?.classes_today ?? 0} today`,
  },
];

const Card = ({ item }) => {
  return (
    <View className="flex-1 rounded-2xl bg-white border border-gray-100 shadow-sm p-4 overflow-hidden">
      {/* soft backdrop blobs */}
      <View
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10"
        style={{ backgroundColor: item.tint }}
      />
      <View
        className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full opacity-10"
        style={{ backgroundColor: item.tint }}
      />

      <View className="flex-row items-center justify-between">
        <View
          className="p-2 rounded-xl"
          style={{ backgroundColor: item.tint + "22" }}
        >
          <Feather name={item.icon} size={16} color={item.tint} />
        </View>

        {item.chip ? (
          <Text
            className="px-2 py-1 rounded-full text-[11px] font-semibold"
            style={{ color: item.tint, backgroundColor: item.tint + "14" }}
          >
            {item.chip}
          </Text>
        ) : (
          <View />
        )}
      </View>

      <Text className="mt-3 text-2xl font-bold text-gray-900">
        {item.value}
      </Text>
      <Text className="text-xs text-gray-600 mt-0.5">{item.label}</Text>
    </View>
  );
};

const StatsGrid = ({ stats }) => {
  const cards = buildCards(stats);
  return (
    <FlatList
      data={cards}
      keyExtractor={(it) => it.key}
      numColumns={2}
      scrollEnabled={false}
      columnWrapperStyle={{ gap: 12 }}
      contentContainerStyle={{ gap: 12 }}
      renderItem={({ item }) => <Card item={item} />}
    />
  );
};

export default StatsGrid;
