import { View, StyleSheet } from "react-native";
import Skeleton from "../../ui/Skeleton";
import { colors, spacing, radius, borders } from "../../../theme";

export default function StudentCardSkeleton() {
  return (
    // Mirrors ShadowCard layout but as a skeleton — no shadow, just border
    <View style={styles.card}>
      {/* ── Top row: avatar circle + name/email | status badge ── */}
      <View style={styles.topRow}>
        <View style={styles.nameRow}>
          <Skeleton style={styles.avatar} />
          <View style={styles.nameBlock}>
            <Skeleton style={styles.nameBar} />
            <Skeleton style={styles.emailBar} />
          </View>
        </View>
        <Skeleton style={styles.statusBadge} />
      </View>

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── Info grid ── */}
      <View style={styles.infoGrid}>
        <View style={styles.infoRow}>
          <View style={styles.infoCell}>
            <Skeleton style={styles.infoIcon} />
            <View style={styles.infoCellText}>
              <Skeleton style={styles.infoLabelBar} />
              <Skeleton style={styles.infoValueBar} />
            </View>
          </View>
          <View style={styles.infoCell}>
            <Skeleton style={styles.infoIcon} />
            <View style={styles.infoCellText}>
              <Skeleton style={styles.infoLabelBar} />
              <Skeleton style={styles.infoValueBarShort} />
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoCell}>
            <Skeleton style={styles.infoIcon} />
            <View style={styles.infoCellText}>
              <Skeleton style={styles.infoLabelBar} />
              <Skeleton style={styles.infoValueBarShort} />
            </View>
          </View>
          <View style={styles.infoCell} />
        </View>
      </View>

      {/* ── Subjects ── */}
      <View style={styles.subjectsBlock}>
        <Skeleton style={styles.subjectsLabel} />
        <View style={styles.subjectsRow}>
          <Skeleton style={styles.chipSm} />
          <Skeleton style={styles.chipMd} />
          <Skeleton style={styles.chipSm} />
        </View>
      </View>

      {/* ── Action buttons ── */}
      <View style={styles.actionsRow}>
        <Skeleton style={styles.actionBtn} />
        <Skeleton style={styles.actionBtn} />
        <Skeleton style={styles.actionBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Card shell — mirrors StudentCard border/radius without the shadow
  card: {
    backgroundColor: colors.white,
    borderWidth: borders.width,
    borderColor: borders.dividerColor,   // lighter than real card — communicates "loading"
    borderRadius: radius.card,
    padding: spacing.lg,
  },

  // ── Top row ──────────────────────────────────────────────────────────────
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.circle,
    backgroundColor: colors.divider,
    flexShrink: 0,
  },
  nameBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  nameBar: {
    height: 14,
    width: 130,
    borderRadius: 6,
    backgroundColor: colors.divider,
  },
  emailBar: {
    height: 11,
    width: 100,
    borderRadius: 6,
    backgroundColor: colors.divider,
  },
  statusBadge: {
    height: 22,
    width: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.divider,
  },

  // ── Divider ──────────────────────────────────────────────────────────────
  divider: {
    height: borders.widthDivider,
    backgroundColor: borders.dividerColor,
    marginVertical: spacing.md,
  },

  // ── Info grid ─────────────────────────────────────────────────────────────
  infoGrid: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  infoCell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.circle,
    backgroundColor: colors.divider,
    flexShrink: 0,
  },
  infoCellText: {
    flex: 1,
    gap: 5,
  },
  infoLabelBar: {
    height: 9,
    width: 50,
    borderRadius: 4,
    backgroundColor: colors.divider,
  },
  infoValueBar: {
    height: 12,
    width: 90,
    borderRadius: 5,
    backgroundColor: colors.divider,
  },
  infoValueBarShort: {
    height: 12,
    width: 64,
    borderRadius: 5,
    backgroundColor: colors.divider,
  },

  // ── Subjects ──────────────────────────────────────────────────────────────
  subjectsBlock: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  subjectsLabel: {
    height: 9,
    width: 60,
    borderRadius: 4,
    backgroundColor: colors.divider,
  },
  subjectsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  chipSm: {
    height: 22,
    width: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.divider,
  },
  chipMd: {
    height: 22,
    width: 70,
    borderRadius: radius.pill,
    backgroundColor: colors.divider,
  },

  // ── Action buttons ─────────────────────────────────────────────────────────
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  actionBtn: {
    flex: 1,
    height: 38,
    borderRadius: radius.button,
    backgroundColor: colors.divider,
  },
});
