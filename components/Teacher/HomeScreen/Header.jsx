import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import useAuth from "../../../hooks/useAuth";
import { colors, spacing, getBadgeStyles } from "../../../theme";

function getGreeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Header() {
  const [greeting, setGreeting] = useState(getGreeting());
  const { user } = useAuth();

  const displayName = user?.name || "Teacher";
  const badgeStyles = getBadgeStyles("yellow");

  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.root}>
      {/* ── App bar: TUITION  |  TEACHER badge ── */}
      <View style={styles.appBar}>
        <Text style={styles.appTitle}>TUITION</Text>

        <View style={badgeStyles.container}>
          <Text style={badgeStyles.text}>TEACHER</Text>
        </View>
      </View>

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── Greeting section ── */}
      <View style={styles.greetingBlock}>
        <Text style={styles.greetingSub}>{greeting}</Text>
        <Text style={styles.greetingName}>{displayName.toUpperCase()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: spacing.lg,
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

  // ── Horizontal rule ───────────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginTop: spacing.md,
  },

  // ── Greeting ──────────────────────────────────────────────────────────────
  greetingBlock: {
    marginTop: spacing.xl,
  },
  greetingSub: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textMuted,
  },
  greetingName: {
    fontSize: 28,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: -0.5,
    color: colors.black,
    marginTop: 2,
  },
});
