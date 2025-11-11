import { createContext, useContext, useState } from "react";

import { LANGUAGE_LIBRARY } from "../../common/translation";

// createContext() can accept a value for testing the context without wrapping, but undefined is fine
const LocaleContext = createContext(null);

export const TranslationProvider = ({ children }) => {
  const [lang, setLang] = useState("en"); // set to null to avoid triggering theme change save

  // useEffect(() => {
  // determine local device's locale
  // setLang(localDeviceLocaleCode)
  // }, []);

  // return provider, where value are the exportable values and methods that can be used by consumers
  return (
    <LocaleContext.Provider
      value={{
        lang,

        getLocalString: (strKey) => {
          if (strKey && lang && (!LANGUAGE_LIBRARY[strKey] || !LANGUAGE_LIBRARY[strKey][lang])) {
            console.log('missing translation for "' + strKey + '" for language "' + lang + '"');
          }
          return LANGUAGE_LIBRARY[strKey] && LANGUAGE_LIBRARY[strKey][lang] ? LANGUAGE_LIBRARY[strKey][lang] : strKey;
        },
        // toggleTheme: () => setTheme(theme === THEMES.light ? THEMES.dark : THEMES.light),
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

// custom hook
export const useLocale = () => useContext(LocaleContext);
