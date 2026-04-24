import { Text, StyleSheet, TextStyle } from "react-native";
import { theme } from "@/constants/theme";

type SectionLabelProps = {
  children: string;
  color?: string;
  style?: TextStyle;
};

export default function SectionLabel({
  children,
  color,
  style,
}: SectionLabelProps) {
  return (
    <Text
      style={[
        styles.label,
        { color: color ?? theme.colors.text.secondary },
        style,
      ]}
    >
      — {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 11,
    letterSpacing: 2,
  },
});
