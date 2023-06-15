import { createI18nContext } from "@solid-primitives/i18n";

const dict = {
  en: {
    auth: {
      password: {
        description: "Password",
        label: "Password",
        placeholder: "Password",
      },
      username: {
        description: "Username",
        label: "Username",
        placeholder: "Username",
      },
    },
    board: {
      menu: "Menu",
      newGame: "New game",
    },
    home: {
      signIn: "Sign In",
      signUp: "Sign Up",
      title: "Puzzle",
    },
    info: {
      madeBy: "Made by wmalarski",
      title: "Solid Puzzle",
    },
    signIn: {
      button: "Sign In",
      signIn: "Sign Up",
      title: "Sign In",
    },
    signUp: {
      button: "Sign Up",
      signIn: "Sign In",
      title: "Sign Up",
    },
  },
};

export const i18n = createI18nContext(dict, "en");
