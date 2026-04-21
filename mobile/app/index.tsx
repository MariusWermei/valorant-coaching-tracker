import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ModalScreen() {
  console.log("ModalScreen");
  return (
    <SafeAreaView>
      <Text style={styles.text}>OUI</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
  },
});
