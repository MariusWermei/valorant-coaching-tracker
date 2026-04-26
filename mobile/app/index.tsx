import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { getPlayers } from "@/services/api";
import { Player } from "../types/player";
import { theme } from "@/constants/theme";
import Button from "@/components/Button";

export default function RSOScreen() {
  const router = useRouter();
  const { setPlayerId } = usePlayer();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      const data = await getPlayers();
      setPlayers(data.data);
    };
    fetchPlayers();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand */}
        <View style={styles.brand}>
          <View style={styles.brandMark}>
            <Text style={styles.brandGlyph}>▲</Text>
          </View>
          <Text style={styles.brandName}>FORM</Text>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Finally understand{"\n"}your game.</Text>
          <Text style={styles.heroSubtitle}>
            Form connects to your Riot account and delivers a weekly coaching
            diagnosis — not stats, but insight.
          </Text>
        </View>

        {/* Player selection */}
        <View style={styles.playerList}>
          {players.map((p) => (
            <Pressable
              key={p.playerId}
              onPress={() =>
                setSelectedPlayer(
                  selectedPlayer === p.playerId ? null : p.playerId,
                )
              }
              style={({ pressed }) => [
                styles.playerCard,
                selectedPlayer === p.playerId && styles.playerCardSelected,
                pressed && styles.playerCardPressed,
              ]}
            >
              <View>
                <Text style={styles.playerName}>{p.displayName}</Text>
                <Text style={styles.playerTag}>{p.riotTag}</Text>
              </View>
              {selectedPlayer === p.playerId && (
                <View style={styles.selectedDot} />
              )}
            </Pressable>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.footer}>
          <Button
            label="Connect with Riot"
            disabled={!selectedPlayer}
            onPress={() => {
              if (selectedPlayer) {
                setPlayerId(selectedPlayer);
                router.push("/(tabs)");
              }
            }}
          />

          {/* Privacy bullets */}
          <View style={styles.privacyList}>
            {[
              "Read-only access — we never touch your account.",
              "Match data processed locally. No third-party sharing.",
              "Disconnect anytime from your Riot account settings.",
            ].map((line, i) => (
              <View key={i} style={styles.privacyRow}>
                <View style={styles.privacyDot} />
                <Text style={styles.privacyText}>{line}</Text>
              </View>
            ))}
          </View>
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
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xxl * 2,
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.default,
    backgroundColor: theme.colors.accent.green,
    alignItems: "center",
    justifyContent: "center",
  },
  brandGlyph: {
    fontFamily: theme.fonts.heading,
    fontSize: 14,
    color: theme.colors.surface.base,
  },
  brandName: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 13,
    color: theme.colors.text.primary,
    letterSpacing: 3,
  },
  hero: {
    marginBottom: theme.spacing.xxl,
  },
  heroTitle: {
    fontFamily: theme.fonts.heading,
    fontSize: 36,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
    lineHeight: 44,
    marginBottom: theme.spacing.lg,
  },
  heroSubtitle: {
    fontFamily: theme.fonts.body,
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  playerList: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xxl,
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: "transparent",
  },
  playerCardSelected: {
    borderColor: theme.colors.accent.green,
    backgroundColor: theme.colors.accent.greenDim,
  },
  playerCardPressed: {
    opacity: 0.8,
  },
  playerName: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  playerTag: {
    fontFamily: theme.fonts.label,
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accent.green,
  },
  footer: {
    marginTop: "auto",
    gap: theme.spacing.xl,
  },
  privacyList: {
    gap: theme.spacing.sm,
  },
  privacyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
  },
  privacyDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.text.disabled,
    marginTop: 8,
  },
  privacyText: {
    flex: 1,
    fontFamily: theme.fonts.body,
    fontSize: 12,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
});
