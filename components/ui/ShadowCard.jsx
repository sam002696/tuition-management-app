import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { colors, radius, borders, shadows, spacing } from "../../theme";

/**
 * ShadowCard
 *
 * The core card primitive for TuitorHub's neo-brutalist flat design.
 * Renders a visible border + hard flat offset shadow (no Gaussian blur).
 *
 * How the flat shadow works:
 *   A twin View (same size, filled with shadowColor) is rendered behind
 *   the card and translated by (offsetX, offsetY). The outer wrapper has
 *   matching bottom/right margin so surrounding layout is not disrupted.
 *
 * Props:
 *   shadowSize     'sm' | 'md' | 'lg'  — see theme/shadows (default 'md')
 *   borderRadius   number              — card corner radius (default radius.card = 16)
 *   borderColor    string              — border color (default '#1A1A1A')
 *   borderWidth    number              — border width (default 2)
 *   backgroundColor string            — card fill (default '#FFFFFF')
 *   padding        number              — inner padding (default spacing.lg = 16)
 *   style          ViewStyle           — extra styles on the outer wrapper
 *   cardStyle      ViewStyle           — extra styles on the card surface View
 *   children       ReactNode
 *
 * Usage:
 *   // Default stat card
 *   <ShadowCard>
 *     <Text>Content</Text>
 *   </ShadowCard>
 *
 *   // Hero card (blue background, large shadow)
 *   <ShadowCard
 *     shadowSize="lg"
 *     backgroundColor={colors.blue}
 *     padding={spacing.xl}
 *   >
 *     ...
 *   </ShadowCard>
 *
 *   // Schedule card (smaller radius)
 *   <ShadowCard borderRadius={radius.cardSm} padding={0}>
 *     ...
 *   </ShadowCard>
 */
const ShadowCard = memo(function ShadowCard({
  shadowSize = "md",
  borderRadius = radius.card,
  borderColor = borders.color,
  borderWidth = borders.width,
  backgroundColor = colors.white,
  padding = spacing.lg,
  style,
  cardStyle,
  children,
}) {
  const shadow = shadows[shadowSize];

  // Flat shadow: the shadow layer is the same dimensions as the card
  // but translated by (offsetX, offsetY). We achieve "same dimensions"
  // by using absoluteFillObject on the shadow layer and overriding
  // top/left with the offset. The right/bottom stay at 0, so the
  // shadow extends exactly to the card's right/bottom edge but starts
  // at (offsetX, offsetY) — it peeks out from underneath the card.
  //
  // The outer wrapper adds marginBottom + marginRight equal to the
  // shadow offset so the shadow doesn't overlap adjacent elements.

  if (!shadow) {
    return (
      <View style={style}>
        <View
          style={[
            {
              borderRadius,
              borderColor,
              borderWidth,
              backgroundColor,
              padding,
            },
            cardStyle,
          ]}
        >
          {children}
        </View>
      </View>
    );
  }

  const { offsetX, offsetY, color: shadowColor } = shadow;

  return (
    <View
      style={[
        styles.wrapper,
        { marginBottom: offsetY, marginRight: offsetX },
        style,
      ]}
    >
      {/* Shadow layer — sits behind card, peeking out at bottom-right */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            top: offsetY,
            left: offsetX,
            borderRadius,
            backgroundColor: shadowColor,
          },
        ]}
      />

      {/* Card surface — rendered after shadow so it sits on top */}
      <View
        style={[
          {
            borderRadius,
            borderColor,
            borderWidth,
            backgroundColor,
            padding,
          },
          cardStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
});

export default ShadowCard;
