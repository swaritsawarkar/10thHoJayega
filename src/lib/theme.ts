export type AppTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "10thhojayega-theme";

export const themeInitScript = `
(function () {
  try {
    var stored = window.localStorage.getItem("${THEME_STORAGE_KEY}");
    var theme = stored === "dark" || stored === "light"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var root = document.documentElement;
    root.classList.remove(theme === "dark" ? "light" : "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
  } catch (_) {}
})();
`;

export function getThemeSnapshot(): AppTheme {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function getServerThemeSnapshot(): AppTheme {
  return "light";
}

export function applyTheme(theme: AppTheme) {
  const root = document.documentElement;
  root.classList.remove(theme === "dark" ? "light" : "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  window.dispatchEvent(new Event("10thhojayega-theme-change"));
}

export function subscribeToThemeChanges(onStoreChange: () => void) {
  window.addEventListener("10thhojayega-theme-change", onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener("10thhojayega-theme-change", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}
