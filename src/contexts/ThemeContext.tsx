import { createWritableMemo } from "@solid-primitives/memo";
import { createAsync } from "@solidjs/router";
import { createContext, ParentProps, useContext } from "solid-js";

import { getAppThemeLoader } from "~/server/theme/client";
import { APP_THEME_COOKIE_NAME } from "~/server/theme/const";
import { type AppTheme } from "~/server/theme/rpc";

const createThemeValue = () => {
  const themeAsync = createAsync(() => getAppThemeLoader());

  const [theme, setTheme] = createWritableMemo(() => {
    return themeAsync();
  });

  const updateTheme = (theme: AppTheme) => {
    document.querySelector("html")?.setAttribute("data-theme", theme);
    document.cookie = `${APP_THEME_COOKIE_NAME}=${theme}`;
    setTheme(theme);
  };

  return { theme, updateTheme };
};

type ThemeContextValue = ReturnType<typeof createThemeValue>;

const ThemeContext = createContext<ThemeContextValue>({
  theme: () => "dracula" as const,
  updateTheme: () => void 0
});

export function ThemeProvider(props: ParentProps) {
  const value = createThemeValue();

  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
