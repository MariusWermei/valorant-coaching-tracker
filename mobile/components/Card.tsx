import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";

type CardProps = {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  rightLabel?: string;
  rightLabelColor?: string;
  style?: ViewStyle;
};

export default function Card({
  title,
  description,
  icon,
  rightLabel,
  rightLabelColor,
  style,
}: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {icon && (
        <View style={styles.iconWrapper}>
          <Ionicons name={icon} size={16} color={theme.colors.positive} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      {rightLabel && (
        <Text
          style={[
            styles.rightLabel,
            { color: rightLabelColor ?? theme.colors.text.primary },
          ]}
        >
          {rightLabel}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  iconWrapper: {
    width: 30,
    height: 30,
    borderRadius: theme.radius.default,
    backgroundColor: theme.colors.accent.greenDim,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 11,
    color: theme.colors.positive,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  description: {
    fontFamily: theme.fonts.body,
    fontSize: 12,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  rightLabel: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 12,
    letterSpacing: 1,
  },
});
