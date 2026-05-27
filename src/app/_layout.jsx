import { Stack } from "expo-router";
import {
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { PaperProvider } from "react-native-paper";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

import { ThemeProvider } from "../components/Providers/ThemeProvider";
import { TranslationProvider } from "../components/Providers/TranslationProvider";

// @todo remove SafeAreaView after using "useSafeArea"

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.phoneWrapper}>
          <View style={styles.phoneShell}>
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
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#121212",
  },
  phoneWrapper: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Platform.OS === "web" ? 24 : 0,
    paddingHorizontal: Platform.OS === "web" ? 24 : 0,
  },
  phoneShell: {
    width: "100%",
    maxWidth: 420,
    minHeight: 720,
    flex: 1,
    backgroundColor: "#121212",
    borderRadius: Platform.OS === "web" ? 28 : 0,
    overflow: "hidden",
    borderWidth: Platform.OS === "web" ? 1 : 0,
    borderColor: "#333",
  },
});

export default RootLayout;
