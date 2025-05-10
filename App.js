import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import QuizApp from "./src/QuizApp";

export default App = () => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <PaperProvider>
                    <QuizApp />
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
