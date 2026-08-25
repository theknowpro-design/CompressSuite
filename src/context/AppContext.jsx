import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { applyTheme, readTheme, writeTheme } from "../utils/theme";

const AppContext = createContext(null);

function getInitialTheme() {
  const theme = readTheme();
  applyTheme(theme);
  return theme;
}

export function AppProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);
  const [isCompressing, setIsCompressing] = useState(false);

  const setTheme = useCallback((nextTheme) => {
    applyTheme(nextTheme);
    writeTheme(nextTheme);
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const nextTheme = current === "light" ? "dark" : "light";
      applyTheme(nextTheme);
      writeTheme(nextTheme);
      return nextTheme;
    });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      isCompressing,
      setIsCompressing,
    }),
    [theme, setTheme, toggleTheme, isCompressing, setIsCompressing]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
