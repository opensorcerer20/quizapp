import { createContext, useContext, useState } from "react";
import { THEMES } from "./constants";

// createContext() can accept a value for testing the context without wrapping, but undefined is fine
const ThemeContext = createContext(THEMES.light);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(THEMES.light);

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
