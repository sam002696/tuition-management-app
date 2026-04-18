import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons, Feather } from "@expo/vector-icons";

import { clearTuitionDetails } from "../../slices/Teacher/StudentManagement/studentManagementSlice";
import { notify } from "../../helpers/toast";
import EditTuitionDetailsSkeleton from "../../components/Teacher/Students/EditTuitionDetailsSkeleton";
import GridBackground from "../../components/ui/GridBackground";
import ShadowCard from "../../components/ui/ShadowCard";
import { colors, spacing, radius, borders, getBadgeStyles } from "../../theme";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─────────────────────────────────────────────────────────────────────────────
// Atoms
// ─────────────────────────────────────────────────────────────────────────────

/** Field label + optional right slot + children */
const Labeled = ({ label, required, children, right }) => (
  <View style={styles.labeled}>
    <View style={styles.labeledHeader}>
      <Text style={styles.labelText}>
        {label}
        {required ? <Text style={styles.labelRequired}> *</Text> : null}
      </Text>
      {right}
    </View>
    {children}
  </View>
);

/** Single-line / multi-line text input with focus state */
function TextBox({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  maxLength,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      style={[
        styles.textBox,
        multiline && styles.textBoxMultiline,
        focused && styles.textBoxFocused,
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textMeta}
      keyboardType={keyboardType}
      multiline={multiline}
      maxLength={maxLength}
      textAlignVertical={multiline ? "top" : "center"}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

/** Tuition type toggle — Monthly | Course */
const Segmented = ({ value, onChange }) => {
  const SEGS = [
    { v: "monthly_based", icon: "calendar-outline", label: "MONTHLY" },
    { v: "course",        icon: "book-outline",     label: "COURSE"  },
  ];
  return (
    <View style={styles.segmentRow}>
      {SEGS.map(({ v, icon, label }) => {
        const active = value === v;
        return (
          <Pressable
            key={v}
            onPress={() => onChange(v)}
            style={[styles.segmentBtn, active && styles.segmentBtnActive]}
            android_ripple={null}
          >
            <Ionicons
              name={icon}
              size={15}
              color={active ? colors.white : colors.textMeta}
            />
            <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

/** Removable subject chip — blue badge variant */
const SubjectChip = ({ label, onRemove }) => {
  const badge = getBadgeStyles("blue");
  return (
    <View style={[badge.container, styles.chipRow]}>
      <Text style={badge.text}>{label}</Text>
      <Pressable onPress={onRemove} hitSlop={8} style={styles.chipClose}>
        <Ionicons name="close-circle" size={14} color={colors.badge?.blue?.text ?? "#1A7AAA"} />
      </Pressable>
    </View>
  );
};

/** Day toggle pill */
const DayPill = ({ day, active, onToggle }) => (
  <TouchableOpacity
    onPress={() => onToggle(day)}
    activeOpacity={0.8}
    style={[styles.dayPill, active ? styles.dayPillActive : styles.dayPillInactive]}
  >
    <Text style={[styles.dayPillText, active && styles.dayPillTextActive]}>
      {day}
    </Text>
  </TouchableOpacity>
);

/** Section card — ShadowCard with uppercase label header */
const SectionCard = ({ title, children, right }) => (
  <ShadowCard
    shadowSize="md"
    borderRadius={radius.card}
    padding={spacing.lg}
    style={styles.sectionCard}
  >
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {right}
    </View>
    <View style={styles.sectionDivider} />
    {children}
  </ShadowCard>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────────────────────────
export default function EditStudentDetails() {
  const insets   = useSafeAreaInsets();
  const router   = useRouter();
  const dispatch = useDispatch();
  const { tuition_details_id, student_name, student_id } = useLocalSearchParams();

  const { tuitionDetails, tuitionDetailsLoading, tuitionDetailsSubmitting } =
    useSelector((s) => s.studentManagement);

  // ── Form state ────────────────────────────────────────────────────────────
  const [tuitionType,     setTuitionType]     = useState("monthly_based");
  const [classLevel,      setClassLevel]      = useState("");
  const [subjectInput,    setSubjectInput]    = useState("");
  const [subjects,        setSubjects]        = useState([]);
  const [medium,          setMedium]          = useState("");
  const [institute,       setInstitute]       = useState("");
  const [address,         setAddress]         = useState("");
  const [district,        setDistrict]        = useState("");
  const [thana,           setThana]           = useState("");
  const [purpose,         setPurpose]         = useState("");

  // monthly
  const [daysPerWeek,     setDaysPerWeek]     = useState("");
  const [hoursPerDay,     setHoursPerDay]     = useState("");
  const [daysSelected,    setDaysSelected]    = useState([]);
  const [salaryPerMonth,  setSalaryPerMonth]  = useState("");
  const [startingMonth,   setStartingMonth]   = useState("");

  // course
  const [classesPerCourse,   setClassesPerCourse]   = useState("");
  const [hoursPerClass,      setHoursPerClass]      = useState("");
  const [salaryPerSubject,   setSalaryPerSubject]   = useState("");
  const [totalCourseSalary,  setTotalCourseSalary]  = useState("");
  const [duration,           setDuration]           = useState("");

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (tuition_details_id != null) {
      dispatch({ type: "GET_TUITION_DETAILS", payload: { id: tuition_details_id } });
    }
    return () => dispatch(clearTuitionDetails());
  }, [tuition_details_id, dispatch]);

  useEffect(() => {
    if (!tuitionDetails) return;
    setTuitionType(tuitionDetails?.tuition_type ?? "monthly_based");
    setClassLevel(tuitionDetails?.class_level ?? "");
    setSubjects(Array.isArray(tuitionDetails?.subject_list) ? tuitionDetails.subject_list : []);
    setMedium(tuitionDetails?.medium ?? "");
    setInstitute(tuitionDetails?.institute_name ?? "");
    setAddress(tuitionDetails?.address_line ?? "");
    setDistrict(tuitionDetails?.district ?? "");
    setThana(tuitionDetails?.thana ?? "");
    setPurpose(tuitionDetails?.study_purpose ?? "");
    setDaysPerWeek(tuitionDetails?.tuition_days_per_week?.toString?.() ?? "");
    setHoursPerDay(tuitionDetails?.hours_per_day?.toString?.() ?? "");
    setDaysSelected(Array.isArray(tuitionDetails?.days_name) ? tuitionDetails.days_name : []);
    setSalaryPerMonth(tuitionDetails?.salary_per_month?.toString?.() ?? "");
    setStartingMonth(tuitionDetails?.starting_month ?? "");
    setClassesPerCourse(tuitionDetails?.total_classes_per_course?.toString?.() ?? "");
    setHoursPerClass(tuitionDetails?.hours_per_class?.toString?.() ?? "");
    setSalaryPerSubject(tuitionDetails?.salary_per_subject?.toString?.() ?? "");
    setTotalCourseSalary(tuitionDetails?.total_course_completion_salary?.toString?.() ?? "");
    setDuration(tuitionDetails?.duration ?? "");
  }, [tuitionDetails]);

  // auto-calc days per week from selection
  useEffect(() => {
    if (tuitionType === "monthly_based") {
      setDaysPerWeek(daysSelected.length ? String(daysSelected.length) : "");
    }
  }, [daysSelected, tuitionType]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const toggleDay = (day) =>
    setDaysSelected((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );

  const addSubject = () => {
    const t = (subjectInput || "").trim();
    if (!t) return;
    if (!subjects.includes(t)) setSubjects((s) => [...s, t]);
    setSubjectInput("");
  };

  const removeSubject = (s) => setSubjects((arr) => arr.filter((x) => x !== s));

  const numberOrNull = (v) => {
    if (v === "" || v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const validate = () => {
    if (!tuitionType) return "Tuition type is required.";
    if (!classLevel)  return "Class level is required.";
    if (!subjects.length) return "Add at least one subject.";
    if (tuitionType === "monthly_based") {
      if (!daysSelected.length) return "Select at least one day.";
      if (!salaryPerMonth)      return "Monthly salary is required.";
    } else {
      if (!classesPerCourse)  return "Total classes per course is required.";
      if (!hoursPerClass)     return "Hours per class is required.";
      if (!salaryPerSubject)  return "Salary per subject is required.";
      if (!totalCourseSalary) return "Total course completion salary is required.";
    }
    return null;
  };

  const onSave = () => {
    const err = validate();
    if (err) { notify?.error?.("Validation", err); return; }

    const base = {
      tuition_type: tuitionType, class_level: classLevel,
      subject_list: subjects, medium, institute_name: institute,
      address_line: address, district, thana, study_purpose: purpose,
    };
    const monthly = tuitionType === "monthly_based" ? {
      tuition_days_per_week: numberOrNull(daysPerWeek),
      hours_per_day: numberOrNull(hoursPerDay),
      days_name: daysSelected,
      salary_per_month: numberOrNull(salaryPerMonth),
      starting_month: startingMonth || null,
    } : {};
    const course = tuitionType === "course" ? {
      total_classes_per_course: numberOrNull(classesPerCourse),
      hours_per_class: numberOrNull(hoursPerClass),
      salary_per_subject: numberOrNull(salaryPerSubject),
      total_course_completion_salary: numberOrNull(totalCourseSalary),
      duration: duration || null,
    } : {};

    dispatch({
      type: "UPDATE_TUITION_DETAILS",
      payload: {
        id: tuition_details_id,
        data: { ...base, ...monthly, ...course },
        navigate: (path) => router.replace(path),
      },
    });
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (tuitionDetailsLoading) {
    return <EditTuitionDetailsSkeleton variant="both" />;
  }

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <GridBackground>
        {/* ── App bar ── */}
        <View style={styles.appBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={styles.backBtn}
          >
            <Feather name="arrow-left" size={18} color={colors.black} />
          </TouchableOpacity>

          {/* Absolutely centred title */}
          <Text style={styles.appBarTitle} numberOfLines={1}>
            EDIT TUITION
          </Text>
        </View>

        {/* Student context pill */}
        <View style={styles.contextBar}>
          <Feather name="user" size={13} color={colors.textMeta} />
          <Text style={styles.contextText} numberOfLines={1}>
            {student_name || "Student"}
            {student_id ? `  ·  #${student_id}` : ""}
          </Text>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── Tuition Type ── */}
            <SectionCard title="TUITION TYPE">
              <Segmented value={tuitionType} onChange={setTuitionType} />
            </SectionCard>

            {/* ── Core Information ── */}
            <SectionCard title="CORE INFORMATION">
              <Labeled label="Class Level" required>
                <TextBox
                  value={classLevel}
                  onChangeText={setClassLevel}
                  placeholder="e.g., Class 9 / HSC"
                />
              </Labeled>

              <Labeled
                label="Subjects"
                required
                right={
                  <TouchableOpacity
                    onPress={addSubject}
                    activeOpacity={0.8}
                    style={styles.addSubjectBtn}
                  >
                    <Text style={styles.addSubjectBtnText}>ADD</Text>
                  </TouchableOpacity>
                }
              >
                {/* Subject input row */}
                <View style={styles.subjectInputRow}>
                  <Ionicons name="book-outline" size={16} color={colors.textMeta} />
                  <TextInput
                    style={styles.subjectTextInput}
                    value={subjectInput}
                    onChangeText={setSubjectInput}
                    onSubmitEditing={addSubject}
                    placeholder="Type a subject and tap ADD"
                    placeholderTextColor={colors.textMeta}
                    returnKeyType="done"
                  />
                </View>
                {/* Subject chips */}
                {subjects.length > 0 && (
                  <View style={styles.chipWrap}>
                    {subjects.map((s) => (
                      <SubjectChip key={s} label={s} onRemove={() => removeSubject(s)} />
                    ))}
                  </View>
                )}
              </Labeled>

              <Labeled label="Medium">
                <TextBox value={medium} onChangeText={setMedium} placeholder="e.g., English / Bangla" />
              </Labeled>

              <Labeled label="Institute Name">
                <TextBox value={institute} onChangeText={setInstitute} placeholder="e.g., City College" />
              </Labeled>

              <Labeled label="Address Line">
                <TextBox value={address} onChangeText={setAddress} placeholder="House 10, Road 2" />
              </Labeled>

              <View style={styles.twoCol}>
                <View style={styles.flex}>
                  <Labeled label="District">
                    <TextBox value={district} onChangeText={setDistrict} placeholder="e.g., Dhaka" />
                  </Labeled>
                </View>
                <View style={styles.flex}>
                  <Labeled label="Thana">
                    <TextBox value={thana} onChangeText={setThana} placeholder="e.g., Tejgaon" />
                  </Labeled>
                </View>
              </View>

              <Labeled label="Study Purpose">
                <TextBox
                  value={purpose}
                  onChangeText={setPurpose}
                  placeholder="Improve grades / Admission prep"
                  multiline
                />
              </Labeled>
            </SectionCard>

            {/* ── Monthly Plan ── */}
            {tuitionType === "monthly_based" && (
              <SectionCard title="MONTHLY PLAN">
                <Labeled label="Select Days" required>
                  <View style={styles.daysRow}>
                    {DAYS.map((d) => (
                      <DayPill
                        key={d}
                        day={d}
                        active={daysSelected.includes(d)}
                        onToggle={toggleDay}
                      />
                    ))}
                  </View>
                </Labeled>

                <View style={styles.twoCol}>
                  <View style={styles.flex}>
                    <Labeled label="Days / Week">
                      <TextBox value={daysPerWeek} onChangeText={setDaysPerWeek} placeholder="e.g., 3" keyboardType="numeric" />
                    </Labeled>
                  </View>
                  <View style={styles.flex}>
                    <Labeled label="Hours / Day">
                      <TextBox value={hoursPerDay} onChangeText={setHoursPerDay} placeholder="e.g., 2" keyboardType="numeric" />
                    </Labeled>
                  </View>
                </View>

                <View style={styles.twoCol}>
                  <View style={styles.flex}>
                    <Labeled label="Salary / Month (BDT)" required>
                      <TextBox value={salaryPerMonth} onChangeText={setSalaryPerMonth} placeholder="e.g., 8000" keyboardType="numeric" />
                    </Labeled>
                  </View>
                  <View style={styles.flex}>
                    <Labeled label="Starting Month">
                      <TextBox value={startingMonth} onChangeText={setStartingMonth} placeholder="2025-09" keyboardType="numbers-and-punctuation" maxLength={7} />
                    </Labeled>
                  </View>
                </View>
              </SectionCard>
            )}

            {/* ── Course Plan ── */}
            {tuitionType === "course" && (
              <SectionCard title="COURSE PLAN">
                <View style={styles.twoCol}>
                  <View style={styles.flex}>
                    <Labeled label="Total Classes" required>
                      <TextBox value={classesPerCourse} onChangeText={setClassesPerCourse} placeholder="e.g., 24" keyboardType="numeric" />
                    </Labeled>
                  </View>
                  <View style={styles.flex}>
                    <Labeled label="Hours / Class" required>
                      <TextBox value={hoursPerClass} onChangeText={setHoursPerClass} placeholder="e.g., 1.5" keyboardType="numeric" />
                    </Labeled>
                  </View>
                </View>

                <View style={styles.twoCol}>
                  <View style={styles.flex}>
                    <Labeled label="Salary / Subject (BDT)" required>
                      <TextBox value={salaryPerSubject} onChangeText={setSalaryPerSubject} placeholder="e.g., 4000" keyboardType="numeric" />
                    </Labeled>
                  </View>
                  <View style={styles.flex}>
                    <Labeled label="Total Course Salary (BDT)" required>
                      <TextBox value={totalCourseSalary} onChangeText={setTotalCourseSalary} placeholder="e.g., 9600" keyboardType="numeric" />
                    </Labeled>
                  </View>
                </View>

                <Labeled label="Duration">
                  <TextBox value={duration} onChangeText={setDuration} placeholder="e.g., 6 weeks / 2 months" />
                </Labeled>
              </SectionCard>
            )}
          </ScrollView>

          {/* ── Sticky footer ── */}
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
            {/* Cancel — outlined */}
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.8}
              style={[styles.footerBtn, styles.footerBtnCancel]}
            >
              <Text style={[styles.footerBtnText, { color: colors.black }]}>
                CANCEL
              </Text>
            </TouchableOpacity>

            {/* Save — blue filled */}
            <TouchableOpacity
              onPress={onSave}
              activeOpacity={0.8}
              disabled={tuitionDetailsSubmitting}
              style={[
                styles.footerBtn,
                styles.footerBtnSave,
                tuitionDetailsSubmitting && styles.footerBtnDisabled,
              ]}
            >
              <Feather
                name={tuitionDetailsSubmitting ? "loader" : "save"}
                size={16}
                color={colors.white}
              />
              <Text style={[styles.footerBtnText, { color: colors.white }]}>
                {tuitionDetailsSubmitting ? "SAVING…" : "SAVE CHANGES"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </GridBackground>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.offWhite },
  flex: { flex: 1 },

  // ── App bar ──────────────────────────────────────────────────────────────
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
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
    pointerEvents: "none",
  },

  // ── Student context bar ───────────────────────────────────────────────────
  contextBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.lg,
  },
  contextText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textMeta,
    flex: 1,
  },

  // ── Scroll content ────────────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 120,
  },

  // ── Section card ──────────────────────────────────────────────────────────
  sectionCard: {
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: -0.1,
    color: colors.black,
  },
  sectionDivider: {
    height: borders.widthDivider,
    backgroundColor: borders.dividerColor,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },

  // ── Labeled field ─────────────────────────────────────────────────────────
  labeled: {
    marginBottom: spacing.md,
  },
  labeledHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  labelText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: colors.textSecondary,
  },
  labelRequired: {
    color: colors.red,
  },

  // ── TextBox input ─────────────────────────────────────────────────────────
  textBox: {
    backgroundColor: colors.white,
    borderWidth: borders.width,
    borderColor: borders.color,
    borderRadius: radius.input,
    paddingVertical: 13,
    paddingHorizontal: spacing.md,
    fontSize: 14,
    fontWeight: "400",
    color: colors.black,
  },
  textBoxMultiline: {
    minHeight: 84,
    paddingTop: 13,
  },
  textBoxFocused: {
    borderColor: colors.blue,
  },

  // ── Segmented control ─────────────────────────────────────────────────────
  segmentRow: {
    flexDirection: "row",
    backgroundColor: colors.offWhite,
    borderWidth: borders.width,
    borderColor: borders.color,
    borderRadius: radius.input,
    padding: 4,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  segmentBtnActive: {
    backgroundColor: colors.black,
  },
  segmentLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: colors.textMeta,
  },
  segmentLabelActive: {
    color: colors.white,
  },

  // ── Subject input + chips ─────────────────────────────────────────────────
  subjectInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: borders.width,
    borderColor: borders.color,
    borderRadius: radius.input,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  subjectTextInput: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
    padding: 0,
  },
  addSubjectBtn: {
    backgroundColor: colors.blue,
    borderWidth: borders.width,
    borderColor: borders.color,
    borderRadius: radius.button,
    paddingVertical: 5,
    paddingHorizontal: spacing.md,
  },
  addSubjectBtnText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    color: colors.white,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  chipClose: {
    marginLeft: 2,
  },

  // ── Day pills ─────────────────────────────────────────────────────────────
  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  dayPill: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    borderWidth: borders.width,
  },
  dayPillActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  dayPillInactive: {
    backgroundColor: colors.white,
    borderColor: borders.color,
  },
  dayPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  dayPillTextActive: {
    color: colors.white,
  },

  // ── Two-column row ────────────────────────────────────────────────────────
  twoCol: {
    flexDirection: "row",
    gap: spacing.md,
  },

  // ── Sticky footer ─────────────────────────────────────────────────────────
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
    flex: 1,
    height: 48,
    borderRadius: radius.button,
    borderWidth: borders.width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  footerBtnText: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  footerBtnCancel: {
    backgroundColor: colors.white,
    borderColor: borders.color,
  },
  footerBtnSave: {
    backgroundColor: colors.blue,
    borderColor: borders.color,
  },
  footerBtnDisabled: {
    opacity: 0.55,
  },
});
