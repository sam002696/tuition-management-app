import { View, Text, StyleSheet } from "react-native";
import ShadowCard from "../../ui/ShadowCard";
import { colors, spacing, radius, getBadgeStyles } from "../../../theme";

/* ── helpers ── */
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const fmtPct = (v) =>
  v == null ? null : v % 1 === 0 ? `${v}` : v.toFixed(1);

const QuickSummary = ({ overview = {} }) => {
  const sessions = overview?.sessions_today ?? 0;
  const students = overview?.students_today ?? 0;
  const attendance = fmtPct(overview?.attendance_rate);
  const pending = overview?.pending_requests ?? 0;

  const heroLine = `${plural(sessions, "Class", "Classes")} · ${plural(
    students,
    "Student",
    "Students"
  )}`;

  const blackBadge = getBadgeStyles("black");
  const yellowBadge = getBadgeStyles("yellow");

  return (
    <ShadowCard
      shadowSize="lg"
      backgroundColor={colors.blue}
      borderRadius={radius.card}
      padding={spacing.xl}
      cardStyle={styles.cardSurface}
    >
      {/* Decorative circle — top-right */}
      <View style={styles.decoCircle} pointerEvents="none" />

      {/* Section label */}
      <Text style={styles.label}>TODAY'S OVERVIEW</Text>

      {/* Hero text */}
      <Text style={styles.heroText}>{heroLine.toUpperCase()}</Text>

      {/* Chips row */}
      <View style={styles.chipRow}>
        {attendance !== null && (
          <View style={blackBadge.container}>
            <Text style={blackBadge.text}>Attendance {attendance}%</Text>
          </View>
        )}

        {pending > 0 && (
          <View style={[yellowBadge.container, { marginLeft: spacing.sm }]}>
            <Text style={yellowBadge.text}>
              {pending} Assignment{pending > 1 ? "s" : ""} due
            </Text>
          </View>
        )}
      </View>
    </ShadowCard>
  );
};

const styles = StyleSheet.create({
  // Extra overflow:hidden on the card surface to clip the deco circle
  cardSurface: {
    overflow: "hidden",
  },

  // Decorative translucent circle at top-right
  decoCircle: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.15)",
    top: -20,
    right: -16,
  },

  // "TODAY'S OVERVIEW" label
  label: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "rgba(255,255,255,0.75)",
  },

  // "3 CLASSES · 16 STUDENTS"
  heroText: {
    fontSize: 22,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: -0.5,
    color: colors.white,
    lineHeight: 28,
    marginTop: spacing.xs,
  },

  // Row of badges under the hero text
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.lg,
  },
});

export default QuickSummary;
