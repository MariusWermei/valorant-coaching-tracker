import { Pressable, Text, StyleSheet, View } from "react-native";
import { theme } from "@/constants/theme";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

export default function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  if (variant === "primary") {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.wrapper,
          { backgroundColor: theme.colors.accent.green },
          pressed && !disabled && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        <Text style={styles.labelDark}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.wrapper,
        { backgroundColor: theme.colors.surface.high },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.labelLight}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.35,
  },
  labelDark: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15,
    color: theme.colors.surface.base,
    letterSpacing: 0.3,
  },
  labelLight: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15,
    color: theme.colors.text.primary,
    letterSpacing: 0.3,
  },
});
