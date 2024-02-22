import { createWritableMemo } from "@solid-primitives/memo";
import { createAsync } from "@solidjs/router";
import { type Component, type JSX, createContext, useContext } from "solid-js";

import { getAppThemeLoader } from "~/server/theme/client";
import { type AppTheme, setAppThemeServerAction } from "~/server/theme/rpc";

const createThemeValue = () => {
  const themeAsync = createAsync(() => getAppThemeLoader());

  const [theme, setTheme] = createWritableMemo(() => {
    return themeAsync();
  });

  const updateTheme = async (theme: AppTheme) => {
    document.querySelector("html")?.setAttribute("data-theme", theme);
    setTheme(theme);
    await setAppThemeServerAction(theme);
  };

  return { theme, updateTheme };
};

type ThemeContextValue = ReturnType<typeof createThemeValue>;

const ThemeContext = createContext<ThemeContextValue>({
  theme: () => "dracula" as const,
  updateTheme: () => Promise.resolve()
});

type ThemeProviderProps = {
  children: JSX.Element;
};

export const ThemeProvider: Component<ThemeProviderProps> = (props) => {
  const value = createThemeValue();

  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
