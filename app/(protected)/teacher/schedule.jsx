import { useEffect, useState, useMemo } from "react";
import { View, SafeAreaView, FlatList, Text } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import StudentRow from "../../../components/Teacher/ScheduleScreen/StudentRow";
import StudentRowSkeleton from "../../../components/Teacher/ScheduleScreen/StudentRowSkeleton";
import Header from "../../../components/Teacher/ScheduleScreen/Header";
import PaginationFooter from "../../../components/ui/PaginationFooter";

/* ---------------- Helpers ---------------- */
function SkeletonList({ count = 5 }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ marginBottom: 10 }}>
          <StudentRowSkeleton />
        </View>
      ))}
    </View>
  );
}

function EmptyState() {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
      <Text className="text-gray-500">No active students found.</Text>
    </View>
  );
}

/* ---------------- Screen ---------------- */
export default function ScheduleScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    activeConnections = [],
    loading,
    pagination,
  } = useSelector((state) => state.scheduleTuitionEvents);

  const [query, setQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Initial load: page 1
  useEffect(() => {
    dispatch({
      type: "FETCH_ACTIVE_CONNECTION_STUDENTS",
      payload: { filters: { per_page: 5, page: 1 } },
    });
    return () => {
      // cancel any pending debounced search when unmounting
      dispatch({ type: "CANCEL_ACTIVE_STUDENTS_SEARCH" });
    };
  }, [dispatch]);

  // Reset local flags when global loading finishes
  useEffect(() => {
    if (!loading) {
      setIsRefreshing(false);
      setIsLoadingMore(false);
      setIsSearching(false);
    }
  }, [loading]);

  // Pagination shape from API
  const currentPage = pagination?.current_page ?? 1;
  const totalPages = pagination?.total_pages ?? 1;
  const totalItems = pagination?.total ?? activeConnections.length;
  const perPage = pagination?.per_page ?? 5;
  const hasMore =
    typeof pagination?.has_more_pages === "boolean"
      ? pagination.has_more_pages
      : currentPage < totalPages;

  const canLoadMore = useMemo(
    () => activeConnections.length > 0 && hasMore,
    [activeConnections.length, hasMore]
  );

  const isInitialLoading =
    loading &&
    activeConnections.length === 0 &&
    !isRefreshing &&
    !isLoadingMore &&
    !isSearching;

  const handleLoadMore = () => {
    if (isLoadingMore || !canLoadMore) return;
    setIsLoadingMore(true);
    const nextPage = Math.min(currentPage + 1, totalPages);
    dispatch({
      type: "FETCH_ACTIVE_CONNECTION_STUDENTS",
      payload: { filters: { per_page: perPage, page: nextPage } },
    });
  };

  const onRefresh = () => {
    if (isInitialLoading || isRefreshing) return;
    setIsRefreshing(true);
    dispatch({
      type: "FETCH_ACTIVE_CONNECTION_STUDENTS",
      payload: { filters: { per_page: perPage, page: 1 } },
    });
  };

  // Search handlers (debounced by saga)
  const handleChangeQuery = (text) => {
    setQuery(text);
    const search = text.trim();

    if (search.length === 0) {
      // clear search → cancel debounce and reload page 1
      dispatch({ type: "CANCEL_ACTIVE_STUDENTS_SEARCH" });
      setIsSearching(false);
      dispatch({
        type: "FETCH_ACTIVE_CONNECTION_STUDENTS",
        payload: { filters: { per_page: perPage, page: 1 } },
      });
      return;
    }

    // trigger debounced search in saga
    setIsSearching(true);
    dispatch({
      type: "FETCH_ACTIVE_CONNECTION_STUDENTS_SEARCH",
      payload: { filters: { per_page: perPage, page: 1, search } },
    });
  };

  const handleClearQuery = () => handleChangeQuery("");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={activeConnections}
        keyExtractor={(it) => String(it.id)}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16 }}>
            <StudentRow
              item={item}
              onViewCalendar={(params) =>
                router.push({
                  pathname: "/calender/[id]",
                  params: { id: item.id, ...params },
                })
              }
            />
          </View>
        )}
        ListHeaderComponent={
          <Header
            query={query}
            onChangeQuery={handleChangeQuery}
            onClearQuery={handleClearQuery}
            isSearching={isSearching}
            STUDENTS={activeConnections}
            onRefreshPress={() => {
              // main API call (page 1)
              dispatch({
                type: "FETCH_ACTIVE_CONNECTION_STUDENTS",
                payload: { filters: { per_page: perPage, page: 1 } },
              });
            }}
            refreshing={loading}
          />
        }
        ListHeaderComponentStyle={{ marginBottom: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={
          <PaginationFooter
            loading={isLoadingMore}
            canLoadMore={canLoadMore}
            onLoadMore={handleLoadMore}
            currentPage={currentPage}
            totalPages={totalPages}
            totalShown={activeConnections.length}
            total={totalItems}
          />
        }
        ListEmptyComponent={
          isInitialLoading ||
          (isSearching && activeConnections.length === 0) ? (
            <SkeletonList count={5} />
          ) : (
            <EmptyState />
          )
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
}
