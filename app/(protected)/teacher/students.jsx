import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import StudentsHeader from "../../../components/Teacher/Students/StudentsHeader";
import StudentCard from "../../../components/Teacher/Students/StudentCard";
import StudentCardSkeleton from "../../../components/Teacher/Students/StudentCardSkeleton";
import GridBackground from "../../../components/ui/GridBackground";
import { colors, spacing } from "../../../theme";

/* ── Tab config ── */
const TABS = [
  { key: "active",   label: "Active",   countVariant: "green"  },
  { key: "pending",  label: "Pending",  countVariant: "yellow" },
  { key: "archived", label: "Archived", countVariant: "blue"   },
];

const FILTERS_BY_TAB = {
  active:   { status: "accepted", is_active: 1 },
  pending:  { status: "pending" },
  archived: { status: "accepted", is_active: 0 },
};

export default function StudentsScreen() {
  const router    = useRouter();
  const dispatch  = useDispatch();
  const { connectionRequests = [], connectionCount, loading } = useSelector(
    (s) => s.studentManagement
  );

  const [activeTab, setActiveTab] = useState("active");
  const [query,     setQuery]     = useState("");
  const searchTimerRef            = useRef(null);

  /* ── fetch counts once ── */
  useEffect(() => {
    dispatch({ type: "CONNECTION_COUNT" });
  }, [dispatch]);

  /* ── fetch list on tab change ── */
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

  /* ── debounced search ── */
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

  /* ── navigation ── */
  const onView = (conn) =>
    router.push({ pathname: "/studentDetails", params: { connection_id: conn?.id } });

  const onEdit = (conn) =>
    router.push({
      pathname: "/editStudentDetails",
      params: {
        tuition_details_id: conn?.tuition_details?.id,
        student_name:       conn?.student?.name,
        student_id:         conn?.student?.custom_id,
      },
    });

  const onDelete  = (item) => Alert.alert("Delete", `Delete ${item?.student?.name || ""}?`);
  const onAddPress = () => Alert.alert("Add", "Add new student");

  /* ── counts per tab ── */
  const countByKey = useMemo(
    () => ({
      active:   connectionCount?.active_accepted   ?? 0,
      pending:  connectionCount?.pending           ?? 0,
      archived: connectionCount?.inactive_accepted ?? 0,
    }),
    [connectionCount]
  );

  /* ── refresh ── */
  const refreshList = () => {
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
    dispatch({ type: "FETCH_CONNECTION_REQUESTS", payload: { filters } });
    dispatch({ type: "CONNECTION_COUNT" });
  };

  /* ── memoised header ── */
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
    [activeTab, query, loading, countByKey] // eslint-disable-line
  );

  /* ── cleanup ── */
  useEffect(
    () => () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    },
    []
  );

  return (
    <SafeAreaView style={styles.root}>
      <GridBackground>
        <FlatList
          data={connectionRequests}
          keyExtractor={(it) => String(it.id)}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
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
              <View style={styles.skeletonWrapper}>
                {[0, 1, 2].map((i) => (
                  <View key={i} style={i > 0 && styles.skeletonGap}>
                    <StudentCardSkeleton />
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.footerSpacer} />
            )
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyWrapper}>
                <Image
                  source={require("../../../assets/images/students/no_data.png")}
                  style={styles.emptyImage}
                  resizeMode="contain"
                  accessibilityRole="image"
                  accessibilityLabel="No students found illustration"
                />
                <Text style={styles.emptyText}>No students found</Text>
                <Text style={styles.emptySubText}>
                  Try adjusting your search or filter
                </Text>
              </View>
            ) : null
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        />
      </GridBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  listContent: {
    paddingBottom: 32,
  },

  // Each student card — horizontal screen padding
  cardWrapper: {
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.lg,
  },

  // Skeleton footer
  skeletonWrapper: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
  },
  skeletonGap: {
    marginTop: spacing.lg,
  },

  // List footer spacer
  footerSpacer: {
    height: spacing.lg,
  },

  // Empty state
  emptyWrapper: {
    paddingHorizontal: spacing.xl,
    paddingTop: 48,
    alignItems: "center",
  },
  emptyImage: {
    width: 260,
    height: 260,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: -0.3,
    color: colors.black,
    marginTop: spacing.lg,
  },
  emptySubText: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
