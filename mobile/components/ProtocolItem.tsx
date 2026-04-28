import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

type Props = {
  index: number;
  title: string;
  description: string;
  showDivider?: boolean;
};

export default function ProtocolItem({ index, title, description, showDivider = true }: Props) {
  return (
    <>
      {showDivider && <View style={styles.divider} />}
      <View style={styles.item}>
        <Text style={styles.number}>{String(index).padStart(2, "0")}</Text>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: theme.colors.surface.high,
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  number: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 13,
    lineHeight: 22,
    color: theme.colors.positive,
    letterSpacing: 1,
    minWidth: 20,
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  title: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  description: {
    fontFamily: theme.fonts.body,
    fontSize: 13,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
});
