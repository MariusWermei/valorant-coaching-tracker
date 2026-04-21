import { HeaderShownContext } from "@react-navigation/elements";
import { Stack } from "expo-router";

export const unstable_settings = {
  anchor: "modal",
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
