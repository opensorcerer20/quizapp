import { useEffect } from "react";

import { Stack } from "expo-router";
import {
  StyleSheet,
  View,
} from "react-native";
import { PaperProvider } from "react-native-paper";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  IS_MOBILE,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../common/constants";
import { registerServiceWorker } from "../common/registerServiceWorker";
import { ThemeProvider } from "../components/Providers/ThemeProvider";
import { TranslationProvider } from "../components/Providers/TranslationProvider";

const RootLayout = () => {
  useEffect(() => {
    registerServiceWorker();
  }, []);

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
    paddingVertical: IS_MOBILE ? 0 : 24,
    paddingHorizontal: IS_MOBILE ? 0 : 24,
  },
  phoneShell: {
    width: "100%",
    maxWidth: SCREEN_WIDTH,
    minHeight: SCREEN_HEIGHT,
    maxHeight: SCREEN_HEIGHT,
    flex: 1,
    backgroundColor: "#121212",
    borderRadius: IS_MOBILE ? 0 : 28,
    overflow: "hidden",
    borderWidth: IS_MOBILE ? 0 : 1,
    borderColor: "#333",
  },
});

export default RootLayout;
