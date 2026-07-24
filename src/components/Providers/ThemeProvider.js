import { createContext, useContext, useEffect, useState } from "react";

import { useColorScheme } from "react-native";

import { THEME_KEY, THEMES } from "../../common/constants";
import { checkIfExists, getFlag, setFlag } from "../../common/fileLib";

// createContext() can accept a value for testing the context without wrapping, but undefined is fine
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null); // set to null to avoid triggering theme change save
  const colorScheme = useColorScheme();

  useEffect(() => {
    const saveTheme = async () => {
      await setFlag(THEME_KEY, theme);
    };
    if (theme) {
      saveTheme();
    }
  }, [theme]);

  /*
   * how default theme works
   * - initial value null
   * - useeffect runs once
   * - get stored value
   * - if not null, use that value
   * - else use default value
   */
  useEffect(() => {
    const getTheme = async () => {
      try {
        if (await checkIfExists(THEME_KEY)) {
          const storedTheme = await getFlag(THEME_KEY);
          setTheme(storedTheme === THEMES.dark ? THEMES.dark : THEMES.light);
        } else {
          // default theme
          if (colorScheme === "dark") {
            setTheme(THEMES.dark);
          } else {
            // light theme
            setTheme(THEMES.light);
          }
        }
      } catch (e) {
        console.log("error loading theme, error keys " + JSON.stringify(Object.keys(e)));
      }
    };
    getTheme();
  }, []);

  // return provider, where value are the exportable values and methods that can be used by consumers
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: () => setTheme(theme === THEMES.light ? THEMES.dark : THEMES.light),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// custom hook
export const useTheme = () => useContext(ThemeContext);
