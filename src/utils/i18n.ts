import { createI18nContext } from "@solid-primitives/i18n";

const dict = {
  en: {
    auth: {
      password: {
        label: "Password",
        placeholder: "Password",
      },
      signOut: "Sign Out",
      username: {
        label: "Username",
        placeholder: "Username",
      },
    },
    board: {
      menu: "Menu",
      newGame: "New game",
    },
    footer: {
      madeBy: "Made by wmalarski",
    },
    home: {
      addBoard: "Add board",
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
      signUp: "Sign Up",
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
