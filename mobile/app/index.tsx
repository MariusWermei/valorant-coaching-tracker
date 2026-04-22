import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import Button from "@/components/Button";
import Card from "@/components/Card";

export default function RSOScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Ionicons name="diamond" size={14} color={theme.colors.primary} />
          <Text style={styles.topBarText}>TACTICAL ANALYST</Text>
        </View>

        <Text style={styles.label}>01 RSO · AUTH SEQUENCE</Text>

        <View style={styles.header}>
          <Text style={styles.titleLight}>Connect</Text>
          <Text style={styles.titleBold}>your Riot</Text>
          <Text style={styles.titleLight}>account</Text>
        </View>

        <Text style={styles.subtitle}>
          Link your profile to allow our Tactical Analyst to process your match
          history, agent performance, and econ ratings for personalized coaching
          insights.
        </Text>

        <View style={styles.cards}>
          <Card
            icon="shield-checkmark"
            title="PRIVACY SHIELD"
            description="This is an opt-in flow. We only access data required for performance analysis. You can disconnect at any time."
          />
          <Card
            icon="lock-closed"
            title="DATA PROTOCOL"
            description="Match results and in-game statistics are shared securely with our coaching engine to generate your Rank-Up roadmap."
          />
        </View>

        <View style={styles.footer}>
          <Button
            label="Continue with Riot →"
            onPress={() => router.push("/(tabs)")}
          />
          <Pressable>
            <Text style={styles.learnMore}>Learn more about Riot Sign-On</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface.base,
  },
  scroll: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    flexGrow: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  topBarText: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 11,
    color: theme.colors.primary,
    letterSpacing: 2,
  },
  label: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
    color: theme.colors.text.secondary,
    letterSpacing: 2,
    marginBottom: 40,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  titleLight: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 42,
    color: theme.colors.text.primary,
    lineHeight: 48,
    letterSpacing: -1,
  },
  titleBold: {
    fontFamily: theme.fonts.heading,
    fontSize: 42,
    color: theme.colors.text.primary,
    lineHeight: 48,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: theme.fonts.body,
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 22,
    marginBottom: theme.spacing.xxl,
  },
  cards: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
  },
  footer: {
    marginTop: "auto",
    gap: theme.spacing.md,
    alignItems: "center",
  },
  learnMore: {
    fontFamily: theme.fonts.body,
    fontSize: 12,
    color: theme.colors.text.secondary,
    textDecorationLine: "underline",
  },
});
