import { createI18nContext } from "@solid-primitives/i18n";

const dict = {
  en: {
    board: {
      menu: "Menu",
      newGame: "New game",
    },
    home: {
      title: "Puzzle",
    },
    info: {
      madeBy: "Made by wmalarski",
      title: "Solid Puzzle",
    },
  },
};

export const i18n = createI18nContext(dict, "en");
