import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { initialsFrom, stringToColor } from "../../ui/InitialsAvatar";
import ShadowCard from "../../ui/ShadowCard";
import { colors, spacing, radius, borders, getBadgeStyles } from "../../../theme";

/* ── Status → design-system badge variant ─────────────────────────────────── */
const STATUS_BADGE = {
  active:   "green",
  pending:  "yellow",
  archived: "blue",
};

/* ── Avatar (design system section 8.8) ──────────────────────────────────── */
function Avatar({ name }) {
  const initials = initialsFrom(name || "ST");
  const bgColor  = stringToColor(name || "ST");

  return (
    <View style={[styles.avatar, { backgroundColor: bgColor }]}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

/* ── Info cell — icon circle + label + value ──────────────────────────────── */
const INFO_CIRCLE = {
  id:    { bg: "#E8F4FF", icon: "#1A7AAA" },
  phone: { bg: "#E8F9F0", icon: "#1A7A45" },
  level: { bg: "#FFF8E5", icon: "#A06000" },
};

function InfoCell({ type = "id", iconName, label, value }) {
  const c = INFO_CIRCLE[type];
  return (
    <View style={styles.infoCell}>
      <View style={[styles.infoIconCircle, { backgroundColor: c.bg }]}>
        <Ionicons name={iconName} size={15} color={c.icon} />
      </View>
      <View style={styles.infoCellText}>
        <Text style={styles.infoCellLabel}>{label}</Text>
        <Text style={styles.infoCellValue} numberOfLines={1}>
          {value ?? "—"}
        </Text>
      </View>
    </View>
  );
}

/* ── Subject chip — blue badge variant ───────────────────────────────────── */
function SubjectChip({ label }) {
  const badge = getBadgeStyles("blue");
  return (
    <View style={[badge.container, styles.subjectChip]}>
      <Text style={badge.text}>{label}</Text>
    </View>
  );
}

/* ── Main card ───────────────────────────────────────────────────────────── */
export default function StudentCard({ item, onView, onEdit, onDelete }) {
  const s  = item?.student        || {};
  const td = item?.tuition_details || {};

  const statusKey =
    item?.status === "pending" ? "pending"
    : item?.is_active           ? "active"
    :                             "archived";

  const statusBadge = getBadgeStyles(STATUS_BADGE[statusKey] ?? "blue");

  return (
    <ShadowCard shadowSize="md" borderRadius={radius.card} padding={spacing.lg}>
      {/* ── Top row: avatar + name/email | status badge ── */}
      <View style={styles.topRow}>
        <View style={styles.nameRow}>
          <Avatar name={s.name || s.custom_id} />
          <View style={styles.nameBlock}>
            <Text style={styles.studentName} numberOfLines={1}>
              {s.name || "—"}
            </Text>
            <Text style={styles.studentEmail} numberOfLines={1}>
              {s.email || "—"}
            </Text>
          </View>
        </View>

        <View style={statusBadge.container}>
          <Text style={statusBadge.text}>
            {statusKey.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── Info grid: 2 columns × 2 rows ── */}
      <View style={styles.infoGrid}>
        <View style={styles.infoRow}>
          <InfoCell
            type="id"
            iconName="card-outline"
            label="Student ID"
            value={s.custom_id}
          />
          <InfoCell
            type="phone"
            iconName="call-outline"
            label="Phone"
            value={s.phone}
          />
        </View>
        <View style={styles.infoRow}>
          <InfoCell
            type="level"
            iconName="school-outline"
            label="Class Level"
            value={td.class_level}
          />
          {/* Spacer for alignment */}
          <View style={styles.infoCell} />
        </View>
      </View>

      {/* ── Subjects ── */}
      {Array.isArray(td.subject_list) && td.subject_list.length > 0 && (
        <View style={styles.subjectsBlock}>
          <Text style={styles.subjectsLabel}>SUBJECTS</Text>
          <View style={styles.subjectsRow}>
            {td.subject_list.map((sub) => (
              <SubjectChip key={String(sub)} label={String(sub)} />
            ))}
          </View>
        </View>
      )}

      {/* ── Action buttons ── */}
      <View style={styles.actionsRow}>
        {/* View — blue filled */}
        <TouchableOpacity
          onPress={() => onView(item)}
          activeOpacity={0.8}
          style={[styles.actionBtn, styles.actionBtnBlue]}
        >
          <Feather name="eye" size={14} color={colors.white} />
          <Text style={[styles.actionBtnText, styles.actionBtnTextBlue]}>
            VIEW
          </Text>
        </TouchableOpacity>

        {/* Edit — outlined */}
        <TouchableOpacity
          onPress={() => onEdit(item)}
          activeOpacity={0.8}
          style={[styles.actionBtn, styles.actionBtnOutlined]}
        >
          <Feather name="edit-2" size={14} color={colors.black} />
          <Text style={[styles.actionBtnText, styles.actionBtnTextOutlined]}>
            EDIT
          </Text>
        </TouchableOpacity>

        {/* Delete — red outlined */}
        <TouchableOpacity
          onPress={() => onDelete(item)}
          activeOpacity={0.8}
          style={[styles.actionBtn, styles.actionBtnRed]}
        >
          <Feather name="trash-2" size={14} color={colors.red} />
          <Text style={[styles.actionBtnText, styles.actionBtnTextRed]}>
            DELETE
          </Text>
        </TouchableOpacity>
      </View>
    </ShadowCard>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  // ── Avatar — design system 8.8 ─────────────────────────────────────────
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.circle,
    borderWidth: borders.width,
    borderColor: borders.color,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.5,
  },

  // ── Top row ─────────────────────────────────────────────────────────────
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
  nameBlock: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.black,
  },
  studentEmail: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textMeta,
    marginTop: 2,
  },

  // ── Divider ─────────────────────────────────────────────────────────────
  divider: {
    height: borders.widthDivider,
    backgroundColor: borders.dividerColor,
    marginVertical: spacing.md,
  },

  // ── Info grid ───────────────────────────────────────────────────────────
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
  infoIconCircle: {
    width: 32,
    height: 32,
    borderRadius: radius.circle,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoCellText: {
    flex: 1,
  },
  infoCellLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: colors.textMeta,
  },
  infoCellValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.black,
    marginTop: 2,
  },

  // ── Subjects ─────────────────────────────────────────────────────────────
  subjectsBlock: {
    marginTop: spacing.md,
  },
  subjectsLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: colors.textMeta,
    marginBottom: spacing.sm,
  },
  subjectsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  subjectChip: {
    marginBottom: 0, // override badge alignSelf
  },

  // ── Action buttons ────────────────────────────────────────────────────────
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  actionBtn: {
    flex: 1,
    height: 38,
    borderRadius: radius.button,
    borderWidth: borders.width,
    borderColor: borders.color,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  // View — sky blue filled
  actionBtnBlue: {
    backgroundColor: colors.blue,
    borderColor: borders.color,
  },
  actionBtnTextBlue: {
    color: colors.white,
  },

  // Edit — white outlined
  actionBtnOutlined: {
    backgroundColor: colors.white,
    borderColor: borders.color,
  },
  actionBtnTextOutlined: {
    color: colors.black,
  },

  // Delete — white with red border + text
  actionBtnRed: {
    backgroundColor: colors.white,
    borderColor: colors.red,
  },
  actionBtnTextRed: {
    color: colors.red,
  },
});
