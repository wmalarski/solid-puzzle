import { type Component, createMemo } from "solid-js";

import { MoonIcon } from "~/components/Icons/MoonIcon";
import { SunIcon } from "~/components/Icons/SunIcon";
import { useThemeContext } from "~/contexts/ThemeContext";

export const ThemeToggle: Component = () => {
  const { theme, updateTheme } = useThemeContext();

  const isLight = createMemo(() => {
    return theme() === "fantasy";
  });

  const onChange = () => {
    updateTheme(isLight() ? "dracula" : "fantasy");
  };

  return (
    <label class="swap swap-rotate">
      <input checked={isLight()} onChange={onChange} type="checkbox" />
      <SunIcon class="swap-on size-5" />
      <MoonIcon class="swap-off size-5" />
    </label>
  );
};
