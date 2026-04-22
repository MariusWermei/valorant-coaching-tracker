import { Pressable, Text, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/constants/theme";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
};

export default function Button({
  label,
  onPress,
  variant = "primary",
}: ButtonProps) {
  if (variant === "primary") {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
      >
        <LinearGradient
          colors={["#ff8a8a", theme.colors.primary, "#d93e4a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.5, 1]}
          style={styles.button}
        >
          <Text style={styles.label}>{label}</Text>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
    >
      <View style={[styles.button, styles.secondary]}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: theme.radius.md,
    overflow: "hidden",
    width: "100%",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  button: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  secondary: {
    backgroundColor: theme.colors.surface.high,
  },
  label: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 16,
    color: theme.colors.text.primary,
    letterSpacing: 0.5,
  },
});
