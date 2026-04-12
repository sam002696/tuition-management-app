// ─────────────────────────────────────────────────────────────────────────────
// TuitorHub Design System — Theme Tokens
// Neo-brutalist flat design language
// Every card/button/input has a hard border + flat offset shadow.
// No gradients, no blur shadows, no rounded "bubbly" UI.
// ─────────────────────────────────────────────────────────────────────────────

// ─── COLORS ──────────────────────────────────────────────────────────────────

export const colors = {
  // Primary brand colors
  yellow: "#FFE033", // Brand yellow — active nav, CTA badges, role tag, primary button bg
  blue: "#4BC8F5", // Sky blue — hero card, login button, schedule accent, FAB
  black: "#1A1A1A", // Near black — all borders, all shadows, all body text
  white: "#FFFFFF", // White — card backgrounds, input backgrounds
  offWhite: "#F5F5F0", // Screen background (always behind grid pattern)

  // Semantic / icon colors
  green: "#4CAF7D", // Revenue stat icon bg, success states
  amber: "#F5A623", // Classes stat icon bg, warning states, schedule accent
  red: "#FF4B4B", // "Starting Soon" badge, alert / danger states
  coral: "#F47C52", // Completion stat icon bg

  // Text hierarchy
  textPrimary: "#1A1A1A",
  textSecondary: "#555555",
  textMuted: "#888888",
  textMeta: "#AAAAAA",

  // Structural
  border: "#1A1A1A",
  divider: "#F0F0F0",

  // Badge variant pairs (bg / text / border)
  badge: {
    yellow: { bg: "#FFE033", text: "#1A1A1A", border: "#1A1A1A" },
    black: { bg: "#1A1A1A", text: "#FFFFFF", border: "#1A1A1A" },
    red: { bg: "#FF4B4B", text: "#FFFFFF", border: "#1A1A1A" },
    green: { bg: "#D4F7E2", text: "#1A7A45", border: "#1A7A45" },
    pink: { bg: "#FFEAEA", text: "#CC3333", border: "#CC3333" },
    blue: { bg: "#E5F6FF", text: "#1A7AAA", border: "#1A7AAA" },
  },

  // Stat card icon circle backgrounds + icon tint
  iconCircle: {
    students: { bg: "#E8F4FF", icon: "#1A7AAA" },
    revenue: { bg: "#E8F9F0", icon: "#1A7A45" },
    classes: { bg: "#FFF8E5", icon: "#A06000" },
    completion: { bg: "#FFEEE8", icon: "#CC3333" },
  },
};

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────────────
// Rule: headings / section titles / nav labels / badge text → ALL CAPS
// Body / list titles / meta / input text → NOT uppercase

export const typography = {
  // Page hero — e.g. "3 CLASSES · 16 STUDENTS"
  h1: {
    fontSize: 28,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: -0.5,
    color: colors.black,
  },
  // Page title — e.g. "TEACH & LEARN"
  h2: {
    fontSize: 22,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: -0.3,
    color: colors.black,
  },
  // Section header — e.g. "TODAY'S SCHEDULE"
  h3: {
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: -0.2,
    color: colors.black,
  },
  // Large stat number — e.g. "48", "$9.2K"
  statNumber: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1,
    color: colors.black,
  },
  // Stat card number — smaller variant for 2×2 grid cards
  statCardNumber: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: colors.black,
  },
  // Field / section label — e.g. "TODAY'S OVERVIEW"
  label: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: colors.textSecondary,
  },
  // General body text
  body: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textSecondary,
  },
  // List row title — e.g. student name
  listTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.black,
  },
  // Secondary / meta info — e.g. "09:00 AM · 90 min"
  meta: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textMeta,
  },
  // All badge / chip text
  badge: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  // Bottom nav tab label — inactive
  navLabel: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: colors.textMeta,
  },
  // Bottom nav tab label — active
  navLabelActive: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: colors.black,
  },
  // Greeting sub-line — e.g. "Good afternoon"
  greeting: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textMuted,
  },
  // Stat card label under number — e.g. "TOTAL STUDENTS"
  statCardLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: colors.textMuted,
  },
};

// ─── SPACING ─────────────────────────────────────────────────────────────────

export const spacing = {
  xs: 4, // icon gaps, tight nudges
  sm: 8, // badge padding (horizontal), chip internal gaps
  md: 12, // card inner padding, gap between items
  lg: 16, // card padding, grid column gap
  xl: 20, // section padding, hero card padding, screen horizontal padding
  xxl: 24, // large hero card padding, section vertical gap
  xxxl: 28, // screen horizontal padding, grid cell size
  screenPadding: 20, // screen horizontal padding on both sides
  sectionGap: 24, // vertical gap between sections on a screen
};

// ─── BORDER RADIUS ───────────────────────────────────────────────────────────
// Rule: buttons & badges → pill (999). Cards → 14–16. Nav → 20.
// Never use sharp corners on interactive elements.

export const radius = {
  chip: 4, // inline tiny chips
  input: 12, // text input fields
  button: 24, // standard buttons (pill-like)
  buttonLarge: 40, // primary submit buttons (full pill)
  cardSm: 14, // schedule cards, smaller cards
  card: 16, // stat cards, hero card, standard content cards
  nav: 20, // bottom navigation bar container
  pill: 999, // badges, status chips, role tags — full pill
  circle: 9999, // avatars, icon circles, FAB
};

// ─── BORDERS ─────────────────────────────────────────────────────────────────
// Rule: EVERY card, button, input, badge, and nav bar must have a visible border.
// This is the single most important visual rule of the design system.

export const borders = {
  width: 2, // cards, buttons, inputs, nav bar, FAB, avatar
  widthThin: 1.5, // badges / chips
  widthDivider: 1, // list item dividers
  color: "#1A1A1A",
  dividerColor: "#F0F0F0",
};

// ─── SHADOWS — FLAT OFFSET ONLY ──────────────────────────────────────────────
// No Gaussian blur (shadowBlur: 0). Hard offset like a sticker / cut-out.
//
// React Native implementation:
//   Render a twin View behind the card, shifted by (offsetX, offsetY),
//   filled with shadowColor, same borderRadius as card.
//   See <ShadowCard> component.

export const shadows = {
  none: null,
  sm: { offsetX: 2, offsetY: 2, color: "#1A1A1A" }, // FAB, small elevated elements
  md: { offsetX: 3, offsetY: 3, color: "#1A1A1A" }, // stat cards, schedule cards, nav — DEFAULT
  lg: { offsetX: 5, offsetY: 5, color: "#1A1A1A" }, // hero overview card, highly elevated elements
};

// ─── GRID BACKGROUND ─────────────────────────────────────────────────────────
// Graph-paper grid pattern shown on all authenticated screens.
// Excluded from: Login, Register, Welcome / Landing screens.

export const grid = {
  backgroundColor: "#F5F5F0",
  lineColor: "rgba(0,0,0,0.07)",
  lineThickness: 1,
  cellSize: 28, // 28 × 28 dp grid cells
};

// ─── COMPONENT STYLE PRESETS ─────────────────────────────────────────────────
// Ready-to-spread StyleSheet-compatible objects for common components.

export const presets = {
  // ── Buttons ──────────────────────────────────────────────────────────────
  buttonYellow: {
    backgroundColor: colors.yellow,
    borderWidth: borders.width,
    borderColor: borders.color,
    borderRadius: radius.button,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  buttonYellowText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.black,
    textTransform: "uppercase",
  },

  buttonBlue: {
    backgroundColor: colors.blue,
    borderWidth: borders.width,
    borderColor: borders.color,
    borderRadius: radius.buttonLarge,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  buttonBlueText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.white,
    textTransform: "uppercase",
  },

  buttonOutlined: {
    backgroundColor: colors.white,
    borderWidth: borders.width,
    borderColor: borders.color,
    borderRadius: radius.button,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  buttonOutlinedText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.black,
    textTransform: "uppercase",
  },

  buttonGhost: {
    backgroundColor: "transparent",
    borderWidth: borders.width,
    borderColor: borders.color,
    borderRadius: radius.button,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonGhostText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.black,
    textTransform: "uppercase",
  },

  // ── Badges / Chips ───────────────────────────────────────────────────────
  // Usage: spread badgeBase + badgeVariant[variant] on container View,
  //        spread badgeText + badgeTextVariant[variant] on Text.
  badgeBase: {
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: borders.widthThin,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  // ── Cards ────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: colors.white,
    borderWidth: borders.width,
    borderColor: borders.color,
    borderRadius: radius.card,
    padding: spacing.lg,
  },
  cardSm: {
    backgroundColor: colors.white,
    borderWidth: borders.width,
    borderColor: borders.color,
    borderRadius: radius.cardSm,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
  },

  // ── Hero overview card ───────────────────────────────────────────────────
  heroCard: {
    backgroundColor: colors.blue,
    borderWidth: borders.width,
    borderColor: borders.color,
    borderRadius: radius.card,
    padding: spacing.xl,
  },

  // ── Form inputs ──────────────────────────────────────────────────────────
  input: {
    backgroundColor: colors.white,
    borderWidth: borders.width,
    borderColor: borders.color,
    borderRadius: radius.input,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
  },
  inputFocused: {
    borderColor: colors.blue,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: colors.textSecondary,
    marginBottom: 6,
  },

  // ── Screen header ────────────────────────────────────────────────────────
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    textTransform: "uppercase",
    color: colors.black,
  },

  // ── Section header row (title + "View all") ──────────────────────────────
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
  sectionViewAll: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.black,
    textDecorationLine: "underline",
  },

  // ── Bottom navigation ────────────────────────────────────────────────────
  navBar: {
    backgroundColor: colors.white,
    borderWidth: borders.width,
    borderColor: borders.color,
    borderRadius: radius.nav,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
  },
  navIconActive: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  navIconInactive: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  navFAB: {
    width: 46,
    height: 46,
    borderRadius: radius.circle,
    backgroundColor: colors.blue,
    borderWidth: borders.width,
    borderColor: borders.color,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },

  // ── Avatar / initials circle ─────────────────────────────────────────────
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.circle,
    borderWidth: borders.width,
    borderColor: borders.color,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.blue,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
  },

  // ── Stat card icon circle ────────────────────────────────────────────────
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: radius.circle,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Schedule card accent bar ─────────────────────────────────────────────
  accentBar: {
    width: 4,
    height: 36,
    borderRadius: 2,
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/**
 * Returns the StyleSheet styles for a badge variant.
 * @param {'yellow'|'black'|'red'|'green'|'pink'|'blue'} variant
 * @returns {{ container: object, text: object }}
 */
export function getBadgeStyles(variant) {
  const v = colors.badge[variant] ?? colors.badge.yellow;
  return {
    container: {
      ...presets.badgeBase,
      backgroundColor: v.bg,
      borderColor: v.border,
    },
    text: {
      ...presets.badgeText,
      color: v.text,
    },
  };
}

/**
 * Returns the StyleSheet styles for a stat card icon circle.
 * @param {'students'|'revenue'|'classes'|'completion'} stat
 * @returns {{ container: object, iconColor: string }}
 */
export function getIconCircleStyles(stat) {
  const s = colors.iconCircle[stat] ?? colors.iconCircle.students;
  return {
    container: { ...presets.iconCircle, backgroundColor: s.bg },
    iconColor: s.icon,
  };
}

// ─── DEFAULT EXPORT ───────────────────────────────────────────────────────────

const theme = {
  colors,
  typography,
  spacing,
  radius,
  borders,
  shadows,
  grid,
  presets,
  getBadgeStyles,
  getIconCircleStyles,
};

export default theme;
