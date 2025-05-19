import { createContext, useContext, useEffect, useState } from "react";
import { THEME_KEY, THEMES } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// createContext() can accept a value for testing the context without wrapping, but undefined is fine
const ThemeContext = createContext(THEMES.light);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(THEMES.dark);

    useEffect(() => {
        const saveTheme = async () => {
            try {
                await AsyncStorage.setItem(THEME_KEY, theme);
            } catch (e) {
                console.log(
                    "error saving theme, error keys " +
                        JSON.stringify(Object.keys(e))
                );
            }
        };
        saveTheme();
    }, [theme]);

    useEffect(() => {
        const getTheme = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem(THEME_KEY);
                if (storedTheme !== null) {
                    setTheme(
                        storedTheme === THEMES.dark ? THEMES.dark : THEMES.light
                    );
                }
            } catch (e) {
                console.log(
                    "error loading theme, error keys " +
                        JSON.stringify(Object.keys(e))
                );
            }
        };
        getTheme();
    }, []);

    // return provider, where value are the exportable values and methods that can be used by consumers
    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme: () =>
                    setTheme(
                        theme === THEMES.light ? THEMES.dark : THEMES.light
                    ),
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

// custom hook
export const useTheme = () => useContext(ThemeContext);
