import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { lStorage } from "~/global/utils/local-storage";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

type ThemeContextValue = { theme: Theme; setTheme: (theme: Theme) => void; toggleTheme: () => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Reads the theme that index.html already applied to <html> before first paint. */
const currentTheme = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");

/** Light/dark theme via the `.dark` class on <html>; the choice is remembered per browser. */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(currentTheme);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        lStorage.set(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const toggleTheme = useCallback(() => setTheme((prev) => (prev === "dark" ? "light" : "dark")), []);

    return <ThemeContext.Provider value={{ setTheme, theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used inside <ThemeProvider>");
    return context;
};
