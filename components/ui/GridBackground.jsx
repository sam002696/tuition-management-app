import React, { memo } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { grid } from "../../theme";

/**
 * GridBackground
 *
 * Wraps authenticated screen content in the TuitorHub graph-paper background:
 *   - Base: #F5F5F0 (off-white)
 *   - Overlaid with a 28×28 dp crosshatch grid (lines at opacity 0.07)
 *
 * Usage:
 *   <GridBackground>
 *     <ScrollView>...</ScrollView>
 *   </GridBackground>
 *
 * Do NOT use on: Login, Register, or Welcome/Landing screens.
 *
 * Implementation note:
 *   No external packages needed — lines are rendered as thin absolutely-
 *   positioned Views. The grid layer is pointerEvents="none" so it never
 *   intercepts touches.
 */
const GridBackground = memo(function GridBackground({
  children,
  style,
  contentContainerStyle,
}) {
  const { width, height } = useWindowDimensions();

  // Calculate how many lines are needed to cover the full screen.
  // Add +2 to ensure coverage even during orientation change / scroll bounce.
  const hCount = Math.ceil(height / grid.cellSize) + 2;
  const vCount = Math.ceil(width / grid.cellSize) + 2;

  return (
    <View style={[styles.root, style]}>
      {/* ── Grid pattern layer (behind all content) ── */}
      <View
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
        aria-hidden
      >
        {/* Horizontal lines */}
        {Array.from({ length: hCount }, (_, i) => (
          <View
            key={`h${i}`}
            style={[
              styles.hLine,
              { top: i * grid.cellSize, width },
            ]}
          />
        ))}

        {/* Vertical lines */}
        {Array.from({ length: vCount }, (_, i) => (
          <View
            key={`v${i}`}
            style={[
              styles.vLine,
              { left: i * grid.cellSize, height },
            ]}
          />
        ))}
      </View>

      {/* ── Screen content ── */}
      <View style={[styles.content, contentContainerStyle]}>{children}</View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: grid.backgroundColor,
  },
  hLine: {
    position: "absolute",
    height: grid.lineThickness,
    backgroundColor: grid.lineColor,
  },
  vLine: {
    position: "absolute",
    width: grid.lineThickness,
    backgroundColor: grid.lineColor,
  },
  content: {
    flex: 1,
  },
});

export default GridBackground;
