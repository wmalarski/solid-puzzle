import { createAsync } from "@solidjs/router";
import { type Component, type JSX, createContext, useContext } from "solid-js";

import { getAppThemeLoader } from "~/server/theme/client";
import { type AppTheme, setAppThemeServerAction } from "~/server/theme/rpc";

const createThemeValue = () => {
  const theme = createAsync(() => getAppThemeLoader());

  const setTheme = async (theme: AppTheme) => {
    document.querySelector("html")?.setAttribute("data-theme", theme);
    await setAppThemeServerAction(theme);
  };

  return { setTheme, theme };
};

type ThemeContextValue = ReturnType<typeof createThemeValue>;

const ThemeContext = createContext<ThemeContextValue>({
  setTheme: () => Promise.resolve(),
  theme: () => "dracula" as const
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
