import { createI18nContext } from "@solid-primitives/i18n";

const dict = {
  en: {
    footer: {
      madeBy: "Made by wmalarski",
    },
    home: {
      title: "Puzzle",
    },
  },
};

export const i18n = createI18nContext(dict, "en");
