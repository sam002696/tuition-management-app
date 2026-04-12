import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import ShadowCard from "../../ui/ShadowCard";
import { colors, spacing, radius, getBadgeStyles } from "../../../theme";

/* ── duration formatter ── */
const fmtDuration = (m) => {
  if (!m || typeof m !== "number") return "—";
  if (m % 60 === 0) return `${m / 60}h`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h ? `${h}h ${r}m` : `${r}m`;
};

/* ── status → design-system badge variant + accent bar color ── */
const STATUS_CONFIG = {
  live: {
    badgeVariant: "red",
    label: "LIVE",
    accentColor: colors.red,
  },
  starting_soon: {
    badgeVariant: "red",
    label: "STARTING SOON",
    accentColor: colors.blue,
  },
  upcoming: {
    badgeVariant: "blue",
    label: "UPCOMING",
    accentColor: colors.amber,
  },
  completed: {
    badgeVariant: "green",
    label: "COMPLETED",
    accentColor: colors.green,
  },
  overdue: {
    badgeVariant: "pink",
    label: "MISSED",
    accentColor: colors.amber,
  },
};

const getStatusConfig = (status) =>
  STATUS_CONFIG[status] ?? {
    badgeVariant: "blue",
    label: "SCHEDULED",
    accentColor: colors.blue,
  };

/* ── section header ── */
const SectionHeader = () => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>TODAY'S SCHEDULE</Text>
    <TouchableOpacity>
      <Text style={styles.viewAll}>View all</Text>
    </TouchableOpacity>
  </View>
);

/* ── single event card ── */
const EventCard = ({ item }) => {
  const config = getStatusConfig(item.status);
  const badgeStyles = getBadgeStyles(config.badgeVariant);
  const duration = fmtDuration(item.duration_min);
  const meta = [item.starts_at_human, duration, item?.student?.name]
    .filter(Boolean)
    .join(" · ");

  return (
    <ShadowCard
      shadowSize="md"
      borderRadius={radius.cardSm}
      padding={0}
      cardStyle={styles.eventCardSurface}
    >
      <View style={styles.eventRow}>
        {/* Accent bar */}
        <View
          style={[styles.accentBar, { backgroundColor: config.accentColor }]}
        />

        {/* Content */}
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.metaRow}>
            <Feather name="clock" size={11} color={colors.textMeta} />
            <Text style={styles.metaText}>{meta}</Text>
          </View>
        </View>

        {/* Status badge */}
        <View style={badgeStyles.container}>
          <Text style={badgeStyles.text}>{config.label}</Text>
        </View>
      </View>
    </ShadowCard>
  );
};

/* ── empty state ── */
const EmptyCard = () => (
  <ShadowCard shadowSize="md" borderRadius={radius.cardSm}>
    <Text style={styles.emptyText}>No classes scheduled for today.</Text>
  </ShadowCard>
);

/* ── main component ── */
const TodaysSchedule = ({ scheduleData = [] }) => (
  <View>
    <SectionHeader />

    <View style={styles.list}>
      {scheduleData.length === 0 ? (
        <EmptyCard />
      ) : (
        scheduleData.map((ev) => <EventCard key={ev.id} item={ev} />)
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  // Section header row
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: -0.2,
    color: colors.black,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.black,
    textDecorationLine: "underline",
  },

  // Card list gap
  list: {
    gap: spacing.md,
  },

  // Inner layout of each event card
  eventCardSurface: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingRight: spacing.lg,
    gap: spacing.md,
  },

  // Left accent bar: 4px wide, 36px tall
  accentBar: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginLeft: spacing.lg,
    flexShrink: 0,
  },

  // Event text block
  eventContent: {
    flex: 1,
    gap: 4,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.black,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textMeta,
  },

  // Empty state
  emptyText: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textSecondary,
  },
});

export default TodaysSchedule;
