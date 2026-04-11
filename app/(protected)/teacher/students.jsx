import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import StudentsHeader from "../../../components/Teacher/Students/StudentsHeader";
import StudentCard from "../../../components/Teacher/Students/StudentCard";
import StudentCardSkeleton from "../../../components/Teacher/Students/StudentCardSkeleton";

/* ------------ Tab config & filter mapping ------------ */
const TABS = [
  {
    key: "active",
    label: "Active",
    icon: "checkmark-done-circle-outline",
    color: "#10B981",
  },
  { key: "pending", label: "Pending", icon: "time-outline", color: "#F59E0B" },
  {
    key: "archived",
    label: "Archived",
    icon: "archive-outline",
    color: "#6B7280",
  },
];

const FILTERS_BY_TAB = {
  active: { status: "accepted", is_active: 1 },
  pending: { status: "pending" },
  archived: { status: "accepted", is_active: 0 },
};

export default function StudentsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    connectionRequests = [],
    connectionCount,
    loading,
  } = useSelector((s) => s.studentManagement);

  const [activeTab, setActiveTab] = useState("active");
  const [query, setQuery] = useState("");
  const searchTimerRef = useRef(null);

  // fetch counts once
  useEffect(() => {
    dispatch({ type: "CONNECTION_COUNT" });
  }, [dispatch]);

  // fetch list on tab change (+ initial)
  useEffect(() => {
    const filters = {
      ...FILTERS_BY_TAB[activeTab],
      per_page: 10,
      page: 1,
      ...(query.trim() ? { search: query.trim() } : {}),
    };
    dispatch({ type: "FETCH_CONNECTION_REQUESTS", payload: { filters } });
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
  }, [activeTab, dispatch]); // eslint-disable-line

  // Debounced search (300ms)
  const onChangeQuery = (text) => {
    setQuery(text);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      const filters = {
        ...FILTERS_BY_TAB[activeTab],
        per_page: 10,
        page: 1,
        ...(text.trim() ? { search: text.trim() } : {}),
      };
      dispatch({ type: "FETCH_CONNECTION_REQUESTS", payload: { filters } });
    }, 300);
  };

  const onView = (conn) => {
    console.log("activeTab", activeTab);
    router.push({
      pathname: "/studentDetails",
      params: {
        connection_id: conn?.id,
      },
    });
  };
  const onEdit = (conn) => {
    // console.log("conn", conn?.tuition_details?.id);
    router.push({
      pathname: "/editStudentDetails",
      params: {
        tuition_details_id: conn?.tuition_details?.id,
        student_name: conn?.student?.name,
        student_id: conn?.student?.custom_id,
      },
    });
  };

  const onDelete = (item) =>
    Alert.alert("Delete", `Delete ${item?.student?.name || ""}?`);
  const onAddPress = () => Alert.alert("Add", "Add new student");

  const countByKey = useMemo(
    () => ({
      active: connectionCount?.active_accepted ?? 0,
      pending: connectionCount?.pending ?? 0,
      archived: connectionCount?.inactive_accepted ?? 0,
    }),
    [connectionCount]
  );

  const refreshList = () => {
    // cancelling any pending debounced search
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }

    const filters = {
      ...FILTERS_BY_TAB[activeTab],
      per_page: 10,
      page: 1,
      ...(query.trim() ? { search: query.trim() } : {}),
    };

    // refresh list
    dispatch({ type: "FETCH_CONNECTION_REQUESTS", payload: { filters } });
    dispatch({ type: "CONNECTION_COUNT" });
  };

  const headerEl = useMemo(
    () => (
      <StudentsHeader
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        query={query}
        onChangeQuery={onChangeQuery}
        loading={loading}
        countsByKey={countByKey}
        onAddPress={onAddPress}
        onRefresh={refreshList}
        refreshing={loading}
      />
    ),
    [activeTab, query, loading, countByKey]
  );

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={connectionRequests}
        keyExtractor={(it) => String(it.id)}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <StudentCard
              item={item}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </View>
        )}
        ListHeaderComponent={headerEl}
        ListFooterComponent={
          loading ? (
            <View className="px-4 py-4">
              {[0, 1, 2].map((i) => (
                <View key={i} style={{ marginTop: i ? 16 : 0 }}>
                  <StudentCardSkeleton />
                </View>
              ))}
            </View>
          ) : (
            <View style={{ height: 16 }} />
          )
        }
        ListEmptyComponent={
          !loading ? (
            <View className="px-6 pt-10 items-center">
              <Image
                source={require("../../../assets/images/students/no_data.png")}
                style={{ width: 450, height: 450 }}
                resizeMode="contain"
                accessible
                accessibilityRole="image"
                accessibilityLabel="No students found illustration"
              />
              <Text className="text-lg  text-gray-600 font-semibold">
                No students found
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="never"
      />
    </SafeAreaView>
  );
}
