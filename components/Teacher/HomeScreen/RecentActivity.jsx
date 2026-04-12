import { useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../../hooks/useAuth";
import ActivityItemSkeleton from "./ActivityItemSkeleton";
import ShadowCard from "../../ui/ShadowCard";
import { colors, spacing, radius, borders, getBadgeStyles } from "../../../theme";

/* ── time ago ── */
const timeAgo = (d) => {
  const t = typeof d === "string" ? new Date(d) : d;
  const diff = Math.max(0, Date.now() - (t?.getTime?.() ?? 0));
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
};

/* ── derive action from notification text ── */
const deriveAction = (title = "", body = "") => {
  const s = `${title} ${body}`.toLowerCase();
  if (/\baccept(ed|s|ance)?\b|approved|confirmed/.test(s)) return "accepted";
  if (/\breject(ed|s|ion)?\b|declined|canceled|cancelled|denied/.test(s))
    return "rejected";
  if (/\bpending\b|awaiting/.test(s)) return "pending";
  return "info";
};

/* ── notification type → icon + icon-circle style ── */
const typeConfig = (notifType) => {
  switch (notifType) {
    case "tuition_event":
      return {
        icon: "calendar-outline",
        iconColor: "#A06000",
        circleBg: "#FFF8E5",
      };
    case "connection_request":
      return {
        icon: "person-add-outline",
        iconColor: "#1A7AAA",
        circleBg: "#E8F4FF",
      };
    default:
      return {
        icon: "notifications-outline",
        iconColor: colors.textMeta,
        circleBg: colors.offWhite,
      };
  }
};

/* ── action → badge variant ── */
const actionToBadgeVariant = (action) => {
  switch (action) {
    case "accepted":
      return "green";
    case "rejected":
      return "pink";
    case "pending":
      return "yellow";
    default:
      return "blue";
  }
};

/* ── single activity row ── */
function ActivityItem({ item, isLast, onPress }) {
  const tc = typeConfig(item.notifType);
  const badgeStyles = getBadgeStyles(actionToBadgeVariant(item.action));
  const when = item.at ? timeAgo(item.at) : "";

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress?.(item.original)}
      style={[styles.row, !isLast && styles.rowDivider]}
    >
      {/* Left icon circle */}
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: tc.circleBg },
        ]}
      >
        <Ionicons name={tc.icon} size={18} color={tc.iconColor} />
      </View>

      {/* Text content */}
      <View style={styles.rowContent}>
        {/* Title row + timestamp */}
        <View style={styles.titleRow}>
          <View style={styles.titleInner}>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {item.title}
            </Text>
            {/* Unread dot */}
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          {!!when && (
            <Text style={styles.timestamp} numberOfLines={1}>
              {when}
            </Text>
          )}
        </View>

        {/* Subtitle */}
        {!!item.subtitle && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {item.subtitle}
          </Text>
        )}

        {/* Status badge */}
        <View style={[badgeStyles.container, { marginTop: spacing.sm }]}>
          <Text style={badgeStyles.text}>{item.action.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* ── map raw notification to display shape ── */
const mapNotification = (n) => {
  const dt = n?.data || {};
  return {
    id: n?.id || String(Math.random()),
    notifType: dt?.type || "notification",
    title: dt?.title || "Notification",
    subtitle: dt?.body || "",
    action: deriveAction(dt?.title, dt?.body),
    at: n?.created_at,
    read: !!n?.read_at,
    original: n,
  };
};

/* ── main component ── */
export default function RecentActivity({ onItemPress }) {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const notifSlice = useSelector((state) => state?.notifications);
  const notifications = Array.isArray(notifSlice?.items)
    ? notifSlice.items
    : [];
  const loading = notifSlice?.loading;

  useEffect(() => {
    if (user?.id) {
      dispatch({ type: "FETCH_NOTIFICATIONS", payload: { id: user.id } });
    }
  }, [dispatch, user?.id]);

  const data = useMemo(
    () =>
      notifications
        .map(mapNotification)
        .sort((a, b) => new Date(b.at) - new Date(a.at))
        .slice(0, 4),
    [notifications]
  );

  const showSkeleton =
    (loading === true || loading === undefined) && data.length === 0;

  return (
    <View>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
      </View>

      {/* Card container */}
      <ShadowCard shadowSize="md" borderRadius={radius.card} padding={0}>
        {/* Card header */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderTitle}>Event updates & requests</Text>
        </View>

        {/* Thin rule */}
        <View style={styles.headerDivider} />

        {/* Content */}
        {showSkeleton ? (
          [0, 1, 2, 3].map((i) => (
            <ActivityItemSkeleton key={i} isLast={i === 3} />
          ))
        ) : data.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No recent activity</Text>
          </View>
        ) : (
          data.map((item, idx) => (
            <ActivityItem
              key={item.id}
              item={item}
              isLast={idx === data.length - 1}
              onPress={onItemPress}
            />
          ))
        )}
      </ShadowCard>
    </View>
  );
}

const styles = StyleSheet.create({
  // Section header
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

  // Card inner header
  cardHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  cardHeaderTitle: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: colors.textSecondary,
  },
  headerDivider: {
    height: borders.widthDivider,
    backgroundColor: borders.dividerColor,
    marginHorizontal: spacing.lg,
  },

  // Activity row
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

  // Icon circle (38×38, no border — border on the card)
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  // Text block
  rowContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  titleInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.black,
    flexShrink: 1,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 9999,
    backgroundColor: colors.blue,
    flexShrink: 0,
  },
  timestamp: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textMeta,
    flexShrink: 0,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textMeta,
    marginTop: 3,
    lineHeight: 15,
  },

  // Empty state
  emptyState: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textSecondary,
  },
});
