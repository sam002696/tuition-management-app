import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import Skeleton from "../../ui/Skeleton";
import GridBackground from "../../ui/GridBackground";
import { colors, spacing, radius, borders } from "../../../theme";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Mirrors the SectionCard shell from editStudentDetails */
function CardShell({ children }) {
  return <View style={styles.card}>{children}</View>;
}

export default function EditTuitionDetailsSkeleton({ variant = "both" }) {
  const showMonthly = variant === "monthly" || variant === "both";
  const showCourse  = variant === "course"  || variant === "both";

  return (
    <SafeAreaView style={styles.root}>
      <GridBackground>
        {/* ── App bar skeleton ── */}
        <View style={styles.appBar}>
          <Skeleton style={styles.backBtn} />
          <Skeleton style={styles.appBarTitle} />
        </View>

        {/* ── Context bar skeleton ── */}
        <View style={styles.contextBar}>
          <Skeleton style={styles.contextLine} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Tuition Type ── */}
          <CardShell>
            <Skeleton style={styles.sectionTitle} />
            <View style={styles.sectionDivider} />
            <View style={styles.twoCol}>
              <Skeleton style={[styles.segmentBtn, styles.flex]} />
              <Skeleton style={[styles.segmentBtn, styles.flex]} />
            </View>
          </CardShell>

          {/* ── Core Information ── */}
          <CardShell>
            <Skeleton style={styles.sectionTitle} />
            <View style={styles.sectionDivider} />

            {/* Class Level */}
            <Skeleton style={styles.fieldLabel} />
            <Skeleton style={styles.fieldInput} />

            {/* Subjects */}
            <Skeleton style={[styles.fieldLabel, { marginTop: spacing.md }]} />
            <View style={styles.subjectInputRow}>
              <Skeleton style={styles.subjectIcon} />
              <Skeleton style={styles.flex} />
              <Skeleton style={styles.addBtn} />
            </View>
            <View style={styles.chipRow}>
              {[52, 68, 44].map((w, i) => (
                <Skeleton key={i} style={[styles.chip, { width: w }]} />
              ))}
            </View>

            {/* Medium */}
            <Skeleton style={[styles.fieldLabel, { marginTop: spacing.md }]} />
            <Skeleton style={styles.fieldInput} />

            {/* Institute */}
            <Skeleton style={[styles.fieldLabel, { marginTop: spacing.md }]} />
            <Skeleton style={styles.fieldInput} />

            {/* Address */}
            <Skeleton style={[styles.fieldLabel, { marginTop: spacing.md }]} />
            <Skeleton style={styles.fieldInput} />

            {/* District + Thana */}
            <View style={[styles.twoCol, { marginTop: spacing.md }]}>
              <View style={styles.flex}>
                <Skeleton style={styles.fieldLabel} />
                <Skeleton style={styles.fieldInput} />
              </View>
              <View style={styles.flex}>
                <Skeleton style={styles.fieldLabel} />
                <Skeleton style={styles.fieldInput} />
              </View>
            </View>

            {/* Study Purpose */}
            <Skeleton style={[styles.fieldLabel, { marginTop: spacing.md }]} />
            <Skeleton style={styles.fieldInputMultiline} />
          </CardShell>

          {/* ── Monthly Plan ── */}
          {showMonthly && (
            <CardShell>
              <Skeleton style={styles.sectionTitle} />
              <View style={styles.sectionDivider} />

              <Skeleton style={styles.fieldLabel} />
              <View style={styles.daysRow}>
                {DAYS.map((d) => (
                  <Skeleton key={d} style={styles.dayPill} />
                ))}
              </View>

              <View style={[styles.twoCol, { marginTop: spacing.md }]}>
                <View style={styles.flex}>
                  <Skeleton style={styles.fieldLabel} />
                  <Skeleton style={styles.fieldInput} />
                </View>
                <View style={styles.flex}>
                  <Skeleton style={styles.fieldLabel} />
                  <Skeleton style={styles.fieldInput} />
                </View>
              </View>

              <View style={[styles.twoCol, { marginTop: spacing.md }]}>
                <View style={styles.flex}>
                  <Skeleton style={styles.fieldLabel} />
                  <Skeleton style={styles.fieldInput} />
                </View>
                <View style={styles.flex}>
                  <Skeleton style={styles.fieldLabel} />
                  <Skeleton style={styles.fieldInput} />
                </View>
              </View>
            </CardShell>
          )}

          {/* ── Course Plan ── */}
          {showCourse && (
            <CardShell>
              <Skeleton style={styles.sectionTitle} />
              <View style={styles.sectionDivider} />

              <View style={styles.twoCol}>
                <View style={styles.flex}>
                  <Skeleton style={styles.fieldLabel} />
                  <Skeleton style={styles.fieldInput} />
                </View>
                <View style={styles.flex}>
                  <Skeleton style={styles.fieldLabel} />
                  <Skeleton style={styles.fieldInput} />
                </View>
              </View>

              <View style={[styles.twoCol, { marginTop: spacing.md }]}>
                <View style={styles.flex}>
                  <Skeleton style={styles.fieldLabel} />
                  <Skeleton style={styles.fieldInput} />
                </View>
                <View style={styles.flex}>
                  <Skeleton style={styles.fieldLabel} />
                  <Skeleton style={styles.fieldInput} />
                </View>
              </View>

              <Skeleton style={[styles.fieldLabel, { marginTop: spacing.md }]} />
              <Skeleton style={styles.fieldInput} />
            </CardShell>
          )}
        </ScrollView>

        {/* ── Sticky footer skeleton ── */}
        <View style={styles.footer}>
          <Skeleton style={[styles.footerBtn, styles.flex]} />
          <Skeleton style={[styles.footerBtn, styles.flex]} />
        </View>
      </GridBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  flex: { flex: 1 },

  // ── App bar ──────────────────────────────────────────────────────────────
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.divider,
  },
  appBarTitle: {
    height: 14,
    width: 120,
    borderRadius: 6,
    backgroundColor: colors.divider,
  },

  // ── Context bar ───────────────────────────────────────────────────────────
  contextBar: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.lg,
  },
  contextLine: {
    height: 11,
    width: 180,
    borderRadius: 5,
    backgroundColor: colors.divider,
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 120,
  },

  // ── Card shell — mirrors SectionCard border/radius ────────────────────────
  card: {
    backgroundColor: colors.white,
    borderWidth: borders.widthDivider,  // lighter border — communicates "loading"
    borderColor: borders.dividerColor,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },

  // ── Section header ────────────────────────────────────────────────────────
  sectionTitle: {
    height: 13,
    width: 110,
    borderRadius: 5,
    backgroundColor: colors.divider,
  },
  sectionDivider: {
    height: borders.widthDivider,
    backgroundColor: borders.dividerColor,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },

  // ── Fields ────────────────────────────────────────────────────────────────
  fieldLabel: {
    height: 9,
    width: 80,
    borderRadius: 4,
    backgroundColor: colors.divider,
    marginBottom: spacing.xs,
  },
  fieldInput: {
    height: 44,
    borderRadius: radius.input,
    backgroundColor: colors.divider,
  },
  fieldInputMultiline: {
    height: 84,
    borderRadius: radius.input,
    backgroundColor: colors.divider,
  },

  // ── Segment buttons ───────────────────────────────────────────────────────
  twoCol: {
    flexDirection: "row",
    gap: spacing.md,
  },
  segmentBtn: {
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.divider,
  },

  // ── Subject input row ─────────────────────────────────────────────────────
  subjectInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.divider,
    borderRadius: radius.input,
    height: 44,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  subjectIcon: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.offWhite,
  },
  addBtn: {
    width: 44,
    height: 26,
    borderRadius: radius.button,
    backgroundColor: colors.offWhite,
  },

  // ── Subject chips ─────────────────────────────────────────────────────────
  chipRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  chip: {
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.divider,
  },

  // ── Day pills ─────────────────────────────────────────────────────────────
  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  dayPill: {
    width: 46,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.divider,
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: borders.width,
    borderTopColor: borders.color,
  },
  footerBtn: {
    height: 48,
    borderRadius: radius.button,
    backgroundColor: colors.divider,
  },
});
