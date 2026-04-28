import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

type Props = {
  variant: "success" | "danger";
  label: string;
  text: string;
};

export default function MissionBlock({ variant, label, text }: Props) {
  const accent =
    variant === "success" ? theme.colors.positive : theme.colors.negative;
  const background =
    variant === "success" ? theme.colors.accent.greenDim : theme.colors.accent.redDim;

  return (
    <View style={[styles.block, { backgroundColor: background, borderColor: accent }]}>
      <Text style={[styles.label, { color: accent }]}>{label}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
  },
  label: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
    letterSpacing: 2,
  },
  text: {
    fontFamily: theme.fonts.body,
    fontSize: 14,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
});
