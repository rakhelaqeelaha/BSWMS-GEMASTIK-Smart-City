import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type ColorTheme = "green" | "blue" | "purple" | "teal" | "indigo";
export type Language = "id" | "en";

interface ThemeContextValue {
  colorTheme: ColorTheme;
  setColorTheme: (t: ColorTheme) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  language: Language;
  setLanguage: (l: Language) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colorTheme: "green",
  setColorTheme: () => {},
  darkMode: false,
  setDarkMode: () => {},
  language: "id",
  setLanguage: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(
    () => (localStorage.getItem("loop-color") as ColorTheme) ?? "green"
  );
  const [darkMode, setDarkModeState] = useState(
    () => localStorage.getItem("loop-dark") === "true"
  );
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem("loop-lang") as Language) ?? "id"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-color", colorTheme);
    document.documentElement.classList.toggle("dark", darkMode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setColorTheme = (t: ColorTheme) => {
    setColorThemeState(t);
    localStorage.setItem("loop-color", t);
    document.documentElement.setAttribute("data-color", t);
  };

  const setDarkMode = (v: boolean) => {
    setDarkModeState(v);
    localStorage.setItem("loop-dark", String(v));
    document.documentElement.classList.toggle("dark", v);
  };

  const setLanguage = (l: Language) => {
    setLanguageState(l);
    localStorage.setItem("loop-lang", l);
  };

  return (
    <ThemeContext.Provider value={{ colorTheme, setColorTheme, darkMode, setDarkMode, language, setLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
