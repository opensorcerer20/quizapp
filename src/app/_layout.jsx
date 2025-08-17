import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { PaperProvider } from "react-native-paper";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

import { ThemeProvider } from "../components/Providers/ThemeProvider";
import { TranslationProvider } from "../components/Providers/TranslationProvider";

export default RootLayout = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <PaperProvider>
          <ThemeProvider>
            <TranslationProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="NewDeck" options={{ headerShown: false }} />
                <Stack.Screen name="QuizScreen" options={{ headerShown: false }} />
                <Stack.Screen name="DeckScreen" options={{ headerShown: false }} />
                <Stack.Screen name="AddQuestion" options={{ headerShown: false }} />
              </Stack>
            </TranslationProvider>
          </ThemeProvider>
        </PaperProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
});
