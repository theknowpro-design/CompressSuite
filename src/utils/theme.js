export const THEME_KEY = "compresssuite-theme";

export function readTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "dark" || saved === "light" ? saved : "light";
  } catch {
    return "light";
  }
}

export function writeTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Ignore storage failures (private mode, blocked storage).
  }
}

export function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
}
