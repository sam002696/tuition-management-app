import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import ShadowCard from "../../ui/ShadowCard";
import { colors, spacing, radius, getBadgeStyles, getIconCircleStyles } from "../../../theme";

/* ── build all 4 stat cards from API data ── */
const buildCards = (s = {}) => [
  {
    key: "students",
    stat: "students",
    label: "STUDENTS",
    value: String(s?.students_total ?? 0),
    icon: "users",
    chip:
      (s?.new_students_today ?? 0) > 0
        ? `+${s.new_students_today} today`
        : null,
    chipVariant: "green",
  },
  {
    key: "revenue",
    stat: "revenue",
    label: "REVENUE",
    value: s?.revenue_total != null ? `$${s.revenue_total}` : "$0",
    icon: "dollar-sign",
    chip:
      s?.revenue_change_pct != null
        ? `+${s.revenue_change_pct}%`
        : null,
    chipVariant: "green",
  },
  {
    key: "classes",
    stat: "classes",
    label: "CLASSES",
    value: String(s?.classes_total ?? 0),
    icon: "book-open",
    chip:
      (s?.classes_today ?? 0) > 0 ? `${s.classes_today} today` : null,
    chipVariant: "yellow",
  },
  {
    key: "completion",
    stat: "completion",
    label: "COMPLETION",
    value:
      s?.completion_rate != null ? `${s.completion_rate}%` : "0%",
    icon: "trending-up",
    chip:
      s?.completion_change != null ? `+${s.completion_change}%` : null,
    chipVariant: "blue",
  },
];

/* ── single stat card ── */
const StatCard = ({ item }) => {
  const iconStyles = getIconCircleStyles(item.stat);
  const chipStyles = item.chip ? getBadgeStyles(item.chipVariant) : null;

  return (
    <ShadowCard
      shadowSize="md"
      borderRadius={radius.card}
      padding={spacing.lg}
      style={styles.cardWrapper}
      cardStyle={styles.cardSurface}
    >
      {/* Top row: icon circle  |  delta chip */}
      <View style={styles.topRow}>
        <View style={[styles.iconCircle, iconStyles.container]}>
          <Feather name={item.icon} size={18} color={iconStyles.iconColor} />
        </View>

        {chipStyles && (
          <View style={chipStyles.container}>
            <Text style={chipStyles.text}>{item.chip}</Text>
          </View>
        )}
      </View>

      {/* Stat number */}
      <Text style={styles.statNumber}>{item.value}</Text>

      {/* Stat label */}
      <Text style={styles.statLabel}>{item.label}</Text>
    </ShadowCard>
  );
};

/* ── 2×2 grid ── */
const StatsGrid = ({ stats }) => {
  const cards = buildCards(stats);
  // Split into two rows of 2
  const row1 = cards.slice(0, 2);
  const row2 = cards.slice(2, 4);

  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        {row1.map((item) => (
          <StatCard key={item.key} item={item} />
        ))}
      </View>
      <View style={styles.row}>
        {row2.map((item) => (
          <StatCard key={item.key} item={item} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    gap: spacing.md,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },

  // ShadowCard outer wrapper — flex:1 so both cards in a row share width equally
  cardWrapper: {
    flex: 1,
  },

  // Clip any overflow inside the card surface (safety)
  cardSurface: {
    minHeight: 110,
  },

  // Top row: icon on left, chip on right
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  // Icon circle — 38×38, no border (border lives on the card)
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },

  // Large stat number
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: colors.black,
    marginTop: spacing.sm,
  },

  // Label below number
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default StatsGrid;
