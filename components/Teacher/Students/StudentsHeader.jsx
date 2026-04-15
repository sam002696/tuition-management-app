import { memo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, borders, getBadgeStyles } from "../../../theme";

/* ── Tab segment ─────────────────────────────────────────────────────────── */
function TabSegment({ tabs, activeTab, onTabChange, countsByKey }) {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => {
        const isActive    = activeTab === tab.key;
        const count       = countsByKey[tab.key] ?? 0;
        const countBadge  = getBadgeStyles(tab.countVariant);

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.75}
            style={[styles.tabBtn, isActive && styles.tabBtnActive]}
          >
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label.toUpperCase()}
            </Text>

            {/* Count chip */}
            <View
              style={[
                countBadge.container,
                styles.countChip,
                isActive && styles.countChipActive,
              ]}
            >
              <Text
                style={[
                  countBadge.text,
                  isActive && styles.countChipTextActive,
                ]}
              >
                {count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* ── Main header ─────────────────────────────────────────────────────────── */
function StudentsHeader({
  tabs = [],
  activeTab,
  onTabChange,
  query,
  onChangeQuery,
  loading,
  countsByKey = {},
  onAddPress,
  onRefresh,
  refreshing,
}) {
  const teacherBadge = getBadgeStyles("yellow");
  const [isFocused, setIsFocused]  = useState(false);

  return (
    <View style={styles.root}>
      {/* ── App bar: TUITION | [refresh] [TEACHER] ── */}
      <View style={styles.appBar}>
        <Text style={styles.appTitle}>TUITION</Text>

        <View style={styles.appBarRight}>
          {/* Refresh icon */}
          {refreshing ? (
            <ActivityIndicator
              size="small"
              color={colors.black}
              style={styles.refreshSpinner}
            />
          ) : (
            <TouchableOpacity
              onPress={onRefresh}
              disabled={refreshing}
              hitSlop={10}
              style={styles.iconBtn}
              activeOpacity={0.7}
            >
              <Feather name="refresh-cw" size={16} color={colors.black} />
            </TouchableOpacity>
          )}

          {/* TEACHER badge */}
          <View style={teacherBadge.container}>
            <Text style={teacherBadge.text}>TEACHER</Text>
          </View>
        </View>
      </View>

      {/* ── Page title row: MY STUDENTS | + Add ── */}
      <View style={styles.titleRow}>
        <Text style={styles.pageTitle}>MY STUDENTS</Text>

        <TouchableOpacity
          onPress={onAddPress}
          activeOpacity={0.8}
          style={styles.addBtn}
        >
          <Feather name="user-plus" size={14} color={colors.white} />
          <Text style={styles.addBtnText}>ADD</Text>
        </TouchableOpacity>
      </View>

      {/* ── Search input ── */}
      <View
        style={[
          styles.searchInput,
          isFocused && styles.searchInputFocused,
        ]}
      >
        <Ionicons
          name="search-outline"
          size={16}
          color={colors.textMeta}
        />
        <TextInput
          value={query}
          onChangeText={onChangeQuery}
          placeholder="Search by student name…"
          placeholderTextColor={colors.textMeta}
          returnKeyType="search"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.searchTextInput}
        />
        {loading ? (
          <ActivityIndicator size="small" color={colors.textMeta} />
        ) : !!query ? (
          <TouchableOpacity
            onPress={() => onChangeQuery("")}
            hitSlop={10}
          >
            <Ionicons name="close-circle" size={18} color={colors.textMeta} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* ── Tab segment ── */}
      <TabSegment
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        countsByKey={countsByKey}
      />
    </View>
  );
}

export default memo(StudentsHeader);

/* ── Styles ────────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },

  // ── App bar ──────────────────────────────────────────────────────────────
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: -0.3,
    color: colors.black,
  },
  appBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    borderWidth: borders.width,
    borderColor: borders.color,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  refreshSpinner: {
    width: 32,
    height: 32,
  },

  // ── Page title row ────────────────────────────────────────────────────────
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: -0.3,
    color: colors.black,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.blue,
    borderWidth: borders.width,
    borderColor: borders.color,
    borderRadius: radius.button,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    color: colors.white,
  },

  // ── Search input ──────────────────────────────────────────────────────────
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: borders.width,
    borderColor: borders.color,
    borderRadius: radius.input,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchInputFocused: {
    borderColor: colors.blue,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    color: colors.black,
    padding: 0,           // remove default TextInput padding on Android
  },

  // ── Tab segment ───────────────────────────────────────────────────────────
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderWidth: borders.width,
    borderColor: borders.color,
    borderRadius: radius.input,   // 12 — slightly soft but not pill
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    gap: spacing.xs,
    backgroundColor: "transparent",
  },
  tabBtnActive: {
    backgroundColor: colors.black,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: colors.textMeta,
  },
  tabLabelActive: {
    color: colors.white,
  },

  // Count chip — overrides badge base for tighter sizing inside tab
  countChip: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    minWidth: 18,
    alignItems: "center",
  },
  countChipActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: "rgba(255,255,255,0.3)",
  },
  countChipTextActive: {
    color: colors.white,
  },
});
