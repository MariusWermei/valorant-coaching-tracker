import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

type InsightListProps = {
  items: string[];
  accentColor: string;
  variant?: "bullet" | "numbered";
};

export default function InsightList({
  items,
  accentColor,
  variant = "bullet",
}: InsightListProps) {
  return (
    <View style={styles.list}>
      {items.map((item, index) => {
        const isPriority = variant === "numbered" && index === 0;

        return (
          <View key={index} style={styles.item}>
            {variant === "numbered" ? (
              <Text style={[styles.number, { color: accentColor }]}>
                {String(index + 1).padStart(2, "0")}
              </Text>
            ) : (
              <View style={[styles.dot, { backgroundColor: accentColor }]} />
            )}
            <View style={styles.body}>
              <Text style={[styles.text, isPriority && styles.priorityText]}>
                {item}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 0,
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.high,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  number: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 13,
    letterSpacing: 0.5,
    lineHeight: 20,
    minWidth: 24,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  text: {
    fontFamily: theme.fonts.body,
    fontSize: 14,
    color: theme.colors.text.primary,
    lineHeight: 21,
  },
  priorityText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15,
  },
});
