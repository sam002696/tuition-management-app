import { Tabs } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { colors, spacing, borders, radius } from "../../../theme";

// ─────────────────────────────────────────────────────────────────────────────
// Tab definitions — LEFT of FAB and RIGHT of FAB
// ─────────────────────────────────────────────────────────────────────────────
const LEFT_TABS = [
  {
    name: "index",
    label: "HOME",
    icon: (active) => (
      <AntDesign
        name="home"
        size={20}
        color={active ? colors.black : colors.textMeta}
      />
    ),
  },
  {
    name: "students",
    label: "STUDENTS",
    icon: (active) => (
      <Feather
        name="users"
        size={20}
        color={active ? colors.black : colors.textMeta}
      />
    ),
  },
];

const RIGHT_TABS = [
  {
    name: "schedule",
    label: "SCHEDULE",
    icon: (active) => (
      <Feather
        name="calendar"
        size={20}
        color={active ? colors.black : colors.textMeta}
      />
    ),
  },
  {
    name: "profile",
    label: "PROFILE",
    icon: (active) => (
      <Ionicons
        name="person-outline"
        size={20}
        color={active ? colors.black : colors.textMeta}
      />
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Tab item
// ─────────────────────────────────────────────────────────────────────────────
function TabItem({ tab, isActive, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.tabItem}
    >
      <View style={[styles.iconBox, isActive && styles.iconBoxActive]}>
        {tab.icon(isActive)}
      </View>
      <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Centre FAB — uses same twin-view shadow pattern as ShadowCard
// ─────────────────────────────────────────────────────────────────────────────
function FABButton({ onPress }) {
  return (
    // Outer container reserves space for shadow offset (2px each side)
    <View style={styles.fabOuter}>
      {/* Shadow layer — absoluteFill + top/left offset */}
      <View style={styles.fabShadow} />
      {/* FAB surface */}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.fab}
      >
        <AntDesign name="plus" size={22} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom tab bar
// Uses the exact twin-view shadow pattern as <ShadowCard>:
//   innerWrapper  →  position: relative, marginBottom/Right = shadow offset
//   navShadow     →  absoluteFillObject override with top/left = offset
//   navBar        →  normal flow, sits above shadow because rendered after
// ─────────────────────────────────────────────────────────────────────────────
function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const activeRouteName = state.routes[state.index]?.name;

  const go = (name) => navigation.navigate(name);

  return (
    // Outer: horizontal float + safe-area bottom padding
    <View
      style={[
        styles.floatWrapper,
        { paddingBottom: Math.max(insets.bottom, spacing.sm) },
      ]}
    >
      {/*
        Inner: this is the "sized" container.
        marginBottom/Right = shadow offset (3px) so shadow isn't clipped.
      */}
      <View style={styles.innerWrapper}>
        {/* Shadow layer — same dimensions as navBar, shifted 3×3 */}
        <View style={styles.navShadow} />

        {/* Nav bar surface — rendered after shadow so it sits on top */}
        <View style={styles.navBar}>
          {LEFT_TABS.map((tab) => (
            <TabItem
              key={tab.name}
              tab={tab}
              isActive={activeRouteName === tab.name}
              onPress={() => go(tab.name)}
            />
          ))}

          <FABButton onPress={() => go("connect")} />

          {RIGHT_TABS.map((tab) => (
            <TabItem
              key={tab.name}
              tab={tab}
              isActive={activeRouteName === tab.name}
              onPress={() => go(tab.name)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout
// ─────────────────────────────────────────────────────────────────────────────
export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="students" />
      <Tabs.Screen name="connect" />
      <Tabs.Screen name="schedule" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const NAV_SHADOW_OFFSET = 3; // md shadow
const FAB_SHADOW_OFFSET = 2; // sm shadow
const FAB_SIZE = 46;

const styles = StyleSheet.create({
  // ── Outer float wrapper ───────────────────────────────────────────────────
  // Keeps the bar away from screen edges and handles safe area.
  floatWrapper: {
    paddingHorizontal: spacing.lg, // 16px each side
    backgroundColor: "transparent",
  },

  // ── Inner wrapper ─────────────────────────────────────────────────────────
  // Reserves space for the shadow so it's never clipped.
  innerWrapper: {
    position: "relative",
    marginBottom: NAV_SHADOW_OFFSET,
    marginRight: NAV_SHADOW_OFFSET,
  },

  // ── Nav bar flat shadow (twin View) ───────────────────────────────────────
  // Fills innerWrapper via absoluteFillObject, then overrides top/left
  // to shift it by the offset. right/bottom stay at 0 → same width/height
  // as innerWrapper → same width/height as navBar.
  navShadow: {
    ...StyleSheet.absoluteFillObject,
    top: NAV_SHADOW_OFFSET,
    left: NAV_SHADOW_OFFSET,
    borderRadius: radius.nav,   // 20
    backgroundColor: colors.black,
  },

  // ── Nav bar surface ───────────────────────────────────────────────────────
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: borders.width,       // 2px
    borderColor: borders.color,       // #1A1A1A
    borderRadius: radius.nav,         // 20
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,    // 16px
  },

  // ── Tab item ──────────────────────────────────────────────────────────────
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },

  // 34×34 icon box, borderRadius 10
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  iconBoxActive: {
    backgroundColor: colors.yellow,  // #FFE033
  },

  // Tab label typography
  tabLabel: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: colors.textMeta,          // #AAAAAA
  },
  tabLabelActive: {
    color: colors.black,             // #1A1A1A
  },

  // ── FAB outer container ───────────────────────────────────────────────────
  // Size = FAB_SIZE + shadow offset on each axis.
  fabOuter: {
    width: FAB_SIZE + FAB_SHADOW_OFFSET,
    height: FAB_SIZE + FAB_SHADOW_OFFSET,
    marginHorizontal: 6,
    position: "relative",
  },

  // FAB shadow (sm: 2×2) — twin View pattern
  fabShadow: {
    ...StyleSheet.absoluteFillObject,
    top: FAB_SHADOW_OFFSET,
    left: FAB_SHADOW_OFFSET,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: radius.circle,
    backgroundColor: colors.black,
  },

  // FAB surface
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: radius.circle,
    backgroundColor: colors.blue,    // #4BC8F5
    borderWidth: borders.width,      // 2px
    borderColor: borders.color,      // #1A1A1A
    alignItems: "center",
    justifyContent: "center",
  },
});
