import { View, StyleSheet } from "react-native";
import Skeleton from "../../ui/Skeleton";
import { colors, spacing, borders } from "../../../theme";

export default function ActivityItemSkeleton({ isLast }) {
  return (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      {/* Icon circle placeholder */}
      <Skeleton style={styles.iconCircle} />

      {/* Text content */}
      <View style={styles.content}>
        {/* Title + timestamp row */}
        <View style={styles.titleRow}>
          <Skeleton style={styles.titleBar} />
          <Skeleton style={styles.timestampBar} />
        </View>

        {/* Subtitle lines */}
        <Skeleton style={styles.subtitleBarLong} />
        <Skeleton style={styles.subtitleBarShort} />

        {/* Badge chip placeholder */}
        <Skeleton style={styles.badge} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rowDivider: {
    borderBottomWidth: borders.widthDivider,
    borderBottomColor: borders.dividerColor,
  },

  // Circle skeleton — matches icon circle in ActivityItem
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    flexShrink: 0,
    backgroundColor: colors.divider,
  },

  content: {
    flex: 1,
    gap: 6,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleBar: {
    height: 14,
    width: 140,
    borderRadius: 6,
    backgroundColor: colors.divider,
  },
  timestampBar: {
    height: 11,
    width: 36,
    borderRadius: 6,
    backgroundColor: colors.divider,
  },

  subtitleBarLong: {
    height: 11,
    width: "85%",
    borderRadius: 6,
    backgroundColor: colors.divider,
  },
  subtitleBarShort: {
    height: 11,
    width: "60%",
    borderRadius: 6,
    backgroundColor: colors.divider,
  },

  // Badge pill placeholder
  badge: {
    height: 20,
    width: 68,
    borderRadius: 999,
    marginTop: 2,
    backgroundColor: colors.divider,
  },
});
