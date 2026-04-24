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
          <View
            key={index}
            style={[styles.item, isPriority && styles.priorityItem]}
          >
            {/* Left accent bar — no border, just a tonal stripe */}
            <View
              style={[
                styles.accent,
                { backgroundColor: accentColor },
                isPriority && styles.accentPriority,
              ]}
            />

            <View style={styles.body}>
              {variant === "numbered" ? (
                <View style={styles.numberedHeader}>
                  <Text style={[styles.number, { color: accentColor }]}>
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                  {isPriority && (
                    <Text
                      style={[styles.priorityTag, { color: accentColor }]}
                    >
                      TOP PRIORITY
                    </Text>
                  )}
                </View>
              ) : null}

              <Text
                style={[
                  styles.text,
                  isPriority && styles.priorityText,
                ]}
              >
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
    gap: theme.spacing.md,
  },
  item: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.md,
    overflow: "hidden",
  },
  priorityItem: {
    backgroundColor: theme.colors.surface.high,
  },
  accent: {
    width: 3,
  },
  accentPriority: {
    width: 4,
  },
  body: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  numberedHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: theme.spacing.sm,
    marginBottom: 2,
  },
  number: {
    fontFamily: theme.fonts.heading,
    fontSize: 18,
    letterSpacing: -0.5,
  },
  priorityTag: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 9,
    letterSpacing: 2,
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
    lineHeight: 22,
  },
});
