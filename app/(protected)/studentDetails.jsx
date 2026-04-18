import { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import GridBackground from "../../components/ui/GridBackground";
import ShadowCard from "../../components/ui/ShadowCard";
import { initialsFrom, stringToColor } from "../../components/ui/InitialsAvatar";
import { colors, spacing, radius, borders, getBadgeStyles } from "../../theme";

// ─────────────────────────────────────────────────────────────────────────────
// Formatters
// ─────────────────────────────────────────────────────────────────────────────
const labelType  = (t) => (t === "monthly_based" ? "MONTHLY" : "COURSE");
const money      = (n) =>
  `৳ ${Number(n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
const fullAddress = (t = {}) =>
  [t.address_line, t.thana, t.district].filter(Boolean).join(", ") || "—";

// ─────────────────────────────────────────────────────────────────────────────
// Icon circle palette (mirrors theme iconCircle)
// ─────────────────────────────────────────────────────────────────────────────
const IC = {
  blue:   { bg: "#E8F4FF", icon: "#1A7AAA" },
  green:  { bg: "#E8F9F0", icon: "#1A7A45" },
  amber:  { bg: "#FFF8E5", icon: "#A06000" },
  coral:  { bg: "#FFEEE8", icon: "#CC3333" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Atoms
// ─────────────────────────────────────────────────────────────────────────────

/** 52×52 avatar circle — design system section 8.8 */
function Avatar({ name }) {
  const initials = initialsFrom(name || "ST");
  const bg       = stringToColor(name || "ST");
  return (
    <View style={[styles.avatar, { backgroundColor: bg }]}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

/** Horizontal divider */
const Divider = () => <View style={styles.divider} />;

/** Uppercase section label inside a card */
const SectionLabel = ({ title, right }) => (
  <View style={styles.sectionLabelRow}>
    <Text style={styles.sectionLabelText}>{title}</Text>
    {right}
  </View>
);

/**
 * Info row — icon circle + label + value.
 * Optionally pressable (e.g. tap to call/mail).
 */
const InfoRow = ({ circleKey = "blue", iconName, label, value, onPress }) => {
  const c = IC[circleKey];
  const content = (
    <View style={styles.infoRow}>
      <View style={[styles.infoCircle, { backgroundColor: c.bg }]}>
        <Ionicons name={iconName} size={15} color={c.icon} />
      </View>
      <View style={styles.infoRowText}>
        <Text style={styles.infoRowLabel}>{label}</Text>
        <Text style={styles.infoRowValue} numberOfLines={2}>
          {value || "—"}
        </Text>
      </View>
      {onPress && (
        <Feather name="chevron-right" size={14} color={colors.textMeta} />
      )}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && { opacity: 0.7 }}
    >
      {content}
    </Pressable>
  );
};

/** Mini stat block used inside the tuition card */
const MiniStat = ({ circleKey = "blue", iconName, label, value }) => {
  const c = IC[circleKey];
  return (
    <View style={styles.miniStat}>
      <View style={[styles.miniStatCircle, { backgroundColor: c.bg }]}>
        <Ionicons name={iconName} size={14} color={c.icon} />
      </View>
      <Text style={styles.miniStatValue}>{value || "—"}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </View>
  );
};

/** Tag chip — wraps getBadgeStyles */
const TagChip = ({ label, variant = "blue" }) => {
  const badge = getBadgeStyles(variant);
  return (
    <View style={badge.container}>
      <Text style={badge.text}>{label}</Text>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function StudentDetails() {
  const router     = useRouter();
  const dispatch   = useDispatch();
  const { connection_id } = useLocalSearchParams();

  const { allDetails, allDetailsLoading } = useSelector(
    (s) => s.studentManagement
  );

  useEffect(() => {
    dispatch({ type: "GET_ALL_DETAILS", payload: { connection_id } });
  }, [connection_id]);

  // ── Derive display data ──────────────────────────────────────────────────
  const student         = allDetails?.student         || {};
  const td              = allDetails?.tuition_details || {};
  const displayStatus   =
    allDetails?.status === "pending"
      ? "pending"
      : allDetails?.status === "accepted" && allDetails?.is_active
        ? "active"
        : "archived";
  const isMonthly = td?.tuition_type === "monthly_based";

  const STATUS_BADGE = { active: "green", pending: "yellow", archived: "blue" };
  const statusBadge  = getBadgeStyles(STATUS_BADGE[displayStatus] ?? "blue");

  // ── Actions ─────────────────────────────────────────────────────────────
  const onCall = () =>
    student?.phone && Linking.openURL(`tel:${student.phone}`).catch(() => {});
  const onMail = () =>
    student?.email &&
    Linking.openURL(`mailto:${student.email}`).catch(() => {});
  const onDisconnect = () =>
    Alert.alert("Disconnect", `Disconnect ${student?.name}?`, [
      { text: "Cancel" },
      { text: "Disconnect", style: "destructive", onPress: () => {} },
    ]);

  // ── Loading state ────────────────────────────────────────────────────────
  if (allDetailsLoading) {
    return (
      <SafeAreaView style={styles.loadingRoot}>
        <GridBackground>
          <View style={styles.loadingCenter}>
            <ActivityIndicator size="large" color={colors.black} />
            <Text style={styles.loadingText}>Loading…</Text>
          </View>
        </GridBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <GridBackground>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* ── 1. App bar — back nav ── */}
          <View style={styles.appBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={styles.backBtn}
            >
              <Feather name="arrow-left" size={18} color={colors.black} />
            </TouchableOpacity>
            {/* Absolutely centred — never shifts with button width */}
            <Text style={styles.appBarTitle} numberOfLines={1}>
              STUDENT DETAILS
            </Text>
          </View>

          {/* ── 2. Profile hero card ── */}
          <ShadowCard
            shadowSize="lg"
            borderRadius={radius.card}
            padding={spacing.xl}
            style={styles.section}
          >
            {/* Avatar + name | status badge */}
            <View style={styles.profileRow}>
              <View style={styles.profileLeft}>
                <Avatar name={student?.name || student?.custom_id} />
                <View style={styles.profileMeta}>
                  <Text style={styles.studentName} numberOfLines={1}>
                    {student?.name || "—"}
                  </Text>
                  <Text style={styles.studentEmail} numberOfLines={1}>
                    {student?.email || "—"}
                  </Text>
                </View>
              </View>
              <View style={statusBadge.container}>
                <Text style={statusBadge.text}>
                  {displayStatus.toUpperCase()}
                </Text>
              </View>
            </View>

            <Divider />

            {/* Action buttons */}
            <View style={styles.actionsRow}>
              {/* Call — blue filled */}
              <TouchableOpacity
                onPress={onCall}
                activeOpacity={0.8}
                style={[styles.actionBtn, styles.actionBtnBlue]}
              >
                <Ionicons name="call-outline" size={15} color={colors.white} />
                <Text style={[styles.actionBtnText, { color: colors.white }]}>
                  CALL
                </Text>
              </TouchableOpacity>

              {/* Email — outlined */}
              <TouchableOpacity
                onPress={onMail}
                activeOpacity={0.8}
                style={[styles.actionBtn, styles.actionBtnOutlined]}
              >
                <Ionicons name="mail-outline" size={15} color={colors.black} />
                <Text style={[styles.actionBtnText, { color: colors.black }]}>
                  EMAIL
                </Text>
              </TouchableOpacity>

              {/* Disconnect — red outlined (only when active) */}
              {allDetails?.is_active ? (
                <TouchableOpacity
                  onPress={onDisconnect}
                  activeOpacity={0.8}
                  style={[styles.actionBtn, styles.actionBtnRed]}
                >
                  <Ionicons
                    name="unlink-outline"
                    size={15}
                    color={colors.red}
                  />
                  <Text style={[styles.actionBtnText, { color: colors.red }]}>
                    REMOVE
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </ShadowCard>

          {/* ── 3. Student info card ── */}
          <ShadowCard
            shadowSize="md"
            borderRadius={radius.card}
            padding={spacing.lg}
            style={styles.section}
          >
            <SectionLabel title="STUDENT INFO" />
            <Divider />

            <InfoRow
              circleKey="blue"
              iconName="card-outline"
              label="Student ID"
              value={student?.custom_id}
            />
            <InfoRow
              circleKey="green"
              iconName="call-outline"
              label="Phone"
              value={student?.phone}
              onPress={onCall}
            />
            <InfoRow
              circleKey="blue"
              iconName="mail-outline"
              label="Email"
              value={student?.email}
              onPress={onMail}
            />
            <InfoRow
              circleKey={
                displayStatus === "active"
                  ? "green"
                  : displayStatus === "pending"
                    ? "amber"
                    : "blue"
              }
              iconName="checkmark-circle-outline"
              label="Status"
              value={
                displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)
              }
            />
          </ShadowCard>

          {/* ── 4. Tuition details card ── */}
          <ShadowCard
            shadowSize="md"
            borderRadius={radius.card}
            padding={spacing.lg}
            style={styles.section}
          >
            {/* Card header: TUITION · type badge + class level badge */}
            <View style={styles.tuitionHeader}>
              <SectionLabel
                title="TUITION"
                right={
                  <View style={styles.tuitionBadges}>
                    {/* Tuition type */}
                    <View style={getBadgeStyles("black").container}>
                      <Text style={getBadgeStyles("black").text}>
                        {labelType(td?.tuition_type)}
                      </Text>
                    </View>
                    {/* Class level */}
                    {td?.class_level ? (
                      <View
                        style={[
                          getBadgeStyles("blue").container,
                          { marginLeft: spacing.xs },
                        ]}
                      >
                        <Text style={getBadgeStyles("blue").text}>
                          {td.class_level}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                }
              />
            </View>

            <Divider />

            {/* Mini stats row */}
            <View style={styles.miniStatsRow}>
              {isMonthly ? (
                <>
                  <MiniStat
                    circleKey="amber"
                    iconName="calendar-outline"
                    label="DAYS / WEEK"
                    value={String(td?.tuition_days_per_week || "—")}
                  />
                  <View style={styles.miniStatDivider} />
                  <MiniStat
                    circleKey="green"
                    iconName="time-outline"
                    label="HOURS / DAY"
                    value={String(td?.hours_per_day || "—")}
                  />
                </>
              ) : (
                <>
                  <MiniStat
                    circleKey="green"
                    iconName="time-outline"
                    label="HRS / CLASS"
                    value={String(td?.hours_per_class || "—")}
                  />
                  <View style={styles.miniStatDivider} />
                  <MiniStat
                    circleKey="coral"
                    iconName="hourglass-outline"
                    label="DURATION"
                    value={td?.duration || "—"}
                  />
                </>
              )}
            </View>

            <Divider />

            {/* Basics */}
            <InfoRow
              circleKey="amber"
              iconName="language-outline"
              label="Medium"
              value={td?.medium}
            />
            <InfoRow
              circleKey="amber"
              iconName="home-outline"
              label="Institute"
              value={td?.institute_name}
            />
            <InfoRow
              circleKey="coral"
              iconName="location-outline"
              label="Address"
              value={fullAddress(td)}
            />
            <InfoRow
              circleKey="green"
              iconName="flag-outline"
              label="Study Purpose"
              value={td?.study_purpose}
            />

            {/* Sub-section: Subjects */}
            <View style={styles.subSection}>
              <View style={styles.subSectionHeader}>
                <Text style={styles.subSectionLabel}>SUBJECTS</Text>
              </View>
              <View style={styles.chipWrap}>
                {(td?.subject_list || []).length > 0 ? (
                  td.subject_list.map((s) => (
                    <TagChip key={String(s)} label={String(s)} variant="blue" />
                  ))
                ) : (
                  <Text style={styles.emptyChipText}>—</Text>
                )}
              </View>
            </View>

            {/* Sub-section: Schedule & Pay */}
            {isMonthly ? (
              <View style={styles.subSection}>
                <View style={styles.subSectionHeader}>
                  <Text style={styles.subSectionLabel}>SCHEDULE & PAY</Text>
                </View>
                <InfoRow
                  circleKey="amber"
                  iconName="calendar-outline"
                  label="Starting Month"
                  value={td?.starting_month}
                />
                <InfoRow
                  circleKey="green"
                  iconName="cash-outline"
                  label="Monthly Salary"
                  value={money(td?.salary_per_month)}
                />
                {/* Day chips */}
                {(td?.days_name || []).length > 0 && (
                  <View style={styles.chipWrap}>
                    {td.days_name.map((d) => (
                      <TagChip
                        key={String(d)}
                        label={String(d)}
                        variant="yellow"
                      />
                    ))}
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.subSection}>
                <View style={styles.subSectionHeader}>
                  <Text style={styles.subSectionLabel}>COURSE PLAN & PAY</Text>
                </View>
                <InfoRow
                  circleKey="blue"
                  iconName="reader-outline"
                  label="Total Classes"
                  value={String(td?.total_classes_per_course || "—")}
                />
                <InfoRow
                  circleKey="green"
                  iconName="cash-outline"
                  label="Per Subject"
                  value={money(td?.salary_per_subject)}
                />
                <InfoRow
                  circleKey="coral"
                  iconName="wallet-outline"
                  label="Total Course"
                  value={money(td?.total_course_completion_salary)}
                />
              </View>
            )}
          </ShadowCard>

        </ScrollView>
      </GridBackground>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── Screen shells ─────────────────────────────────────────────────────────
  root: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  loadingRoot: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  loadingCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textMuted,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: 40,
  },

  // ── App bar ───────────────────────────────────────────────────────────────
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    borderWidth: borders.width,
    borderColor: borders.color,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  appBarTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: -0.2,
    color: colors.black,
    // pointerEvents none so touches pass through to the back button
    pointerEvents: "none",
  },

  // ── Section spacing ───────────────────────────────────────────────────────
  section: {
    marginBottom: spacing.xxl,
  },

  // ── Divider ───────────────────────────────────────────────────────────────
  divider: {
    height: borders.widthDivider,
    backgroundColor: borders.dividerColor,
    marginVertical: spacing.md,
  },

  // ── Section label ─────────────────────────────────────────────────────────
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionLabelText: {
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: -0.2,
    color: colors.black,
  },

  // ── Avatar ────────────────────────────────────────────────────────────────
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.circle,
    borderWidth: borders.width,
    borderColor: borders.color,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.5,
  },

  // ── Profile hero ──────────────────────────────────────────────────────────
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  profileMeta: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.black,
  },
  studentEmail: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textMeta,
    marginTop: 2,
  },

  // ── Action buttons ────────────────────────────────────────────────────────
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    height: 38,
    borderRadius: radius.button,
    borderWidth: borders.width,
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
  actionBtnBlue: {
    backgroundColor: colors.blue,
    borderColor: borders.color,
  },
  actionBtnOutlined: {
    backgroundColor: colors.white,
    borderColor: borders.color,
  },
  actionBtnRed: {
    backgroundColor: colors.white,
    borderColor: colors.red,
  },

  // ── Info row ──────────────────────────────────────────────────────────────
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: 10,
  },
  infoCircle: {
    width: 32,
    height: 32,
    borderRadius: radius.circle,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoRowText: {
    flex: 1,
  },
  infoRowLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: colors.textMeta,
  },
  infoRowValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.black,
    marginTop: 2,
  },

  // ── Mini stat ─────────────────────────────────────────────────────────────
  miniStatsRow: {
    flexDirection: "row",
    backgroundColor: colors.offWhite,
    borderRadius: radius.cardSm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  miniStat: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
  },
  miniStatCircle: {
    width: 28,
    height: 28,
    borderRadius: radius.circle,
    alignItems: "center",
    justifyContent: "center",
  },
  miniStatValue: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: colors.black,
  },
  miniStatLabel: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: colors.textMeta,
  },
  miniStatDivider: {
    width: 1,
    backgroundColor: borders.dividerColor,
    marginHorizontal: spacing.md,
  },

  // ── Tuition card header ───────────────────────────────────────────────────
  tuitionHeader: {
    marginBottom: 0,
  },
  tuitionBadges: {
    flexDirection: "row",
    alignItems: "center",
  },

  // ── Sub-section (inside tuition card) ────────────────────────────────────
  subSection: {
    marginTop: spacing.sm,
  },
  subSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderTopWidth: borders.widthDivider,
    borderTopColor: borders.dividerColor,
    marginTop: spacing.xs,
  },
  subSectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: colors.textSecondary,
  },

  // ── Chip wrap ─────────────────────────────────────────────────────────────
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  emptyChipText: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textMeta,
  },
});
